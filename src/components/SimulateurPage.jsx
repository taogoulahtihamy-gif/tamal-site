import { Link } from "react-router-dom"
import { useState } from "react"
import RevealOnScroll from "./RevealOnScroll"

export default function SimulateurPage() {
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
    <section className="min-h-screen bg-[#f5f3ed] py-14 text-gray-900 md:py-20">
      <div className="mx-auto max-w-7xl px-4">
        <RevealOnScroll>
          <div className="relative overflow-hidden rounded-[32px] border border-black/10 bg-[#161616] px-6 py-14 text-center shadow-[0_24px_80px_rgba(0,0,0,0.18)] md:px-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.10),transparent_40%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.03),transparent_25%,transparent_75%,rgba(255,255,255,0.03))]" />

            <div className="relative mx-auto max-w-4xl">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-yellow-500">
                Simulateur TAMAL
              </p>

              <h1 className="mt-4 text-3xl font-bold leading-tight text-white md:text-5xl md:leading-[1.1]">
                Simulez votre prêt sur gage en toute transparence
              </h1>

              <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-white/75 md:text-lg">
                Entrez votre montant pour estimer la durée, le remboursement
                normal et le montant après un jour de retard selon les règles du
                service TAMAL.
              </p>
            </div>
          </div>
        </RevealOnScroll>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <RevealOnScroll delay={100}>
            <div className="rounded-[32px] border border-gray-200 bg-white p-6 shadow-sm md:p-8">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-yellow-600">
                  Calcul rapide
                </p>

                <h2 className="mt-3 text-2xl font-bold text-slate-950 md:text-3xl">
                  Estimez votre remboursement
                </h2>

                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 md:text-base">
                  Le simulateur vous donne une estimation immédiate selon le
                  montant demandé. Les frais de transaction ne sont pas inclus.
                </p>
              </div>

              <div className="mt-8">
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
                    className="rounded-full border border-gray-200 bg-[#faf9f5] px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-yellow-500 hover:text-yellow-700"
                  >
                    5 000
                  </button>

                  <button
                    type="button"
                    onClick={() => choisirMontant(10000)}
                    className="rounded-full border border-gray-200 bg-[#faf9f5] px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-yellow-500 hover:text-yellow-700"
                  >
                    10 000
                  </button>

                  <button
                    type="button"
                    onClick={() => choisirMontant(30000)}
                    className="rounded-full border border-gray-200 bg-[#faf9f5] px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-yellow-500 hover:text-yellow-700"
                  >
                    30 000
                  </button>

                  <button
                    type="button"
                    onClick={() => choisirMontant(50000)}
                    className="rounded-full border border-gray-200 bg-[#faf9f5] px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-yellow-500 hover:text-yellow-700"
                  >
                    50 000
                  </button>
                </div>

                {!montantValide && (
                  <p className="mt-3 text-sm text-red-500">
                    Veuillez entrer un montant valide d’au moins 5 000 FCFA.
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
                  <p className="mt-1 text-xs text-gray-500">
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
                  <p className="mt-1 text-xs text-gray-500">
                    Le taux passe de <span className="font-semibold">30%</span>{" "}
                    à <span className="font-semibold">35%</span>
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

              <div className="mt-4 rounded-2xl border border-yellow-200 bg-yellow-50 p-4 text-sm leading-6 text-gray-700">
                ⚠️ Les frais de transaction (Mobile Money ou autre moyen de
                paiement) sont entièrement supportés par le client et ne sont
                pas inclus dans le montant du remboursement affiché.
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/demande"
                  className="inline-flex items-center justify-center rounded-full bg-yellow-500 px-6 py-3 text-sm font-semibold text-black transition hover:bg-yellow-400"
                >
                  Faire une demande
                </Link>

                <Link
                  to="/conditions"
                  className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
                >
                  Voir les conditions
                </Link>
              </div>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={180} direction="left">
  <div className="grid gap-5">

    <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-700">
        Questions fréquentes
      </p>
      <p className="mt-2 text-2xl font-bold text-slate-950">
        Ce que vous devez savoir
      </p>
      <p className="mt-3 text-sm leading-7 text-slate-600">
        Voici les informations les plus demandées par nos clients avant de faire
        une demande de prêt.
      </p>
    </div>

    <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-6">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-700">
        Montant minimum
      </p>
      <p className="mt-2 text-2xl font-bold text-slate-950">
        5 000 FCFA
      </p>
      <p className="mt-3 text-sm leading-7 text-slate-600">
        Le montant minimum pour une demande de prêt est de 5 000 FCFA.
      </p>
    </div>

    <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-700">
        Durée du prêt
      </p>
      <p className="mt-2 text-2xl font-bold text-slate-950">
        7 à 14 jours
      </p>
      <p className="mt-3 text-sm leading-7 text-slate-600">
        La durée dépend du montant demandé et des conditions du service.
      </p>
    </div>

    <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-6">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-700">
        Retard de paiement
      </p>
      <p className="mt-2 text-2xl font-bold text-slate-950">
        Taux 35%
      </p>
      <p className="mt-3 text-sm leading-7 text-slate-600">
        En cas de retard d’un jour, le taux passe de 30% à 35%.
      </p>
    </div>

    <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-700">
        Pénalité journalière
      </p>
      <p className="mt-2 text-2xl font-bold text-slate-950">
        2 000 FCFA / jour
      </p>
      <p className="mt-3 text-sm leading-7 text-slate-600">
        Une pénalité de 2 000 FCFA par jour est appliquée jusqu’au remboursement
        complet du prêt.
      </p>
    </div>

  </div>
</RevealOnScroll>
        </div>
      </div>
    </section>
  )
}