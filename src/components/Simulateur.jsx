import { useState } from "react"

export default function Simulateur() {
  const [montant, setMontant] = useState("10000")

  const montantNombre = Number(montant)
  const montantValide = montant !== "" && montantNombre >= 5000

  const duree = montantValide ? (montantNombre >= 30000 ? 14 : 7) : null
  const remboursementNormal = montantValide ? Math.round(montantNombre * 1.3) : null
  const remboursementRetard1Jour = montantValide ? Math.round(montantNombre * 1.35) : null

  return (
    <section id="simulateur" className="border-t border-white/10 bg-black py-20">
      <div className="mx-auto max-w-5xl px-4">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-yellow-500">
            Simulateur
          </p>

          <h3 className="mt-4 text-3xl font-bold md:text-4xl">
            Estimez votre remboursement
          </h3>

          <p className="mt-4 text-gray-400">
            Entrez le montant souhaité pour voir automatiquement la durée du prêt
            et le montant à rembourser selon les règles du service.
          </p>
        </div>

        <div className="mt-12 rounded-3xl border border-white/10 bg-white/5 p-6 md:p-8">
          <div>
            <label className="mb-3 block text-sm font-medium text-gray-300">
              Montant souhaité (FCFA)
            </label>

            <input
              type="number"
              value={montant}
              onChange={(e) => setMontant(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-lg text-white outline-none focus:border-yellow-500"
              placeholder="Entrez un montant"
            />

            {!montantValide && (
              <p className="mt-3 text-sm text-red-400">
                Veuillez entrer un montant valide d’au moins 5 000 FCFA.
              </p>
            )}
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
              <p className="text-sm text-gray-400">Durée</p>
              <p className="mt-2 text-2xl font-semibold text-yellow-500">
                {montantValide ? `${duree} jours` : "--"}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
              <p className="text-sm text-gray-400">Remboursement normal</p>
              <p className="mt-2 text-2xl font-semibold text-yellow-500">
                {montantValide ? `${remboursementNormal.toLocaleString()} FCFA` : "--"}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
              <p className="text-sm text-gray-400">Après 1 jour de retard</p>
              <p className="mt-2 text-2xl font-semibold text-yellow-500">
                {montantValide ? `${remboursementRetard1Jour.toLocaleString()} FCFA` : "--"}
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-yellow-500/20 bg-yellow-500/10 p-4 text-sm leading-6 text-gray-200">
            Une pénalité supplémentaire de{" "}
            <span className="font-semibold text-yellow-400">2 000 FCFA</span> par jour
            s’applique ensuite jusqu’au remboursement complet.
          </div>
        </div>
      </div>
    </section>
  )
}