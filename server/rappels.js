require("dotenv").config()
const pool = require("./db")

// =========================
// ENV
// =========================

const WHATSAPP_PROVIDER = process.env.WHATSAPP_PROVIDER || "disabled"
const WHATSAPP_ADMIN_NUMBER = process.env.WHATSAPP_ADMIN_NUMBER

const ULTRAMSG_INSTANCE_ID = process.env.ULTRAMSG_INSTANCE_ID
const ULTRAMSG_TOKEN = process.env.ULTRAMSG_TOKEN

const META_ACCESS_TOKEN = process.env.META_ACCESS_TOKEN
const META_PHONE_NUMBER_ID = process.env.META_PHONE_NUMBER_ID

const BREVO_API_KEY = process.env.BREVO_API_KEY
const MAIL_FROM = process.env.MAIL_FROM
const MAIL_FROM_NAME = process.env.MAIL_FROM_NAME || "TAMAL"
const MAIL_TO = process.env.MAIL_TO

// =========================
// HELPERS
// =========================

const formaterNumeroWhatsApp = (telephone, defaultCountryCode = "221") => {
  if (!telephone) return null

  let brut = String(telephone).trim()
  brut = brut.replace(/[^\d+]/g, "")

  if (brut.startsWith("+")) {
    brut = brut.slice(1)
  }

  if (brut.startsWith("00")) {
    brut = brut.slice(2)
  }

  if (/^\d{10,15}$/.test(brut)) {
    return brut
  }

  const digits = brut.replace(/\D/g, "")
  if (/^\d{6,9}$/.test(digits)) {
    return `${defaultCountryCode}${digits}`
  }

  return null
}

const formaterMontant = (montant) => {
  if (montant === null || montant === undefined || montant === "") return "-"
  return `${Number(montant).toLocaleString("fr-FR")} FCFA`
}

const formaterDate = (date) => {
  if (!date) return "-"
  try {
    return new Date(date).toLocaleString("fr-FR", {
      timeZone: "Africa/Dakar",
    })
  } catch {
    return "-"
  }
}

// =========================
// WHATSAPP
// =========================

const envoyerMessageWhatsAppMeta = async ({ to, body }) => {
  try {
    if (!META_ACCESS_TOKEN || !META_PHONE_NUMBER_ID) {
      console.warn("META_ACCESS_TOKEN ou META_PHONE_NUMBER_ID manquant.")
      return false
    }

    const response = await fetch(
      `https://graph.facebook.com/v25.0/${META_PHONE_NUMBER_ID}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${META_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to,
          type: "text",
          text: { body },
        }),
      }
    )

    const data = await response.text()

    if (!response.ok) {
      console.error("Erreur WhatsApp Meta :", data)
      return false
    }

    console.log("Message WhatsApp Meta envoyé :", data)
    return true
  } catch (error) {
    console.error("Erreur envoi WhatsApp Meta :", error)
    return false
  }
}

const envoyerMessageWhatsAppUltraMsg = async ({ to, body }) => {
  try {
    if (!ULTRAMSG_INSTANCE_ID || !ULTRAMSG_TOKEN) {
      console.warn("ULTRAMSG_INSTANCE_ID ou ULTRAMSG_TOKEN manquant.")
      return false
    }

    const payload = new URLSearchParams({
      token: ULTRAMSG_TOKEN,
      to,
      body,
    })

    const response = await fetch(
      `https://api.ultramsg.com/${ULTRAMSG_INSTANCE_ID}/messages/chat`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: payload.toString(),
      }
    )

    const data = await response.text()

    if (!response.ok) {
      console.error("Erreur UltraMsg :", data)
      return false
    }

    console.log("Message WhatsApp UltraMsg envoyé :", data)
    return true
  } catch (error) {
    console.error("Erreur envoi WhatsApp UltraMsg :", error)
    return false
  }
}

const envoyerMessageWhatsApp = async ({ to, body }) => {
  try {
    if (WHATSAPP_PROVIDER === "disabled") {
      console.warn("WhatsApp désactivé.")
      return false
    }

    if (!to || !body) return false

    if (WHATSAPP_PROVIDER === "meta") {
      return await envoyerMessageWhatsAppMeta({ to, body })
    }

    if (WHATSAPP_PROVIDER === "ultramsg") {
      return await envoyerMessageWhatsAppUltraMsg({ to, body })
    }

    console.warn(`Provider WhatsApp inconnu : ${WHATSAPP_PROVIDER}`)
    return false
  } catch (error) {
    console.error("Erreur routeur WhatsApp :", error)
    return false
  }
}

// =========================
// EMAILS
// =========================

const envoyerEmailBrevo = async ({ to, subject, htmlContent }) => {
  try {
    if (!BREVO_API_KEY || !MAIL_FROM) {
      console.warn("Configuration Brevo absente : email ignoré.")
      return false
    }

    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": BREVO_API_KEY,
        Accept: "application/json",
      },
      body: JSON.stringify({
        sender: {
          name: MAIL_FROM_NAME,
          email: MAIL_FROM,
        },
        to: [{ email: to }],
        subject,
        htmlContent,
      }),
    })

    const data = await response.text()

    if (!response.ok) {
      console.error("Erreur API Brevo :", data)
      return false
    }

    console.log(`Email Brevo envoyé avec succès à ${to}.`)
    return true
  } catch (error) {
    console.error("Erreur lors de l'envoi via Brevo :", error)
    return false
  }
}

// =========================
// RAPPELS
// =========================

const envoyerRappelClient = async (demande) => {
  try {
    const numeroClient = formaterNumeroWhatsApp(demande.telephone)

    const messageWhatsApp = [
      `Bonjour ${demande.nom || ""},`,
      "",
      "Ceci est un rappel concernant votre dossier TAMAL.",
      `Montant à rembourser : ${formaterMontant(demande.montantRemboursement)}`,
      `Date prévue : ${formaterDate(demande.dateRemboursement)}`,
      "",
      "Merci de prendre les dispositions nécessaires.",
      "TAMAL – Service Liquidité Immédiate",
    ].join("\n")

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; color: #111; line-height: 1.6;">
        <h2>Rappel de remboursement TAMAL</h2>
        <p>Bonjour ${demande.nom || ""},</p>
        <p>Ceci est un rappel concernant votre dossier TAMAL.</p>

        <div style="margin: 20px 0; padding: 16px; background: #f8f8f6; border: 1px solid #e5e5e5; border-radius: 12px;">
          <p style="margin: 0 0 8px;"><strong>Montant à rembourser :</strong> ${formaterMontant(demande.montantRemboursement)}</p>
          <p style="margin: 0;"><strong>Date prévue :</strong> ${formaterDate(demande.dateRemboursement)}</p>
        </div>

        <p>Merci de prendre les dispositions nécessaires.</p>
        <p><strong>TAMAL</strong><br />Service Liquidité Immédiate</p>
      </div>
    `

    await Promise.all([
      numeroClient
        ? envoyerMessageWhatsApp({
            to: numeroClient,
            body: messageWhatsApp,
          })
        : Promise.resolve(false),

      demande.email
        ? envoyerEmailBrevo({
            to: demande.email,
            subject: "Rappel de remboursement TAMAL",
            htmlContent: emailHtml,
          })
        : Promise.resolve(false),
    ])
  } catch (error) {
    console.error("Erreur rappel client :", error)
  }
}

const envoyerNotificationAdminRappel = async (demande) => {
  try {
    if (!WHATSAPP_ADMIN_NUMBER && !MAIL_TO) return

    const messageAdmin = [
      "⏰ Rappel TAMAL déclenché",
      `Client : ${demande.nom || "-"}`,
      `Téléphone : ${demande.telephone || "-"}`,
      `Montant à rembourser : ${formaterMontant(demande.montantRemboursement)}`,
      `Date prévue : ${formaterDate(demande.dateRemboursement)}`,
      `Statut : ${demande.statut || "-"}`,
      `État CRM : ${demande.etatCrm || "-"}`,
    ].join("\n")

    const numeroAdmin = formaterNumeroWhatsApp(WHATSAPP_ADMIN_NUMBER)

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; color: #111; line-height: 1.6;">
        <h2>Rappel TAMAL déclenché</h2>
        <p>Un rappel client vient d'être envoyé.</p>

        <table style="border-collapse: collapse; width: 100%; max-width: 700px;">
          <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Client</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${demande.nom || "-"}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Téléphone</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${demande.telephone || "-"}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Montant à rembourser</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${formaterMontant(demande.montantRemboursement)}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Date prévue</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${formaterDate(demande.dateRemboursement)}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Statut</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${demande.statut || "-"}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>État CRM</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${demande.etatCrm || "-"}</td></tr>
        </table>
      </div>
    `

    await Promise.all([
      numeroAdmin
        ? envoyerMessageWhatsApp({
            to: numeroAdmin,
            body: messageAdmin,
          })
        : Promise.resolve(false),

      MAIL_TO
        ? envoyerEmailBrevo({
            to: MAIL_TO,
            subject: `Rappel TAMAL - ${demande.nom || "Client"}`,
            htmlContent: emailHtml,
          })
        : Promise.resolve(false),
    ])
  } catch (error) {
    console.error("Erreur notification admin rappel :", error)
  }
}

// =========================
// EXECUTION
// =========================

const lancerRappels = async () => {
  try {
    console.log("Début des rappels TAMAL...")

    const result = await pool.query(`
      SELECT
        id,
        nom,
        telephone,
        email,
        statut,
        etat_crm AS "etatCrm",
        montant_remboursement AS "montantRemboursement",
        date_remboursement AS "dateRemboursement",
        date_dernier_rappel AS "dateDernierRappel"
      FROM demandes
      WHERE statut = 'acceptée'
        AND statut_paiement = 'non payé'
        AND date_remboursement IS NOT NULL
        AND date_remboursement <= NOW() + INTERVAL '2 days'
        AND (
          date_dernier_rappel IS NULL
          OR date_dernier_rappel < NOW() - INTERVAL '12 hours'
        )
      ORDER BY date_remboursement ASC
    `)

    const demandes = result.rows || []

    console.log(`${demandes.length} rappel(s) à traiter.`)

    for (const demande of demandes) {
      console.log(`Traitement rappel demande #${demande.id}...`)

      await envoyerRappelClient(demande)
      await envoyerNotificationAdminRappel(demande)

      await pool.query(
        `
        UPDATE demandes
        SET date_dernier_rappel = NOW()
        WHERE id = $1
        `,
        [demande.id]
      )

      console.log(`Rappel envoyé pour demande #${demande.id}.`)
    }

    console.log("Fin des rappels TAMAL.")
    process.exit(0)
  } catch (error) {
    console.error("Erreur globale rappels TAMAL :", error)
    process.exit(1)
  }
}

lancerRappels()