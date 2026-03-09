import RevealOnScroll from "./RevealOnScroll"

export default function Conditions() {
  return (
    <section
      id="conditions"
      className="border-t border-gray-200 bg-[#f5f3ed] py-20 text-gray-900"
    >
      <div className="mx-auto max-w-7xl px-4">
        <RevealOnScroll>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-yellow-600">
              Conditions
            </p>

            <h3 className="mt-4 text-3xl font-bold md:text-4xl">
              Conditions du prêt sur gage
            </h3>

            <p className="mt-4 text-gray-600">
              Les documents et l’objet proposé en gage doivent être présentés
              physiquement lors du rendez-vous en agence.
            </p>
          </div>
        </RevealOnScroll>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <RevealOnScroll delay={100}>
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-yellow-300 hover:shadow-lg">
              <h4 className="text-xl font-semibold text-yellow-600">
                Documents requis
              </h4>

              <div className="mt-6 space-y-4">
                <div className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4 text-gray-700 transition duration-300 hover:bg-white hover:shadow-sm">
                  ✓ Carte nationale d'identité ou Passeport
                </div>

                <div className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4 text-gray-700 transition duration-300 hover:bg-white hover:shadow-sm">
                  ✓ Certificat de résidence
                </div>

                <div className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4 text-gray-700 transition duration-300 hover:bg-white hover:shadow-sm">
                  ✓ Signature de la reconnaissance de dette
                </div>
              </div>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={220}>
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-yellow-300 hover:shadow-lg">
              <h4 className="text-xl font-semibold text-yellow-600">
                Conditions d’acceptation
              </h4>

              <div className="mt-6 space-y-4">
                <div className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4 text-gray-700 transition duration-300 hover:bg-white hover:shadow-sm">
                  ✓ Dépôt physique obligatoire de l’objet
                </div>

                <div className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4 text-gray-700 transition duration-300 hover:bg-white hover:shadow-sm">
                  ✓ Vérification complète de l’objet et des documents
                </div>

                <div className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4 text-gray-700 transition duration-300 hover:bg-white hover:shadow-sm">
                  ✓ Validation finale du dossier en agence
                </div>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  )
}