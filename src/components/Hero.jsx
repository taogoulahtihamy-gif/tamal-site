import { Link } from "react-router-dom"
import { useMemo, useState } from "react"
import RevealOnScroll from "./RevealOnScroll"

export default function Hero() {
  const [montant, setMontant] = useState("30000")

  const montantNombre = Number(montant)
  const montantValide = montant !== "" && montantNombre >= 5000

  const duree = useMemo(() => {
    if (!montantValide) return "--"
    return montantNombre >= 30000 ? "14 jours" : "7 jours"
  }, [montantNombre, montantValide])

  const remboursement = useMemo(() => {
    if (!montantValide) return "--"
    return `${Math.round(montantNombre * 1.3).toLocaleString("fr-FR")} FCFA`
  }, [montantNombre, montantValide])

  return (
    <section className="bg-[#f5f3ed] text-gray-900">
      <div className="mx-auto max-w-7xl px-4 pb-16 pt-4 md:pb-20 md:pt-6">
        {/* IMAGE EN HAUT */}
        <RevealOnScroll>
          <div className="relative mb-10 overflow-hidden rounded-[28px] border border-yellow-500/20 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
            <img
              src="/pret-gage.jpeg"
              alt="Illustration prêt sur gage"
              className="h-56 w-full object-cover md:h-80"
            />

            <div className="absolute inset-0 bg-gradient-to-r from-black/25 via-black/10 to-transparent" />

            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent p-5 md:p-8">
              <div className="max-w-2xl">
                <p className="inline-block rounded-full border border-white/20 bg-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-sm">
                  TAMAL • Prêt sur gage
                </p>

                <h2 className="mt-4 text-2xl font-bold text-white md:text-4xl">
                  Une solution simple pour obtenir rapidement de la liquidité
                </h2>

                <p className="mt-3 max-w-xl text-sm text-white/90 md:text-base">
                  Déposez votre objet, faites étudier votre dossier et obtenez
                  une réponse rapide avec un cadre clair et sécurisé.
                </p>
              </div>
            </div>
          </div>
        </RevealOnScroll>

        {/* CONTENU HERO */}
        <div className="grid items-start gap-12 md:grid-cols-2">
          {/* TEXTE */}
          <div>
            <RevealOnScroll>
              <div className="mb-6 inline-block rounded-full bg-yellow-100 px-4 py-2 text-sm font-semibold text-yellow-700">
                Réponse rapide • En 24H
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay={100}>
              <h1 className="text-5xl font-bold leading-tight">
                Prêt sur gage{" "}
                <span className="text-yellow-600">rapide</span>
                <br />
                et sécurisé
              </h1>
            </RevealOnScroll>

            <RevealOnScroll delay={200}>
              <p className="mt-6 text-lg text-gray-600">
                Obtenez votre prêt en 24h : simple, rapide et sans mauvaises
                surprises.
              </p>
            </RevealOnScroll>

            <RevealOnScroll delay={300}>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link
                  to="/demande"
                  className="rounded-full bg-yellow-500 px-8 py-4 text-center font-semibold text-black shadow-sm transition hover:bg-yellow-400"
                >
                  Faire une demande
                </Link>

                <a
                  href="https://wa.me/221778492779"
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-gray-300 bg-white px-8 py-4 text-center transition hover:bg-gray-50"
                >
                  Parler à un agent
                </a>
              </div>
            </RevealOnScroll>

            <div className="mt-10 space-y-4">
              <RevealOnScroll delay={350}>
                <div className="rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-sm">
                  ✓ Réponse rapide
                </div>
              </RevealOnScroll>

              <RevealOnScroll delay={450}>
                <div className="rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-sm">
                  ✓ Paiement cash ou mobile money
                </div>
              </RevealOnScroll>

              <RevealOnScroll delay={550}>
                <div className="rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-sm">
                  ✓ Processus simple
                </div>
              </RevealOnScroll>

              <RevealOnScroll delay={650}>
                <div className="rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-sm">
                  ✓ Dépôt du gage en agence
                </div>
              </RevealOnScroll>
            </div>
          </div>

          {/* MINI SIMULATEUR PREMIUM */}
          <RevealOnScroll delay={200} direction="left">
            <div className="relative overflow-hidden rounded-[28px] border border-yellow-500/20 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-300" />

              <div className="p-6 md:p-7">
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.16em] text-yellow-600">
                      Simulation
                    </p>
                    <h3 className="mt-2 text-2xl font-bold text-gray-900">
                      Simulez votre prêt
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-gray-600">
                      Entrez le montant souhaité pour voir automatiquement la
                      durée et le remboursement estimé.
                    </p>
                  </div>

                  <div className="rounded-2xl bg-[#faf9f5] px-4 py-3 text-right">
                    <p className="text-xs uppercase tracking-wide text-gray-500">
                      Réponse
                    </p>
                    <p className="mt-1 text-lg font-bold text-yellow-600">
                      24H
                    </p>
                  </div>
                </div>

                <div className="rounded-3xl border border-gray-200 bg-[#fcfbf8] p-4 md:p-5">
                  <label className="mb-3 block text-sm font-medium text-gray-700">
                    Montant souhaité (FCFA)
                  </label>

                  <input
                    type="number"
                    value={montant}
                    onChange={(e) => setMontant(e.target.value)}
                    placeholder="Ex : 30000"
                    className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-4 text-xl font-semibold text-gray-900 outline-none transition focus:border-yellow-500"
                  />

                  {!montantValide && (
                    <p className="mt-3 text-sm text-red-500">
                      Veuillez entrer un montant valide d’au moins 5 000 FCFA.
                    </p>
                  )}

                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                      <p className="text-sm text-gray-500">Durée</p>
                      <p className="mt-2 text-3xl font-bold text-yellow-600">
                        {duree}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                      <p className="text-sm text-gray-500">Remboursement</p>
                      <p className="mt-2 text-3xl font-bold text-yellow-600">
                        {remboursement}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 rounded-2xl border border-yellow-200 bg-yellow-50/80 p-4">
                  <p className="text-sm font-semibold text-gray-800">
                    Règles en cas de retard
                  </p>

                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    À partir d’un jour de dépassement, le taux passe à{" "}
                    <span className="font-semibold text-yellow-600">35 %</span>,
                    puis une pénalité de{" "}
                    <span className="font-semibold text-yellow-600">
                      2 000 FCFA
                    </span>{" "}
                    par jour s’applique jusqu’au remboursement.
                  </p>
                </div>

                <div className="mt-4 rounded-2xl border border-gray-200 bg-[#faf9f5] p-4">
                  <p className="text-sm text-gray-600">
                    ⚠️ Les frais de transaction sont supportés par le client.
                  </p>
                </div>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  )
}