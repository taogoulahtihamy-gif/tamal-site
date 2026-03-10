import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom"
import { useEffect } from "react"
import ScrollToTopButton from "./components/ScrollToTopButton"
import Navbar from "./components/Navbar"
import Hero from "./components/Hero"
import HowItWorks from "./components/HowItWorks"
import Conditions from "./components/Conditions"
import Formulaire from "./components/Formulaire"
import Footer from "./components/Footer"
import SimulateurPage from "./components/SimulateurPage"
import Admin from "./components/Admin"
import LoginAdmin from "./components/LoginAdmin"
import GestionAdmins from "./components/GestionAdmins"
import ListeDemandes from "./components/ListeDemandes"
import FloatingWhatsapp from "./components/FloatingWhatsapp"

function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    })
  }, [pathname])

  return null
}

function LayoutPublic({ children }) {
  return (
    <div className="min-h-screen bg-[#f8f8f6] text-black">
      <Navbar />
      {children}
      <Footer />
      <FloatingWhatsapp />
      <FloatingWhatsapp />
      <ScrollToTopButton />
    </div>
  )
}

function AccueilPage() {
  return (
    <LayoutPublic>
      <Hero />
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

function SimulateurRoutePage() {
  return (
    <LayoutPublic>
      <SimulateurPage />
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
        section.scrollIntoView({ behavior: "smooth", block: "start" })
      }
    }, 350)
  }, [navigate])

  return null
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />

      <Routes>
        <Route path="/" element={<AccueilPage />} />
        <Route path="/comment-ca-marche" element={<CommentCaMarchePage />} />
        <Route path="/conditions" element={<ConditionsPage />} />
        <Route path="/simulateur" element={<SimulateurRoutePage />} />
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