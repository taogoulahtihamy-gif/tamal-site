import { useEffect, useState } from "react"
import { Navigate, Link } from "react-router-dom"

export default function GestionAdmins() {
  const estConnecte = localStorage.getItem("adminAuth") === "true"
  const adminUser = JSON.parse(localStorage.getItem("adminUser") || "null")
  const API_URL = import.meta.env.VITE_API_URL

  const [admins, setAdmins] = useState([])
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("admin")
  const [message, setMessage] = useState("")
  const [erreur, setErreur] = useState("")
  const [passwords, setPasswords] = useState({})

  const [afficherMotDePasseAjout, setAfficherMotDePasseAjout] = useState(false)
  const [afficherMotsDePasseActuels, setAfficherMotsDePasseActuels] = useState({})
  const [afficherMotsDePasseEdition, setAfficherMotsDePasseEdition] = useState({})

  const estSuperAdmin = adminUser?.role === "super_admin"

  const headersAdmin = {
    "Content-Type": "application/json",
    "x-admin-role": adminUser?.role || "",
  }

  const chargerAdmins = async () => {
    try {
      const response = await fetch(`${API_URL}/api/admins`, {
        headers: headersAdmin,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Erreur lors du chargement des admins")
      }

      setAdmins(data)
    } catch (error) {
      setErreur(error.message)
    }
  }

  useEffect(() => {
    if (estConnecte && estSuperAdmin) {
      chargerAdmins()
    }
  }, [])

  if (!estConnecte) {
    return <Navigate to="/login-admin" replace />
  }

  if (!estSuperAdmin) {
    return <Navigate to="/admin" replace />
  }

  const reinitialiserMessages = () => {
    setMessage("")
    setErreur("")
  }

  const ajouterAdmin = async (e) => {
    e.preventDefault()
    reinitialiserMessages()

    if (!username.trim() || !password.trim() || !role) {
      setErreur("Tous les champs sont obligatoires.")
      return
    }

    try {
      const response = await fetch(`${API_URL}/api/admins`, {
        method: "POST",
        headers: headersAdmin,
        body: JSON.stringify({
          username: username.trim(),
          password: password.trim(),
          role,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Erreur lors de l'ajout de l'admin")
      }

      setMessage("Admin ajouté avec succès.")
      setUsername("")
      setPassword("")
      setRole("admin")
      setAfficherMotDePasseAjout(false)
      chargerAdmins()
    } catch (error) {
      setErreur(error.message)
    }
  }

  const modifierMotDePasse = async (id) => {
    reinitialiserMessages()

    const nouveauMotDePasse = passwords[id]

    if (!nouveauMotDePasse || !nouveauMotDePasse.trim()) {
      setErreur("Veuillez saisir un nouveau mot de passe.")
      return
    }

    try {
      const response = await fetch(
        `${API_URL}/api/admins/${id}/password`,
        {
          method: "PATCH",
          headers: headersAdmin,
          body: JSON.stringify({
            password: nouveauMotDePasse.trim(),
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message || "Erreur lors de la modification du mot de passe"
        )
      }

      setMessage("Mot de passe mis à jour avec succès.")
      setPasswords((prev) => ({
        ...prev,
        [id]: "",
      }))
      setAfficherMotsDePasseEdition((prev) => ({
        ...prev,
        [id]: false,
      }))
      chargerAdmins()
    } catch (error) {
      setErreur(error.message)
    }
  }

  const supprimerAdmin = async (id) => {
    reinitialiserMessages()

    const confirmation = window.confirm(
      "Voulez-vous vraiment supprimer cet admin ?"
    )

    if (!confirmation) return

    try {
      const response = await fetch(`${API_URL}/api/admins/${id}`, {
        method: "DELETE",
        headers: headersAdmin,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Erreur lors de la suppression")
      }

      setMessage("Admin supprimé avec succès.")
      chargerAdmins()
    } catch (error) {
      setErreur(error.message)
    }
  }

  const deconnexion = () => {
    localStorage.removeItem("adminAuth")
    localStorage.removeItem("adminUser")
    window.location.href = "/login-admin"
  }

  return (
    <section className="min-h-screen bg-black p-6 text-white md:p-10">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-yellow-500">
            Gestion des admins
          </h1>
          <p className="mt-2 text-sm text-gray-400">
            Connecté en tant que{" "}
            <span className="font-semibold text-white">
              {adminUser?.username}
            </span>{" "}
            — <span className="text-yellow-400">Super Admin</span>
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            to="/admin"
            className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white hover:border-yellow-500 hover:text-yellow-400"
          >
            Retour dashboard
          </Link>

          <button
            onClick={deconnexion}
            className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white hover:border-red-500 hover:text-red-400"
          >
            Déconnexion
          </button>
        </div>
      </div>

      <div className="mb-10 rounded-3xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-xl font-bold text-yellow-400">Ajouter un admin</h2>

        <form
          onSubmit={ajouterAdmin}
          className="mt-6 grid gap-4 md:grid-cols-3"
        >
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Nom d'utilisateur"
            className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-yellow-500"
          />

          <div>
            <input
              type={afficherMotDePasseAjout ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mot de passe"
              className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-yellow-500"
            />

            <label className="mt-2 flex items-center gap-2 text-sm text-gray-400">
              <input
                type="checkbox"
                checked={afficherMotDePasseAjout}
                onChange={() =>
                  setAfficherMotDePasseAjout(!afficherMotDePasseAjout)
                }
              />
              Afficher le mot de passe
            </label>
          </div>

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-yellow-500"
          >
            <option value="admin">admin</option>
            <option value="super_admin">super_admin</option>
          </select>

          <div className="md:col-span-3">
            <button
              type="submit"
              className="rounded-full bg-yellow-500 px-6 py-3 font-semibold text-black hover:bg-yellow-400"
            >
              Ajouter
            </button>
          </div>
        </form>

        {message && <p className="mt-4 text-sm text-green-400">{message}</p>}
        {erreur && <p className="mt-4 text-sm text-red-400">{erreur}</p>}
      </div>

      <div className="overflow-x-auto rounded-3xl border border-white/10">
        <table className="w-full">
          <thead className="bg-white/5">
            <tr>
              <th className="p-3 text-center">ID</th>
              <th className="p-3 text-center">Nom d'utilisateur</th>
              <th className="p-3 text-center">Rôle</th>
              <th className="p-3 text-center">Mot de passe actuel</th>
              <th className="p-3 text-center">Nouveau mot de passe</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {admins.length > 0 ? (
              admins.map((admin) => (
                <tr
                  key={admin.id}
                  className="border-t border-white/10 text-center"
                >
                  <td className="p-3">{admin.id}</td>
                  <td className="p-3">{admin.username}</td>
                  <td className="p-3">
                    <span
                      className={
                        admin.role === "super_admin"
                          ? "font-semibold text-yellow-400"
                          : "text-white"
                      }
                    >
                      {admin.role}
                    </span>
                  </td>

                  <td className="p-3">
                    <div className="flex flex-col items-center gap-2">
                      <input
                        type={afficherMotsDePasseActuels[admin.id] ? "text" : "password"}
                        value={admin.password || ""}
                        readOnly
                        className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2 text-center text-white outline-none"
                      />

                      <label className="flex items-center gap-2 text-sm text-gray-400">
                        <input
                          type="checkbox"
                          checked={!!afficherMotsDePasseActuels[admin.id]}
                          onChange={() =>
                            setAfficherMotsDePasseActuels((prev) => ({
                              ...prev,
                              [admin.id]: !prev[admin.id],
                            }))
                          }
                        />
                        Afficher
                      </label>
                    </div>
                  </td>

                  <td className="p-3">
                    <div className="flex flex-col items-center gap-2">
                      <input
                        type={afficherMotsDePasseEdition[admin.id] ? "text" : "password"}
                        value={passwords[admin.id] || ""}
                        onChange={(e) =>
                          setPasswords((prev) => ({
                            ...prev,
                            [admin.id]: e.target.value,
                          }))
                        }
                        placeholder="Nouveau mot de passe"
                        className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2 text-white outline-none focus:border-yellow-500"
                      />

                      <label className="flex items-center gap-2 text-sm text-gray-400">
                        <input
                          type="checkbox"
                          checked={!!afficherMotsDePasseEdition[admin.id]}
                          onChange={() =>
                            setAfficherMotsDePasseEdition((prev) => ({
                              ...prev,
                              [admin.id]: !prev[admin.id],
                            }))
                          }
                        />
                        Afficher
                      </label>
                    </div>
                  </td>

                  <td className="p-3">
                    <div className="flex flex-wrap justify-center gap-2">
                      <button
                        onClick={() => modifierMotDePasse(admin.id)}
                        className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
                      >
                        Modifier mot de passe
                      </button>

                      <button
                        onClick={() => supprimerAdmin(admin.id)}
                        className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
                        disabled={admin.role === "super_admin"}
                      >
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="p-6 text-center text-gray-400">
                  Aucun admin disponible.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}