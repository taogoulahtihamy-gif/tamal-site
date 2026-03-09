export default function Footer() {
  return (
    <footer className="bg-[#050505] text-gray-400">
      <div className="mx-auto max-w-6xl px-4 py-6">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/logo-tamal.jpeg"
              alt="TAMAL"
              className="h-11 w-11 rounded-full border-2 border-yellow-500 bg-white p-1 object-cover"
            />

            <div className="leading-tight">
              <h4 className="text-sm font-bold uppercase tracking-wide text-yellow-500">
                TAMAL
              </h4>
              <p className="text-[11px] text-gray-400">
                Service Liquidité Immédiate
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm md:justify-end">
            <a className="transition hover:text-yellow-500" href="/">
              Accueil
            </a>

            <a className="transition hover:text-yellow-500" href="/demande">
              Faire une demande
            </a>

            <a className="transition hover:text-yellow-500" href="/contact">
              Contact
            </a>
          </div>
        </div>

        <div className="mt-4 border-t border-white/10 pt-4 text-center text-xs text-gray-500">
          © 2026 TAMAL – Service Liquidité Immédiate. Tous droits réservés.
        </div>
      </div>
    </footer>
  )
}