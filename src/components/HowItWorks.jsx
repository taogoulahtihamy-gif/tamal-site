export default function HowItWorks() {
  return (
    <section id="comment" className="border-t border-white/10 bg-[#111111] py-20">
      <div className="mx-auto max-w-7xl px-4">

        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-yellow-500">
            Comment ça marche
          </p>

          <h3 className="mt-4 text-3xl font-bold md:text-4xl">
            Un processus simple et rapide
          </h3>

          <p className="mt-4 text-gray-400">
            Le client fait sa demande en ligne, vient avec son objet en agence,
            puis reçoit son prêt après validation complète du dossier.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-5">

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm font-semibold text-yellow-500">01</p>
            <h4 className="mt-3 text-xl font-semibold">Demande en ligne</h4>
            <p className="mt-3 text-sm text-gray-400">
              Le client remplit le formulaire et décrit l'objet proposé en gage.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm font-semibold text-yellow-500">02</p>
            <h4 className="mt-3 text-xl font-semibold">Étude du dossier</h4>
            <p className="mt-3 text-sm text-gray-400">
              L'entreprise analyse la demande et donne un premier avis.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm font-semibold text-yellow-500">03</p>
            <h4 className="mt-3 text-xl font-semibold">Rendez-vous en agence</h4>
            <p className="mt-3 text-sm text-gray-400">
              Le client se présente avec son objet et ses documents.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm font-semibold text-yellow-500">04</p>
            <h4 className="mt-3 text-xl font-semibold">Validation physique</h4>
            <p className="mt-3 text-sm text-gray-400">
              L'agent vérifie l'objet, les documents et confirme la valeur.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm font-semibold text-yellow-500">05</p>
            <h4 className="mt-3 text-xl font-semibold">Versement du prêt</h4>
            <p className="mt-3 text-sm text-gray-400">
              Le prêt est versé en cash ou mobile money après validation.
            </p>
          </div>

        </div>
      </div>
    </section>
  )
}