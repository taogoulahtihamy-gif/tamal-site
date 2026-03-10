require("dotenv").config()

const pool = require("./db")

const BREVO_API_KEY = process.env.BREVO_API_KEY
const MAIL_FROM = process.env.MAIL_FROM
const MAIL_FROM_NAME = process.env.MAIL_FROM_NAME || "TAMAL"

const parseDateFr = (date) => {
  if (!date) return "-"
  return new Date(date).toLocaleString("fr-FR")
}

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

    console.log(`Rappel email envoyé à ${to}.`)
    return true
  } catch (error) {
    console.error("Erreur lors de l'envoi du rappel email :", error)
    return false
  }
}

const mettreAJourEtatCRM = async () => {
  await pool.query(`
    UPDATE demandes
    SET etat_crm =
      CASE
        WHEN statut = 'remboursée' THEN 'Remboursée'
        WHEN statut = 'refusée' THEN 'Refusée'
        WHEN date_remboursement IS NULL THEN 'En attente'
        WHEN date_remboursement < NOW() AND statut <> 'remboursée' THEN 'En retard'
        WHEN date_remboursement <= NOW() + INTERVAL '2 days' AND statut <> 'remboursée' THEN 'Proche remboursement'
        ELSE 'En cours'
      END
  `)
}

const getSujetEtMessage = (demande) => {
  const dateRemboursement = new Date(demande.dateRemboursement)
  const maintenant = new Date()
  const diffMs = dateRemboursement - maintenant
  const diffJours = Math.ceil(diffMs / (1000 * 60 * 60 * 24))

  if (diffJours < 0) {
    return {
      sujet: "TAMAL - Rappel de paiement en retard",
      titre: "Votre paiement est en retard",
      intro:
        "Nous vous informons que la date d’échéance de votre prêt est dépassée.",
    }
  }

  if (diffJours === 0) {
    return {
      sujet: "TAMAL - Échéance de paiement aujourd’hui",
      titre: "Votre échéance est aujourd’hui",
      intro:
        "Nous vous rappelons que votre paiement arrive à échéance aujourd’hui.",
    }
  }

  return {
    sujet: "TAMAL - Rappel de paiement à venir",
    titre: "Votre échéance approche",
    intro:
      "Nous vous rappelons que votre paiement arrive bientôt à échéance.",
  }
}

const envoyerRappels = async () => {
  try {
    await mettreAJourEtatCRM()

    const result = await pool.query(`
      SELECT
        id,
        nom,
        email,
        telephone,
        montant,
        montant_remboursement AS "montantRemboursement",
        date_remboursement AS "dateRemboursement",
        statut,
        statut_paiement AS "statutPaiement",
        etat_crm AS "etatCrm",
        date_dernier_rappel AS "dateDernierRappel"
      FROM demandes
      WHERE statut = 'acceptée'
        AND COALESCE(statut_paiement, 'non payé') <> 'payé'
        AND date_remboursement IS NOT NULL
        AND etat_crm IN ('Proche remboursement', 'En retard')
        AND (
          date_dernier_rappel IS NULL
          OR date_dernier_rappel < NOW() - INTERVAL '24 hours'
        )
      ORDER BY date_remboursement ASC
    `)

    if (result.rows.length === 0) {
      console.log("Aucun rappel à envoyer.")
      return
    }

    console.log(`${result.rows.length} rappel(s) à envoyer.`)

    for (const demande of result.rows) {
      if (!demande.email) {
        console.warn(`Demande ${demande.id} sans email client : rappel ignoré.`)
        continue
      }

      const contenu = getSujetEtMessage(demande)

      const html = `
        <div style="font-family: Arial, sans-serif; color: #111; line-height: 1.6;">
          <h2>${contenu.titre}</h2>

          <p>Bonjour ${demande.nom || ""},</p>

          <p>${contenu.intro}</p>

          <div style="margin: 20px 0; padding: 16px; background: #f8f8f6; border: 1px solid #e5e5e5; border-radius: 12px;">
            <p style="margin: 0 0 8px;"><strong>Montant initial :</strong> ${demande.montant || "-"} FCFA</p>
            <p style="margin: 0 0 8px;"><strong>Montant à rembourser :</strong> ${demande.montantRemboursement || "-"} FCFA</p>
            <p style="margin: 0 0 8px;"><strong>Date d’échéance :</strong> ${parseDateFr(demande.dateRemboursement)}</p>
            <p style="margin: 0;"><strong>État :</strong> ${demande.etatCrm || "-"}</p>
          </div>

          <p>
            Merci de prendre les dispositions nécessaires dans les meilleurs délais.
          </p>

          <p>
            <strong>TAMAL</strong><br />
            Service Liquidité Immédiate
          </p>
        </div>
      `

      const emailEnvoye = await envoyerEmailBrevo({
        to: demande.email,
        subject: contenu.sujet,
        htmlContent: html,
      })

      if (emailEnvoye) {
        await pool.query(
          `
          UPDATE demandes
          SET date_dernier_rappel = NOW()
          WHERE id = $1
          `,
          [demande.id]
        )
      }
    }

    console.log("Traitement des rappels terminé.")
  } catch (error) {
    console.error("Erreur générale rappels :", error)
    process.exit(1)
  } finally {
    await pool.end()
  }
}

envoyerRappels()