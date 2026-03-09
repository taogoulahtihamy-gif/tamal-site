import { useMemo, useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"

export default function Navbar() {
  const [menuOuvert, setMenuOuvert] = useState(false)
  const [rechercheOuverte, setRechercheOuverte] = useState(false)
  const [recherche, setRecherche] = useState("")

  const navigate = useNavigate()
  const location = useLocation()

  const liensRecherche = [
    {
      label: "Accueil",
      path: "/",
      motsCles: ["accueil","home","tamal","pret","prêt","gage","liquidité","liquidite","rapide","sécurisé","securise"],
    },
    {
      label: "Comment ça marche",
      path: "/comment-ca-marche",
      motsCles: ["comment","marche","fonctionnement","etapes","étapes","processus","demande","rendez-vous","validation","versement"],
    },
    {
      label: "Conditions",
      path: "/conditions",
      motsCles: ["condition","conditions","documents","document","cni","passeport","certificat","résidence","acceptation","dépôt"],
    },
    {
      label: "Simulateur",
      path: "/simulateur",
      motsCles: ["simulateur","simulation","montant","durée","remboursement","retard","penalite","calcul","fcfa"],
    },
    {
      label: "Demande",
      path: "/demande",
      motsCles: ["demande","formulaire","soumettre","nom","telephone","photo","document","piece","objet"],
    },
    {
      label: "Contact",
      path: "/contact",
      motsCles: ["contact","appel","telephone","adresse","dakar","horaires"],
    },
  ]

  const resultatsRecherche = useMemo(() => {
    const texte = recherche.trim().toLowerCase()
    if (!texte) return liensRecherche

    return liensRecherche.filter((item) => {
      const dansLabel = item.label.toLowerCase().includes(texte)
      const dansMotsCles = item.motsCles.some((mot) =>
        mot.toLowerCase().includes(texte)
      )
      return dansLabel || dansMotsCles
    })
  }, [recherche])

  const fermerTout = () => {
    setMenuOuvert(false)
    setRechercheOuverte(false)
    setRecherche("")
  }

  const toggleMenu = () => {
    setMenuOuvert((prev) => !prev)
  }

  const toggleRecherche = () => {
    setRechercheOuverte((prev) => !prev)
    if (rechercheOuverte) setRecherche("")
  }

  const allerVers = (path) => {
    setMenuOuvert(false)
    setRechercheOuverte(false)
    setRecherche("")

    if (path === "/contact") {
      if (location.pathname !== "/") {
        navigate("/")
        setTimeout(() => {
          const section = document.getElementById("contact")
          if (section) section.scrollIntoView({ behavior: "smooth" })
        }, 250)
      } else {
        const section = document.getElementById("contact")
        if (section) section.scrollIntoView({ behavior: "smooth" })
      }
      return
    }

    navigate(path)
  }

  const estActif = (path) => location.pathname === path

  const lienDesktopClass = (path) =>
    `relative pb-1 text-sm font-medium transition ${
      estActif(path) ? "text-yellow-600" : "text-gray-600 hover:text-gray-950"
    }`

  const lienMobileClass = (path) =>
    `rounded-2xl px-4 py-4 text-left text-base transition ${
      estActif(path)
        ? "bg-yellow-50 text-yellow-700"
        : "text-gray-800 hover:bg-gray-100"
    }`

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-black/5 bg-[#f8f8f6]/92 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex h-[88px] items-center justify-between">
            
            <Link to="/" className="flex items-center gap-3" onClick={fermerTout}>
              <img
                src="/logo-tamal.jpeg"
                alt="TAMAL"
                className="h-14 w-14 rounded-full border-2 border-yellow-500 bg-white p-1 object-cover shadow-sm"
              />

              <div className="leading-tight">
                <h1 className="text-base font-bold uppercase tracking-wide text-yellow-600">
                  TAMAL
                </h1>
                <p className="text-sm text-gray-500">
                  Service Liquidité Immédiate
                </p>
              </div>
            </Link>

            <nav className="hidden items-center gap-9 xl:flex">

              <button onClick={() => allerVers("/")} className={lienDesktopClass("/")}>
                Accueil
              </button>

              <button onClick={() => allerVers("/comment-ca-marche")} className={lienDesktopClass("/comment-ca-marche")}>
                Comment ça marche
              </button>

              <button onClick={() => allerVers("/conditions")} className={lienDesktopClass("/conditions")}>
                Conditions
              </button>

              <button onClick={() => allerVers("/simulateur")} className={lienDesktopClass("/simulateur")}>
                Simulateur
              </button>

              <button onClick={() => allerVers("/demande")} className={lienDesktopClass("/demande")}>
                Demande
              </button>

              <button onClick={() => allerVers("/contact")} className={lienDesktopClass("/contact")}>
                Contact
              </button>

            </nav>

            <div className="flex items-center gap-2 xl:hidden">

              <button
                type="button"
                onClick={toggleRecherche}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-white text-gray-700"
              >
                🔍
              </button>

              <button
                type="button"
                onClick={toggleMenu}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-white text-gray-700"
              >
                ☰
              </button>

            </div>

          </div>
        </div>
      </header>

      {menuOuvert && (
        <div className="fixed inset-0 z-40 xl:hidden">

          <button
            type="button"
            onClick={fermerTout}
            className="absolute inset-0 bg-black/25 backdrop-blur-sm"
          />

          <div className="absolute right-0 top-0 h-full w-[88%] max-w-sm overflow-y-auto bg-white shadow-2xl">

            <div className="flex flex-col px-4 py-4">

              <button onClick={() => allerVers("/")} className={lienMobileClass("/")}>
                Accueil
              </button>

              <button onClick={() => allerVers("/comment-ca-marche")} className={lienMobileClass("/comment-ca-marche")}>
                Comment ça marche
              </button>

              <button onClick={() => allerVers("/conditions")} className={lienMobileClass("/conditions")}>
                Conditions
              </button>

              <button onClick={() => allerVers("/simulateur")} className={lienMobileClass("/simulateur")}>
                Simulateur
              </button>

              <button onClick={() => allerVers("/demande")} className={lienMobileClass("/demande")}>
                Demande
              </button>

              <button onClick={() => allerVers("/contact")} className={lienMobileClass("/contact")}>
                Contact
              </button>

            </div>
          </div>
        </div>
      )}
    </>
  )
}