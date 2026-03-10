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
    const uniqueName = Date.now() + "-" + file.originalname
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
// WHATSAPP NOTIFICATION
// =========================

const envoyerNotificationWhatsApp = async (demande) => {
  try {
    if (!ULTRAMSG_INSTANCE_ID || !ULTRAMSG_TOKEN || !WHATSAPP_ADMIN_NUMBER) {
      console.warn("Configuration UltraMsg absente : notification WhatsApp ignorée.")
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
      "➡️ Consultez l’espace admin pour la traiter.",
    ].join("\n")

    const body = new URLSearchParams({
      token: ULTRAMSG_TOKEN,
      to: WHATSAPP_ADMIN_NUMBER,
      body: message,
    })

    const response = await fetch(
      `https://api.ultramsg.com/${ULTRAMSG_INSTANCE_ID}/messages/chat`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: body.toString(),
      }
    )

    const data = await response.text()

    if (!response.ok) {
      console.error("Erreur envoi WhatsApp UltraMsg :", data)
      return
    }

    console.log("Notification WhatsApp envoyée avec succès.")
  } catch (error) {
    console.error("Erreur lors de l'envoi de la notification WhatsApp :", error)
  }
}

// =========================
// EMAILS BREVO
// =========================


const envoyerEmailBrevo = async ({ to, subject, htmlContent }) => {
  try {
    if (!BREVO_API_KEY || !MAIL_FROM) {
      console.warn("Configuration Brevo absente : email ignoré.")
      return
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
      return
    }

    console.log(`Email Brevo envoyé avec succès à ${to}.`)
  } catch (error) {
    console.error("Erreur lors de l'envoi via Brevo :", error)
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

const envoyerEmailClient = async (demande) => {
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

      const result = await pool.query(
        `
        INSERT INTO demandes
        (nom, telephone, email, montant, typeobjet, typepiece, description, document, photo, statut, datecreation)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'en attente', CURRENT_TIMESTAMP)
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
        ]
      )

      const demande = result.rows[0]

      console.log("Nouvelle demande reçue :")
      console.log(demande)

      await Promise.all([
        envoyerNotificationWhatsApp(demande),
        envoyerEmailInterne(demande),
        envoyerEmailClient(demande),
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
    const statut = req.body?.statut

    if (!statut) {
      return res.status(400).json({ message: "Le statut est obligatoire" })
    }

    const result = await pool.query(
      `
      UPDATE demandes
      SET statut = $1
      WHERE id = $2
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
        datecreation AS "dateCreation"
      `,
      [statut, id]
    )

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Demande introuvable" })
    }

    res.json({
      message: "Statut mis à jour avec succès",
      data: result.rows[0],
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

// =========================
// ROUTES GESTION ADMINS
// =========================

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