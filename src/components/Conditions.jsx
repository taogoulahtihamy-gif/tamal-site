export default function Conditions() {
  return (
    <section id="conditions" className="border-t border-white/10 bg-black py-20">
      <div className="mx-auto max-w-7xl px-4">

        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-yellow-500">
            Conditions
          </p>

          <h3 className="mt-4 text-3xl font-bold md:text-4xl">
            Conditions du prêt sur gage
          </h3>

          <p className="mt-4 text-gray-400">
            Les documents et l’objet proposé en gage doivent être présentés
            physiquement lors du rendez-vous en agence.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h4 className="text-xl font-semibold text-yellow-500">
              Documents requis
            </h4>

            <div className="mt-6 space-y-4">

              <div className="rounded-2xl border border-white/10 bg-black/30 px-4 py-4 text-gray-300">
                ✓ Carte nationale d'identité ou Passeport
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/30 px-4 py-4 text-gray-300">
                ✓ Certificat de résidence
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/30 px-4 py-4 text-gray-300">
                ✓ Signature de la reconnaissance de dette
              </div>

            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h4 className="text-xl font-semibold text-yellow-500">
              Conditions d’acceptation
            </h4>

            <div className="mt-6 space-y-4">

              <div className="rounded-2xl border border-white/10 bg-black/30 px-4 py-4 text-gray-300">
                ✓ Dépôt physique obligatoire de l’objet
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/30 px-4 py-4 text-gray-300">
                ✓ Vérification complète de l’objet et des documents
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/30 px-4 py-4 text-gray-300">
                ✓ Validation finale du dossier en agence
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  )
}