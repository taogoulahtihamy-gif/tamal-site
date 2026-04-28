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
  const WHATSAPP_ADMIN_NUMBER =
    import.meta.env.VITE_WHATSAPP_ADMIN_NUMBER || "221772616753"

  // ✅ AJOUT CALCUL
  const montantNum = parseFloat(formData.montant) || 0
  const fraisEnvoi = montantNum * 0.01
  const totalAPayer = montantNum + fraisEnvoi

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

  const nettoyerNumero = (numero) => {
    if (!numero) return ""
    return String(numero).replace(/\D/g, "")
  }

  const construireNumeroWhatsApp = (telephone, indicatif) => {
    const numeroNettoye = nettoyerNumero(telephone)
    const indicatifNettoye = nettoyerNumero(indicatif)

    if (!numeroNettoye) return ""
    if (!indicatifNettoye) return numeroNettoye

    if (numeroNettoye.startsWith(indicatifNettoye)) {
      return numeroNettoye
    }

    return `${indicatifNettoye}${numeroNettoye}`
  }

  const construireLienWhatsApp = (numero, message) => {
    const numeroNettoye = nettoyerNumero(numero)
    return `https://wa.me/${numeroNettoye}?text=${encodeURIComponent(message)}`
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

      // ✅ AJOUT BACKEND
      dataToSend.append("fraisEnvoi", fraisEnvoi)
      dataToSend.append("totalAPayer", totalAPayer)

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

      const numeroClientWhatsapp = construireNumeroWhatsApp(
        formData.telephone,
        indicatifFinal
      )

      // ✅ AJOUT MESSAGE
      const messageWhatsApp = [
        "Bonjour TAMAL,",
        "",
        "Je viens d'envoyer une demande de prêt sur gage.",
        "",
        `Nom : ${formData.nom}`,
        `Téléphone / WhatsApp : ${numeroClientWhatsapp || "-"}`,
        `Email : ${formData.email}`,
        `Montant souhaité : ${montantNum.toLocaleString("fr-FR")} FCFA`,
        `Frais (1%) : ${fraisEnvoi.toLocaleString("fr-FR")} FCFA`,
        `Total à rembourser : ${totalAPayer.toLocaleString("fr-FR")} FCFA`,
        `Type d'objet : ${formData.typeObjet}`,
        `Type de pièce : ${formData.typePiece}`,
        `Description : ${formData.description}`,
        "",
        "Merci.",
      ].join("\n")

      const lienWhatsApp = construireLienWhatsApp(
        WHATSAPP_ADMIN_NUMBER,
        messageWhatsApp
      )

      setMessageSucces(
        "Votre demande a bien été envoyée. Vous allez être redirigé vers WhatsApp."
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

      window.location.href = lienWhatsApp

    } catch (error) {
      console.error(error)
      setMessageErreur("Une erreur est survenue lors de l'envoi du formulaire.")
    } finally {
      setChargement(false)
    }
  }

  return (
    <section id="demande" className="border-t border-gray-200 bg-[#f5f3ed] py-20 text-gray-900">
      <div className="mx-auto max-w-3xl px-4">
        <RevealOnScroll>
          <div className="text-center">
            <h3 className="mt-4 text-3xl font-bold md:text-4xl">
              Faire une demande
            </h3>
          </div>
        </RevealOnScroll>

        <RevealOnScroll delay={120}>
          <form onSubmit={handleSubmit} className="mt-12 space-y-6 bg-white p-6 rounded-3xl">

            {/* TON INPUT MONTANT */}
            <input
              type="number"
              name="montant"
              value={formData.montant}
              onChange={handleChange}
              placeholder="Montant demandé"
              className="w-full px-4 py-3 border rounded-xl"
            />

            {/* ✅ FACTURE AJOUTÉE */}
            {montantNum > 0 && (
              <div className="mt-4 p-4 rounded-xl bg-yellow-50 border border-yellow-200 text-sm">
                <div className="flex justify-between">
                  <span>Montant</span>
                  <strong>{montantNum.toLocaleString()} FCFA</strong>
                </div>
                <div className="flex justify-between">
                  <span>Frais (1%)</span>
                  <strong>{fraisEnvoi.toLocaleString()} FCFA</strong>
                </div>
                <div className="border-t my-2"></div>
                <div className="flex justify-between font-bold text-yellow-700">
                  <span>Total</span>
                  <span>{totalAPayer.toLocaleString()} FCFA</span>
                </div>
              </div>
            )}

            <button type="submit">Envoyer</button>

          </form>
        </RevealOnScroll>
      </div>
    </section>
  )
}