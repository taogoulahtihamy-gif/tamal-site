import { Link } from "react-router-dom"
import RevealOnScroll from "./RevealOnScroll"
import Simulateur from "./Simulateur"

export default function Hero() {
  return (
    <>
      <section className="bg-[#f5f3ed] text-gray-900">
        <div className="mx-auto max-w-7xl px-4 pb-16 pt-6 md:pb-24 md:pt-8">

          {/* HERO */}
          <RevealOnScroll>
            <div className="relative overflow-hidden rounded-[32px] border border-black/10 bg-[#161616] shadow-[0_24px_80px_rgba(0,0,0,0.18)]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.10),transparent_40%)]" />
              <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.03),transparent_25%,transparent_75%,rgba(255,255,255,0.03))]" />

              <div className="relative flex min-h-[220px] items-center justify-center px-6 py-12 text-center md:min-h-[260px] md:px-10">
                <div className="max-w-4xl">

                  <h1 className="text-3xl font-bold leading-tight text-white md:text-5xl md:leading-[1.1]">
                  Une solution simple pour obtenir rapidement de la liquidité
                  </h1>
                  //test
                  <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-white/75 md:text-lg">
                    Un service clair, rapide et sécurisé pour répondre à vos
                    besoins de trésorerie avec un accompagnement sérieux.
                  </p>

                  <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                    <Link
                      to="/demande"
                      className="inline-flex min-w-[210px] items-center justify-center rounded-full bg-yellow-500 px-8 py-4 text-sm font-semibold text-black transition hover:bg-yellow-400"
                    >
                      Faire une demande
                    </Link>

                    <Link
                      to="/simulateur"
                      className="inline-flex min-w-[210px] items-center justify-center rounded-full border border-white/20 bg-white/5 px-8 py-4 text-sm font-semibold text-white transition hover:bg-white/10"
                    >
                      Simuler mon prêt
                    </Link>
                  </div>

                </div>
              </div>
            </div>
          </RevealOnScroll>


          {/* A PROPOS */}
          <div className="mt-16 grid items-center gap-12 md:mt-24 md:grid-cols-2 md:gap-16">

            <div>
              <RevealOnScroll>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
                  À propos
                </p>
              </RevealOnScroll>

              <RevealOnScroll delay={100}>
                <h2 className="mt-5 text-4xl font-bold leading-tight text-slate-950 md:text-6xl md:leading-[1.02]">
                  Avec TAMAL, vous bénéficiez d’un service de qualité
                </h2>
              </RevealOnScroll>

              <RevealOnScroll delay={180}>
                <p className="mt-6 text-lg leading-8 text-slate-600">
                  TAMAL vous accompagne pour accéder à une liquidité immédiate
                  grâce à un processus simple, humain et rassurant.
                </p>
              </RevealOnScroll>

              <RevealOnScroll delay={260}>
                <p className="mt-5 text-base leading-8 text-slate-600">
                  Notre service est pensé pour offrir une solution rapide aux
                  besoins urgents de trésorerie, tout en maintenant un cadre
                  sérieux, transparent et sécurisé pour chaque client.
                </p>
              </RevealOnScroll>

              <RevealOnScroll delay={340}>
                <p className="mt-5 text-base leading-8 text-slate-600">
                  Nous misons sur la clarté des conditions, la rapidité de
                  traitement des demandes et un accompagnement accessible.
                </p>
              </RevealOnScroll>

              <RevealOnScroll delay={420}>
                <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                  <Link
                    to="/comment-ca-marche"
                    className="inline-flex items-center justify-center rounded-full bg-slate-950 px-7 py-4 text-sm font-semibold text-white transition hover:bg-slate-800"
                  >
                    Comment ça marche
                  </Link>

                  <a
                    href="https://wa.me/221778492779"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-7 py-4 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
                  >
                    Contacter un agent
                  </a>
                </div>
              </RevealOnScroll>
            </div>


            {/* BLOC RÉPONSE RAPIDE (REMIS) */}
            <RevealOnScroll delay={180} direction="left">
              <div className="rounded-[32px] border border-black/5 bg-white p-8 shadow-[0_24px_80px_rgba(0,0,0,0.08)] md:p-10">

                <div className="grid gap-5">

                  <div className="rounded-[24px] border border-yellow-200 bg-yellow-50 p-5">
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-yellow-700">
                      Réponse rapide
                    </p>
                    <p className="mt-2 text-3xl font-bold text-slate-950">
                      En 24H
                    </p>
                    <p className="mt-3 text-sm leading-7 text-slate-600">
                      Votre dossier est étudié rapidement avec un retour clair sur
                      la faisabilité de votre demande.
                    </p>
                  </div>

                  <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-700">
            
                    </p>
                    <p className="mt-2 text-2xl font-bold text-slate-950">
                     Processus simple
                    </p>
                    <p className="mt-3 text-sm leading-7 text-slate-600">
                      Un parcours fluide et compréhensible, conçu pour aller à
                      l’essentiel sans complexité inutile.
                    </p>
                  </div>

                  <div className="rounded-[24px] border border-slate-200 bg-white p-5">
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-700">
                      Sécurité
                    </p>
                    <p className="mt-2 text-2xl font-bold text-slate-950">
                      Cadre clair et rassurant
                    </p>
                    <p className="mt-3 text-sm leading-7 text-slate-600">
                      Conditions transparentes, accompagnement humain et traitement
                      sérieux de chaque demande.
                    </p>
                  </div>

                </div>

              </div>
            </RevealOnScroll>

          </div>

        </div>
      </section>

      {/* SIMULATEUR */}
      <Simulateur />
    </>
  )
}