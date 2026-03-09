import { Link } from "react-router-dom"
import RevealOnScroll from "./RevealOnScroll"

export default function HowItWorks() {
  return (
    <section className="bg-[#f5f3ed] text-gray-900">
      <div className="mx-auto max-w-7xl px-4 pb-16 pt-6 md:pb-24 md:pt-8">
        {/* HERO PAGE */}
        <RevealOnScroll>
          <div className="relative overflow-hidden rounded-[32px] border border-black/10 bg-[#161616] shadow-[0_24px_80px_rgba(0,0,0,0.18)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.10),transparent_42%)]" />
            <div className="relative px-6 py-10 text-center md:px-10 md:py-12">
              <p className="inline-flex rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white/80">
                Fonctionnement
              </p>

              <h1 className="mx-auto mt-4 max-w-3xl text-2xl font-bold leading-tight text-white md:text-4xl">
                Comment fonctionne votre prêt sur gage avec TAMAL
              </h1>

              <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-white/70 md:text-base">
                Un parcours simple, encadré et transparent pour vous permettre
                d’obtenir rapidement de la liquidité.
              </p>
            </div>
          </div>
        </RevealOnScroll>

        {/* INTRO */}
        <div className="mt-16 grid gap-10 md:grid-cols-[1.1fr_0.9fr] md:items-center">
          <div>
            <RevealOnScroll>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
                Vue d’ensemble
              </p>
            </RevealOnScroll>

            <RevealOnScroll delay={100}>
              <h2 className="mt-4 text-3xl font-bold leading-tight text-slate-950 md:text-5xl">
                Un service pensé pour aller vite, sans perdre en clarté
              </h2>
            </RevealOnScroll>

            <RevealOnScroll delay={180}>
              <p className="mt-5 text-base leading-8 text-slate-600 md:text-lg">
                Chez TAMAL, chaque demande suit un processus simple : vous
                soumettez votre besoin, nous étudions votre dossier, vous
                déposez le gage si la demande est retenue, puis le prêt est mis
                en place selon les conditions convenues.
              </p>
            </RevealOnScroll>

            <RevealOnScroll delay={260}>
              <p className="mt-4 text-base leading-8 text-slate-600">
                L’objectif est de vous proposer une solution rapide pour un
                besoin ponctuel de trésorerie, tout en maintenant un cadre
                sérieux, lisible et rassurant à chaque étape.
              </p>
            </RevealOnScroll>
          </div>

          <RevealOnScroll delay={180} direction="left">
            <div className="rounded-[32px] border border-black/5 bg-white p-8 shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
              <div className="grid gap-4">
                <div className="rounded-[24px] border border-yellow-200 bg-yellow-50 p-5">
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-yellow-700">
                    Réponse rapide
                  </p>
                  <p className="mt-2 text-3xl font-bold text-slate-950">
                    Sous 24H
                  </p>
                </div>

                <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-700">
                    Dépôt du gage
                  </p>
                  <p className="mt-2 text-xl font-bold text-slate-950">
                    En agence, dans un cadre sécurisé
                  </p>
                </div>

                <div className="rounded-[24px] border border-slate-200 bg-white p-5">
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-700">
                    Conditions
                  </p>
                  <p className="mt-2 text-xl font-bold text-slate-950">
                    Simples, claires et transparentes
                  </p>
                </div>
              </div>
            </div>
          </RevealOnScroll>
        </div>

        {/* ETAPES DETAILLEES */}
        <div className="mt-16 md:mt-24">
          <RevealOnScroll>
            <div className="text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
                Les étapes détaillées
              </p>
              <h3 className="mt-4 text-3xl font-bold text-slate-950 md:text-5xl">
                De la demande au versement
              </h3>
            </div>
          </RevealOnScroll>

          <div className="mt-10 grid gap-6">
            <RevealOnScroll>
              <div className="rounded-[30px] border border-black/5 bg-white p-6 shadow-sm md:p-8">
                <div className="grid gap-6 md:grid-cols-[88px_1fr] md:items-start">
                  <div className="inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-yellow-500 text-2xl font-bold text-black">
                    1
                  </div>

                  <div>
                    <h4 className="text-2xl font-bold text-slate-950">
                      Vous soumettez votre demande
                    </h4>
                    <p className="mt-4 text-base leading-8 text-slate-600">
                      Vous commencez par remplir le formulaire avec vos
                      informations principales, le montant souhaité et les
                      éléments utiles à l’étude du dossier.
                    </p>
                    <p className="mt-3 text-base leading-8 text-slate-600">
                      Cette première étape nous permet de comprendre votre
                      besoin, d’avoir une première visibilité sur votre demande
                      et de vous orienter rapidement.
                    </p>
                  </div>
                </div>
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay={120}>
              <div className="rounded-[30px] border border-black/5 bg-white p-6 shadow-sm md:p-8">
                <div className="grid gap-6 md:grid-cols-[88px_1fr] md:items-start">
                  <div className="inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-yellow-500 text-2xl font-bold text-black">
                    2
                  </div>

                  <div>
                    <h4 className="text-2xl font-bold text-slate-950">
                      Notre équipe étudie votre dossier
                    </h4>
                    <p className="mt-4 text-base leading-8 text-slate-600">
                      Après réception de votre demande, nous analysons les
                      informations transmises afin d’évaluer la faisabilité de
                      l’opération.
                    </p>
                    <p className="mt-3 text-base leading-8 text-slate-600">
                      Si votre demande peut avancer, vous recevez un retour
                      rapide avec les prochaines étapes à suivre.
                    </p>
                  </div>
                </div>
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay={240}>
              <div className="rounded-[30px] border border-black/5 bg-white p-6 shadow-sm md:p-8">
                <div className="grid gap-6 md:grid-cols-[88px_1fr] md:items-start">
                  <div className="inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-yellow-500 text-2xl font-bold text-black">
                    3
                  </div>

                  <div>
                    <h4 className="text-2xl font-bold text-slate-950">
                      Vous déposez le gage en agence
                    </h4>
                    <p className="mt-4 text-base leading-8 text-slate-600">
                      Lorsque la demande est retenue, vous déposez l’objet
                      concerné dans un cadre sécurisé. Les conditions du prêt
                      sont alors précisées de manière claire.
                    </p>
                    <p className="mt-3 text-base leading-8 text-slate-600">
                      Cette étape permet de finaliser le dossier avant la mise à
                      disposition du prêt.
                    </p>
                  </div>
                </div>
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay={360}>
              <div className="rounded-[30px] border border-black/5 bg-white p-6 shadow-sm md:p-8">
                <div className="grid gap-6 md:grid-cols-[88px_1fr] md:items-start">
                  <div className="inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-yellow-500 text-2xl font-bold text-black">
                    4
                  </div>

                  <div>
                    <h4 className="text-2xl font-bold text-slate-950">
                      Le prêt est versé selon les modalités prévues
                    </h4>
                    <p className="mt-4 text-base leading-8 text-slate-600">
                      Une fois le dossier validé, le prêt est mis en place
                      rapidement selon les conditions arrêtées avec vous.
                    </p>
                    <p className="mt-3 text-base leading-8 text-slate-600">
                      Vous bénéficiez ainsi d’une liquidité immédiate dans un
                      cadre simple, lisible et professionnel.
                    </p>
                  </div>
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </div>

        {/* DOCUMENTS / INFOS */}
        <div className="mt-16 grid gap-6 md:mt-24 md:grid-cols-2">
          <RevealOnScroll>
            <div className="rounded-[30px] border border-black/5 bg-white p-7 shadow-sm md:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                Ce qu’il faut prévoir
              </p>
              <h3 className="mt-4 text-2xl font-bold text-slate-950">
                Les éléments utiles pour avancer rapidement
              </h3>

              <div className="mt-6 space-y-4">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4">
                  Pièce d’identité valide
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4">
                  Informations de contact exactes
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4">
                  Objet destiné au gage
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4">
                  Disponibilité pour dépôt en agence
                </div>
              </div>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={150} direction="left">
            <div className="rounded-[30px] border border-black/5 bg-white p-7 shadow-sm md:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                À savoir
              </p>
              <h3 className="mt-4 text-2xl font-bold text-slate-950">
                Délais et cadre de traitement
              </h3>

              <div className="mt-6 space-y-5 text-slate-600">
                <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-5">
                  <p className="text-sm font-semibold text-slate-900">
                    Réponse rapide
                  </p>
                  <p className="mt-2 text-sm leading-7">
                    Les demandes sont étudiées rapidement, en général sous 24H
                    selon la complétude du dossier.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <p className="text-sm font-semibold text-slate-900">
                    Transparence
                  </p>
                  <p className="mt-2 text-sm leading-7">
                    Les modalités du prêt et les conditions associées sont
                    précisées avant toute finalisation.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <p className="text-sm font-semibold text-slate-900">
                    Accompagnement
                  </p>
                  <p className="mt-2 text-sm leading-7">
                    Notre équipe reste disponible pour répondre à vos questions
                    et vous guider dans les différentes étapes.
                  </p>
                </div>
              </div>
            </div>
          </RevealOnScroll>
        </div>

        {/* CTA FINAL */}
        <RevealOnScroll>
          <div className="mt-16 rounded-[32px] border border-black/5 bg-white p-8 text-center shadow-sm md:mt-24 md:p-12">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
              Passer à l’action
            </p>
            <h3 className="mt-4 text-3xl font-bold text-slate-950 md:text-4xl">
              Prête à soumettre votre demande ?
            </h3>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600">
              Lancez votre demande maintenant ou contactez directement notre
              équipe pour obtenir une réponse rapide.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                to="/demande"
                className="inline-flex min-w-[220px] items-center justify-center rounded-full bg-yellow-500 px-8 py-4 text-sm font-semibold text-black transition hover:bg-yellow-400"
              >
                Faire une demande
              </Link>

              <a
                href="https://wa.me/221778492779"
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-w-[220px] items-center justify-center rounded-full border border-slate-300 bg-white px-8 py-4 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
              >
                Contacter un agent
              </a>
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  )
}