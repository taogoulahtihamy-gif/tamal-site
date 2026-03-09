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
      motsCles: [
        "accueil",
        "home",
        "tamal",
        "pret",
        "prêt",
        "gage",
        "liquidité",
        "liquidite",
        "rapide",
        "sécurisé",
        "securise",
      ],
    },
    {
      label: "Comment ça marche",
      path: "/comment-ca-marche",
      motsCles: [
        "comment",
        "marche",
        "fonctionnement",
        "etapes",
        "étapes",
        "processus",
        "demande en ligne",
        "rendez-vous",
        "validation",
        "versement",
      ],
    },
    {
      label: "Conditions",
      path: "/conditions",
      motsCles: [
        "condition",
        "conditions",
        "documents",
        "document",
        "cni",
        "passeport",
        "certificat",
        "résidence",
        "residence",
        "acceptation",
        "dépôt",
        "depot",
      ],
    },
    {
      label: "Simulateur",
      path: "/simulateur",
      motsCles: [
        "simulateur",
        "simulation",
        "montant",
        "durée",
        "duree",
        "remboursement",
        "retard",
        "penalite",
        "pénalité",
        "calcul",
        "fcfa",
      ],
    },
    {
      label: "Demande",
      path: "/demande",
      motsCles: [
        "demande",
        "formulaire",
        "soumettre",
        "nom",
        "telephone",
        "téléphone",
        "photo",
        "document",
        "piece",
        "pièce",
        "objet",
        "gager",
      ],
    },
    {
      label: "Contact",
      path: "/contact",
      motsCles: [
        "contact",
        "whatsapp",
        "appel",
        "telephone",
        "téléphone",
        "adresse",
        "dakar",
        "horaires",
        "agent",
      ],
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
    if (rechercheOuverte) {
      setRecherche("")
    }
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
          if (section) {
            section.scrollIntoView({ behavior: "smooth" })
          }
        }, 250)
      } else {
        const section = document.getElementById("contact")
        if (section) {
          section.scrollIntoView({ behavior: "smooth" })
        }
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
              <button
                type="button"
                onClick={() => allerVers("/")}
                className={lienDesktopClass("/")}
              >
                Accueil
                {estActif("/") && (
                  <span className="absolute -bottom-1 left-1/2 h-[3px] w-8 -translate-x-1/2 rounded-full bg-yellow-500" />
                )}
              </button>

              <button
                type="button"
                onClick={() => allerVers("/comment-ca-marche")}
                className={lienDesktopClass("/comment-ca-marche")}
              >
                Comment ça marche
                {estActif("/comment-ca-marche") && (
                  <span className="absolute -bottom-1 left-1/2 h-[3px] w-8 -translate-x-1/2 rounded-full bg-yellow-500" />
                )}
              </button>

              <button
                type="button"
                onClick={() => allerVers("/conditions")}
                className={lienDesktopClass("/conditions")}
              >
                Conditions
                {estActif("/conditions") && (
                  <span className="absolute -bottom-1 left-1/2 h-[3px] w-8 -translate-x-1/2 rounded-full bg-yellow-500" />
                )}
              </button>

              <button
                type="button"
                onClick={() => allerVers("/simulateur")}
                className={lienDesktopClass("/simulateur")}
              >
                Simulateur
                {estActif("/simulateur") && (
                  <span className="absolute -bottom-1 left-1/2 h-[3px] w-8 -translate-x-1/2 rounded-full bg-yellow-500" />
                )}
              </button>

              <button
                type="button"
                onClick={() => allerVers("/demande")}
                className={lienDesktopClass("/demande")}
              >
                Demande
                {estActif("/demande") && (
                  <span className="absolute -bottom-1 left-1/2 h-[3px] w-8 -translate-x-1/2 rounded-full bg-yellow-500" />
                )}
              </button>

              <button
                type="button"
                onClick={() => allerVers("/contact")}
                className="relative pb-1 text-sm font-medium text-gray-600 transition hover:text-gray-950"
              >
                Contact
              </button>
            </nav>

            <div className="relative flex items-center gap-3">
              <button
                type="button"
                onClick={toggleRecherche}
                className="hidden h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-white text-gray-700 transition hover:bg-gray-50 md:flex"
                aria-label="Recherche"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-4.35-4.35m1.85-5.15a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>

              <a
                href="https://wa.me/221778492779"
                target="_blank"
                rel="noreferrer"
                className="hidden rounded-full bg-yellow-500 px-6 py-3 text-sm font-semibold text-black transition hover:bg-yellow-400 md:inline-flex"
              >
                WhatsApp
              </a>

              <div className="flex items-center gap-2 xl:hidden">
                <button
                  type="button"
                  onClick={toggleRecherche}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-white text-gray-700 transition hover:bg-gray-50"
                  aria-label="Ouvrir la recherche"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 21l-4.35-4.35m1.85-5.15a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>

                <button
                  type="button"
                  onClick={toggleMenu}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-white text-gray-700 transition hover:bg-gray-50"
                  aria-label="Ouvrir le menu"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    {menuOuvert ? (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    ) : (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4 7h16M4 12h16M4 17h16"
                      />
                    )}
                  </svg>
                </button>
              </div>

              {rechercheOuverte && (
                <div className="absolute right-0 top-14 hidden w-80 rounded-[28px] border border-black/10 bg-white p-4 shadow-2xl md:block">
                  <input
                    type="text"
                    value={recherche}
                    onChange={(e) => setRecherche(e.target.value)}
                    placeholder="Rechercher sur le site..."
                    className="w-full rounded-2xl border border-black/10 bg-[#faf9f5] px-4 py-3 text-gray-900 outline-none transition focus:border-yellow-500"
                  />

                  <div className="mt-3 space-y-2">
                    {resultatsRecherche.length > 0 ? (
                      resultatsRecherche.map((item) => (
                        <button
                          key={item.label}
                          type="button"
                          onClick={() => allerVers(item.path)}
                          className="block w-full rounded-2xl px-3 py-3 text-left text-sm text-gray-800 transition hover:bg-gray-100"
                        >
                          {item.label}
                        </button>
                      ))
                    ) : (
                      <p className="px-3 py-2 text-sm text-gray-500">
                        Aucun résultat.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {rechercheOuverte && (
          <div className="border-t border-black/5 bg-[#f8f8f6] px-4 pb-4 pt-3 md:hidden">
            <div className="mx-auto max-w-7xl">
              <div className="rounded-[28px] border border-black/10 bg-white p-3 shadow-lg">
                <input
                  type="text"
                  value={recherche}
                  onChange={(e) => setRecherche(e.target.value)}
                  placeholder="Rechercher sur tout le site..."
                  className="w-full rounded-2xl border border-black/10 bg-[#faf9f5] px-4 py-3 text-gray-900 outline-none focus:border-yellow-500"
                />

                <div className="mt-3 max-h-72 space-y-2 overflow-y-auto">
                  {resultatsRecherche.length > 0 ? (
                    resultatsRecherche.map((item) => (
                      <button
                        key={item.label}
                        type="button"
                        onClick={() => allerVers(item.path)}
                        className="block w-full rounded-2xl px-3 py-3 text-left text-sm text-gray-800 transition hover:bg-gray-100"
                      >
                        {item.label}
                      </button>
                    ))
                  ) : (
                    <p className="px-3 py-2 text-sm text-gray-500">
                      Aucun résultat.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {menuOuvert && (
        <div className="fixed inset-0 z-40 xl:hidden">
          <button
            type="button"
            onClick={fermerTout}
            className="absolute inset-0 bg-black/25 backdrop-blur-sm"
            aria-label="Fermer le menu"
          />

          <div className="absolute right-0 top-0 h-full w-[88%] max-w-sm overflow-y-auto bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-black/5 px-5 py-5">
              <div className="flex items-center gap-3">
                <img
                  src="/logo-tamal.jpeg"
                  alt="TAMAL"
                  className="h-12 w-12 rounded-full border-2 border-yellow-500 bg-white p-1 object-cover"
                />
                <div>
                  <p className="text-sm font-bold text-yellow-600">TAMAL</p>
                  <p className="text-xs text-gray-500">
                    Service Liquidité Immédiate
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={fermerTout}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col px-4 py-4">
              <button
                type="button"
                onClick={() => allerVers("/")}
                className={lienMobileClass("/")}
              >
                Accueil
              </button>

              <button
                type="button"
                onClick={() => allerVers("/comment-ca-marche")}
                className={lienMobileClass("/comment-ca-marche")}
              >
                Comment ça marche
              </button>

              <button
                type="button"
                onClick={() => allerVers("/conditions")}
                className={lienMobileClass("/conditions")}
              >
                Conditions
              </button>

              <button
                type="button"
                onClick={() => allerVers("/simulateur")}
                className={lienMobileClass("/simulateur")}
              >
                Simulateur
              </button>

              <button
                type="button"
                onClick={() => allerVers("/demande")}
                className={lienMobileClass("/demande")}
              >
                Demande
              </button>

              <button
                type="button"
                onClick={() => allerVers("/contact")}
                className="rounded-2xl px-4 py-4 text-left text-base text-gray-800 transition hover:bg-gray-100"
              >
                Contact
              </button>
            </div>

            <div className="border-t border-black/5 px-5 py-5">
              <a
                href="https://wa.me/221778492779"
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-full justify-center rounded-full bg-yellow-500 px-4 py-3 text-sm font-semibold text-black transition hover:bg-yellow-400"
              >
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  )
}