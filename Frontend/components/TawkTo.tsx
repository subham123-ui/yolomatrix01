"use client"

import { useEffect } from "react"

export default function TawkTo() {
  useEffect(() => {
     const script = document.createElement("script");
    script.src = "https://embed.tawk.to/6821c760ca3aee190c0f991f/1ir1v5l7j"
    script.async = true
    script.charset = "UTF-8"
    script.setAttribute("crossorigin", "*")
    document.body.appendChild(script)

    script.onload = () => {
      const tryPositionAdjust = () => {
        const tawkContainer = document.querySelector("iframe[title='chat widget']")?.parentElement

        if (tawkContainer) {
          // 👇 Push the widget up from the bottom
          tawkContainer.style.bottom = "90px" // adjust this value
          tawkContainer.style.right = "20px"
          tawkContainer.style.zIndex = "999999" // Ensure it's on top
        } else {
          // Try again in 500ms
          setTimeout(tryPositionAdjust, 500)
        }
      }

      // Run it the first time
      tryPositionAdjust()
    }
  }, [])

  return null
}
