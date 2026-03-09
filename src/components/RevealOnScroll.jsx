import { useEffect, useRef, useState } from "react"

export default function RevealOnScroll({
  children,
  delay = 0,
  direction = "up",
  distance = 24,
  duration = 700,
  once = true,
  className = "",
}) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          if (once) observer.unobserve(element)
        } else if (!once) {
          setVisible(false)
        }
      },
      {
        threshold: 0.15,
      }
    )

    observer.observe(element)

    return () => observer.disconnect()
  }, [once])

  const getInitialTransform = () => {
    switch (direction) {
      case "left":
        return `translateX(${distance}px)`
      case "right":
        return `translateX(-${distance}px)`
      case "down":
        return `translateY(-${distance}px)`
      case "up":
      default:
        return `translateY(${distance}px)`
    }
  }

  const style = {
    opacity: visible ? 1 : 0,
    transform: visible ? "translate(0, 0)" : getInitialTransform(),
    transition: `opacity ${duration}ms ease, transform ${duration}ms ease`,
    transitionDelay: `${delay}ms`,
    willChange: "opacity, transform",
  }

  return (
    <div ref={ref} style={style} className={className}>
      {children}
    </div>
  )
}