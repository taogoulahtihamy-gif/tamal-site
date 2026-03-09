import { useMemo, useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"

export default function Navbar() {
  const [menuOuvert, setMenuOuvert] = useState(false)
  const [rechercheOuverte, setRechercheOuverte] = useState(false)
  const [recherche, setRecherche] = useState("")

  const navigate = useNavigate()
  const location = useLocation()

  const liensRecherche = [
    { label: "Accueil", path: "/" },
    { label: "Comment ça marche", path: "/comment-ca-marche" },
    { label: "Conditions", path: "/conditions" },
    { label: "Simulateur", path: "/simulateur" },
    { label: "Demande", path: "/demande" },
    { label: "Contact", path: "/contact" },
    { label: "Espace admin", path: "/login-admin" },
  ]

  const resultatsRecherche = useMemo(() => {
    const texte = recherche.trim().toLowerCase()
    if (!texte) return liensRecherche

    return liensRecherche.filter((item) =>
      item.label.toLowerCase().includes(texte)
    )
  }, [recherche])

  const fermerTout = () => {
    setMenuOuvert(false)
    setRechercheOuverte(false)
    setRecherche("")
  }

  const toggleMenu = () => {
    setMenuOuvert((prev) => !prev)
    setRechercheOuverte(false)
  }

  const toggleRecherche = () => {
    setRechercheOuverte((prev) => !prev)
    setMenuOuvert(false)
    if (rechercheOuverte) setRecherche("")
  }

  const allerVers = (path) => {
    fermerTout()

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

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <Link to="/" className="flex items-center gap-3" onClick={fermerTout}>
            <img
              src="/logo-tamal.jpeg"
              alt="TAMAL"
              className="h-14 w-14 rounded-full border-2 border-yellow-500 bg-white p-1 object-cover shadow-md"
            />

            <div className="leading-tight">
              <h1 className="text-sm font-bold uppercase tracking-wide text-yellow-600">
                TAMAL
              </h1>
              <p className="text-xs text-gray-600">
                Service Liquidité Immédiate
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-6 text-sm font-medium text-gray-700 xl:flex">
            <button
              type="button"
              onClick={() => allerVers("/")}
              className="transition hover:text-yellow-600"
            >
              Accueil
            </button>
            <button
              type="button"
              onClick={() => allerVers("/comment-ca-marche")}
              className="transition hover:text-yellow-600"
            >
              Comment ça marche
            </button>
            <button
              type="button"
              onClick={() => allerVers("/conditions")}
              className="transition hover:text-yellow-600"
            >
              Conditions
            </button>
            <button
              type="button"
              onClick={() => allerVers("/simulateur")}
              className="transition hover:text-yellow-600"
            >
              Simulateur
            </button>
            <button
              type="button"
              onClick={() => allerVers("/demande")}
              className="transition hover:text-yellow-600"
            >
              Demande
            </button>
            <button
              type="button"
              onClick={() => allerVers("/contact")}
              className="transition hover:text-yellow-600"
            >
              Contact
            </button>
          </nav>

          <div className="relative flex items-center gap-3">
            <button
              type="button"
              onClick={toggleRecherche}
              className="hidden h-11 w-11 items-center justify-center rounded-full border border-gray-200 text-gray-700 transition hover:bg-gray-100 md:flex"
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
              className="hidden rounded-full bg-yellow-500 px-4 py-2 text-sm font-semibold text-black transition hover:bg-yellow-400 md:inline-flex"
            >
              WhatsApp
            </a>

            <button
              type="button"
              onClick={toggleMenu}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 text-gray-700 transition hover:bg-gray-100 xl:hidden"
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

            {rechercheOuverte && (
              <div className="absolute right-0 top-14 hidden w-80 rounded-3xl border border-gray-200 bg-white p-4 shadow-2xl md:block">
                <input
                  type="text"
                  value={recherche}
                  onChange={(e) => setRecherche(e.target.value)}
                  placeholder="Rechercher une page..."
                  className="w-full rounded-2xl border border-gray-200 bg-[#faf9f5] px-4 py-3 text-gray-900 outline-none focus:border-yellow-500"
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
            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-5">
              <div className="flex items-center gap-3">
                <img
                  src="/logo-tamal.jpeg"
                  alt="TAMAL"
                  className="h-12 w-12 rounded-full border-2 border-yellow-500 bg-white p-1 object-cover"
                />
                <div>
                  <p className="text-sm font-bold text-yellow-600">TAMAL</p>
                  <p className="text-xs text-gray-600">
                    Service Liquidité Immédiate
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={fermerTout}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="border-b border-gray-100 px-5 py-4">
              <button
                type="button"
                onClick={toggleRecherche}
                className="flex w-full items-center justify-between rounded-2xl border border-gray-200 bg-[#faf9f5] px-4 py-3 text-sm text-gray-700"
              >
                <span>Recherche</span>
                <span>⌕</span>
              </button>

              {rechercheOuverte && (
                <div className="mt-3 rounded-2xl border border-gray-200 bg-white p-3">
                  <input
                    type="text"
                    value={recherche}
                    onChange={(e) => setRecherche(e.target.value)}
                    placeholder="Rechercher une page..."
                    className="w-full rounded-2xl border border-gray-200 bg-[#faf9f5] px-4 py-3 text-gray-900 outline-none focus:border-yellow-500"
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

            <div className="flex flex-col px-4 py-4">
              <button
                type="button"
                onClick={() => allerVers("/")}
                className="rounded-2xl px-4 py-4 text-left text-base text-gray-800 transition hover:bg-gray-100"
              >
                Accueil
              </button>

              <button
                type="button"
                onClick={() => allerVers("/comment-ca-marche")}
                className="rounded-2xl px-4 py-4 text-left text-base text-gray-800 transition hover:bg-gray-100"
              >
                Comment ça marche
              </button>

              <button
                type="button"
                onClick={() => allerVers("/conditions")}
                className="rounded-2xl px-4 py-4 text-left text-base text-gray-800 transition hover:bg-gray-100"
              >
                Conditions
              </button>

              <button
                type="button"
                onClick={() => allerVers("/simulateur")}
                className="rounded-2xl px-4 py-4 text-left text-base text-gray-800 transition hover:bg-gray-100"
              >
                Simulateur
              </button>

              <button
                type="button"
                onClick={() => allerVers("/demande")}
                className="rounded-2xl px-4 py-4 text-left text-base text-gray-800 transition hover:bg-gray-100"
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

              <button
                type="button"
                onClick={() => allerVers("/login-admin")}
                className="rounded-2xl px-4 py-4 text-left text-base text-gray-800 transition hover:bg-gray-100"
              >
                Espace admin
              </button>
            </div>

            <div className="border-t border-gray-100 px-5 py-5">
              <a
                href="https://wa.me/221778492779"
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-full justify-center rounded-full bg-yellow-500 px-4 py-3 text-sm font-semibold text-black hover:bg-yellow-400"
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