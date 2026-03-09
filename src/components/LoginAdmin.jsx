import { useState } from "react"
import { useNavigate } from "react-router-dom"

export default function LoginAdmin() {
  const [identifiant, setIdentifiant] = useState("")
  const [motDePasse, setMotDePasse] = useState("")
  const [erreur, setErreur] = useState("")
  const [chargement, setChargement] = useState(false)
  const [afficherMotDePasse, setAfficherMotDePasse] = useState(false)

  const navigate = useNavigate()
  const API_URL = import.meta.env.VITE_API_URL

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErreur("")
    setChargement(true)

    try {
      const response = await fetch(`${API_URL}/api/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: identifiant,
          password: motDePasse,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setErreur(data.message || "Identifiants incorrects")
        setChargement(false)
        return
      }

      localStorage.setItem("adminAuth", "true")
      localStorage.setItem("adminUser", JSON.stringify(data.admin))

      navigate("/admin")
    } catch (error) {
      setErreur("Impossible de se connecter au serveur.")
    } finally {
      setChargement(false)
    }
  }

  return (
    <section className="min-h-screen bg-[#f5f3ed] px-4 py-20 text-gray-900">
      <div className="mx-auto max-w-md rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <img
            src="/logo-tamal.jpeg"
            alt="TAMAL"
            className="h-14 w-14 rounded-full border-2 border-yellow-500 bg-white p-1 object-cover shadow-md"
          />

          <div>
            <h1 className="text-xl font-bold text-yellow-600">TAMAL</h1>
            <p className="text-sm text-gray-600">
              Service Liquidité Immédiate
            </p>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-gray-900">
          Connexion Admin
        </h2>

        <p className="mt-3 text-sm text-gray-600">
          Accès réservé à l’équipe TAMAL.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="mb-2 block text-sm text-gray-700">
              Identifiant
            </label>

            <input
              type="text"
              value={identifiant}
              onChange={(e) => setIdentifiant(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-[#faf9f5] px-4 py-3 text-gray-900 outline-none focus:border-yellow-500"
              placeholder="Votre identifiant"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-gray-700">
              Mot de passe
            </label>

            <input
              type={afficherMotDePasse ? "text" : "password"}
              value={motDePasse}
              onChange={(e) => setMotDePasse(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-[#faf9f5] px-4 py-3 text-gray-900 outline-none focus:border-yellow-500"
              placeholder="Votre mot de passe"
              required
            />

            <label className="mt-2 flex items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={afficherMotDePasse}
                onChange={() => setAfficherMotDePasse(!afficherMotDePasse)}
              />
              Afficher le mot de passe
            </label>
          </div>

          {erreur && (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {erreur}
            </div>
          )}

          <button
            type="submit"
            disabled={chargement}
            className="w-full rounded-full bg-yellow-500 py-3 font-semibold text-black hover:bg-yellow-400 disabled:opacity-60"
          >
            {chargement ? "Connexion..." : "Se connecter"}
          </button>
        </form>
      </div>
    </section>
  )
}