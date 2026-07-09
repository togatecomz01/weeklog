import { useEffect } from 'react'

const KEYBOARD_OFFSET_PROPERTY = '--keyboard-offset-bottom'
const KEYBOARD_OPEN_CLASS = 'is-keyboard-open'
const KEYBOARD_THRESHOLD = 80

export function useKeyboardOffset() {
  useEffect(() => {
    const root = document.documentElement
    const viewport = window.visualViewport
    let frameId = 0

    function setKeyboardOffset() {
      if (!viewport) {
        root.style.setProperty(KEYBOARD_OFFSET_PROPERTY, '0px')
        root.classList.remove(KEYBOARD_OPEN_CLASS)
        return
      }

      const viewportBottom = viewport.height + viewport.offsetTop
      const nextOffset = Math.max(0, window.innerHeight - viewportBottom)
      const keyboardOffset = nextOffset > KEYBOARD_THRESHOLD ? Math.round(nextOffset) : 0

      root.style.setProperty(KEYBOARD_OFFSET_PROPERTY, `${keyboardOffset}px`)
      root.classList.toggle(KEYBOARD_OPEN_CLASS, keyboardOffset > 0)
    }

    function requestUpdate() {
      if (frameId) cancelAnimationFrame(frameId)
      frameId = requestAnimationFrame(setKeyboardOffset)
    }

    setKeyboardOffset()

    viewport?.addEventListener('resize', requestUpdate)
    viewport?.addEventListener('scroll', requestUpdate)
    window.addEventListener('resize', requestUpdate)
    window.addEventListener('orientationchange', requestUpdate)

    return () => {
      if (frameId) cancelAnimationFrame(frameId)
      viewport?.removeEventListener('resize', requestUpdate)
      viewport?.removeEventListener('scroll', requestUpdate)
      window.removeEventListener('resize', requestUpdate)
      window.removeEventListener('orientationchange', requestUpdate)
      root.style.removeProperty(KEYBOARD_OFFSET_PROPERTY)
      root.classList.remove(KEYBOARD_OPEN_CLASS)
    }
  }, [])
}
