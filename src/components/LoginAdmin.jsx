import { useState } from "react"
import { useNavigate } from "react-router-dom"

export default function LoginAdmin() {
  const [identifiant, setIdentifiant] = useState("")
  const [motDePasse, setMotDePasse] = useState("")
  const [erreur, setErreur] = useState("")
  const [chargement, setChargement] = useState(false)

  const [afficherMotDePasse, setAfficherMotDePasse] = useState(false)

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErreur("")
    setChargement(true)

    try {
      const response = await fetch("http://localhost:5000/api/admin/login", {
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
    <section className="min-h-screen bg-black px-4 py-20 text-white">
      <div className="mx-auto max-w-md rounded-3xl border border-white/10 bg-white/5 p-8">
        <h1 className="text-3xl font-bold text-yellow-500">
          Connexion Admin
        </h1>

        <p className="mt-3 text-sm text-gray-400">
          Accès réservé à l’équipe TAMAL.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="mb-2 block text-sm text-gray-300">
              Identifiant
            </label>

            <input
              type="text"
              value={identifiant}
              onChange={(e) => setIdentifiant(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-yellow-500"
              placeholder="Votre identifiant"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-gray-300">
              Mot de passe
            </label>

            <input
              type={afficherMotDePasse ? "text" : "password"}
              value={motDePasse}
              onChange={(e) => setMotDePasse(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-yellow-500"
              placeholder="Votre mot de passe"
              required
            />

            <label className="mt-2 flex items-center gap-2 text-sm text-gray-400">
              <input
                type="checkbox"
                checked={afficherMotDePasse}
                onChange={() =>
                  setAfficherMotDePasse(!afficherMotDePasse)
                }
              />
              Afficher le mot de passe
            </label>
          </div>

          {erreur && <p className="text-sm text-red-400">{erreur}</p>}

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