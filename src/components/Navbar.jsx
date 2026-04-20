import { useEffect, useMemo, useRef, useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"

const searchData = [
  {
    title: "Accueil",
    description: "Présentation générale du service TAMAL",
    keywords: [
      "accueil",
      "home",
      "tamal",
      "service liquidité immédiate",
      "service liquidite immediate",
      "liquidité",
      "liquidite",
      "immédiate",
      "immediate",
      "prêt",
      "pret",
      "prêt sur gage",
      "pret sur gage",
      "gage",
      "dakar",
      "sénégal",
      "senegal",
      "solution simple",
      "obtenir rapidement de la liquidité",
      "obtenir rapidement de la liquidite",
      "service clair",
      "service rapide",
      "service sécurisé",
      "service securise",
      "accompagnement sérieux",
      "accompagnement serieux",
    ],
    path: "/",
    sectionId: null,
  },
  {
    title: "À propos",
    description: "Service simple, humain et rassurant",
    keywords: [
      "à propos",
      "a propos",
      "apropos",
      "service de qualité",
      "service de qualite",
      "processus simple",
      "humain",
      "rassurant",
      "trésorerie",
      "tresorerie",
      "cadre sérieux",
      "cadre serieux",
      "cadre transparent",
      "cadre sécurisé",
      "cadre securise",
      "accompagnement accessible",
      "rapidité de traitement",
      "rapidite de traitement",
      "besoins urgents",
      "liquidité immédiate",
      "liquidite immediate",
    ],
    path: "/",
    sectionId: null,
  },
  {
    title: "Réponse rapide",
    description: "Votre dossier est étudié rapidement avec un retour clair",
    keywords: [
      "réponse rapide",
      "reponse rapide",
      "en 24h",
      "24h",
      "24 heures",
      "dossier étudié rapidement",
      "dossier etudie rapidement",
      "retour clair",
      "faisabilité",
      "faisabilite",
      "faisabilité de votre demande",
      "faisabilite de votre demande",
      "rapidité",
      "rapidite",
    ],
    path: "/",
    sectionId: null,
  },
  {
    title: "Processus simple",
    description: "Un parcours fluide et compréhensible",
    keywords: [
      "processus simple",
      "simple",
      "parcours simple",
      "parcours fluide",
      "fluide",
      "compréhensible",
      "comprehensible",
      "aller à l’essentiel",
      "aller a l essentiel",
      "sans complexité inutile",
      "sans complexite inutile",
    ],
    path: "/",
    sectionId: null,
  },
  {
    title: "Sécurité",
    description: "Cadre clair et rassurant",
    keywords: [
      "sécurité",
      "securite",
      "cadre clair",
      "cadre rassurant",
      "rassurant",
      "conditions transparentes",
      "accompagnement humain",
      "traitement sérieux",
      "traitement serieux",
      "chaque demande",
      "protection",
      "confiance",
    ],
    path: "/",
    sectionId: null,
  },
  {
    title: "Comment ça marche",
    description: "Un parcours simple en 4 étapes",
    keywords: [
      "comment ça marche",
      "comment ca marche",
      "fonctionnement",
      "parcours simple en 4 étapes",
      "parcours simple en 4 etapes",
      "4 étapes",
      "4 etapes",
      "étapes",
      "etapes",
      "déposez votre demande",
      "deposez votre demande",
      "étude du dossier",
      "etude du dossier",
      "dépôt du gage",
      "depot du gage",
      "versement rapide",
      "demande",
      "étude",
      "etude",
      "dépôt",
      "depot",
      "gage",
      "versement",
      "réponse rapide",
      "reponse rapide",
    ],
    path: "/comment-ca-marche",
    sectionId: null,
  },
  {
    title: "Conditions",
    description: "Conditions du service de prêt sur gage",
    keywords: [
      "conditions",
      "règles",
      "regles",
      "service de prêt sur gage",
      "service de pret sur gage",
      "remboursement",
      "retard",
      "pénalité",
      "penalite",
      "frais de transaction",
      "mobile money",
      "taux",
      "taux 30",
      "taux 35",
      "30%",
      "35%",
      "2 000",
      "2000",
      "jour",
      "remboursement complet",
      "remboursement intégral",
      "remboursement integral",
    ],
    path: "/conditions",
    sectionId: null,
  },
  {
    title: "Simulateur",
    description: "Estimez votre remboursement",
    keywords: [
      "simulateur",
      "simulation",
      "simuler",
      "estimez votre remboursement",
      "montant souhaité",
      "montant souhaite",
      "montant demandé",
      "montant demande",
      "fcfa",
      "durée",
      "duree",
      "7 jours",
      "14 jours",
      "remboursement normal",
      "après 1 jour de retard",
      "apres 1 jour de retard",
      "taux appliqué 30",
      "taux applique 30",
      "30%",
      "35%",
      "le taux passe de 30 à 35",
      "le taux passe de 30 a 35",
      "pénalité supplémentaire",
      "penalite supplementaire",
      "2000 fcfa",
      "2 000 fcfa",
      "mobile money",
      "frais de transaction",
      "estimation",
      "calcul",
      "pret",
      "prêt",
    ],
    path: "/",
    sectionId: "simulateur",
  },
  {
    title: "Demande",
    description: "Faire une demande de prêt",
    keywords: [
      "demande",
      "faire une demande",
      "formulaire",
      "envoyer la demande",
      "objet",
      "objet de valeur",
      "pièce d’identité",
      "piece d identite",
      "pièce",
      "piece",
      "photo",
      "document",
      "nom",
      "téléphone",
      "telephone",
      "email",
      "client",
      "dossier",
      "pret",
      "prêt",
      "gage",
    ],
    path: "/demande",
    sectionId: null,
  },
  {
    title: "Contact",
    description: "Téléphone, WhatsApp, email, adresse et horaires",
    keywords: [
      "contact",
      "téléphone",
      "telephone",
      "whatsapp",
      "email",
      "mail",
      "adresse",
      "horaires",
      "dakar",
      "sénégal",
      "senegal",
      "lun sam",
      "08h00",
      "19h00",
      "tamaladmin1@gmail.com",
      "77 261 67 53",
      "772616753",
      "appeler",
      "contacter",
      "agent",
      "footer",
    ],
    path: "/",
    sectionId: "contact",
  },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [searchFocused, setSearchFocused] = useState(false)

  const navigate = useNavigate()
  const location = useLocation()
  const searchRef = useRef(null)

  const normaliser = (texte) =>
    (texte || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\w\s%]/g, " ")
      .replace(/\s+/g, " ")
      .trim()

  const results = useMemo(() => {
    const q = normaliser(search)

    if (!q) return []

    const qWords = q.split(" ").filter(Boolean)

    return searchData
      .map((item) => {
        const corpus = normaliser(
          [item.title, item.description, ...(item.keywords || [])].join(" ")
        )

        const includesFullQuery = corpus.includes(q)

        const matchedWords = qWords.filter((word) => corpus.includes(word)).length

        let score = 0

        if (includesFullQuery) score += 10
        score += matchedWords * 3

        if (normaliser(item.title).includes(q)) score += 6
        if (normaliser(item.description).includes(q)) score += 4

        return { ...item, score }
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8)
  }, [search])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchFocused(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const allerVers = (path) => {
    setMenuOpen(false)

    navigate(path)

    setTimeout(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      })
    }, 50)
  }

  const allerVersSection = (sectionId) => {
    setMenuOpen(false)

    if (location.pathname !== "/") {
      navigate("/")
      setTimeout(() => {
        const section = document.getElementById(sectionId)
        if (section) {
          section.scrollIntoView({ behavior: "smooth", block: "start" })
        }
      }, 350)
      return
    }

    const section = document.getElementById(sectionId)
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  const handleSearchResultClick = (item) => {
    setSearch("")
    setSearchFocused(false)
    setSearchOpen(false)
    setMenuOpen(false)

    if (item.sectionId) {
      if (item.path !== "/" && location.pathname !== item.path) {
        navigate(item.path)
        setTimeout(() => {
          const section = document.getElementById(item.sectionId)
          if (section) {
            section.scrollIntoView({ behavior: "smooth", block: "start" })
          }
        }, 350)
        return
      }

      if (item.path === "/" && location.pathname !== "/") {
        navigate("/")
        setTimeout(() => {
          const section = document.getElementById(item.sectionId)
          if (section) {
            section.scrollIntoView({ behavior: "smooth", block: "start" })
          }
        }, 350)
        return
      }

      const section = document.getElementById(item.sectionId)
      if (section) {
        section.scrollIntoView({ behavior: "smooth", block: "start" })
      } else {
        navigate(item.path)
      }
      return
    }

    navigate(item.path)
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" })
    }, 50)
  }

  const liens = [
    { label: "Accueil", action: () => allerVers("/") },
    { label: "Comment ça marche", action: () => allerVers("/comment-ca-marche") },
    { label: "Conditions", action: () => allerVers("/conditions") },
    { label: "Simulateur", action: () => allerVers("/simulateur") },
    { label: "Demande", action: () => allerVers("/demande") },
    { label: "Contact", action: () => allerVersSection("contact") },
  ]

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <Link to="/" className="flex items-center gap-4">
          <img
            src="/logo-tamal.jpeg"
            alt="TAMAL"
            className="h-14 w-14 rounded-full border-2 border-yellow-500 bg-white p-1 object-cover"
          />

          <div className="leading-tight">
            <h1 className="text-xl font-bold uppercase tracking-wide text-yellow-600">
              TAMAL
            </h1>
            <p className="text-sm text-gray-600">Service Liquidité Immédiate</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-10 md:flex">
          {liens.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={item.action}
              className="text-sm font-medium text-gray-700 transition hover:text-yellow-600"
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div ref={searchRef} className="relative hidden md:block">
            {!searchOpen ? (
              <button
                type="button"
                onClick={() => {
                  setSearchOpen(true)
                  setSearchFocused(true)
                }}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-gray-200 text-gray-700 transition hover:border-yellow-500 hover:text-yellow-600"
                aria-label="Ouvrir la recherche"
              >
                <span className="text-xl">⌕</span>
              </button>
            ) : (
              <div className="relative">
                <input
                  autoFocus
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  placeholder="Rechercher sur le site..."
                  className="w-80 rounded-full border border-gray-200 bg-white px-5 py-3 text-sm text-gray-900 outline-none focus:border-yellow-500"
                />

                {searchFocused && search.trim() !== "" && (
                  <div className="absolute right-0 top-full mt-2 max-h-80 w-96 overflow-y-auto rounded-2xl border border-gray-200 bg-white shadow-xl">
                    {results.length > 0 ? (
                      results.map((item, index) => (
                        <button
                          key={`${item.title}-${index}`}
                          type="button"
                          onClick={() => handleSearchResultClick(item)}
                          className="block w-full border-b border-gray-100 px-4 py-3 text-left hover:bg-[#faf9f5]"
                        >
                          <p className="font-semibold text-gray-900">
                            {item.title}
                          </p>
                          <p className="mt-1 text-sm text-gray-500">
                            {item.description}
                          </p>
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-sm text-gray-500">
                        Aucun résultat trouvé.
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-gray-200 text-gray-700 transition hover:border-yellow-500 hover:text-yellow-600 md:hidden"
            aria-label="Ouvrir le menu"
          >
            <span className="text-2xl">{menuOpen ? "✕" : "☰"}</span>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-gray-200 bg-white md:hidden">
          <div className="mx-auto max-w-7xl px-4 py-4">
            <div className="mb-4" ref={searchRef}>
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setSearchFocused(true)
                }}
                onFocus={() => setSearchFocused(true)}
                placeholder="Rechercher sur le site..."
                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-yellow-500"
              />

              {searchFocused && search.trim() !== "" && (
                <div className="mt-2 max-h-72 overflow-y-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
                  {results.length > 0 ? (
                    results.map((item, index) => (
                      <button
                        key={`${item.title}-${index}`}
                        type="button"
                        onClick={() => handleSearchResultClick(item)}
                        className="block w-full border-b border-gray-100 px-4 py-3 text-left hover:bg-[#faf9f5]"
                      >
                        <p className="font-semibold text-gray-900">
                          {item.title}
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                          {item.description}
                        </p>
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-sm text-gray-500">
                      Aucun résultat trouvé.
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="grid gap-2">
              {liens.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={item.action}
                  className="rounded-2xl border border-gray-200 bg-[#faf9f5] px-4 py-3 text-left text-sm font-medium text-gray-800 transition hover:border-yellow-500 hover:text-yellow-600"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}