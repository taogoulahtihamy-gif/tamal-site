import { BrowserRouter, Routes, Route } from "react-router-dom"

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

function SiteClient() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <Hero />
      <HowItWorks />
      <Conditions />
      <Simulateur />
      <Formulaire />
      <Contact />
      <Footer />
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* SITE CLIENT */}
        <Route path="/" element={<SiteClient />} />

        {/* LOGIN ADMIN */}
        <Route path="/login-admin" element={<LoginAdmin />} />

        {/* DASHBOARD ADMIN */}
        <Route path="/admin" element={<Admin />} />

        {/* GESTION DES ADMINS (SUPER ADMIN) */}
        <Route path="/gestion-admins" element={<GestionAdmins />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App