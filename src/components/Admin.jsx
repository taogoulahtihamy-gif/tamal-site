import { useEffect, useMemo, useState } from "react"
import { Navigate } from "react-router-dom"
import logo from "../assets/logo.jpeg"

export default function Admin() {
  const [demandes, setDemandes] = useState([])
  const [recherche, setRecherche] = useState("")
  const [filtreStatut, setFiltreStatut] = useState("tous")
  const [chargement, setChargement] = useState(true)
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState("success")
  const [edition, setEdition] = useState({})

  const estConnecte = localStorage.getItem("adminAuth") === "true"
  const adminUser = JSON.parse(localStorage.getItem("adminUser") || "null")
  const API_URL = import.meta.env.VITE_API_URL

  const afficherMessage = (texte, type = "success") => {
    setMessage(texte)
    setMessageType(type)

    setTimeout(() => {
      setMessage("")
    }, 3000)
  }

  const chargerDemandes = async () => {
    try {
      setChargement(true)
      const response = await fetch(`${API_URL}/api/demandes`)
      const data = await response.json()
      setDemandes(data)

      const initialEdition = {}
      data.forEach((d) => {
        initialEdition[d.id] = {
          statut: d.statut || "en attente",
          dateRemboursement: d.dateRemboursement
            ? new Date(d.dateRemboursement).toISOString().slice(0, 16)
            : "",
          montantAccorde:
            d.montantAccorde !== null && d.montantAccorde !== undefined
              ? d.montantAccorde
              : "",
          montantRemboursement:
            d.montantRemboursement !== null && d.montantRemboursement !== undefined
              ? d.montantRemboursement
              : "",
          statutPaiement: d.statutPaiement || "non payé",
        }
      })
      setEdition(initialEdition)
    } catch (error) {
      console.error("Erreur chargement demandes :", error)
      afficherMessage("Erreur lors du chargement des demandes.", "error")
    } finally {
      setChargement(false)
    }
  }

  useEffect(() => {
    if (estConnecte) {
      chargerDemandes()
    }
  }, [estConnecte])

  if (!estConnecte) {
    return <Navigate to="/login-admin" replace />
  }

  const formaterDate = (date) => {
    if (!date) return "-"
    return new Intl.DateTimeFormat("fr-FR", {
      dateStyle: "short",
      timeStyle: "short",
      timeZone: "Africa/Dakar",
    }).format(new Date(date))
  }

  const formaterMontant = (montant) => {
    if (montant === null || montant === undefined || montant === "") return "-"
    return `${Number(montant).toLocaleString("fr-FR")} FCFA`
  }

  const couleurStatut = (statut) => {
    if (statut === "acceptée") return "text-green-600"
    if (statut === "refusée") return "text-red-600"
    if (statut === "remboursée") return "text-emerald-700"
    return "text-yellow-600"
  }

  const getStyleEtatCRM = (etatCrm) => {
    if (etatCrm === "Remboursée") {
      return {
        color: "text-green-700",
        bg: "bg-green-50",
        border: "border-green-200",
      }
    }

    if (etatCrm === "Refusée") {
      return {
        color: "text-gray-600",
        bg: "bg-gray-50",
        border: "border-gray-200",
      }
    }

    if (etatCrm === "En retard") {
      return {
        color: "text-red-700",
        bg: "bg-red-50",
        border: "border-red-200",
      }
    }

    if (etatCrm === "Proche remboursement") {
      return {
        color: "text-orange-700",
        bg: "bg-orange-50",
        border: "border-orange-200",
      }
    }

    if (etatCrm === "En attente") {
      return {
        color: "text-yellow-700",
        bg: "bg-yellow-50",
        border: "border-yellow-200",
      }
    }

    return {
      color: "text-blue-700",
      bg: "bg-blue-50",
      border: "border-blue-200",
    }
  }

  const handleChangeEdition = (id, field, value) => {
    setEdition((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }))
  }

  const enregistrerDemande = async (id) => {
    try {
      const data = edition[id]

      if (!data?.statut) {
        afficherMessage("Le statut est obligatoire.", "error")
        return
      }

      const payload = {
        statut: data.statut,
        dateRemboursement: data.dateRemboursement || null,
        montantAccorde: data.montantAccorde === "" ? null : Number(data.montantAccorde),
        montantRemboursement:
          data.montantRemboursement === ""
            ? null
            : Number(data.montantRemboursement),
        statutPaiement: data.statutPaiement || "non payé",
      }

      const response = await fetch(`${API_URL}/api/demandes/${id}/statut`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || "Erreur lors de la mise à jour")
      }

      setDemandes((prev) =>
        prev.map((d) => (d.id === id ? result.data : d))
      )

      setEdition((prev) => ({
        ...prev,
        [id]: {
          statut: result.data.statut || "en attente",
          dateRemboursement: result.data.dateRemboursement
            ? new Date(result.data.dateRemboursement).toISOString().slice(0, 16)
            : "",
          montantAccorde:
            result.data.montantAccorde !== null &&
            result.data.montantAccorde !== undefined
              ? result.data.montantAccorde
              : "",
          montantRemboursement:
            result.data.montantRemboursement !== null &&
            result.data.montantRemboursement !== undefined
              ? result.data.montantRemboursement
              : "",
          statutPaiement: result.data.statutPaiement || "non payé",
        },
      }))

      afficherMessage(`Demande #${id} mise à jour avec succès.`)
    } catch (error) {
      console.error("Erreur mise à jour demande :", error)
      afficherMessage(error.message || "Erreur lors de la mise à jour.", "error")
    }
  }

  const demandesFiltrees = useMemo(() => {
    return demandes.filter((d) => {
      const texte = recherche.toLowerCase().trim()

      const matchRecherche =
        d.nom?.toLowerCase().includes(texte) ||
        d.telephone?.toLowerCase().includes(texte) ||
        d.email?.toLowerCase().includes(texte) ||
        d.typeObjet?.toLowerCase().includes(texte) ||
        String(d.montant || "").includes(texte)

      const matchStatut =
        filtreStatut === "tous" ? true : d.statut === filtreStatut

      return matchRecherche && matchStatut
    })
  }, [demandes, recherche, filtreStatut])

  const stats = useMemo(() => {
    return {
      total: demandes.length,
      enAttente: demandes.filter((d) => d.statut === "en attente").length,
      acceptees: demandes.filter((d) => d.statut === "acceptée").length,
      refusees: demandes.filter((d) => d.statut === "refusée").length,
      remboursees: demandes.filter((d) => d.statut === "remboursée").length,
    }
  }, [demandes])

  const deconnexion = () => {
    localStorage.removeItem("adminAuth")
    localStorage.removeItem("adminUser")
    window.location.href = "/login-admin"
  }

  return (
    <section className="min-h-screen bg-[#f5f3ed] p-6 text-gray-900 md:p-10">
      <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <img
            src={logo}
            alt="TAMAL"
            className="h-14 w-14 rounded-full border-2 border-yellow-500 bg-white p-1 object-cover shadow-md"
          />

          <div>
            <h1 className="text-2xl font-bold text-yellow-600">TAMAL</h1>
            <p className="text-sm text-gray-600">
              Service Liquidité Immédiate
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Connecté en tant que{" "}
              <span className="font-semibold text-gray-900">
                {adminUser?.username}
              </span>{" "}
              —{" "}
              <span className="text-yellow-600">
                {adminUser?.role === "super_admin"
                  ? "Super Admin"
                  : "Gestionnaire"}
              </span>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => (window.location.href = "/admin")}
            className="rounded-full border border-yellow-500 bg-yellow-500 px-4 py-2 text-sm font-semibold text-black"
          >
            Gestion des demandes
          </button>

          <button
            onClick={() => (window.location.href = "/liste-demandes")}
            className="rounded-full border border-yellow-500 px-4 py-2 text-sm font-semibold text-yellow-600 hover:bg-yellow-500 hover:text-black"
          >
            Liste des demandes
          </button>

          {adminUser?.role === "super_admin" && (
            <button
              onClick={() => (window.location.href = "/gestion-admins")}
              className="rounded-full border border-yellow-500 px-4 py-2 text-sm font-semibold text-yellow-600 hover:bg-yellow-500 hover:text-black"
            >
              Gestion des admins
            </button>
          )}

          <button
            onClick={deconnexion}
            className="rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-800 hover:border-red-500 hover:text-red-500"
          >
            Déconnexion
          </button>
        </div>
      </div>

      {message && (
        <div
          className={`mb-6 rounded-2xl border px-4 py-3 text-sm font-medium ${
            messageType === "error"
              ? "border-red-200 bg-red-50 text-red-700"
              : "border-green-200 bg-green-50 text-green-700"
          }`}
        >
          {message}
        </div>
      )}

      <div className="mb-6 grid gap-4 md:grid-cols-5">
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">Total</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">En attente</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.enAttente}</p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">Acceptées</p>
          <p className="text-2xl font-bold text-green-600">{stats.acceptees}</p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">Refusées</p>
          <p className="text-2xl font-bold text-red-600">{stats.refusees}</p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">Remboursées</p>
          <p className="text-2xl font-bold text-emerald-700">{stats.remboursees}</p>
        </div>
      </div>

      <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex flex-col gap-4 md:flex-row">
          <input
            type="text"
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            placeholder="Rechercher par nom, téléphone, email, objet ou montant"
            className="flex-1 rounded-xl border border-gray-200 bg-[#faf9f5] px-4 py-3 text-gray-900 outline-none focus:border-yellow-500"
          />

          <select
            value={filtreStatut}
            onChange={(e) => setFiltreStatut(e.target.value)}
            className="rounded-xl border border-gray-200 bg-[#faf9f5] px-4 py-3 text-gray-900 outline-none focus:border-yellow-500"
          >
            <option value="tous">Tous les statuts</option>
            <option value="en attente">En attente</option>
            <option value="acceptée">Acceptée</option>
            <option value="refusée">Refusée</option>
            <option value="remboursée">Remboursée</option>
          </select>
        </div>
      </div>

      {chargement ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          Chargement des demandes...
        </div>
      ) : demandesFiltrees.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm text-gray-500">
          Aucune demande trouvée.
        </div>
      ) : (
        <div className="grid gap-6">
          {demandesFiltrees.map((d) => {
            const etatCRM = getStyleEtatCRM(d.etatCrm)
            const dataEdition = edition[d.id] || {
              statut: d.statut || "en attente",
              dateRemboursement: "",
              montantAccorde: "",
              montantRemboursement: "",
              statutPaiement: "non payé",
            }

            return (
              <div
                key={d.id}
                className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm"
              >
                <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="mb-2 flex flex-wrap items-center gap-3">
                      <h2 className="text-xl font-bold text-gray-900">
                        Demande #{d.id}
                      </h2>

                      <span className={`font-semibold ${couleurStatut(d.statut)}`}>
                        {d.statut || "-"}
                      </span>

                      <span
                        className={`inline-block rounded-full border px-3 py-1 text-xs font-semibold ${etatCRM.color} ${etatCRM.bg} ${etatCRM.border}`}
                      >
                        {d.etatCrm || "-"}
                      </span>
                    </div>

                    <p className="text-sm text-gray-500">
                      Créée le {formaterDate(d.dateCreation)}
                    </p>
                  </div>

                  <button
                    onClick={() => enregistrerDemande(d.id)}
                    className="rounded-full bg-yellow-500 px-5 py-2 text-sm font-semibold text-black hover:bg-yellow-400"
                  >
                    Enregistrer les modifications
                  </button>
                </div>

                <div className="grid gap-6 xl:grid-cols-2">
                  <div className="rounded-2xl bg-[#faf9f5] p-4">
                    <h3 className="mb-4 text-lg font-bold text-gray-900">
                      Informations client
                    </h3>

                    <div className="grid gap-3 text-sm">
                      <p>
                        <span className="font-semibold">Nom :</span> {d.nom || "-"}
                      </p>
                      <p>
                        <span className="font-semibold">Téléphone :</span>{" "}
                        {d.telephone || "-"}
                      </p>
                      <p>
                        <span className="font-semibold">Email :</span>{" "}
                        {d.email || "-"}
                      </p>
                      <p>
                        <span className="font-semibold">Objet :</span>{" "}
                        {d.typeObjet || "-"}
                      </p>
                      <p>
                        <span className="font-semibold">Type de pièce :</span>{" "}
                        {d.typePiece || "-"}
                      </p>
                      <p>
                        <span className="font-semibold">Montant demandé :</span>{" "}
                        {formaterMontant(d.montant)}
                      </p>
                      <p>
                        <span className="font-semibold">Description :</span>{" "}
                        {d.description || "-"}
                      </p>

                      {d.document && (
                        <p>
                          <span className="font-semibold">Document :</span>{" "}
                          <a
                            href={`${API_URL}/uploads/${d.document}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-600 underline"
                          >
                            Voir le document
                          </a>
                        </p>
                      )}

                      {d.photo && (
                        <div className="pt-2">
                          <p className="mb-2 font-semibold">Photo de l’objet :</p>
                          <img
                            src={`${API_URL}/uploads/${d.photo}`}
                            alt={d.typeObjet || "Objet"}
                            className="max-h-56 rounded-2xl border border-gray-200 object-cover"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="rounded-2xl bg-[#faf9f5] p-4">
                    <h3 className="mb-4 text-lg font-bold text-gray-900">
                      Traitement du dossier
                    </h3>

                    <div className="grid gap-4">
                      <div>
                        <label className="mb-1 block text-sm font-semibold text-gray-700">
                          Statut
                        </label>
                        <select
                          value={dataEdition.statut}
                          onChange={(e) =>
                            handleChangeEdition(d.id, "statut", e.target.value)
                          }
                          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-yellow-500"
                        >
                          <option value="en attente">En attente</option>
                          <option value="acceptée">Acceptée</option>
                          <option value="refusée">Refusée</option>
                          <option value="remboursée">Remboursée</option>
                        </select>
                      </div>

                      <div>
                        <label className="mb-1 block text-sm font-semibold text-gray-700">
                          Montant accordé
                        </label>
                        <input
                          type="number"
                          value={dataEdition.montantAccorde}
                          onChange={(e) =>
                            handleChangeEdition(d.id, "montantAccorde", e.target.value)
                          }
                          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-yellow-500"
                          placeholder="Ex : 50000"
                        />
                      </div>

                      <div>
                        <label className="mb-1 block text-sm font-semibold text-gray-700">
                          Montant remboursement
                        </label>
                        <input
                          type="number"
                          value={dataEdition.montantRemboursement}
                          onChange={(e) =>
                            handleChangeEdition(
                              d.id,
                              "montantRemboursement",
                              e.target.value
                            )
                          }
                          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-yellow-500"
                          placeholder="Ex : 60000"
                        />
                      </div>

                      <div>
                        <label className="mb-1 block text-sm font-semibold text-gray-700">
                          Date de remboursement
                        </label>
                        <input
                          type="datetime-local"
                          value={dataEdition.dateRemboursement}
                          onChange={(e) =>
                            handleChangeEdition(
                              d.id,
                              "dateRemboursement",
                              e.target.value
                            )
                          }
                          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-yellow-500"
                        />
                      </div>

                      <div>
                        <label className="mb-1 block text-sm font-semibold text-gray-700">
                          Statut paiement
                        </label>
                        <select
                          value={dataEdition.statutPaiement}
                          onChange={(e) =>
                            handleChangeEdition(d.id, "statutPaiement", e.target.value)
                          }
                          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-yellow-500"
                        >
                          <option value="non payé">Non payé</option>
                          <option value="payé">Payé</option>
                          <option value="en retard">En retard</option>
                        </select>
                      </div>

                      <div className="rounded-2xl border border-gray-200 bg-white p-4 text-sm">
                        <p className="mb-2">
                          <span className="font-semibold">État CRM actuel :</span>{" "}
                          {d.etatCrm || "-"}
                        </p>
                        <p className="mb-2">
                          <span className="font-semibold">Dernier rappel :</span>{" "}
                          {formaterDate(d.dateDernierRappel)}
                        </p>
                        <p>
                          <span className="font-semibold">Montant demandé :</span>{" "}
                          {formaterMontant(d.montant)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}