import { useEffect, useMemo, useState } from "react"
import { Navigate } from "react-router-dom"
import * as XLSX from "xlsx"
import logo from "../assets/logo.jpeg"

export default function ListeDemandes() {
  const [demandes, setDemandes] = useState([])
  const [recherche, setRecherche] = useState("")
  const [filtreStatut, setFiltreStatut] = useState("tous")

  const estConnecte = localStorage.getItem("adminAuth") === "true"
  const adminUser = JSON.parse(localStorage.getItem("adminUser") || "null")
  const API_URL = import.meta.env.VITE_API_URL

  const chargerDemandes = () => {
    fetch(`${API_URL}/api/demandes`)
      .then((res) => res.json())
      .then((data) => {
        setDemandes(data)
      })
      .catch((error) => {
        console.error("Erreur chargement demandes :", error)
      })
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

  const couleurStatut = (statut) => {
    if (statut === "acceptée") return "text-green-600"
    if (statut === "refusée") return "text-red-600"
    if (statut === "remboursée") return "text-emerald-700"
    return "text-yellow-600"
  }

  const couleurPaiement = (statutPaiement) => {
    if (statutPaiement === "payé") return "text-green-700"
    if (statutPaiement === "en retard") return "text-red-700"
    return "text-gray-600"
  }

  const demandesFiltrees = useMemo(() => {
    return demandes.filter((d) => {
      const texteRecherche = recherche.toLowerCase().trim()

      const matchRecherche =
        d.nom?.toLowerCase().includes(texteRecherche) ||
        d.telephone?.toLowerCase().includes(texteRecherche) ||
        d.email?.toLowerCase().includes(texteRecherche) ||
        d.typeObjet?.toLowerCase().includes(texteRecherche) ||
        String(d.montant || "").includes(texteRecherche)

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
      enRetard: demandes.filter((d) => d.etatCrm === "En retard").length,
    }
  }, [demandes])

  const exporterExcel = () => {
    const dataExport = demandesFiltrees.map((d) => ({
      ID: d.id,
      Nom: d.nom || "",
      Téléphone: d.telephone || "",
      Email: d.email || "",
      Objet: d.typeObjet || "",
      "Montant demandé": d.montant || "",
      Statut: d.statut || "",
      "État CRM": d.etatCrm || "",
      "Montant accordé": d.montantAccorde || "",
      "Montant remboursement": d.montantRemboursement || "",
      "Statut paiement": d.statutPaiement || "",
      "Date demande": formaterDate(d.dateCreation),
      "Date remboursement": formaterDate(d.dateRemboursement),
      "Dernier rappel": formaterDate(d.dateDernierRappel),
    }))

    const worksheet = XLSX.utils.json_to_sheet(dataExport)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Liste demandes")
    XLSX.writeFile(workbook, "liste_demandes_tamal.xlsx")
  }

  const imprimerPage = () => {
    window.print()
  }

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
            className="rounded-full border border-yellow-500 px-4 py-2 text-sm font-semibold text-yellow-600 hover:bg-yellow-500 hover:text-black"
          >
            Gestion des demandes
          </button>

          <button
            onClick={() => (window.location.href = "/liste-demandes")}
            className="rounded-full border border-yellow-500 bg-yellow-500 px-4 py-2 text-sm font-semibold text-black"
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

      <div className="mb-6 grid gap-4 md:grid-cols-6">
        <div className="rounded-2xl bg-white p-4 shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500">Total</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>

        <div className="rounded-2xl bg-white p-4 shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500">En attente</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.enAttente}</p>
        </div>

        <div className="rounded-2xl bg-white p-4 shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500">Acceptées</p>
          <p className="text-2xl font-bold text-green-600">{stats.acceptees}</p>
        </div>

        <div className="rounded-2xl bg-white p-4 shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500">Refusées</p>
          <p className="text-2xl font-bold text-red-600">{stats.refusees}</p>
        </div>

        <div className="rounded-2xl bg-white p-4 shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500">Remboursées</p>
          <p className="text-2xl font-bold text-emerald-700">{stats.remboursees}</p>
        </div>

        <div className="rounded-2xl bg-white p-4 shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500">En retard</p>
          <p className="text-2xl font-bold text-red-700">{stats.enRetard}</p>
        </div>
      </div>

      <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h2 className="text-xl font-bold text-yellow-600">
            Liste complète des demandes
          </h2>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={exporterExcel}
              className="rounded-full bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-500"
            >
              Exporter Excel
            </button>

            <button
              onClick={imprimerPage}
              className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
            >
              Imprimer
            </button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <input
            type="text"
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            placeholder="Rechercher par nom, téléphone, email, objet ou montant"
            className="rounded-xl border border-gray-200 bg-[#faf9f5] px-4 py-3 text-gray-900 outline-none focus:border-yellow-500"
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

      <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
        <table className="min-w-[1450px] w-full">
          <thead className="bg-[#faf9f5]">
            <tr>
              <th className="p-3 text-gray-700">ID</th>
              <th className="p-3 text-gray-700">Nom</th>
              <th className="p-3 text-gray-700">Téléphone</th>
              <th className="p-3 text-gray-700">Email</th>
              <th className="p-3 text-gray-700">Objet</th>
              <th className="p-3 text-gray-700">Montant demandé</th>
              <th className="p-3 text-gray-700">Montant accordé</th>
              <th className="p-3 text-gray-700">Montant remboursement</th>
              <th className="p-3 text-gray-700">Statut</th>
              <th className="p-3 text-gray-700">État CRM</th>
              <th className="p-3 text-gray-700">Paiement</th>
              <th className="p-3 text-gray-700">Date demande</th>
              <th className="p-3 text-gray-700">Date remboursement</th>
              <th className="p-3 text-gray-700">Dernier rappel</th>
            </tr>
          </thead>

          <tbody>
            {demandesFiltrees.length > 0 ? (
              demandesFiltrees.map((d) => {
                const etatCRM = getStyleEtatCRM(d.etatCrm)

                return (
                  <tr key={d.id} className="border-t border-gray-200 text-center">
                    <td className="p-3 text-gray-800">{d.id}</td>
                    <td className="p-3 text-gray-800">{d.nom || "-"}</td>
                    <td className="p-3 text-gray-800">{d.telephone || "-"}</td>
                    <td className="p-3 text-gray-800">{d.email || "-"}</td>
                    <td className="p-3 text-gray-800">{d.typeObjet || "-"}</td>
                    <td className="p-3 text-gray-800">{formaterMontant(d.montant)}</td>
                    <td className="p-3 text-gray-800">
                      {formaterMontant(d.montantAccorde)}
                    </td>
                    <td className="p-3 text-gray-800">
                      {formaterMontant(d.montantRemboursement)}
                    </td>

                    <td className={`p-3 font-semibold ${couleurStatut(d.statut)}`}>
                      {d.statut || "-"}
                    </td>

                    <td className="p-3">
                      <span
                        className={`inline-block rounded-full border px-3 py-1 text-xs font-semibold ${etatCRM.color} ${etatCRM.bg} ${etatCRM.border}`}
                      >
                        {d.etatCrm || "-"}
                      </span>
                    </td>

                    <td className={`p-3 font-semibold ${couleurPaiement(d.statutPaiement)}`}>
                      {d.statutPaiement || "non payé"}
                    </td>

                    <td className="p-3 text-sm text-gray-600">
                      {formaterDate(d.dateCreation)}
                    </td>

                    <td className="p-3 text-sm text-gray-600">
                      {formaterDate(d.dateRemboursement)}
                    </td>

                    <td className="p-3 text-sm text-gray-600">
                      {formaterDate(d.dateDernierRappel)}
                    </td>
                  </tr>
                )
              })
            ) : (
              <tr>
                <td colSpan="14" className="p-6 text-center text-gray-500">
                  Aucune demande trouvée.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}