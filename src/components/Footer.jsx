import { useNavigate, useLocation } from "react-router-dom"

export default function Footer() {
  const navigate = useNavigate()
  const location = useLocation()

  const allerEnHaut = () => {
    if (location.pathname !== "/") {
      navigate("/")
      setTimeout(() => {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        })
      }, 200)
    } else {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      })
    }
  }

  return (
    <footer id="contact" className="mt-16 bg-[#050505] text-white md:mt-20">
      <div className="mx-auto max-w-6xl px-4 py-10">

        <div className="grid gap-10 md:grid-cols-2">

          {/* COLONNE 1 */}
          <div>
            <div className="flex items-center gap-4">
              <img
                src="/logo-tamal.jpeg"
                alt="TAMAL"
                className="h-12 w-12 rounded-full border-2 border-yellow-500 bg-white p-1 object-cover"
              />

              <div className="leading-tight">
                <h4 className="text-lg font-bold uppercase tracking-wide text-yellow-500">
                  TAMAL
                </h4>
                <p className="text-xs text-gray-400">
                  Service Liquidité Immédiate
                </p>
              </div>
            </div>

            <p className="mt-4 max-w-sm text-sm leading-6 text-gray-300">
              Votre solution de prêt sur gage pour obtenir rapidement
              de la liquidité dans un cadre simple, clair et sécurisé.
            </p>

            {/* BOUTONS */}
            <div className="mt-5 flex flex-wrap gap-3">
              <a
                href="https://wa.me/221772616753"
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-yellow-500 px-5 py-2 text-sm font-semibold text-black transition hover:bg-yellow-400"
              >
                WhatsApp
              </a>

              <a
                href="tel:+221772616753"
                className="rounded-full border border-white/20 px-5 py-2 text-sm font-semibold text-white transition hover:border-yellow-500 hover:text-yellow-400"
              >
                Appeler
              </a>

              <button
                onClick={allerEnHaut}
                className="rounded-full border border-white/20 px-5 py-2 text-sm font-semibold text-white transition hover:border-yellow-500 hover:text-yellow-400"
              >
                Accueil
              </button>
            </div>
          </div>

          {/* COLONNE 2 */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-yellow-500">
              Informations de contact
            </p>

            <div className="mt-4 space-y-4 text-sm">

              <div>
                <p className="text-gray-500 text-xs uppercase">Téléphone</p>
                <p className="font-semibold">+221 77 849 27 79</p>
              </div>

              <div>
                <p className="text-gray-500 text-xs uppercase">WhatsApp</p>
                <p className="font-semibold">+221 77 849 27 79</p>
              </div>

              <div>
                <p className="text-gray-500 text-xs uppercase">Email</p>
                <a
                  href="mailto:tamaladmin1@gmail.com"
                  className="font-semibold hover:text-yellow-400"
                >
                  tamaladmin1@gmail.com
                </a>
              </div>

              <div>
                <p className="text-gray-500 text-xs uppercase">Adresse</p>
                <p className="font-semibold">Dakar, Sénégal</p>
              </div>

              <div>
                <p className="text-gray-500 text-xs uppercase">Horaires</p>
                <p className="font-semibold">Lun - Sam : 08h00 - 19h00</p>
              </div>

            </div>
          </div>

        </div>

        {/* COPYRIGHT */}
        <div className="mt-8 border-t border-white/10 pt-4 text-center text-sm text-gray-400">
          © 2026 TAMAL – Service Liquidité Immédiate. Tous droits réservés.
        </div>

      </div>
    </footer>
  )
}