export default function Hero() {
  return (
    <section
      id="accueil"
      className="mx-auto grid max-w-7xl gap-10 px-4 py-16 md:grid-cols-2 md:items-center md:py-24"
    >
      <div>
        <p className="inline-block rounded-full border border-yellow-500/30 bg-yellow-500/10 px-4 py-1 text-sm text-yellow-400">
          Réponse rapide • Dépôt du gage en agence
        </p>

        <h2 className="mt-6 text-4xl font-bold leading-tight md:text-6xl">
          Prêt sur gage <span className="text-yellow-500">rapide</span> et sécurisé
        </h2>

        <p className="mt-6 max-w-xl text-lg text-gray-400">
          Faites votre demande en ligne, présentez votre objet en agence
          et recevez votre prêt après validation complète de votre dossier.
        </p>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <a
            href="#demande"
            className="rounded-full bg-yellow-500 px-6 py-3 text-center font-semibold text-black hover:bg-yellow-400"
          >
            Faire une demande
          </a>

          <a
            href="https://wa.me/221772616753"
            className="rounded-full border border-white/20 px-6 py-3 text-center font-semibold text-white hover:border-yellow-500 hover:text-yellow-500"
          >
            Parler à un agent
          </a>
        </div>

        <div className="mt-10 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-gray-300">
            ✓ Réponse rapide
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-gray-300">
            ✓ Paiement cash ou mobile money
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-gray-300">
            ✓ Processus simple
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-gray-300">
            ✓ Dépôt du gage en agence
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <div className="w-full max-w-md rounded-3xl border border-yellow-500/20 bg-white/5 p-6 shadow-xl">
          <div className="rounded-2xl bg-black/40 p-5">
            <p className="text-sm text-gray-400">Montant demandé</p>
            <p className="mt-2 text-3xl font-bold">30 000 FCFA</p>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
              <p className="text-sm text-gray-400">Durée</p>
              <p className="mt-2 text-2xl font-semibold text-yellow-500">
                14 jours
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
              <p className="text-sm text-gray-400">Remboursement</p>
              <p className="mt-2 text-2xl font-semibold text-yellow-500">
                39 000 FCFA
              </p>
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-4">
            <p className="text-sm text-gray-300">Règles en cas de retard</p>
            <p className="mt-2 text-sm leading-6 text-gray-200">
              À partir d’un jour de dépassement, le taux passe à{" "}
              <span className="font-semibold text-yellow-400">35 %</span>,
              puis une pénalité de{" "}
              <span className="font-semibold text-yellow-400">2 000 FCFA</span> par jour
              s’applique jusqu’au remboursement.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}