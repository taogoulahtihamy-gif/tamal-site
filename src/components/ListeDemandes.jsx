import { useEffect, useMemo, useState } from "react"
import { Navigate } from "react-router-dom"
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

  const couleurStatut = (statut) => {
    if (statut === "acceptée") return "text-green-600"
    if (statut === "refusée") return "text-red-600"
    return "text-yellow-600"
  }

  const formaterDate = (date) => {
    if (!date) return "-"
    return new Date(date).toLocaleString("fr-FR")
  }

  const calculerDateRemboursement = (demande) => {
    if (!demande?.dateCreation) return "-"

    const montant = Number(demande.montant || 0)
    const duree = montant >= 30000 ? 14 : 7

    const date = new Date(demande.dateCreation)
    date.setDate(date.getDate() + duree)

    return date.toLocaleString("fr-FR")
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

      <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-yellow-600">
            Liste complète des demandes
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <input
            type="text"
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            placeholder="Rechercher par nom, téléphone, objet ou montant"
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
          </select>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full">
          <thead className="bg-[#faf9f5]">
            <tr>
              <th className="p-3 text-gray-700">ID</th>
              <th className="p-3 text-gray-700">Nom</th>
              <th className="p-3 text-gray-700">Téléphone</th>
              <th className="p-3 text-gray-700">Objet</th>
              <th className="p-3 text-gray-700">Montant</th>
              <th className="p-3 text-gray-700">Statut</th>
              <th className="p-3 text-gray-700">Date demande</th>
              <th className="p-3 text-gray-700">Date remboursement</th>
            </tr>
          </thead>

          <tbody>
            {demandesFiltrees.length > 0 ? (
              demandesFiltrees.map((d) => (
                <tr key={d.id} className="border-t border-gray-200 text-center">
                  <td className="p-3 text-gray-800">{d.id}</td>
                  <td className="p-3 text-gray-800">{d.nom}</td>
                  <td className="p-3 text-gray-800">{d.telephone}</td>
                  <td className="p-3 text-gray-800">{d.typeObjet}</td>
                  <td className="p-3 text-gray-800">{d.montant} FCFA</td>
                  <td className={`p-3 font-semibold ${couleurStatut(d.statut)}`}>
                    {d.statut}
                  </td>
                  <td className="p-3 text-sm text-gray-600">
                    {formaterDate(d.dateCreation)}
                  </td>
                  <td className="p-3 text-sm text-gray-600">
                    {calculerDateRemboursement(d)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="p-6 text-center text-gray-500">
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