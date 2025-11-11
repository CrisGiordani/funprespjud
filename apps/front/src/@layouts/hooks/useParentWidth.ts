import { useEffect, useState } from 'react'

export function useParentWidth({ parentRef }: { parentRef: React.RefObject<HTMLDivElement> }) {
  const [parentWidth, setParentWidth] = useState<number>(0)

  useEffect(() => {
    if (!parentRef.current) return

    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        setParentWidth(entry.contentRect.width)
      }
    })

    resizeObserver.observe(parentRef.current)

    return () => {
      resizeObserver.disconnect()
    }
  }, [parentRef])

  return { parentWidth }
}
