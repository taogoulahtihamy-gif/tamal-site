import { useState } from "react"
import RevealOnScroll from "./RevealOnScroll"

export default function Formulaire() {
  const [formData, setFormData] = useState({
    nom: "",
    telephone: "",
    countryCode: "221",
    customCode: "",
    email: "",
    montant: "",
    typeObjet: "Téléphone",
    typePiece: "Carte nationale d'identité",
    description: "",
  })

  const [erreurs, setErreurs] = useState({})
  const [documentFile, setDocumentFile] = useState(null)
  const [photoFile, setPhotoFile] = useState(null)
  const [photoPreview, setPhotoPreview] = useState(null)

  const [messageSucces, setMessageSucces] = useState("")
  const [messageErreur, setMessageErreur] = useState("")
  const [chargement, setChargement] = useState(false)

  const API_URL = import.meta.env.VITE_API_URL

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleDocumentChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setDocumentFile(file)
    }
  }

  const handlePhotoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setPhotoFile(file)
      setPhotoPreview(URL.createObjectURL(file))
    }
  }

  const validerEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const validerFormulaire = () => {
    const nouvellesErreurs = {}

    if (!formData.nom.trim()) {
      nouvellesErreurs.nom = "Le nom est obligatoire"
    }

    if (!formData.telephone.trim()) {
      nouvellesErreurs.telephone = "Le téléphone est obligatoire"
    }

    if (formData.countryCode === "custom" && !formData.customCode.trim()) {
      nouvellesErreurs.telephone = "Veuillez entrer l’indicatif pays"
    }

    if (!formData.email.trim()) {
      nouvellesErreurs.email = "L’email est obligatoire"
    } else if (!validerEmail(formData.email)) {
      nouvellesErreurs.email = "Veuillez entrer une adresse email valide"
    }

    if (!formData.montant || Number(formData.montant) < 5000) {
      nouvellesErreurs.montant = "Le montant doit être au moins de 5 000 FCFA"
    }

    if (!photoFile) {
      nouvellesErreurs.photo = "La photo de l'objet est obligatoire"
    }

    if (!formData.description.trim()) {
      nouvellesErreurs.description = "La description de l'objet est obligatoire"
    }

    if (!documentFile) {
      nouvellesErreurs.document = "La copie de la pièce est obligatoire"
    }

    return nouvellesErreurs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const nouvellesErreurs = validerFormulaire()

    setErreurs(nouvellesErreurs)
    setMessageSucces("")
    setMessageErreur("")

    if (Object.keys(nouvellesErreurs).length > 0) {
      return
    }

    setChargement(true)

    try {
      const dataToSend = new FormData()

      const indicatifFinal =
        formData.countryCode === "custom"
          ? formData.customCode
          : formData.countryCode

      dataToSend.append("nom", formData.nom)
      dataToSend.append("countryCode", indicatifFinal)
      dataToSend.append("telephone", formData.telephone)
      dataToSend.append("email", formData.email)
      dataToSend.append("montant", formData.montant)
      dataToSend.append("typeObjet", formData.typeObjet)
      dataToSend.append("typePiece", formData.typePiece)
      dataToSend.append("description", formData.description)

      if (documentFile) {
        dataToSend.append("document", documentFile)
      }

      if (photoFile) {
        dataToSend.append("photo", photoFile)
      }

      const response = await fetch(`${API_URL}/api/demandes`, {
        method: "POST",
        body: dataToSend,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Erreur lors de l'envoi")
      }

      setMessageSucces(
        "Votre demande a bien été envoyée. Un agent vous contactera bientôt."
      )

      setErreurs({})

      setFormData({
        nom: "",
        telephone: "",
        countryCode: "221",
        customCode: "",
        email: "",
        montant: "",
        typeObjet: "Téléphone",
        typePiece: "Carte nationale d'identité",
        description: "",
      })

      setDocumentFile(null)
      setPhotoFile(null)
      setPhotoPreview(null)
    } catch (error) {
      console.error(error)
      setMessageErreur("Une erreur est survenue lors de l'envoi du formulaire.")
    } finally {
      setChargement(false)
    }
  }

  return (
    <section
      id="demande"
      className="border-t border-gray-200 bg-[#f5f3ed] py-20 text-gray-900"
    >
      <div className="mx-auto max-w-3xl px-4">
        <RevealOnScroll>
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-yellow-600">
              Demande de prêt
            </p>

            <h3 className="mt-4 text-3xl font-bold md:text-4xl">
              Faire une demande
            </h3>

            <p className="mt-4 text-gray-600">
              Remplissez ce formulaire pour soumettre votre demande de prêt.
              Un agent analysera votre dossier et vous contactera rapidement.
            </p>
          </div>
        </RevealOnScroll>

        <RevealOnScroll delay={120}>
          <form
            onSubmit={handleSubmit}
            className="mt-12 space-y-6 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md md:p-8"
          >
            <div>
              <label className="mb-2 block text-sm text-gray-700">
                Nom complet
              </label>

              <input
                type="text"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                placeholder="Votre nom complet"
                className="w-full rounded-xl border border-gray-200 bg-[#faf9f5] px-4 py-3 text-gray-900 outline-none transition focus:border-yellow-500"
              />

              {erreurs.nom && (
                <p className="mt-2 text-sm text-red-500">{erreurs.nom}</p>
              )}
            </div>
            <div>
              <label className="mb-2 block text-sm text-gray-700">
                Téléphone / WhatsApp
              </label>

              <div className="grid gap-3 md:grid-cols-[220px_1fr]">
                <select
                  name="countryCode"
                  value={formData.countryCode}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-200 bg-[#faf9f5] px-4 py-3 text-gray-900 outline-none transition focus:border-yellow-500"
                  required
                >
                  <option value="221">🇸🇳 Sénégal (+221)</option>
                  <option value="254">🇰🇪 Kenya (+254)</option>
                  <option value="225">🇨🇮 Côte d’Ivoire (+225)</option>
                  <option value="226">🇧🇫 Burkina Faso (+226)</option>
                  <option value="223">🇲🇱 Mali (+223)</option>
                  <option value="227">🇳🇪 Niger (+227)</option>
                  <option value="228">🇹🇬 Togo (+228)</option>
                  <option value="229">🇧🇯 Bénin (+229)</option>
                  <option value="224">🇬🇳 Guinée (+224)</option>
                  <option value="237">🇨🇲 Cameroun (+237)</option>
                  <option value="243">🇨🇩 RDC (+243)</option>
                  <option value="241">🇬🇦 Gabon (+241)</option>
                  <option value="233">🇬🇭 Ghana (+233)</option>
                  <option value="234">🇳🇬 Nigeria (+234)</option>
                  <option value="250">🇷🇼 Rwanda (+250)</option>
                  <option value="255">🇹🇿 Tanzanie (+255)</option>
                  <option value="256">🇺🇬 Ouganda (+256)</option>
                  <option value="251">🇪🇹 Éthiopie (+251)</option>
                  <option value="212">🇲🇦 Maroc (+212)</option>
                  <option value="213">🇩🇿 Algérie (+213)</option>
                  <option value="216">🇹🇳 Tunisie (+216)</option>
                  <option value="33">🇫🇷 France (+33)</option>
                  <option value="32">🇧🇪 Belgique (+32)</option>
                  <option value="1">🇺🇸 USA / Canada (+1)</option>
                  <option value="custom">🌍 Autre pays</option>
                </select>

                <input
                  type="tel"
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleChange}
                  placeholder="Ex : 77 000 00 00"
                  className="w-full rounded-xl border border-gray-200 bg-[#faf9f5] px-4 py-3 text-gray-900 outline-none transition focus:border-yellow-500"
                />
              </div>

              {formData.countryCode === "custom" && (
                <input
                  type="text"
                  name="customCode"
                  value={formData.customCode}
                  onChange={handleChange}
                  placeholder="Entrez l’indicatif pays, ex : 49"
                  className="mt-3 w-full rounded-xl border border-gray-200 bg-[#faf9f5] px-4 py-3 text-gray-900 outline-none transition focus:border-yellow-500"
                />
              )}

              <p className="mt-2 text-xs text-gray-500">
                Si votre indicatif n’apparaît pas, choisissez{" "}
                <span className="font-medium">Autre pays</span> puis saisissez
                votre code. Exemple : 33, 49, 1.
              </p>

              {erreurs.telephone && (
                <p className="mt-2 text-sm text-red-500">{erreurs.telephone}</p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-700">
                Adresse email
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Ex: client@email.com"
                className="w-full rounded-xl border border-gray-200 bg-[#faf9f5] px-4 py-3 text-gray-900 outline-none transition focus:border-yellow-500"
              />

              {erreurs.email && (
                <p className="mt-2 text-sm text-red-500">{erreurs.email}</p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-700">
                Montant souhaité
              </label>

              <input
                type="number"
                name="montant"
                value={formData.montant}
                onChange={handleChange}
                placeholder="Montant demandé"
                className="w-full rounded-xl border border-gray-200 bg-[#faf9f5] px-4 py-3 text-gray-900 outline-none transition focus:border-yellow-500"
              />

              {erreurs.montant && (
                <p className="mt-2 text-sm text-red-500">{erreurs.montant}</p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-700">
                Type d'objet
              </label>

              <select
                name="typeObjet"
                value={formData.typeObjet}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-200 bg-[#faf9f5] px-4 py-3 text-gray-900 outline-none transition focus:border-yellow-500"
              >
                <option>Téléphone</option>
                <option>Ordinateur</option>
                <option>Bijou</option>
                <option>Électroménager</option>
                <option>Autre</option>
              </select>
            </div>

            <div>
              <label className="mb-3 block text-sm text-gray-700">
                Photo de l'objet
              </label>

              <div className="rounded-2xl border border-gray-200 bg-[#faf9f5] p-6 transition hover:border-yellow-300 hover:bg-white">
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoChange}
                  />

                  <div className="flex flex-col items-center gap-3">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-yellow-500 text-2xl font-bold text-black transition hover:scale-105">
                      +
                    </div>

                    <p className="text-sm text-gray-700">Importer une photo</p>

                    {photoFile && (
                      <p className="text-xs text-green-600">
                        Photo sélectionnée : {photoFile.name}
                      </p>
                    )}

                    {photoPreview && (
                      <div className="mt-4 flex justify-center">
                        <img
                          src={photoPreview}
                          alt="preview"
                          className="h-40 w-40 rounded-xl border border-gray-200 object-cover shadow-sm"
                        />
                      </div>
                    )}

                    <p className="text-xs text-gray-500">JPG ou PNG</p>
                  </div>
                </label>
              </div>

              {erreurs.photo && (
                <p className="mt-2 text-sm text-red-500">{erreurs.photo}</p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-700">
                Description de l'objet
              </label>

              <textarea
                rows="4"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Décrivez l'objet proposé en gage"
                className="w-full rounded-xl border border-gray-200 bg-[#faf9f5] px-4 py-3 text-gray-900 outline-none transition focus:border-yellow-500"
              />

              {erreurs.description && (
                <p className="mt-2 text-sm text-red-500">
                  {erreurs.description}
                </p>
              )}
            </div>
            <div>
              <label className="mb-2 block text-sm text-gray-700">
                Type de pièce d'identité
              </label>

              <select
                name="typePiece"
                value={formData.typePiece}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-200 bg-[#faf9f5] px-4 py-3 text-gray-900 outline-none transition focus:border-yellow-500"
              >
                <option>Carte nationale d'identité</option>
                <option>Passeport</option>
              </select>
            </div>

            <div>
              <label className="mb-3 block text-sm text-gray-700">
                Image ou PDF de la pièce
              </label>

              <div className="rounded-2xl border border-gray-200 bg-[#faf9f5] p-6 transition hover:border-yellow-300 hover:bg-white">
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept=".pdf,image/*"
                    className="hidden"
                    onChange={handleDocumentChange}
                  />

                  <div className="flex flex-col items-center gap-3">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-yellow-500 text-2xl font-bold text-black transition hover:scale-105">
                      +
                    </div>

                    <p className="text-sm text-gray-700">
                      Télécharger la copie de la pièce
                    </p>

                    {documentFile && (
                      <p className="text-xs text-green-600">
                        Fichier sélectionné : {documentFile.name}
                      </p>
                    )}

                    <p className="text-xs text-gray-500">PDF, JPG ou PNG</p>
                  </div>
                </label>
              </div>

              {erreurs.document && (
                <p className="mt-2 text-sm text-red-500">{erreurs.document}</p>
              )}
            </div>

            {messageSucces && (
              <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                {messageSucces}
              </div>
            )}

            {messageErreur && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {messageErreur}
              </div>
            )}

            <button
              type="submit"
              disabled={chargement}
              className="w-full rounded-full bg-yellow-500 py-4 font-semibold text-black transition hover:bg-yellow-400 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-70"
            >
              {chargement ? "Envoi en cours..." : "Envoyer la demande"}
            </button>
          </form>
        </RevealOnScroll>
      </div>
    </section>
  )
}