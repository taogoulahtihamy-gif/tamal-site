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

// =========================
// ENV
// =========================

const BREVO_API_KEY = process.env.BREVO_API_KEY
const MAIL_FROM = process.env.MAIL_FROM
const MAIL_FROM_NAME = process.env.MAIL_FROM_NAME || "TAMAL"
const MAIL_TO = process.env.MAIL_TO

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

// =========================
// CONFIG UPLOAD
// =========================

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir)
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`)
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
  const autorises = [
    "en attente",
    "acceptée",
    "refusée",
    "remboursée",
  ]

  return autorises.includes(statut)
    ? statut
    : "en attente"
}

const calculerMontantRemboursement = (
  montantAccorde,
  statutPaiement
) => {
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

const calculerEtatCrm = ({
  statut,
  dateRemboursement,
  statutPaiement,
}) => {
  if (statut === "refusée") return "Refusée"
  if (
    statut === "remboursée" ||
    statutPaiement === "payé"
  ) {
    return "Remboursée"
  }

  if (statut === "en attente") {
    return "En attente"
  }

  if (statut === "acceptée") {
    if (!dateRemboursement) {
      return "En cours"
    }

    const now = new Date()
    const echeance = new Date(dateRemboursement)

    const diffMs =
      echeance.getTime() - now.getTime()

    const diffJours = Math.ceil(
      diffMs / (1000 * 60 * 60 * 24)
    )

    if (diffJours < 0) return "En retard"
    if (diffJours <= 2)
      return "Proche remboursement"

    return "En cours"
  }

  return "En attente"
}

const formaterNumero = (
  telephone,
  countryCode = "221"
) => {
  if (!telephone) return null

  const tel = String(telephone)
    .replace(/\D/g, "")
    .trim()

  const code = String(countryCode)
    .replace(/\D/g, "")
    .trim()

  if (!tel) return null

  if (tel.startsWith(code)) {
    return tel
  }

  return `${code}${tel}`
}

// =========================
// EMAIL BREVO
// =========================

const envoyerEmailBrevo = async ({
  to,
  subject,
  htmlContent,
}) => {
  try {
    if (!BREVO_API_KEY || !MAIL_FROM) {
      console.warn(
        "Config email absente."
      )
      return false
    }

    const response = await fetch(
      "https://api.brevo.com/v3/smtp/email",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
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
      }
    )

    if (!response.ok) {
      const err = await response.text()
      console.error(err)
      return false
    }

    return true
  } catch (error) {
    console.error(error)
    return false
  }
}

const envoyerEmailInterne = async (
  demande
) => {
  if (!MAIL_TO) return

  const html = `
  <h2>Nouvelle demande TAMAL</h2>
  <p><strong>Nom :</strong> ${demande.nom}</p>
  <p><strong>Téléphone :</strong> ${demande.telephone}</p>
  <p><strong>Email :</strong> ${demande.email}</p>
  <p><strong>Montant :</strong> ${demande.montant} FCFA</p>
  <p><strong>Objet :</strong> ${demande.typeObjet}</p>
  <p><strong>Statut :</strong> ${demande.statut}</p>
  `

  await envoyerEmailBrevo({
    to: MAIL_TO,
    subject: "Nouvelle demande TAMAL",
    htmlContent: html,
  })
}

const envoyerEmailClientCreation =
  async (demande) => {
    if (!demande.email) return

    const html = `
    <h2>Demande reçue</h2>
    <p>Bonjour ${demande.nom},</p>
    <p>Votre demande a bien été reçue.</p>
    <p>Notre équipe vous contactera rapidement.</p>
    `

    await envoyerEmailBrevo({
      to: demande.email,
      subject:
        "Confirmation de votre demande",
      htmlContent: html,
    })
  }

const envoyerEmailDecisionClient =
  async (demande) => {
    if (!demande.email) return

    if (demande.statut === "acceptée") {
      const html = `
      <h2>Demande acceptée</h2>
      <p>Bonjour ${demande.nom},</p>
      <p>Votre demande a été acceptée.</p>
      <p><strong>Montant accordé :</strong> ${demande.montantAccorde} FCFA</p>
      <p><strong>Montant à rembourser :</strong> ${demande.montantRemboursement} FCFA</p>
      `

      await envoyerEmailBrevo({
        to: demande.email,
        subject:
          "Votre demande a été acceptée",
        htmlContent: html,
      })
    }

    if (demande.statut === "refusée") {
      const html = `
      <h2>Demande refusée</h2>
      <p>Bonjour ${demande.nom},</p>
      <p>Après étude, votre demande n’a pas été retenue.</p>
      `

      await envoyerEmailBrevo({
        to: demande.email,
        subject:
          "Mise à jour de votre demande",
        htmlContent: html,
      })
    }
  }

// =========================
// TEST
// =========================

app.get("/", (req, res) => {
  res.send("Backend TAMAL OK")
})

app.get("/api/test", async (req, res) => {
  try {
    await pool.query("SELECT 1")
    res.json({
      message: "API OK",
    })
  } catch {
    res.status(500).json({
      message: "Erreur DB",
    })
  }
})

// =========================
// DEMANDES
// =========================

app.post(
  "/api/demandes",
  upload.fields([
    {
      name: "document",
      maxCount: 1,
    },
    {
      name: "photo",
      maxCount: 1,
    },
  ]),
  async (req, res) => {
    try {
      const formData = req.body

      const telephone =
        formaterNumero(
          formData.telephone,
          formData.countryCode
        )

      const documentFile =
        req.files?.document?.[0]

      const photoFile =
        req.files?.photo?.[0]

      const result =
        await pool.query(
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
        VALUES
        ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,CURRENT_TIMESTAMP)
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
            formData.nom,
            telephone,
            formData.email,
            Number(
              formData.montant
            ),
            formData.typeObjet,
            formData.typePiece,
            formData.description,
            documentFile
              ? documentFile.filename
              : null,
            photoFile
              ? photoFile.filename
              : null,
            "en attente",
            "En attente",
          ]
        )

      const demande = result.rows[0]

      await Promise.all([
        envoyerEmailInterne(
          demande
        ),
        envoyerEmailClientCreation(
          demande
        ),
      ])

      res.status(201).json({
        message:
          "Demande créée",
        data: demande,
      })
    } catch (error) {
      console.error(error)

      res.status(500).json({
        message:
          "Erreur création demande",
      })
    }
  }
)

app.get(
  "/api/demandes",
  async (req, res) => {
    try {
      const result =
        await pool.query(`
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
    } catch {
      res.status(500).json({
        message:
          "Erreur lecture demandes",
      })
    }
  }
)

app.patch(
  "/api/demandes/:id/statut",
  async (req, res) => {
    try {
      const id = Number(
        req.params.id
      )

      const statutRecu =
        req.body.statut

      const statutPaiement =
        req.body
          .statutPaiement ||
        "non payé"

      const actuel =
        await pool.query(
          `
        SELECT
        id,
        statut,
        nom,
        email,
        montant_accorde AS "montantAccorde"
        FROM demandes
        WHERE id=$1
      `,
          [id]
        )

      if (
        actuel.rowCount === 0
      ) {
        return res
          .status(404)
          .json({
            message:
              "Introuvable",
          })
      }

      const old =
        actuel.rows[0]

      const statut =
        normaliserStatut(
          statutRecu
        )

      let montantAccorde =
        old.montantAccorde

      if (
        statut ===
        "acceptée"
      ) {
        montantAccorde =
          req.body
            .montantAccorde ||
          montantAccorde
      }

      let dateRemboursement =
        null

      if (
        statut ===
          "acceptée" &&
        montantAccorde
      ) {
        const d =
          new Date()

        d.setDate(
          d.getDate() +
            7
        )

        dateRemboursement =
          d.toISOString()
      }

      const montantRemboursement =
        calculerMontantRemboursement(
          montantAccorde,
          statutPaiement
        )

      const statutFinal =
        statutPaiement ===
        "payé"
          ? "remboursée"
          : statut

      const etatCrm =
        calculerEtatCrm({
          statut:
            statutFinal,
          dateRemboursement,
          statutPaiement,
        })

      const result =
        await pool.query(
          `
        UPDATE demandes
        SET
        statut=$1,
        date_remboursement=$2,
        montant_accorde=$3,
        montant_remboursement=$4,
        statut_paiement=$5,
        etat_crm=$6
        WHERE id=$7
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

      const demande =
        result.rows[0]

      const changement =
        (old.statut !==
          "acceptée" &&
          demande.statut ===
            "acceptée") ||
        (old.statut !==
          "refusée" &&
          demande.statut ===
            "refusée")

      if (changement) {
        await envoyerEmailDecisionClient(
          demande
        )
      }

      res.json({
        message:
          "Mis à jour",
        data: demande,
      })
    } catch (error) {
      console.error(error)

      res.status(500).json({
        message:
          "Erreur mise à jour",
      })
    }
  }
)

// =========================
// LOGIN ADMIN
// =========================

app.post(
  "/api/admin/login",
  async (req, res) => {
    try {
      const {
        username,
        password,
      } = req.body

      const result =
        await pool.query(
          `
        SELECT id,username,password,role
        FROM admins
        WHERE username=$1
        AND password=$2
        LIMIT 1
      `,
          [
            username,
            password,
          ]
        )

      const admin =
        result.rows[0]

      if (!admin) {
        return res
          .status(401)
          .json({
            message:
              "Identifiants invalides",
          })
      }

      res.json({
        message:
          "Connexion OK",
        admin: {
          id: admin.id,
          username:
            admin.username,
          role: admin.role,
        },
      })
    } catch {
      res.status(500).json({
        message:
          "Erreur login",
      })
    }
  }
)

// =========================
// ADMINS
// =========================

app.get(
  "/api/admins",
  verifierSuperAdmin,
  async (req, res) => {
    const result =
      await pool.query(`
      SELECT id,username,password,role
      FROM admins
      ORDER BY id ASC
    `)

    res.json(result.rows)
  }
)

app.post(
  "/api/admins",
  verifierSuperAdmin,
  async (req, res) => {
    try {
      const {
        username,
        password,
        role,
      } = req.body

      const existe =
        await pool.query(
          `
        SELECT id
        FROM admins
        WHERE username=$1
      `,
          [username]
        )

      if (
        existe.rowCount > 0
      ) {
        return res
          .status(400)
          .json({
            message:
              "Existe déjà",
          })
      }

      await pool.query(
        `
        INSERT INTO admins
        (username,password,role)
        VALUES($1,$2,$3)
      `,
        [
          username,
          password,
          role,
        ]
      )

      res.json({
        message:
          "Admin ajouté",
      })
    } catch {
      res.status(500).json({
        message:
          "Erreur ajout admin",
      })
    }
  }
)

app.patch(
  "/api/admins/:id/password",
  verifierSuperAdmin,
  async (req, res) => {
    await pool.query(
      `
    UPDATE admins
    SET password=$1
    WHERE id=$2
  `,
      [
        req.body.password,
        req.params.id,
      ]
    )

    res.json({
      message:
        "Mot de passe modifié",
    })
  }
)

app.delete(
  "/api/admins/:id",
  verifierSuperAdmin,
  async (req, res) => {
    await pool.query(
      `
    DELETE FROM admins
    WHERE id=$1
  `,
      [req.params.id]
    )

    res.json({
      message:
        "Admin supprimé",
    })
  }
)

// =========================
// START
// =========================

app.listen(PORT, () => {
  console.log(
    "Serveur lancé sur port " +
      PORT
  )
})