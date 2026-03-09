import { Link } from "react-router-dom"
import RevealOnScroll from "./RevealOnScroll"

export default function Hero() {
  return (
    <section className="bg-[#f5f3ed] text-gray-900">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 md:grid-cols-2">
        {/* TEXTE */}
        <div>
          <RevealOnScroll>
            <div className="inline-block rounded-full bg-yellow-100 px-4 py-2 text-sm font-semibold text-yellow-700 mb-6">
              Réponse rapide • Dépôt du gage en agence
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
              Faites votre demande en ligne, présentez votre objet en agence et recevez votre prêt après validation complète de votre dossier.
            </p>
          </RevealOnScroll>

          <RevealOnScroll delay={300}>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                to="/demande"
                className="rounded-full bg-yellow-500 px-8 py-4 text-center font-semibold text-black hover:bg-yellow-400"
              >
                Faire une demande
              </Link>

              <a
                href="https://wa.me/221778492779"
                className="rounded-full border border-gray-300 px-8 py-4 text-center hover:bg-gray-100"
              >
                Parler à un agent
              </a>
            </div>
          </RevealOnScroll>

          {/* LISTE */}
          <div className="mt-10 space-y-4">
            <RevealOnScroll delay={350}>
              <div className="rounded-xl border border-gray-200 bg-white px-5 py-4 shadow-sm">
                ✓ Réponse rapide
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay={450}>
              <div className="rounded-xl border border-gray-200 bg-white px-5 py-4 shadow-sm">
                ✓ Paiement cash ou mobile money
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay={550}>
              <div className="rounded-xl border border-gray-200 bg-white px-5 py-4 shadow-sm">
                ✓ Processus simple
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay={650}>
              <div className="rounded-xl border border-gray-200 bg-white px-5 py-4 shadow-sm">
                ✓ Dépôt du gage en agence
              </div>
            </RevealOnScroll>
          </div>
        </div>

        {/* SIMULATEUR */}
        <RevealOnScroll delay={200} direction="left">
          <div>
            <div className="rounded-3xl border border-yellow-500 bg-white p-6 shadow-lg">
              <div className="mb-4 rounded-xl bg-gray-100 p-6">
                <p className="text-sm text-gray-500">
                  Montant demandé
                </p>

                <p className="mt-2 text-4xl font-bold">
                  30 000 FCFA
                </p>
              </div>

              <div className="mb-4 rounded-xl border border-gray-200 bg-white p-5">
                <p className="text-sm text-gray-500">
                  Durée
                </p>

                <p className="text-2xl font-bold text-yellow-600">
                  14 jours
                </p>
              </div>

              <div className="mb-4 rounded-xl border border-gray-200 bg-white p-5">
                <p className="text-sm text-gray-500">
                  Remboursement
                </p>

                <p className="text-2xl font-bold text-yellow-600">
                  39 000 FCFA
                </p>
              </div>

              <div className="mt-4 rounded-xl border border-yellow-300 bg-yellow-50 p-5">
                <p className="mb-2 font-semibold text-gray-800">
                  Règles en cas de retard
                </p>

                <p className="text-sm text-gray-600">
                  À partir d’un jour de dépassement, le taux passe à{" "}
                  <span className="font-semibold text-yellow-600">
                    35 %
                  </span>
                  , puis une pénalité de{" "}
                  <span className="font-semibold text-yellow-600">
                    2 000 FCFA
                  </span>{" "}
                  par jour s’applique jusqu’au remboursement.
                </p>
              </div>
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  )
}