const express = require("express")
const cors = require("cors")
const multer = require("multer")
const path = require("path")
const fs = require("fs")

const app = express()
const PORT = 5000

app.use(cors())
app.use(express.json())
app.use("/uploads", express.static(path.join(__dirname, "uploads")))

const demandesFile = path.join(__dirname, "demandes.json")
const adminsFile = path.join(__dirname, "admins.json")
const uploadsDir = path.join(__dirname, "uploads")

// Créer le dossier uploads s'il n'existe pas
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

// =========================
// DEMANDES
// =========================

// Lire les demandes
const lireDemandes = () => {
  if (!fs.existsSync(demandesFile)) {
    fs.writeFileSync(demandesFile, JSON.stringify([], null, 2))
  }

  const data = fs.readFileSync(demandesFile, "utf-8")
  return JSON.parse(data)
}

// Sauvegarder les demandes
const enregistrerDemandes = (demandes) => {
  fs.writeFileSync(demandesFile, JSON.stringify(demandes, null, 2))
}

// =========================
// ADMINS
// =========================

// Initialiser admins.json si absent
const initialiserAdmins = () => {
  if (!fs.existsSync(adminsFile)) {
    const adminsParDefaut = [
      {
        id: 1,
        username: "superadmin",
        password: "123456",
        role: "super_admin",
      },
      {
        id: 2,
        username: "admin1",
        password: "123456",
        role: "admin",
      },
    ]

    fs.writeFileSync(adminsFile, JSON.stringify(adminsParDefaut, null, 2))
  }
}

// Lire les admins
const lireAdmins = () => {
  initialiserAdmins()
  const data = fs.readFileSync(adminsFile, "utf-8")
  return JSON.parse(data)
}

// Sauvegarder les admins
const enregistrerAdmins = (admins) => {
  fs.writeFileSync(adminsFile, JSON.stringify(admins, null, 2))
}

// Middleware simple pour autoriser seulement le super admin
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
// ROUTES TEST
// =========================

app.get("/", (req, res) => {
  res.send("Backend TAMAL en cours de fonctionnement")
})

app.get("/api/test", (req, res) => {
  res.json({ message: "API TAMAL OK" })
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
  (req, res) => {
    try {
      const demandes = lireDemandes()

      const formData = req.body
      const documentFile = req.files?.document ? req.files.document[0] : null
      const photoFile = req.files?.photo ? req.files.photo[0] : null

      const demande = {
        id: demandes.length > 0 ? demandes[demandes.length - 1].id + 1 : 1,
        ...formData,
        document: documentFile ? documentFile.filename : null,
        photo: photoFile ? photoFile.filename : null,
        statut: "en attente",
        dateCreation: new Date().toISOString(),
      }

      demandes.push(demande)
      enregistrerDemandes(demandes)

      console.log("Nouvelle demande reçue :")
      console.log(demande)

      console.log("Demandes enregistrées dans le fichier :")
      console.log(demandes)

      res.status(201).json({
        message: "Demande reçue avec succès",
        data: demande,
      })
    } catch (error) {
      console.error("Erreur lors de la création de la demande :", error)
      res.status(500).json({ message: "Erreur serveur lors de l'envoi de la demande" })
    }
  }
)

app.get("/api/demandes", (req, res) => {
  try {
    const demandes = lireDemandes()
    res.json(demandes)
  } catch (error) {
    console.error("Erreur lors de la lecture des demandes :", error)
    res.status(500).json({ message: "Erreur serveur lors de la lecture des demandes" })
  }
})

app.patch("/api/demandes/:id/statut", (req, res) => {
  try {
    const demandes = lireDemandes()

    const id = Number(req.params.id)
    const statut = req.body?.statut

    if (!statut) {
      return res.status(400).json({ message: "Le statut est obligatoire" })
    }

    const demande = demandes.find((d) => d.id === id)

    if (!demande) {
      return res.status(404).json({ message: "Demande introuvable" })
    }

    demande.statut = statut

    enregistrerDemandes(demandes)

    res.json({
      message: "Statut mis à jour avec succès",
      data: demande,
    })
  } catch (error) {
    console.error("Erreur lors de la mise à jour du statut :", error)
    res.status(500).json({ message: "Erreur serveur lors de la mise à jour du statut" })
  }
})

// =========================
// ROUTES AUTH ADMIN
// =========================

app.post("/api/admin/login", (req, res) => {
  try {
    const { username, password } = req.body

    if (!username || !password) {
      return res.status(400).json({
        message: "Nom d'utilisateur et mot de passe requis.",
      })
    }

    const admins = lireAdmins()

    const admin = admins.find(
      (a) => a.username === username && a.password === password
    )

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

// Voir la liste des admins
app.get("/api/admins", verifierSuperAdmin, (req, res) => {
  try {
    const admins = lireAdmins()
    res.json(admins)
  } catch (error) {
    console.error("Erreur lecture admins :", error)
    res.status(500).json({
      message: "Erreur lors de la récupération des admins.",
    })
  }
})

// Ajouter un admin
app.post("/api/admins", verifierSuperAdmin, (req, res) => {
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

    const admins = lireAdmins()

    const adminExiste = admins.find((a) => a.username === username)

    if (adminExiste) {
      return res.status(400).json({
        message: "Ce nom d'utilisateur existe déjà.",
      })
    }

    const nouvelAdmin = {
      id: admins.length > 0 ? Math.max(...admins.map((a) => a.id)) + 1 : 1,
      username,
      password,
      role,
    }

    admins.push(nouvelAdmin)
    enregistrerAdmins(admins)

    const { password: _, ...adminSansPassword } = nouvelAdmin

    res.status(201).json({
      message: "Admin ajouté avec succès.",
      admin: adminSansPassword,
    })
  } catch (error) {
    console.error("Erreur ajout admin :", error)
    res.status(500).json({
      message: "Erreur lors de l'ajout de l'admin.",
    })
  }
})

// Modifier mot de passe admin
app.patch("/api/admins/:id/password", verifierSuperAdmin, (req, res) => {
  try {
    const id = Number(req.params.id)
    const { password } = req.body

    if (!password) {
      return res.status(400).json({
        message: "Le nouveau mot de passe est requis.",
      })
    }

    const admins = lireAdmins()
    const index = admins.findIndex((a) => a.id === id)

    if (index === -1) {
      return res.status(404).json({
        message: "Admin introuvable.",
      })
    }

    admins[index].password = password
    enregistrerAdmins(admins)

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

// Supprimer un admin
app.delete("/api/admins/:id", verifierSuperAdmin, (req, res) => {
  try {
    const id = Number(req.params.id)
    const admins = lireAdmins()

    const adminASupprimer = admins.find((a) => a.id === id)

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

    const adminsMisAJour = admins.filter((a) => a.id !== id)
    enregistrerAdmins(adminsMisAJour)

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

app.listen(PORT, () => {
  console.log(`Serveur backend lancé sur http://localhost:${PORT}`)
})