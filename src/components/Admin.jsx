import { useEffect, useMemo, useState } from "react"
import { Navigate } from "react-router-dom"
import * as XLSX from "xlsx"
import logo from "../assets/logo.jpeg"

export default function Admin() {
  const [demandes, setDemandes] = useState([])
  const [recherche, setRecherche] = useState("")
  const [filtreStatut, setFiltreStatut] = useState("tous")

  const estConnecte = localStorage.getItem("adminAuth") === "true"
  const adminUser = JSON.parse(localStorage.getItem("adminUser") || "null")

  const chargerDemandes = () => {
    fetch("http://localhost:5000/api/demandes")
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

  const changerStatut = async (id, nouveauStatut) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/demandes/${id}/statut`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ statut: nouveauStatut }),
        }
      )

      if (!response.ok) {
        throw new Error("Erreur lors de la mise à jour du statut")
      }

      setDemandes((prev) =>
        prev.map((demande) =>
          demande.id === id
            ? { ...demande, statut: nouveauStatut }
            : demande
        )
      )
    } catch (error) {
      console.error("Erreur :", error)
    }
  }

  const couleurStatut = (statut) => {
    if (statut === "acceptée") return "text-green-400"
    if (statut === "refusée") return "text-red-400"
    return "text-yellow-400"
  }

  const formaterDate = (date) => {
    if (!date) return "-"
    return new Date(date).toLocaleString("fr-FR")
  }

  const demandesFiltrees = useMemo(() => {
    return demandes.filter((d) => {
      const texteRecherche = recherche.toLowerCase().trim()

      const matchRecherche =
        d.nom?.toLowerCase().includes(texteRecherche) ||
        d.telephone?.toLowerCase().includes(texteRecherche) ||
        d.typeObjet?.toLowerCase().includes(texteRecherche) ||
        String(d.montant || "").includes(texteRecherche)

      const matchStatut =
        filtreStatut === "tous" ? true : d.statut === filtreStatut

      return matchRecherche && matchStatut
    })
  }, [demandes, recherche, filtreStatut])

  const totalDemandes = demandes.length
  const totalEnAttente = demandes.filter((d) => d.statut === "en attente").length
  const totalAcceptees = demandes.filter((d) => d.statut === "acceptée").length
  const totalRefusees = demandes.filter((d) => d.statut === "refusée").length

  const exporterExcel = () => {
    const dataExport = demandesFiltrees.map((d) => ({
      ID: d.id,
      Nom: d.nom || "",
      Téléphone: d.telephone || "",
      Objet: d.typeObjet || "",
      Montant: d.montant || "",
      Description: d.description || "",
      Document: d.document || "",
      Photo: d.photo || "",
      Statut: d.statut || "",
      "Date de création": formaterDate(d.dateCreation),
    }))

    const worksheet = XLSX.utils.json_to_sheet(dataExport)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Demandes TAMAL")
    XLSX.writeFile(workbook, "historique_demandes_tamal.xlsx")
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
    <section className="min-h-screen bg-black p-6 text-white md:p-10">
      <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <img
            src={logo}
            alt="TAMAL"
            className="h-14 w-14 rounded-full object-cover"
          />

          <div>
            <h1 className="text-2xl font-bold text-yellow-500">TAMAL</h1>
            <p className="text-sm text-gray-400">
              Service Liquidité Immédiate
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Connecté en tant que{" "}
              <span className="font-semibold text-white">
                {adminUser?.username}
              </span>{" "}
              —{" "}
              <span className="text-yellow-400">
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
            className="rounded-full border border-yellow-500 px-4 py-2 text-sm font-semibold text-yellow-400 hover:bg-yellow-500 hover:text-black"
          >
            Gestion des demandes
          </button>

          {adminUser?.role === "super_admin" && (
            <button
              onClick={() => (window.location.href = "/gestion-admins")}
              className="rounded-full border border-yellow-500 px-4 py-2 text-sm font-semibold text-yellow-400 hover:bg-yellow-500 hover:text-black"
            >
              Gestion des admins
            </button>
          )}

          <button
            onClick={deconnexion}
            className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white hover:border-red-500 hover:text-red-400"
          >
            Déconnexion
          </button>
        </div>
      </div>

      <div className="mb-10 grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <p className="text-sm text-gray-400">Total demandes</p>
          <p className="mt-2 text-3xl font-bold text-white">{totalDemandes}</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <p className="text-sm text-gray-400">En attente</p>
          <p className="mt-2 text-3xl font-bold text-yellow-400">
            {totalEnAttente}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <p className="text-sm text-gray-400">Acceptées</p>
          <p className="mt-2 text-3xl font-bold text-green-400">
            {totalAcceptees}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <p className="text-sm text-gray-400">Refusées</p>
          <p className="mt-2 text-3xl font-bold text-red-400">
            {totalRefusees}
          </p>
        </div>
      </div>

      <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-5">
        <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h2 className="text-xl font-bold text-yellow-400">
            Historique des demandes
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
            placeholder="Rechercher par nom, téléphone, objet ou montant"
            className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-yellow-500"
          />

          <select
            value={filtreStatut}
            onChange={(e) => setFiltreStatut(e.target.value)}
            className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-yellow-500"
          >
            <option value="tous">Tous les statuts</option>
            <option value="en attente">En attente</option>
            <option value="acceptée">Acceptée</option>
            <option value="refusée">Refusée</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-white/10">
        <table className="w-full">
          <thead className="bg-white/5">
            <tr>
              <th className="p-3">ID</th>
              <th className="p-3">Nom</th>
              <th className="p-3">Téléphone</th>
              <th className="p-3">Objet</th>
              <th className="p-3">Montant</th>
              <th className="p-3">Document</th>
              <th className="p-3">Photo</th>
              <th className="p-3">Statut</th>
              <th className="p-3">Date</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {demandesFiltrees.length > 0 ? (
              demandesFiltrees.map((d) => (
                <tr key={d.id} className="border-t border-white/10 text-center">
                  <td className="p-3">{d.id}</td>
                  <td className="p-3">{d.nom}</td>
                  <td className="p-3">{d.telephone}</td>
                  <td className="p-3">{d.typeObjet}</td>
                  <td className="p-3">{d.montant} FCFA</td>

                  <td className="p-3">
                    {d.document ? (
                      <a
                        href={`http://localhost:5000/uploads/${d.document}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-yellow-400 underline"
                      >
                        Voir
                      </a>
                    ) : (
                      "-"
                    )}
                  </td>

                  <td className="p-3">
                    {d.photo ? (
                      <img
                        src={`http://localhost:5000/uploads/${d.photo}`}
                        alt="photo objet"
                        className="mx-auto h-16 w-16 rounded object-cover"
                      />
                    ) : (
                      "-"
                    )}
                  </td>

                  <td className={`p-3 font-semibold ${couleurStatut(d.statut)}`}>
                    {d.statut}
                  </td>

                  <td className="p-3 text-sm text-gray-300">
                    {formaterDate(d.dateCreation)}
                  </td>

                  <td className="p-3">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => changerStatut(d.id, "acceptée")}
                        className="rounded-full bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-500"
                      >
                        Accepter
                      </button>

                      <button
                        onClick={() => changerStatut(d.id, "refusée")}
                        className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500"
                      >
                        Refuser
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="p-6 text-center text-gray-400">
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