import RevealOnScroll from "./RevealOnScroll"

export default function HowItWorks() {
  return (
    <section
      id="comment"
      className="border-t border-gray-200 bg-[#f5f3ed] py-20 text-gray-900"
    >
      <div className="mx-auto max-w-7xl px-4">
        <RevealOnScroll>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-yellow-600">
              Comment ça marche
            </p>

            <h3 className="mt-4 text-3xl font-bold md:text-4xl">
              Un processus simple et rapide
            </h3>

            <p className="mt-4 text-gray-600">
              Le client fait sa demande en ligne, vient avec son objet en agence,
              puis reçoit son prêt après validation complète du dossier.
            </p>
          </div>
        </RevealOnScroll>

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-5">
          <RevealOnScroll delay={0}>
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-yellow-300 hover:shadow-lg">
              <p className="text-sm font-semibold text-yellow-600">01</p>
              <h4 className="mt-3 text-xl font-semibold text-gray-900">
                Demande en ligne
              </h4>
              <p className="mt-3 text-sm text-gray-600">
                Le client remplit le formulaire et décrit l'objet proposé en gage.
              </p>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={100}>
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-yellow-300 hover:shadow-lg">
              <p className="text-sm font-semibold text-yellow-600">02</p>
              <h4 className="mt-3 text-xl font-semibold text-gray-900">
                Étude du dossier
              </h4>
              <p className="mt-3 text-sm text-gray-600">
                L'entreprise analyse la demande et donne un premier avis.
              </p>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={200}>
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-yellow-300 hover:shadow-lg">
              <p className="text-sm font-semibold text-yellow-600">03</p>
              <h4 className="mt-3 text-xl font-semibold text-gray-900">
                Rendez-vous en agence
              </h4>
              <p className="mt-3 text-sm text-gray-600">
                Le client se présente avec son objet et ses documents.
              </p>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={300}>
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-yellow-300 hover:shadow-lg">
              <p className="text-sm font-semibold text-yellow-600">04</p>
              <h4 className="mt-3 text-xl font-semibold text-gray-900">
                Validation physique
              </h4>
              <p className="mt-3 text-sm text-gray-600">
                L'agent vérifie l'objet, les documents et confirme la valeur.
              </p>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={400}>
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-yellow-300 hover:shadow-lg">
              <p className="text-sm font-semibold text-yellow-600">05</p>
              <h4 className="mt-3 text-xl font-semibold text-gray-900">
                Versement du prêt
              </h4>
              <p className="mt-3 text-sm text-gray-600">
                Le prêt est versé en cash ou mobile money après validation.
              </p>
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  )
}