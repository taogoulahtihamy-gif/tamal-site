import RevealOnScroll from "./RevealOnScroll"

export default function Contact() {
  return (
    <section
      id="contact"
      className="border-t border-gray-200 bg-[#f5f3ed] py-20 text-gray-900"
    >
      <div className="mx-auto max-w-7xl px-4">
        <RevealOnScroll>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-yellow-600">
              Contact
            </p>

            <h3 className="mt-4 text-3xl font-bold md:text-4xl">
              Contactez TAMAL
            </h3>

            <p className="mt-4 text-gray-600">
              Besoin d’informations complémentaires ? Un agent peut vous répondre
              rapidement par téléphone ou par WhatsApp.
            </p>
          </div>
        </RevealOnScroll>

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <RevealOnScroll delay={0}>
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-yellow-300 hover:shadow-lg">
              <p className="text-sm font-semibold uppercase tracking-wide text-yellow-600">
                Téléphone
              </p>
              <p className="mt-4 text-lg font-semibold text-gray-900">
                +221 77 261 67 53
              </p>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={100}>
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-yellow-300 hover:shadow-lg">
              <p className="text-sm font-semibold uppercase tracking-wide text-yellow-600">
                WhatsApp
              </p>
              <p className="mt-4 text-lg font-semibold text-gray-900">
                +221 77 261 67 53
              </p>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={200}>
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-yellow-300 hover:shadow-lg">
              <p className="text-sm font-semibold uppercase tracking-wide text-yellow-600">
                Adresse
              </p>
              <p className="mt-4 text-lg font-semibold text-gray-900">
                Dakar, Sénégal
              </p>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={300}>
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-yellow-300 hover:shadow-lg">
              <p className="text-sm font-semibold uppercase tracking-wide text-yellow-600">
                Horaires
              </p>
              <p className="mt-4 text-lg font-semibold text-gray-900">
                Lun - Sam : 08h00 - 19h00
              </p>
            </div>
          </RevealOnScroll>
        </div>

        <RevealOnScroll delay={350}>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="https://wa.me/221772616753"
              className="rounded-full bg-yellow-500 px-6 py-3 font-semibold text-black transition duration-300 hover:-translate-y-0.5 hover:bg-yellow-400 hover:shadow-md"
            >
              Écrire sur WhatsApp
            </a>

            <a
              href="tel:+221772616753"
              className="rounded-full border border-gray-300 px-6 py-3 font-semibold text-gray-800 transition duration-300 hover:-translate-y-0.5 hover:border-yellow-500 hover:text-yellow-600 hover:shadow-sm"
            >
              Appeler maintenant
            </a>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  )
}