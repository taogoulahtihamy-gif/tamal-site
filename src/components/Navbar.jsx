export default function Navbar() {
  return (
    <header className="border-b border-white/10 bg-black">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">

        <div className="flex items-center gap-3">
          <img
            src="/logo-tamal.jpeg"
            alt="TAMAL"
            className="h-14 w-14 rounded-full object-cover border-2 border-yellow-500 bg-white p-1 shadow-lg"
          />

          <div className="leading-tight">
            <h1 className="text-sm font-bold uppercase tracking-wide text-yellow-500">
              TAMAL
            </h1>
            <p className="text-xs text-gray-300">
              Service Liquidité Immédiate
            </p>
          </div>
        </div>

        <nav className="hidden md:flex gap-6 text-sm text-gray-300">
          <a href="#accueil" className="hover:text-yellow-500">Accueil</a>
          <a href="#comment" className="hover:text-yellow-500">Comment ça marche</a>
          <a href="#conditions" className="hover:text-yellow-500">Conditions</a>
          <a href="#simulateur" className="hover:text-yellow-500">Simulateur</a>
          <a href="#contact" className="hover:text-yellow-500">Contact</a>
        </nav>

        <a
          href="https://wa.me/221772616753"
          className="rounded-full bg-yellow-500 px-4 py-2 text-sm font-semibold text-black hover:bg-yellow-400"
        >
          WhatsApp
        </a>

      </div>
    </header>
  )
}