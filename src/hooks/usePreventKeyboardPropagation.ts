import { useEffect } from 'react'

// 防止一些键盘事件冒泡，避免和b站的键盘快捷键冲突
export function usePreventKeyboardPropagation(open: boolean) {
  useEffect(() => {
    if (!open) return
    const preventKeyboardPropagation = (e: KeyboardEvent) => {
      const keysToPrevent = [
        // 'Space',
        // 'ArrowLeft',
        // 'ArrowRight',
        'ArrowUp',
        'ArrowDown',
        'Shift',
        'KeyF',
        'KeyA',
        'KeyD',
        'KeyW',
        'KeyE',
        'KeyQ',
      ]

      if (keysToPrevent.includes(e.code)) {
        e.stopPropagation()
        // e.preventDefault()
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
  }, [open])
} 