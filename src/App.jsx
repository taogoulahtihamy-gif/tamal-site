import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom"
import { useEffect } from "react"

import Navbar from "./components/Navbar"
import Hero from "./components/Hero"
import HowItWorks from "./components/HowItWorks"
import Conditions from "./components/Conditions"
import Simulateur from "./components/Simulateur"
import Formulaire from "./components/Formulaire"
import Contact from "./components/Contact"
import Footer from "./components/Footer"

import Admin from "./components/Admin"
import LoginAdmin from "./components/LoginAdmin"
import GestionAdmins from "./components/GestionAdmins"
import ListeDemandes from "./components/ListeDemandes"

function LayoutPublic({ children }) {
  return (
    <div className="min-h-screen bg-[#f8f8f6] text-black">
      <Navbar />
      {children}
      <Footer />
    </div>
  )
}

function AccueilPage() {
  return (
    <LayoutPublic>
      <Hero />
      <Contact />
    </LayoutPublic>
  )
}

function CommentCaMarchePage() {
  return (
    <LayoutPublic>
      <HowItWorks />
    </LayoutPublic>
  )
}

function ConditionsPage() {
  return (
    <LayoutPublic>
      <Conditions />
    </LayoutPublic>
  )
}

function SimulateurPage() {
  return (
    <LayoutPublic>
      <Simulateur />
    </LayoutPublic>
  )
}

function DemandePage() {
  return (
    <LayoutPublic>
      <Formulaire />
    </LayoutPublic>
  )
}

function ContactRedirectPage() {
  const navigate = useNavigate()

  useEffect(() => {
    navigate("/")

    setTimeout(() => {
      const section = document.getElementById("contact")
      if (section) {
        section.scrollIntoView({ behavior: "smooth" })
      }
    }, 200)
  }, [navigate])

  return null
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AccueilPage />} />
        <Route path="/comment-ca-marche" element={<CommentCaMarchePage />} />
        <Route path="/conditions" element={<ConditionsPage />} />
        <Route path="/simulateur" element={<SimulateurPage />} />
        <Route path="/demande" element={<DemandePage />} />
        <Route path="/contact" element={<ContactRedirectPage />} />

        <Route path="/login-admin" element={<LoginAdmin />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/gestion-admins" element={<GestionAdmins />} />
        <Route path="/liste-demandes" element={<ListeDemandes />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App