require("dotenv").config()

const express = require("express")
const cors = require("cors")
const multer = require("multer")
const path = require("path")
const fs = require("fs")
const pool = require("./db")

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

const uploadsDir = path.join(__dirname, "uploads")
app.use("/uploads", express.static(uploadsDir))

const ULTRAMSG_INSTANCE_ID = process.env.ULTRAMSG_INSTANCE_ID
const ULTRAMSG_TOKEN = process.env.ULTRAMSG_TOKEN
const WHATSAPP_ADMIN_NUMBER = process.env.WHATSAPP_ADMIN_NUMBER

const BREVO_API_KEY = process.env.BREVO_API_KEY
const MAIL_FROM = process.env.MAIL_FROM
const MAIL_FROM_NAME = process.env.MAIL_FROM_NAME || "TAMAL"
const MAIL_TO = process.env.MAIL_TO

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

// =========================
// CONFIGURATION UPLOAD
// =========================

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir)
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`
    cb(null, uniqueName)
  },
})

const upload = multer({ storage })

// =========================
// MIDDLEWARE
// =========================

const verifierSuperAdmin = (req, res, next) => {
  const role = req.headers["x-admin-role"]

  if (role !== "super_admin") {
    return res.status(403).json({
      message: "Accès refusé. Super admin uniquement.",
    })
  }

  next()
}

// =========================
// HELPERS
// =========================

const normaliserStatut = (statut) => {
  const statutsAutorises = ["en attente", "acceptée", "refusée", "remboursée"]
  return statutsAutorises.includes(statut) ? statut : "en attente"
}

const calculerMontantRemboursement = (montantAccorde, statutPaiement) => {
  if (
    montantAccorde === null ||
    montantAccorde === undefined ||
    montantAccorde === ""
  ) {
    return null
  }

  if (statutPaiement === "payé") {
    return Number(montantAccorde)
  }

  return Math.round(Number(montantAccorde) * 1.3)
}

const calculerEtatCrm = ({ statut, dateRemboursement, statutPaiement }) => {
  if (statut === "refusée") return "Refusée"
  if (statut === "remboursée" || statutPaiement === "payé") return "Remboursée"
  if (statut === "en attente") return "En attente"

  if (statut === "acceptée") {
    if (!dateRemboursement) return "En cours"

    const now = new Date()
    const echeance = new Date(dateRemboursement)

    if (Number.isNaN(echeance.getTime())) return "En cours"

    const diffMs = echeance.getTime() - now.getTime()
    const diffJours = Math.ceil(diffMs / (1000 * 60 * 60 * 24))

    if (diffJours < 0) return "En retard"
    if (diffJours <= 2) return "Proche remboursement"
    return "En cours"
  }

  return "En attente"
}

// =========================
// WHATSAPP NOTIFICATION
// =========================

const envoyerMessageUltraMsg = async ({ to, body }) => {
  try {
    if (!ULTRAMSG_INSTANCE_ID || !ULTRAMSG_TOKEN) {
      console.warn("Configuration UltraMsg absente : WhatsApp ignoré.")
      return false
    }

    if (!to || !body) {
      console.warn("Paramètres WhatsApp incomplets.")
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

    return true
  } catch (error) {
    console.error("Erreur envoi WhatsApp UltraMsg :", error)
    return false
  }
}

/**
 * Convertit différents formats vers un format exploitable par UltraMsg.
 * Exemples acceptés :
 * +221778492779
 * 221778492779
 * 00221778492779
 * 77 849 27 79   -> fallback Sénégal (221) si 9 chiffres
 * (221) 77-849-27-79
 */
const formaterNumeroWhatsApp = (telephone, defaultCountryCode = "221") => {
  if (!telephone) return null

  let brut = String(telephone).trim()

  // Garde uniquement chiffres et +
  brut = brut.replace(/[^\d+]/g, "")

  // +221...  -> 221...
  if (brut.startsWith("+")) {
    brut = brut.slice(1)
  }

  // 00... -> ...
  if (brut.startsWith("00")) {
    brut = brut.slice(2)
  }

  // Si déjà au format international raisonnable
  if (/^\d{10,15}$/.test(brut)) {
    return brut
  }

  // Si numéro local (ex: Sénégal 9 chiffres), on ajoute l'indicatif par défaut
  const digits = brut.replace(/\D/g, "")
  if (/^\d{6,9}$/.test(digits)) {
    return `${defaultCountryCode}${digits}`
  }

  return null
}

const envoyerNotificationWhatsApp = async (demande) => {
  try {
    if (!WHATSAPP_ADMIN_NUMBER) {
      console.warn("WHATSAPP_ADMIN_NUMBER absent : notification admin ignorée.")
      return
    }

    const numeroAdmin = formaterNumeroWhatsApp(WHATSAPP_ADMIN_NUMBER)

    if (!numeroAdmin) {
      console.warn("Numéro admin invalide : notification admin ignorée.")
      return
    }

    const message = [
      "📩 Nouvelle demande TAMAL",
      `Nom : ${demande.nom || "-"}`,
      `Téléphone : ${demande.telephone || "-"}`,
      `Email : ${demande.email || "-"}`,
      `Montant : ${demande.montant || "-"} FCFA`,
      `Objet : ${demande.typeObjet || "-"}`,
      `Statut : ${demande.statut || "-"}`,
      `État CRM : ${demande.etatCrm || "-"}`,
      "➡️ Consultez l’espace admin pour la traiter.",
    ].join("\n")

    const ok = await envoyerMessageUltraMsg({
      to: numeroAdmin,
      body: message,
    })

    if (ok) {
      console.log("Notification WhatsApp admin envoyée avec succès.")
    }
  } catch (error) {
    console.error("Erreur lors de l'envoi de la notification WhatsApp admin :", error)
  }
}

const envoyerWhatsAppClientCreation = async (demande) => {
  try {
    const numeroClient = formaterNumeroWhatsApp(demande.telephone)

    if (!numeroClient) {
      console.warn("Numéro client invalide : WhatsApp création ignoré.")
      return
    }

    const message = [
      `Bonjour ${demande.nom || ""},`,
      "",
      "Votre demande de prêt a bien été reçue par TAMAL.",
      "Notre équipe analyse votre dossier.",
      "Vous recevrez une réponse dans un délai maximum de 24h.",
      "",
      "Merci pour votre confiance.",
      "TAMAL – Service Liquidité Immédiate",
    ].join("\n")

    const ok = await envoyerMessageUltraMsg({
      to: numeroClient,
      body: message,
    })

    if (ok) {
      console.log(`WhatsApp client création envoyé avec succès à ${numeroClient}.`)
    }
  } catch (error) {
    console.error("Erreur lors de l'envoi du WhatsApp client création :", error)
  }
}

const envoyerWhatsAppDecisionClient = async (demande) => {
  try {
    const numeroClient = formaterNumeroWhatsApp(demande.telephone)

    if (!numeroClient) {
      console.warn("Numéro client invalide : WhatsApp décision ignoré.")
      return
    }

    let message = null

    if (demande.statut === "acceptée") {
      message = [
        `Bonjour ${demande.nom || ""},`,
        "",
        "Votre demande TAMAL a été acceptée ✅",
        `Montant accordé : ${demande.montantAccorde || "-"} FCFA`,
        `Montant à rembourser : ${demande.montantRemboursement || "-"} FCFA`,
        `Date de remboursement : ${
          demande.dateRemboursement
            ? new Date(demande.dateRemboursement).toLocaleString("fr-FR")
            : "-"
        }`,
        "",
        "Notre équipe reste disponible pour la suite du traitement.",
        "TAMAL – Service Liquidité Immédiate",
      ].join("\n")
    }

    if (demande.statut === "refusée") {
      message = [
        `Bonjour ${demande.nom || ""},`,
        "",
        "Après étude, votre demande TAMAL n’a pas été retenue pour le moment ❌",
        "Vous pouvez reprendre contact avec notre équipe pour toute précision.",
        "",
        "TAMAL – Service Liquidité Immédiate",
      ].join("\n")
    }

    if (!message) return

    const ok = await envoyerMessageUltraMsg({
      to: numeroClient,
      body: message,
    })

    if (ok) {
      console.log(`WhatsApp client décision envoyé avec succès à ${numeroClient}.`)
    }
  } catch (error) {
    console.error("Erreur lors de l'envoi du WhatsApp client décision :", error)
  }
}
// =========================
// EMAILS BREVO
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

const envoyerEmailInterne = async (demande) => {
  try {
    if (!MAIL_TO) {
      console.warn("MAIL_TO absent : email interne ignoré.")
      return
    }

    const html = `
      <div style="font-family: Arial, sans-serif; color: #111; line-height: 1.6;">
        <h2>Nouvelle demande TAMAL</h2>
        <p>Une nouvelle demande a été envoyée depuis le site.</p>

        <table style="border-collapse: collapse; width: 100%; max-width: 700px;">
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Nom</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">${demande.nom || "-"}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Téléphone</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">${demande.telephone || "-"}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Email</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">${demande.email || "-"}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Montant</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">${demande.montant || "-"} FCFA</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Type d'objet</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">${demande.typeObjet || "-"}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Type de pièce</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">${demande.typePiece || "-"}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Description</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">${demande.description || "-"}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Statut</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">${demande.statut || "-"}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>État CRM</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">${demande.etatCrm || "-"}</td>
          </tr>
        </table>

        <p style="margin-top: 20px;">Connectez-vous à l’espace admin pour traiter cette demande.</p>
      </div>
    `

    await envoyerEmailBrevo({
      to: MAIL_TO,
      subject: `Nouvelle demande TAMAL - ${demande.nom || "Client"}`,
      htmlContent: html,
    })
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email interne :", error)
  }
}

const envoyerEmailClientCreation = async (demande) => {
  try {
    if (!demande.email) {
      console.warn("Adresse email client absente : email client ignoré.")
      return
    }

    const html = `
      <div style="font-family: Arial, sans-serif; color: #111; line-height: 1.6;">
        <h2>Votre demande a bien été reçue</h2>

        <p>Bonjour ${demande.nom || ""},</p>

        <p>
          Nous confirmons la bonne réception de votre demande de prêt sur gage
          sur le site TAMAL.
        </p>

        <p>
          Notre équipe va étudier votre dossier et vous contacter rapidement.
        </p>

        <div style="margin: 20px 0; padding: 16px; background: #f8f8f6; border: 1px solid #e5e5e5; border-radius: 12px;">
          <p style="margin: 0 0 8px;"><strong>Montant demandé :</strong> ${demande.montant || "-"} FCFA</p>
          <p style="margin: 0 0 8px;"><strong>Type d'objet :</strong> ${demande.typeObjet || "-"}</p>
          <p style="margin: 0;"><strong>Statut initial :</strong> ${demande.statut || "en attente"}</p>
        </div>

        <p>Merci pour votre confiance.</p>

        <p>
          <strong>TAMAL</strong><br />
          Service Liquidité Immédiate
        </p>
      </div>
    `

    await envoyerEmailBrevo({
      to: demande.email,
      subject: "Confirmation de votre demande TAMAL",
      htmlContent: html,
    })
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email client :", error)
  }
}

const envoyerEmailDecisionClient = async (demande) => {
  try {
    if (!demande.email) {
      console.warn("Pas d'email client pour notification décision.")
      return
    }

    if (demande.statut === "acceptée") {
      const html = `
        <div style="font-family: Arial, sans-serif; color: #111; line-height: 1.6;">
          <h2>Votre demande a été acceptée</h2>

          <p>Bonjour ${demande.nom || ""},</p>

          <p>
            Nous vous informons que votre demande de prêt sur gage a été
            <strong> acceptée</strong>.
          </p>

          <div style="margin: 20px 0; padding: 16px; background: #f8f8f6; border: 1px solid #e5e5e5; border-radius: 12px;">
            <p style="margin: 0 0 8px;"><strong>Montant accordé :</strong> ${demande.montantAccorde || "-"} FCFA</p>
            <p style="margin: 0 0 8px;"><strong>Montant à rembourser :</strong> ${demande.montantRemboursement || "-"} FCFA</p>
            <p style="margin: 0;"><strong>Date de remboursement :</strong> ${
              demande.dateRemboursement
                ? new Date(demande.dateRemboursement).toLocaleString("fr-FR")
                : "-"
            }</p>
          </div>

          <p>Notre équipe reste disponible pour la suite du traitement.</p>

          <p>
            <strong>TAMAL</strong><br />
            Service Liquidité Immédiate
          </p>
        </div>
      `

      await envoyerEmailBrevo({
        to: demande.email,
        subject: "Votre demande TAMAL a été acceptée",
        htmlContent: html,
      })
    }

    if (demande.statut === "refusée") {
      const html = `
        <div style="font-family: Arial, sans-serif; color: #111; line-height: 1.6;">
          <h2>Votre demande n’a pas été retenue</h2>

          <p>Bonjour ${demande.nom || ""},</p>

          <p>
            Après étude, votre demande de prêt sur gage n’a pas pu être retenue
            pour le moment.
          </p>

          <p>
            Vous pouvez reprendre contact avec notre équipe pour toute précision.
          </p>

          <p>
            <strong>TAMAL</strong><br />
            Service Liquidité Immédiate
          </p>
        </div>
      `

      await envoyerEmailBrevo({
        to: demande.email,
        subject: "Mise à jour de votre demande TAMAL",
        htmlContent: html,
      })
    }
  } catch (error) {
    console.error("Erreur envoi email décision client :", error)
  }
}

// =========================
// ROUTES TEST
// =========================

app.get("/", (req, res) => {
  res.send("Backend TAMAL en cours de fonctionnement")
})

app.get("/api/test", async (req, res) => {
  try {
    await pool.query("SELECT 1")
    res.json({ message: "API TAMAL OK" })
  } catch (error) {
    console.error("Erreur test base :", error)
    res.status(500).json({ message: "Connexion base de données échouée" })
  }
})

// =========================
// ROUTES DEMANDES
// =========================

app.post(
  "/api/demandes",
  upload.fields([
    { name: "document", maxCount: 1 },
    { name: "photo", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const formData = req.body
      const documentFile = req.files?.document ? req.files.document[0] : null
      const photoFile = req.files?.photo ? req.files.photo[0] : null

      const statut = "en attente"
      const etatCrm = "En attente"

      const result = await pool.query(
        `
        INSERT INTO demandes
        (
          nom,
          telephone,
          email,
          montant,
          typeobjet,
          typepiece,
          description,
          document,
          photo,
          statut,
          etat_crm,
          datecreation
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, CURRENT_TIMESTAMP)
        RETURNING
          id,
          nom,
          telephone,
          email,
          montant,
          typeobjet AS "typeObjet",
          typepiece AS "typePiece",
          description,
          document,
          photo,
          statut,
          etat_crm AS "etatCrm",
          datecreation AS "dateCreation"
        `,
        [
          formData.nom || null,
          formData.telephone || null,
          formData.email || null,
          formData.montant ? Number(formData.montant) : null,
          formData.typeObjet || null,
          formData.typePiece || null,
          formData.description || null,
          documentFile ? documentFile.filename : null,
          photoFile ? photoFile.filename : null,
          statut,
          etatCrm,
        ]
      )

      const demande = result.rows[0]

     await Promise.all([
  envoyerNotificationWhatsApp(demande),
  envoyerWhatsAppClientCreation(demande),
  envoyerEmailInterne(demande),
  envoyerEmailClientCreation(demande),
])
      res.status(201).json({
        message: "Demande reçue avec succès",
        data: demande,
      })
    } catch (error) {
      console.error("Erreur lors de la création de la demande :", error)
      res.status(500).json({
        message: "Erreur serveur lors de l'envoi de la demande",
      })
    }
  }
)

app.get("/api/demandes", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        id,
        nom,
        telephone,
        email,
        montant,
        typeobjet AS "typeObjet",
        typepiece AS "typePiece",
        description,
        document,
        photo,
        statut,
        datecreation AS "dateCreation",
        date_remboursement AS "dateRemboursement",
        etat_crm AS "etatCrm",
        montant_accorde AS "montantAccorde",
        montant_remboursement AS "montantRemboursement",
        statut_paiement AS "statutPaiement",
        date_dernier_rappel AS "dateDernierRappel"
      FROM demandes
      ORDER BY id DESC
    `)

    res.json(result.rows)
  } catch (error) {
    console.error("Erreur lors de la lecture des demandes :", error)
    res.status(500).json({
      message: "Erreur serveur lors de la lecture des demandes",
    })
  }
})

app.patch("/api/demandes/:id/statut", async (req, res) => {
  try {
    const id = Number(req.params.id)
    const statutRecu = req.body?.statut
    const statutPaiement = req.body?.statutPaiement || "non payé"

    if (!statutRecu) {
      return res.status(400).json({ message: "Le statut est obligatoire" })
    }

    const actuelResult = await pool.query(
      `
      SELECT
        id,
        nom,
        email,
        montant_accorde AS "montantAccorde",
        statut
      FROM demandes
      WHERE id = $1
      LIMIT 1
      `,
      [id]
    )

    if (actuelResult.rowCount === 0) {
      return res.status(404).json({ message: "Demande introuvable" })
    }

    const actuel = actuelResult.rows[0]
    const statut = normaliserStatut(statutRecu)

    let montantAccorde = actuel.montantAccorde

    if (statut === "acceptée" && (montantAccorde === null || montantAccorde === undefined)) {
      const montantAccordeRecu =
        req.body?.montantAccorde !== undefined && req.body?.montantAccorde !== ""
          ? Number(req.body.montantAccorde)
          : null

      if (!montantAccordeRecu) {
        return res.status(400).json({
          message: "Le montant accordé est obligatoire pour accepter une demande.",
        })
      }

      montantAccorde = montantAccordeRecu
    }

    let dateRemboursement = req.body?.dateRemboursement || null

    // DATE AUTOMATIQUE
    if (statut === "acceptée" && montantAccorde) {
      const baseDate = new Date()
      const nbJours = Number(montantAccorde) >= 30000 ? 14 : 7
      baseDate.setDate(baseDate.getDate() + nbJours)
      dateRemboursement = baseDate.toISOString()
    }

    const montantRemboursement = calculerMontantRemboursement(
      montantAccorde,
      statutPaiement
    )

    const statutFinal = statutPaiement === "payé" ? "remboursée" : statut

    const etatCrm = calculerEtatCrm({
      statut: statutFinal,
      dateRemboursement,
      statutPaiement,
    })

    const result = await pool.query(
      `
      UPDATE demandes
      SET
        statut = $1,
        date_remboursement = $2,
        montant_accorde = $3,
        montant_remboursement = $4,
        statut_paiement = $5,
        etat_crm = $6
      WHERE id = $7
      RETURNING
        id,
        nom,
        telephone,
        email,
        montant,
        typeobjet AS "typeObjet",
        typepiece AS "typePiece",
        description,
        document,
        photo,
        statut,
        datecreation AS "dateCreation",
        date_remboursement AS "dateRemboursement",
        etat_crm AS "etatCrm",
        montant_accorde AS "montantAccorde",
        montant_remboursement AS "montantRemboursement",
        statut_paiement AS "statutPaiement",
        date_dernier_rappel AS "dateDernierRappel"
      `,
      [
        statutFinal,
        dateRemboursement,
        montantAccorde,
        montantRemboursement,
        statutPaiement,
        etatCrm,
        id,
      ]
    )

    const demandeMAJ = result.rows[0]

    const changementDecision =
  (actuel.statut !== "acceptée" && demandeMAJ.statut === "acceptée") ||
  (actuel.statut !== "refusée" && demandeMAJ.statut === "refusée")

if (changementDecision) {
  await Promise.all([
    envoyerEmailDecisionClient(demandeMAJ),
    envoyerWhatsAppDecisionClient(demandeMAJ),
  ])
}

    res.json({
      message: "Statut mis à jour avec succès",
      data: demandeMAJ,
    })
  } catch (error) {
    console.error("Erreur lors de la mise à jour du statut :", error)
    res.status(500).json({
      message: "Erreur serveur lors de la mise à jour du statut",
    })
  }
})

// =========================
// ROUTES AUTH ADMIN
// =========================

app.post("/api/admin/login", async (req, res) => {
  try {
    const { username, password } = req.body

    if (!username || !password) {
      return res.status(400).json({
        message: "Nom d'utilisateur et mot de passe requis.",
      })
    }

    const result = await pool.query(
      `
      SELECT id, username, password, role
      FROM admins
      WHERE username = $1 AND password = $2
      LIMIT 1
      `,
      [username, password]
    )

    const admin = result.rows[0]

    if (!admin) {
      return res.status(401).json({
        message: "Identifiants invalides.",
      })
    }

    return res.json({
      message: "Connexion réussie.",
      admin: {
        id: admin.id,
        username: admin.username,
        role: admin.role,
      },
    })
  } catch (error) {
    console.error("Erreur login admin :", error)
    return res.status(500).json({ message: "Erreur serveur." })
  }
})

app.get("/api/admins", verifierSuperAdmin, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, username, password, role
      FROM admins
      ORDER BY id ASC
    `)

    res.json(result.rows)
  } catch (error) {
    console.error("Erreur lecture admins :", error)
    res.status(500).json({
      message: "Erreur lors de la récupération des admins.",
    })
  }
})

app.post("/api/admins", verifierSuperAdmin, async (req, res) => {
  try {
    const { username, password, role } = req.body

    if (!username || !password || !role) {
      return res.status(400).json({
        message: "Tous les champs sont requis.",
      })
    }

    if (!["super_admin", "admin"].includes(role)) {
      return res.status(400).json({
        message: "Rôle invalide.",
      })
    }

    const adminExiste = await pool.query(
      "SELECT id FROM admins WHERE username = $1 LIMIT 1",
      [username]
    )

    if (adminExiste.rowCount > 0) {
      return res.status(400).json({
        message: "Ce nom d'utilisateur existe déjà.",
      })
    }

    const result = await pool.query(
      `
      INSERT INTO admins (username, password, role)
      VALUES ($1, $2, $3)
      RETURNING id, username, role
      `,
      [username, password, role]
    )

    res.status(201).json({
      message: "Admin ajouté avec succès.",
      admin: result.rows[0],
    })
  } catch (error) {
    console.error("Erreur ajout admin :", error)
    res.status(500).json({
      message: "Erreur lors de l'ajout de l'admin.",
    })
  }
})

app.patch("/api/admins/:id/password", verifierSuperAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id)
    const { password } = req.body

    if (!password) {
      return res.status(400).json({
        message: "Le nouveau mot de passe est requis.",
      })
    }

    const result = await pool.query(
      `
      UPDATE admins
      SET password = $1
      WHERE id = $2
      RETURNING id
      `,
      [password, id]
    )

    if (result.rowCount === 0) {
      return res.status(404).json({
        message: "Admin introuvable.",
      })
    }

    res.json({
      message: "Mot de passe mis à jour avec succès.",
    })
  } catch (error) {
    console.error("Erreur modification mot de passe :", error)
    res.status(500).json({
      message: "Erreur lors de la modification du mot de passe.",
    })
  }
})

app.delete("/api/admins/:id", verifierSuperAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id)

    const adminResult = await pool.query(
      "SELECT id, role FROM admins WHERE id = $1 LIMIT 1",
      [id]
    )

    const adminASupprimer = adminResult.rows[0]

    if (!adminASupprimer) {
      return res.status(404).json({
        message: "Admin introuvable.",
      })
    }

    if (adminASupprimer.role === "super_admin") {
      return res.status(400).json({
        message: "Impossible de supprimer un super admin.",
      })
    }

    await pool.query("DELETE FROM admins WHERE id = $1", [id])

    res.json({
      message: "Admin supprimé avec succès.",
    })
  } catch (error) {
    console.error("Erreur suppression admin :", error)
    res.status(500).json({
      message: "Erreur lors de la suppression.",
    })
  }
})

app.get("/api/debug-admins", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, username, role FROM admins ORDER BY id ASC"
    )
    res.json(result.rows)
  } catch (error) {
    console.error("Erreur debug admins :", error)
    res.status(500).json({ message: error.message })
  }
})

app.listen(PORT, () => {
  console.log("Serveur backend lancé sur le port " + PORT)
})