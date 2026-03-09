import { Link, useNavigate, useLocation } from "react-router-dom"

export default function Footer() {
  const navigate = useNavigate()
  const location = useLocation()

  const allerEnHaut = (path) => {
    if (path === "/contact") {
      if (location.pathname !== "/") {
        navigate("/")
        setTimeout(() => {
          const section = document.getElementById("contact")
          if (section) {
            section.scrollIntoView({ behavior: "smooth", block: "start" })
          }
        }, 350)
      } else {
        const section = document.getElementById("contact")
        if (section) {
          section.scrollIntoView({ behavior: "smooth", block: "start" })
        }
      }
      return
    }

    navigate(path)

    setTimeout(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      })
    }, 50)
  }

  return (
    <footer
      id="contact"
      className="mt-16 bg-[#050505] text-white md:mt-24"
    >
      <div className="mx-auto max-w-7xl px-4 py-14 md:py-20">
        <div className="grid gap-12 md:grid-cols-[1.1fr_1fr_0.9fr] md:gap-10">
          {/* COLONNE 1 */}
          <div>
            <div className="flex items-center gap-4">
              <img
                src="/logo-tamal.jpeg"
                alt="TAMAL"
                className="h-14 w-14 rounded-full border-2 border-yellow-500 bg-white p-1 object-cover"
              />

              <div className="leading-tight">
                <h4 className="text-xl font-bold uppercase tracking-wide text-yellow-500">
                  TAMAL
                </h4>
                <p className="text-sm text-gray-400">
                  Service Liquidité Immédiate
                </p>
              </div>
            </div>

            <p className="mt-6 max-w-md text-sm leading-7 text-gray-300 md:text-base">
              Votre solution de prêt sur gage à Dakar pour obtenir rapidement de
              la liquidité dans un cadre simple, clair et sécurisé.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <a
                href="https://wa.me/221778492779"
                target="_blank"
                rel="noreferrer"
                className="inline-flex justify-center rounded-full bg-yellow-500 px-6 py-3 font-semibold text-black transition hover:bg-yellow-400"
              >
                WhatsApp
              </a>

              <a
                href="tel:+221778492779"
                className="inline-flex justify-center rounded-full border border-white/15 px-6 py-3 font-semibold text-white transition hover:border-yellow-500 hover:text-yellow-400"
              >
                Appeler
              </a>
            </div>
          </div>

          {/* COLONNE 2 */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-yellow-500">
              Informations de contact
            </p>

            <div className="mt-6 space-y-6">
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  Téléphone
                </p>
                <a
                  href="tel:+221778492779"
                  className="mt-2 block text-lg font-semibold text-white transition hover:text-yellow-400"
                >
                  +221 77 849 27 79
                </a>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  WhatsApp
                </p>
                <a
                  href="https://wa.me/221778492779"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 block text-lg font-semibold text-white transition hover:text-yellow-400"
                >
                  +221 77 849 27 79
                </a>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  Adresse
                </p>
                <p className="mt-2 text-lg font-semibold text-white">
                  Dakar, Sénégal
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  Horaires
                </p>
                <p className="mt-2 text-lg font-semibold text-white">
                  Lun - Sam : 08h00 - 19h00
                </p>
              </div>
            </div>
          </div>

          {/* COLONNE 3 */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-yellow-500">
              Liens rapides
            </p>

            <div className="mt-6 grid gap-3">
              <button
                type="button"
                onClick={() => allerEnHaut("/")}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-left text-sm text-white transition hover:border-yellow-500 hover:text-yellow-400"
              >
                Accueil
              </button>

              <button
                type="button"
                onClick={() => allerEnHaut("/comment-ca-marche")}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-left text-sm text-white transition hover:border-yellow-500 hover:text-yellow-400"
              >
                Comment ça marche
              </button>

              <button
                type="button"
                onClick={() => allerEnHaut("/conditions")}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-left text-sm text-white transition hover:border-yellow-500 hover:text-yellow-400"
              >
                Conditions
              </button>

              <button
                type="button"
                onClick={() => allerEnHaut("/simulateur")}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-left text-sm text-white transition hover:border-yellow-500 hover:text-yellow-400"
              >
                Simulateur
              </button>

              <button
                type="button"
                onClick={() => allerEnHaut("/demande")}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-left text-sm text-white transition hover:border-yellow-500 hover:text-yellow-400"
              >
                Faire une demande
              </button>

              <button
                type="button"
                onClick={() => allerEnHaut("/contact")}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-left text-sm text-white transition hover:border-yellow-500 hover:text-yellow-400"
              >
                Contact
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6">
          <div className="flex flex-col gap-4 text-sm text-gray-400 md:flex-row md:items-center md:justify-between">
            <p>© 2026 TAMAL – Service Liquidité Immédiate. Tous droits réservés.</p>

            <div className="flex flex-wrap gap-5">
              <button
                type="button"
                onClick={() => allerEnHaut("/")}
                className="transition hover:text-yellow-400"
              >
                Accueil
              </button>

              <button
                type="button"
                onClick={() => allerEnHaut("/demande")}
                className="transition hover:text-yellow-400"
              >
                Demande
              </button>

              <button
                type="button"
                onClick={() => allerEnHaut("/contact")}
                className="transition hover:text-yellow-400"
              >
                Contact
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}