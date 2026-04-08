import RevealOnScroll from "./RevealOnScroll"

export default function Contact() {
  return (
    <section
      id="contact"
      className="border-t border-gray-200 bg-[#f5f3ed] pt-40 pb-10 text-gray-900"
    >
      <div className="mx-auto max-w-7xl px-4">

        <RevealOnScroll>
          <div className="overflow-hidden rounded-[32px] border border-white/10 bg-[#0b0b0b] text-white shadow-[0_20px_60px_rgba(0,0,0,0.2)]">
            
            <div className="grid gap-10 px-6 py-10 md:grid-cols-2 md:px-10 md:py-12">

              {/* CONTACT */}
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-yellow-500">
                  Nous contacter
                </p>

                <h4 className="mt-4 text-3xl font-bold">
                  Restons en contact
                </h4>

                <p className="mt-4 max-w-xl text-sm leading-7 text-gray-300">
                  Pour toute demande d'information concernant un prêt sur gage,
                  notre équipe reste disponible par téléphone ou WhatsApp.
                </p>

                <div className="mt-8 space-y-5">

                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-400">
                      Téléphone
                    </p>
                    <p className="mt-1 text-lg font-semibold text-white">
                      +221 77 261 67 53
                    </p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-400">
                      WhatsApp
                    </p>
                    <p className="mt-1 text-lg font-semibold text-white">
                      +221 77 261 67 53
                    </p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-400">
                      Adresse
                    </p>
                    <p className="mt-1 text-lg font-semibold text-white">
                      Dakar, Sénégal
                    </p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-400">
                      Horaires
                    </p>
                    <p className="mt-1 text-lg font-semibold text-white">
                      Lun - Sam : 08h00 - 19h00
                    </p>
                  </div>

                </div>
              </div>

              {/* LIENS RAPIDES */}
              <div className="flex flex-col justify-between">

                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-yellow-500">
                    Navigation
                  </p>

                  <div className="mt-6 grid gap-3">

                    <a
                      href="/"
                      className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm transition hover:border-yellow-500 hover:text-yellow-400"
                    >
                      Accueil
                    </a>

                    <a
                      href="/demande"
                      className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm transition hover:border-yellow-500 hover:text-yellow-400"
                    >
                      Faire une demande
                    </a>

                    <a
                      href="/contact"
                      className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm transition hover:border-yellow-500 hover:text-yellow-400"
                    >
                      Contact
                    </a>

                  </div>
                </div>

                <div className="mt-8 flex flex-col gap-4 sm:flex-row md:flex-col lg:flex-row">

                  <a
                    href="https://wa.me/221772616753"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex justify-center rounded-full bg-yellow-500 px-6 py-3 font-semibold text-black transition hover:bg-yellow-400"
                  >
                    WhatsApp
                  </a>

                  <a
                    href="tel:+221772616753"
                    className="inline-flex justify-center rounded-full border border-white/20 px-6 py-3 font-semibold text-white transition hover:border-yellow-500 hover:text-yellow-400"
                  >
                    Appeler
                  </a>

                </div>

              </div>

            </div>
          </div>
        </RevealOnScroll>

      </div>
    </section>
  )
}