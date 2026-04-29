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

    setErreurs((prev) => ({
      ...prev,
      [name]: "",
    }))
  }

  const handleDocumentChange = (e) => {
    setDocumentFile(e.target.files[0] || null)
  }

  const handlePhotoChange = (e) => {
    const file = e.target.files[0]
    setPhotoFile(file || null)

    if (file) {
      setPhotoPreview(URL.createObjectURL(file))
    } else {
      setPhotoPreview(null)
    }
  }

  const getFullPhone = () => {
    const code =
      formData.countryCode === "custom"
        ? formData.customCode.replace(/\D/g, "")
        : formData.countryCode

    const phone = formData.telephone.replace(/\D/g, "")

    return `${code}${phone}`
  }

  const formatMontant = (montant) => {
    if (!montant) return ""
    return Number(montant).toLocaleString("fr-FR")
  }

  const validerFormulaire = () => {
    const newErreurs = {}

    if (!formData.nom.trim()) newErreurs.nom = "Le nom est obligatoire"
    if (!formData.telephone.trim()) newErreurs.telephone = "Le téléphone est obligatoire"
    if (!formData.email.trim()) newErreurs.email = "L'email est obligatoire"
    if (!formData.montant || Number(formData.montant) <= 0)
      newErreurs.montant = "Le montant demandé est obligatoire"
    if (!formData.description.trim())
      newErreurs.description = "La description est obligatoire"
    if (formData.countryCode === "custom" && !formData.customCode.trim())
      newErreurs.customCode = "Le code pays est obligatoire"

    setErreurs(newErreurs)
    return Object.keys(newErreurs).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    setMessageSucces("")
    setMessageErreur("")

    if (!validerFormulaire()) {
      setMessageErreur("Veuillez remplir correctement tous les champs obligatoires.")
      return
    }

    setChargement(true)

    try {
      const fullPhone = getFullPhone()

      const messageClient = `Bonjour TAMAL,
Je viens solliciter auprès de vous pour solliciter un prêt.

Nom : ${formData.nom}
Téléphone / WhatsApp : ${fullPhone}
Email : ${formData.email}
Montant demandé : ${formatMontant(formData.montant)} FCFA
Type d'objet : ${formData.typeObjet}
Type de pièce : ${formData.typePiece}
Description : ${formData.description}

Dans l’attente d’une suite favorable, veuillez agréer mes salutations distinguées.`

      const data = new FormData()
      data.append("nom", formData.nom)
      data.append("telephone", fullPhone)
      data.append("email", formData.email)
      data.append("montant", formData.montant)
      data.append("typeObjet", formData.typeObjet)
      data.append("typePiece", formData.typePiece)
      data.append("description", formData.description)
      data.append("messageClient", messageClient)

      if (documentFile) data.append("document", documentFile)
      if (photoFile) data.append("photo", photoFile)

      const response = await fetch(`${API_URL}/api/demandes`, {
        method: "POST",
        body: data,
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || "Erreur lors de l'envoi de la demande")
      }

      setMessageSucces("Votre demande a été envoyée avec succès.")

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
      setErreurs({})
    } catch (error) {
      setMessageErreur(error.message || "Une erreur est survenue. Veuillez réessayer.")
    } finally {
      setChargement(false)
    }
  }

  return (
    <section id="formulaire" className="py-20 bg-slate-50">
      <RevealOnScroll>
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
              Demande de financement
            </h2>
            <p className="mt-4 text-slate-600">
              Remplissez le formulaire ci-dessous pour envoyer votre demande à TAMAL.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-xl p-6 md:p-10 space-y-6">
            {messageSucces && (
              <div className="p-4 rounded-xl bg-green-50 text-green-700 border border-green-200">
                {messageSucces}
              </div>
            )}

            {messageErreur && (
              <div className="p-4 rounded-xl bg-red-50 text-red-700 border border-red-200">
                {messageErreur}
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Nom complet
              </label>
              <input
                type="text"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                placeholder="Votre nom complet"
                className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
              {erreurs.nom && <p className="text-red-500 text-sm mt-1">{erreurs.nom}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Téléphone / WhatsApp
              </label>

              <div className="flex gap-3">
                <select
                  name="countryCode"
                  value={formData.countryCode}
                  onChange={handleChange}
                  className="w-32 border border-slate-300 rounded-xl px-3 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="221">+221</option>
                  <option value="225">+225</option>
                  <option value="223">+223</option>
                  <option value="226">+226</option>
                  <option value="228">+228</option>
                  <option value="229">+229</option>
                  <option value="224">+224</option>
                  <option value="227">+227</option>
                  <option value="custom">Autre</option>
                </select>

                <input
                  type="tel"
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleChange}
                  placeholder="778492779"
                  className="flex-1 border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {formData.countryCode === "custom" && (
                <input
                  type="text"
                  name="customCode"
                  value={formData.customCode}
                  onChange={handleChange}
                  placeholder="Code pays sans +"
                  className="mt-3 w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />
              )}

              {erreurs.telephone && <p className="text-red-500 text-sm mt-1">{erreurs.telephone}</p>}
              {erreurs.customCode && <p className="text-red-500 text-sm mt-1">{erreurs.customCode}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="votre@email.com"
                className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
              {erreurs.email && <p className="text-red-500 text-sm mt-1">{erreurs.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Montant demandé
              </label>
              <input
                type="number"
                name="montant"
                value={formData.montant}
                onChange={handleChange}
                placeholder="60000"
                className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
              {erreurs.montant && <p className="text-red-500 text-sm mt-1">{erreurs.montant}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Type d'objet
              </label>
              <select
                name="typeObjet"
                value={formData.typeObjet}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Téléphone">Téléphone</option>
                <option value="Ordinateur">Ordinateur</option>
                <option value="Tablette">Tablette</option>
                <option value="Électroménager">Électroménager</option>
                <option value="Autre">Autre</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Type de pièce
              </label>
              <select
                name="typePiece"
                value={formData.typePiece}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Carte nationale d'identité">Carte nationale d'identité</option>
                <option value="Passeport">Passeport</option>
                <option value="Permis de conduire">Permis de conduire</option>
                <option value="Carte consulaire">Carte consulaire</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Décrivez votre besoin"
                rows="4"
                className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
              {erreurs.description && <p className="text-red-500 text-sm mt-1">{erreurs.description}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Pièce d'identité
              </label>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleDocumentChange}
                className="w-full border border-slate-300 rounded-xl px-4 py-3"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Photo de l'objet
              </label>
              <input
                type="file"
                accept=".jpg,.jpeg,.png"
                onChange={handlePhotoChange}
                className="w-full border border-slate-300 rounded-xl px-4 py-3"
              />

              {photoPreview && (
                <img
                  src={photoPreview}
                  alt="Aperçu"
                  className="mt-4 w-32 h-32 object-cover rounded-xl border"
                />
              )}
            </div>

            <button
              type="submit"
              disabled={chargement}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-xl transition disabled:opacity-60"
            >
              {chargement ? "Envoi en cours..." : "Envoyer la demande"}
            </button>
          </form>
        </div>
      </RevealOnScroll>
    </section>
  )
}