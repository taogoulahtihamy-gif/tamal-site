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

    const statutFinal =
      statutPaiement === "payé" ? "remboursée" : statut

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
      await envoyerEmailDecisionClient(demandeMAJ)
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