export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#0a0a0a]">
      <div className="mx-auto max-w-7xl px-4 py-10">

        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">

          <div className="flex items-center gap-3">
            <img
              src="/logo-tamal.jpeg"
              alt="TAMAL"
              className="h-14 w-14 rounded-full object-cover border-2 border-yellow-500 bg-white p-1 shadow-lg"
            />

            <div className="leading-tight">
              <h4 className="text-sm font-bold uppercase tracking-wide text-yellow-500">
                TAMAL
              </h4>
              <p className="text-xs text-gray-300">
                Service Liquidité Immédiate
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2 text-sm text-gray-400 md:text-right">
            <a href="#accueil" className="hover:text-yellow-500">Accueil</a>
            <a href="#demande" className="hover:text-yellow-500">Faire une demande</a>
            <a href="#contact" className="hover:text-yellow-500">Contact</a>
          </div>

        </div>

        <div className="mt-8 border-t border-white/10 pt-6 text-center text-sm text-gray-500">
          © 2026 TAMAL – Service Liquidité Immédiate. Tous droits réservés.
        </div>

      </div>
    </footer>
  )
}