import { useEffect, useState } from "react"

export default function ScrollToTopButton() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 350)
    }

    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const remonter = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  if (!visible) return null

  return (
    <button
      onClick={remonter}
      aria-label="Retour en haut"
      className="fixed bottom-24 right-5 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-yellow-500 bg-black text-xl font-bold text-yellow-500 shadow-lg transition hover:bg-yellow-500 hover:text-black"
    >
      ↑
    </button>
  )
}