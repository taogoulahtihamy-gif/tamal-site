export default function Contact() {
  return (
    <section id="contact" className="border-t border-white/10 bg-black py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-yellow-500">
            Contact
          </p>

          <h3 className="mt-4 text-3xl font-bold md:text-4xl">
            Contactez TAMAL
          </h3>

          <p className="mt-4 text-gray-400">
            Besoin d’informations complémentaires ? Un agent peut vous répondre
            rapidement par téléphone ou par WhatsApp.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm font-semibold uppercase tracking-wide text-yellow-500">
              Téléphone
            </p>
            <p className="mt-4 text-lg font-semibold text-white">
              +221 77 261 67 53
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm font-semibold uppercase tracking-wide text-yellow-500">
              WhatsApp
            </p>
            <p className="mt-4 text-lg font-semibold text-white">
              +221 77 261 67 53
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm font-semibold uppercase tracking-wide text-yellow-500">
              Adresse
            </p>
            <p className="mt-4 text-lg font-semibold text-white">
              Dakar, Sénégal
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm font-semibold uppercase tracking-wide text-yellow-500">
              Horaires
            </p>
            <p className="mt-4 text-lg font-semibold text-white">
              Lun - Sam : 08h00 - 19h00
            </p>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="https://wa.me/221772616753"
            className="rounded-full bg-yellow-500 px-6 py-3 font-semibold text-black hover:bg-yellow-400"
          >
            Écrire sur WhatsApp
          </a>

          <a
            href="tel:+221772616753"
            className="rounded-full border border-white/20 px-6 py-3 font-semibold text-white hover:border-yellow-500 hover:text-yellow-500"
          >
            Appeler maintenant
          </a>
        </div>
      </div>
    </section>
  )
}