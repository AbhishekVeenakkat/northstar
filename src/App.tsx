import { type CSSProperties, useEffect, useRef, useState } from 'react'
import './App.css'

const introText = 'ux by abhi'
const nameText = 'Abhishek Veenakkat'
const manifestoLines = [
  ['Each', 'project', "we've", 'touched', 'holds'],
  ['sentimental', 'importance', 'and'],
  ['showcases', 'our', 'passion', 'for', 'art.'],
]

function App() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const deckStageRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLCanvasElement>(null)
  const heroSectionRef = useRef<HTMLElement>(null)
  const portraitGridRef = useRef<HTMLCanvasElement>(null)
  const portraitSectionRef = useRef<HTMLElement>(null)
  const closingGridRef = useRef<HTMLCanvasElement>(null)
  const closingSectionRef = useRef<HTMLElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isTypingComplete, setIsTypingComplete] = useState(() => {
    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return true
    }

    return false
  })
  const [heroText, setHeroText] = useState(() => {
    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return nameText
    }

    return ''
  })

  useEffect(() => {
    const cursor = cursorRef.current
    const canvas = gridRef.current
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)')
      .matches

    if (!canvas) {
      return undefined
    }

    const context = canvas.getContext('2d')
    if (!context) {
      return undefined
    }

    let animationFrame = 0
    let canvasWidth = 0
    let canvasHeight = 0
    let pixelRatio = 1
    let cursorX = window.innerWidth / 2
    let cursorY = window.innerHeight / 2
    let targetCursorX = cursorX
    let targetCursorY = cursorY
    let gridX = cursorX
    let gridY = cursorY
    let targetGridX = gridX
    let targetGridY = gridY
    let pointerActive = false
    const cursorEnabled = Boolean(cursor && canHover && !prefersReducedMotion)
    const gridResponsive = canHover && !prefersReducedMotion

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect()
      pixelRatio = Math.min(window.devicePixelRatio || 1, 2)
      canvasWidth = Math.round(rect.width)
      canvasHeight = Math.round(rect.height)
      canvas.width = Math.round(canvasWidth * pixelRatio)
      canvas.height = Math.round(canvasHeight * pixelRatio)
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
    }

    const drawGrid = () => {
      const spacing = 24
      const baseRadius = 1.1
      const maxRadius = 5.4
      const influence = 170

      context.clearRect(0, 0, canvasWidth, canvasHeight)
      context.fillStyle = 'rgb(21 19 15 / 0.17)'

      for (let y = spacing / 2; y < canvasHeight; y += spacing) {
        for (let x = spacing / 2; x < canvasWidth; x += spacing) {
          const distance = Math.hypot(x - gridX, y - gridY)
          const proximity = pointerActive
            ? Math.max(0, 1 - distance / influence)
            : 0
          const easedProximity = proximity * proximity * (3 - 2 * proximity)
          const radius = baseRadius + easedProximity * (maxRadius - baseRadius)

          context.beginPath()
          context.arc(x, y, radius, 0, Math.PI * 2)
          context.fill()
        }
      }
    }

    resizeCanvas()

    const handleResize = () => {
      resizeCanvas()
      drawGrid()
    }

    if (!gridResponsive) {
      drawGrid()
      window.addEventListener('resize', handleResize)

      return () => {
        window.removeEventListener('resize', handleResize)
      }
    }

    const render = () => {
      cursorX += (targetCursorX - cursorX) * 0.18
      cursorY += (targetCursorY - cursorY) * 0.18
      gridX += (targetGridX - gridX) * 0.18
      gridY += (targetGridY - gridY) * 0.18

      if (cursorEnabled && cursor) {
        cursor.style.opacity = pointerActive ? '1' : '0'
        cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`
      }

      drawGrid()
      animationFrame = window.requestAnimationFrame(render)
    }

    const handlePointerMove = (event: PointerEvent) => {
      const target = event.target
      const isOverOpenMenu = Boolean(
        target instanceof Node &&
          menuRef.current?.contains(target) &&
          menuRef.current.classList.contains('is-open'),
      )

      const rect = canvas.getBoundingClientRect()
      targetCursorX = event.clientX
      targetCursorY = event.clientY
      targetGridX = event.clientX - rect.left
      targetGridY = event.clientY - rect.top
      pointerActive = true

      if (cursor) {
        cursor.style.background = isOverOpenMenu ? '#f3c623' : '#1677ff'
      }
    }

    const handlePointerLeave = () => {
      pointerActive = false
      if (cursor) {
        cursor.style.opacity = '0'
      }
    }

    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    window.addEventListener('pointerleave', handlePointerLeave)
    window.addEventListener('resize', handleResize)
    animationFrame = window.requestAnimationFrame(render)

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerleave', handlePointerLeave)
      window.removeEventListener('resize', handleResize)
      window.cancelAnimationFrame(animationFrame)
    }
  }, [])

  useEffect(() => {
    if (!isMenuOpen && cursorRef.current) {
      cursorRef.current.style.background = '#1677ff'
    }
  }, [isMenuOpen])

  useEffect(() => {
    const deckStage = deckStageRef.current
    const heroSection = heroSectionRef.current
    const section = portraitSectionRef.current
    const canvas = portraitGridRef.current
    const closingSection = closingSectionRef.current
    const closingCanvas = closingGridRef.current
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    if (
      !deckStage ||
      !heroSection ||
      !section ||
      !canvas ||
      !closingSection ||
      !closingCanvas ||
      prefersReducedMotion
    ) {
      return undefined
    }

    const context = canvas.getContext('2d')
    const closingContext = closingCanvas.getContext('2d')
    if (!context || !closingContext) {
      return undefined
    }

    let animationFrame = 0
    let canvasWidth = 0
    let canvasHeight = 0
    let closingCanvasWidth = 0
    let closingCanvasHeight = 0
    let pixelRatio = 1
    let gridX = window.innerWidth / 2
    let gridY = window.innerHeight / 2
    let targetGridX = gridX
    let targetGridY = gridY
    let closingGridX = window.innerWidth / 2
    let closingGridY = window.innerHeight / 2
    let targetClosingGridX = closingGridX
    let targetClosingGridY = closingGridY
    let closingPointerActive = false
    let pointerActive = false

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect()
      const closingRect = closingCanvas.getBoundingClientRect()
      pixelRatio = Math.min(window.devicePixelRatio || 1, 2)
      canvasWidth = Math.round(rect.width)
      canvasHeight = Math.round(rect.height)
      closingCanvasWidth = Math.round(closingRect.width)
      closingCanvasHeight = Math.round(closingRect.height)
      canvas.width = Math.round(canvasWidth * pixelRatio)
      canvas.height = Math.round(canvasHeight * pixelRatio)
      closingCanvas.width = Math.round(closingCanvasWidth * pixelRatio)
      closingCanvas.height = Math.round(closingCanvasHeight * pixelRatio)
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
      closingContext.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
    }

    const drawDots = (
      targetContext: CanvasRenderingContext2D,
      width: number,
      height: number,
      focusX: number,
      focusY: number,
      isPointerActive: boolean,
      fillStyle: string,
    ) => {
      const spacing = 24
      const baseRadius = 1.75
      const maxRadius = 5.4
      const influence = 170

      targetContext.clearRect(0, 0, width, height)
      targetContext.fillStyle = fillStyle

      for (let y = spacing / 2; y < height; y += spacing) {
        for (let x = spacing / 2; x < width; x += spacing) {
          const distance = Math.hypot(x - focusX, y - focusY)
          const proximity = isPointerActive
            ? Math.max(0, 1 - distance / influence)
            : 0
          const easedProximity = proximity * proximity * (3 - 2 * proximity)
          const radius = baseRadius + easedProximity * (maxRadius - baseRadius)

          targetContext.beginPath()
          targetContext.arc(x, y, radius, 0, Math.PI * 2)
          targetContext.fill()
        }
      }
    }

    const updateParallax = () => {
      const deckRect = deckStage.getBoundingClientRect()
      const viewportHeight = window.innerHeight || 1
      const heroProgress = Math.min(
        1,
        Math.max(0, -deckRect.top / viewportHeight),
      )
      const closingProgress = Math.min(
        1,
        Math.max(0, (-deckRect.top - viewportHeight) / viewportHeight),
      )
      const closingWordProgress = Math.min(
        1,
        Math.max(0, (-deckRect.top - viewportHeight * 2) / viewportHeight),
      )

      heroSection.style.setProperty('--hero-scroll-progress', heroProgress.toString())
      section.style.setProperty('--portrait-progress', heroProgress.toString())
      section.style.setProperty(
        '--portrait-exit-progress',
        closingProgress.toString(),
      )
      closingSection.style.setProperty(
        '--closing-progress',
        closingProgress.toString(),
      )
      closingSection.style.setProperty(
        '--closing-word-progress',
        closingWordProgress.toString(),
      )
    }

    const render = () => {
      gridX += (targetGridX - gridX) * 0.18
      gridY += (targetGridY - gridY) * 0.18
      closingGridX += (targetClosingGridX - closingGridX) * 0.18
      closingGridY += (targetClosingGridY - closingGridY) * 0.18

      updateParallax()
      drawDots(
        context,
        canvasWidth,
        canvasHeight,
        gridX,
        gridY,
        pointerActive,
        'rgb(255 255 255 / 0.25)',
      )
      drawDots(
        closingContext,
        closingCanvasWidth,
        closingCanvasHeight,
        closingGridX,
        closingGridY,
        closingPointerActive,
        'rgb(255 255 255 / 0.12)',
      )
      animationFrame = window.requestAnimationFrame(render)
    }

    const handlePointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      const closingRect = closingCanvas.getBoundingClientRect()
      const isInsideSection =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom
      const isInsideClosingSection =
        event.clientX >= closingRect.left &&
        event.clientX <= closingRect.right &&
        event.clientY >= closingRect.top &&
        event.clientY <= closingRect.bottom

      targetGridX = event.clientX - rect.left
      targetGridY = event.clientY - rect.top
      targetClosingGridX = event.clientX - closingRect.left
      targetClosingGridY = event.clientY - closingRect.top
      pointerActive = isInsideSection
      closingPointerActive = isInsideClosingSection
    }

    const handlePointerLeave = () => {
      pointerActive = false
      closingPointerActive = false
    }

    const handleResize = () => {
      resizeCanvas()
      updateParallax()
    }

    resizeCanvas()
    updateParallax()
    animationFrame = window.requestAnimationFrame(render)
    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    window.addEventListener('pointerleave', handlePointerLeave)
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerleave', handlePointerLeave)
      window.removeEventListener('resize', handleResize)
      window.cancelAnimationFrame(animationFrame)
    }
  }, [])

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    if (prefersReducedMotion) {
      return undefined
    }

    let timeout = 0
    let active = true

    const wait = (duration: number) =>
      new Promise<void>((resolve) => {
        timeout = window.setTimeout(resolve, duration)
      })

    const typeText = async (text: string, speed: number) => {
      for (let index = 1; index <= text.length && active; index += 1) {
        setHeroText(text.slice(0, index))
        await wait(speed)
      }
    }

    const eraseText = async (speed: number) => {
      for (let index = introText.length - 1; index >= 0 && active; index -= 1) {
        setHeroText(introText.slice(0, index))
        await wait(speed)
      }
    }

    const runTypeSequence = async () => {
      await wait(600)
      await typeText(introText, 82)
      await wait(900)
      await eraseText(44)
      await wait(280)
      await typeText(nameText, 72)
      if (active) {
        await wait(450)
        setIsTypingComplete(true)
      }
    }

    void runTypeSequence()

    return () => {
      active = false
      window.clearTimeout(timeout)
    }
  }, [])

  useEffect(() => {
    if (!isMenuOpen) {
      return undefined
    }

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target

      if (!(target instanceof Node)) {
        return
      }

      if (
        menuRef.current?.contains(target) ||
        menuButtonRef.current?.contains(target)
      ) {
        return
      }

      setIsMenuOpen(false)
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false)
      }
    }

    window.addEventListener('pointerdown', handlePointerDown)
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('pointerdown', handlePointerDown)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isMenuOpen])

  return (
    <main className="app-shell">
      <div ref={cursorRef} className="smooth-cursor" aria-hidden="true" />
      <div ref={deckStageRef} className="deck-stage">
        <section
          ref={heroSectionRef}
          className="header-section"
          aria-label="Portfolio introduction"
        >
          <canvas ref={gridRef} className="dot-grid" aria-hidden="true" />
          <div className="header-frame">
            <div
              className={`hero-copy ${isTypingComplete ? 'is-complete' : ''}`}
            >
              <h1 className="hero-title" aria-live="polite">
                <span>{heroText}</span>
                {!isTypingComplete && (
                  <span className="typing-caret" aria-hidden="true" />
                )}
              </h1>
              <div className="hero-rule" aria-hidden="true" />
            <p className="hero-subtitle">
              UX Engineer from Kerala 🌴 - I design, develop and ship apps.
            </p>
          </div>
          </div>
        </section>
        <section
          ref={portraitSectionRef}
          className="portrait-section"
          aria-label="Portrait"
        >
          <canvas
            ref={portraitGridRef}
            className="portrait-dot-grid"
            aria-hidden="true"
        />
        <div className="portrait-parallax">
          <p className="portrait-statement">
            Product Designer • UI/UX Designer • UI Developer
          </p>
          <img
            className="portrait-image"
            src="/abhishek-portrait.png"
            alt="Portrait of Abhishek Veenakkat"
          />
        </div>
      </section>
        <section
          ref={closingSectionRef}
          className="closing-section"
          aria-label="Project philosophy"
        >
          <canvas
            ref={closingGridRef}
            className="closing-dot-grid"
            aria-hidden="true"
          />
          <p
            className="closing-statement"
            style={
              {
                '--closing-word-count': manifestoLines.flat().length,
              } as CSSProperties
            }
          >
            {manifestoLines.map((line, lineIndex) => {
              const precedingWords = manifestoLines
                .slice(0, lineIndex)
                .reduce((count, words) => count + words.length, 0)

              return (
                <span className="closing-line" key={line.join(' ')}>
                  {line.map((word, wordIndex) => (
                    <span
                      className="closing-word"
                      key={`${word}-${wordIndex}`}
                      style={
                        {
                          '--closing-word-index': precedingWords + wordIndex,
                        } as CSSProperties
                      }
                    >
                      {word}
                    </span>
                  ))}
                </span>
              )
            })}
          </p>
        </section>
      </div>
      <div
        ref={menuRef}
        className={`menu-cta ${isMenuOpen ? 'is-open' : ''}`}
      >
        <button
          className="menu-close"
          type="button"
          aria-label="Close menu"
          tabIndex={isMenuOpen ? 0 : -1}
          onClick={(event) => {
            event.currentTarget.blur()
            setIsMenuOpen(false)
          }}
        >
          <span />
          <span />
        </button>
        <nav
          id="hero-menu"
          className="menu-panel"
          aria-label="Portfolio menu"
          aria-hidden={!isMenuOpen}
        >
          <a href="#work" tabIndex={isMenuOpen ? 0 : -1}>
            Work
          </a>
          <a href="#about" tabIndex={isMenuOpen ? 0 : -1}>
            About
          </a>
          <a href="#notes" tabIndex={isMenuOpen ? 0 : -1}>
            Notes
          </a>
          <a href="#contact" tabIndex={isMenuOpen ? 0 : -1}>
            Contact
          </a>
        </nav>
        <button
          ref={menuButtonRef}
          className="menu-cta__button"
          type="button"
          aria-controls="hero-menu"
          aria-expanded={isMenuOpen}
          onClick={() => {
            setIsMenuOpen((isOpen) => !isOpen)
          }}
        >
          <span className="menu-cta__label">Menu</span>
        </button>
        <span className="menu-cta__anchor menu-cta__anchor--top-left" />
        <span className="menu-cta__anchor menu-cta__anchor--top-right" />
        <span className="menu-cta__anchor menu-cta__anchor--bottom-left" />
        <span className="menu-cta__anchor menu-cta__anchor--bottom-right" />
      </div>
    </main>
  )
}

export default App
