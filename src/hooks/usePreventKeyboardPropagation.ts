import { useEffect } from 'react'

export function usePreventKeyboardPropagation() {
  useEffect(() => {
    const preventKeyboardPropagation = (e: KeyboardEvent) => {
      const keysToPrevent = [
        'Space',
        'ArrowLeft',
        'ArrowRight',
        'ArrowUp',
        'ArrowDown',
        'Shift'
      ]

      if (keysToPrevent.includes(e.code)) {
        e.stopPropagation()
        e.preventDefault()
      }
    }

    document.addEventListener('keydown', preventKeyboardPropagation, true)
    document.addEventListener('keyup', preventKeyboardPropagation, true)
    document.addEventListener('keypress', preventKeyboardPropagation, true)

    return () => {
      document.removeEventListener('keydown', preventKeyboardPropagation, true)
      document.removeEventListener('keyup', preventKeyboardPropagation, true)
      document.removeEventListener('keypress', preventKeyboardPropagation, true)
    }
  }, [])
} 