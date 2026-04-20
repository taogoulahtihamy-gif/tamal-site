import { useState } from "react"
import RevealOnScroll from "./RevealOnScroll"

export default function Simulateur() {
  const [montant, setMontant] = useState("10000")

  const montantNombre = Number(montant)
  const montantValide =
    montant !== "" && !Number.isNaN(montantNombre) && montantNombre >= 5000

  const duree = montantValide ? (montantNombre >= 30000 ? 14 : 7) : null
  const remboursementNormal = montantValide
    ? Math.round(montantNombre * 1.3)
    : null
  const remboursementRetard1Jour = montantValide
    ? Math.round(montantNombre * 1.35)
    : null

  const penaliteJournaliere = 2000

  const formatMontant = (valeur) => {
    return new Intl.NumberFormat("fr-FR").format(valeur)
  }

  const choisirMontant = (valeur) => {
    setMontant(String(valeur))
  }

  return (
    <section
      id="simulateur"
      className="border-t border-gray-200 bg-[#f5f3ed] py-20 text-gray-900"
    >
      <div className="mx-auto max-w-3xl px-4">
        <RevealOnScroll>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-yellow-600">
              Simulateur
            </p>

            <h3 className="mt-4 text-3xl font-bold md:text-4xl">
              Estimez votre remboursement
            </h3>

            <p className="mt-4 text-gray-600">
              Entrez le montant souhaité pour voir automatiquement la durée du
              prêt et le montant à rembourser selon les règles du service.
            </p>
          </div>
        </RevealOnScroll>

        <RevealOnScroll delay={100}>
          <div className="mt-12 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
            <div>
              <label className="mb-3 block text-sm font-medium text-gray-700">
                Montant souhaité (FCFA)
              </label>

              <input
                type="number"
                value={montant}
                onChange={(e) => setMontant(e.target.value)}
                className="w-full rounded-2xl border border-gray-200 bg-[#faf9f5] px-4 py-4 text-lg text-gray-900 outline-none focus:border-yellow-500"
                placeholder="Entrez un montant"
              />

              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => choisirMontant(5000)}
                  className="rounded-full border border-gray-200 bg-[#faf9f5] px-4 py-2 text-sm font-medium text-gray-700 hover:border-yellow-500 hover:text-yellow-700"
                >
                  5 000
                </button>

                <button
                  type="button"
                  onClick={() => choisirMontant(10000)}
                  className="rounded-full border border-gray-200 bg-[#faf9f5] px-4 py-2 text-sm font-medium text-gray-700 hover:border-yellow-500 hover:text-yellow-700"
                >
                  10 000
                </button>

                <button
                  type="button"
                  onClick={() => choisirMontant(30000)}
                  className="rounded-full border border-gray-200 bg-[#faf9f5] px-4 py-2 text-sm font-medium text-gray-700 hover:border-yellow-500 hover:text-yellow-700"
                >
                  30 000
                </button>

                <button
                  type="button"
                  onClick={() => choisirMontant(50000)}
                  className="rounded-full border border-gray-200 bg-[#faf9f5] px-4 py-2 text-sm font-medium text-gray-700 hover:border-yellow-500 hover:text-yellow-700"
                >
                  50 000
                </button>
              </div>

              {!montantValide && (
                <p className="mt-3 text-sm text-red-500">
                  Veuillez entrer un montant valide d’au moins 5 000 FCFA..
                </p>
              )}
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
                <p className="text-sm text-gray-500">Durée</p>
                <p className="mt-2 text-2xl font-semibold text-yellow-600">
                  {montantValide ? `${duree} jours` : "--"}
                </p>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
                <p className="text-sm text-gray-500">Remboursement normal</p>

                <p className="text-xs text-gray-500 mt-1">
                  Taux appliqué : <span className="font-semibold">30%</span>
                </p>

                <p className="mt-2 text-2xl font-semibold text-yellow-600">
                  {montantValide
                    ? `${formatMontant(remboursementNormal)} FCFA`
                    : "--"}
                </p>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
                <p className="text-sm text-gray-500">Après 1 jour de retard</p>

                <p className="text-xs text-gray-500 mt-1">
                  Le taux passe de <span className="font-semibold">30%</span> à{" "}
                  <span className="font-semibold">35%</span>
                </p>

                <p className="mt-2 text-2xl font-semibold text-yellow-600">
                  {montantValide
                    ? `${formatMontant(remboursementRetard1Jour)} FCFA`
                    : "--"}
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-yellow-300 bg-yellow-50 p-4 text-sm leading-6 text-gray-700">
              Une pénalité supplémentaire de{" "}
              <span className="font-semibold text-yellow-700">
                {formatMontant(penaliteJournaliere)} FCFA / Jour
              </span>{" "}
              sera appliquée jusqu’au remboursement intégral.
            </div>

            <div className="mt-4 rounded-xl border border-yellow-200 bg-yellow-50 p-4 text-sm text-gray-700">
              ⚠️ Les frais de transaction (Mobile Money ou autre moyen de
              paiement) sont entièrement supportés par le client et ne sont pas
              inclus dans le montant du remboursement affiché dans ce
              simulateur.
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  )
}