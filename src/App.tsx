import { type CSSProperties, useEffect, useRef, useState } from 'react'
import './App.css'

const introText = 'ux by abhi'
const nameText = 'Abhishek Veenakkat'
const manifestoLines = [
  ['Each', 'project', "we've", 'touched', 'holds'],
  ['sentimental', 'importance', 'and'],
  ['showcases', 'our', 'passion', 'for', 'art.'],
]

const getViewportCoverage = (element: Element) => {
  const rect = element.getBoundingClientRect()
  const viewportHeight = window.innerHeight || 1
  const visibleHeight = Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0)

  return Math.max(0, Math.min(1, visibleHeight / viewportHeight))
}

function App() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const deckStageRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLCanvasElement>(null)
  const heroSectionRef = useRef<HTMLElement>(null)
  const heroSlimePathRef = useRef<SVGPathElement>(null)
  const portraitGridRef = useRef<HTMLCanvasElement>(null)
  const portraitSectionRef = useRef<HTMLElement>(null)
  const closingGridRef = useRef<HTMLCanvasElement>(null)
  const closingSlimePathRef = useRef<SVGPathElement>(null)
  const closingSectionRef = useRef<HTMLElement>(null)
  const fourthSectionRef = useRef<HTMLElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isWordmarkRevealed, setIsWordmarkRevealed] = useState(() => {
    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return true
    }

    return false
  })
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
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [])

  useEffect(() => {
    if (isWordmarkRevealed) {
      return undefined
    }

    const deckStage = deckStageRef.current
    const portraitSection = portraitSectionRef.current

    if (!deckStage || !portraitSection) {
      return undefined
    }

    let frame = 0

    const revealWhenLoaded = () => {
      frame = 0
      const viewportHeight = window.innerHeight || 1
      const deckProgress = Math.max(
        0,
        -deckStage.getBoundingClientRect().top / viewportHeight,
      )

      if (deckProgress >= 0.99 && getViewportCoverage(portraitSection) >= 0.82) {
        setIsWordmarkRevealed(true)
      }
    }

    const scheduleRevealCheck = () => {
      if (frame) {
        return
      }

      frame = window.requestAnimationFrame(revealWhenLoaded)
    }

    scheduleRevealCheck()
    window.addEventListener('scroll', scheduleRevealCheck, { passive: true })
    window.addEventListener('resize', scheduleRevealCheck)

    return () => {
      window.removeEventListener('scroll', scheduleRevealCheck)
      window.removeEventListener('resize', scheduleRevealCheck)
      window.cancelAnimationFrame(frame)
    }
  }, [isWordmarkRevealed])

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
    let gridActive = false
    let gridNeedsDraw = true
    let lastPointerX = targetCursorX
    let lastPointerY = targetCursorY
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
          const proximity = gridActive
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
      gridNeedsDraw = true
      drawGrid()
    }

    if (!gridResponsive) {
      drawGrid()
      window.addEventListener('resize', handleResize)

      return () => {
        window.removeEventListener('resize', handleResize)
      }
    }

    const syncGridTarget = () => {
      const rect = canvas.getBoundingClientRect()
      targetGridX = lastPointerX - rect.left
      targetGridY = lastPointerY - rect.top
      const nextGridActive = pointerActive && getViewportCoverage(canvas) >= 0.7

      if (gridActive !== nextGridActive) {
        gridNeedsDraw = true
      }

      gridActive = nextGridActive
    }

    const scheduleRender = () => {
      if (animationFrame) {
        return
      }

      animationFrame = window.requestAnimationFrame(render)
    }

    const render = () => {
      animationFrame = 0
      const cursorDeltaX = targetCursorX - cursorX
      const cursorDeltaY = targetCursorY - cursorY
      const gridDeltaX = targetGridX - gridX
      const gridDeltaY = targetGridY - gridY

      cursorX += (targetCursorX - cursorX) * 0.18
      cursorY += (targetCursorY - cursorY) * 0.18
      gridX += (targetGridX - gridX) * 0.18
      gridY += (targetGridY - gridY) * 0.18

      if (cursorEnabled && cursor) {
        cursor.style.opacity = pointerActive ? '1' : '0'
        cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`
      }

      if (gridNeedsDraw || gridActive) {
        drawGrid()
        gridNeedsDraw = false
      }

      const isMoving =
        Math.abs(cursorDeltaX) > 0.08 ||
        Math.abs(cursorDeltaY) > 0.08 ||
        Math.abs(gridDeltaX) > 0.08 ||
        Math.abs(gridDeltaY) > 0.08

      if (isMoving) {
        scheduleRender()
      }
    }

    const handlePointerMove = (event: PointerEvent) => {
      const target = event.target
      const cursorEdgeInset = 14
      const isNearViewportEdge =
        event.clientX <= cursorEdgeInset ||
        event.clientY <= cursorEdgeInset ||
        event.clientX >= window.innerWidth - cursorEdgeInset ||
        event.clientY >= window.innerHeight - cursorEdgeInset
      const isOverOpenMenu = Boolean(
        target instanceof Node &&
          menuRef.current?.contains(target) &&
          menuRef.current.classList.contains('is-open'),
      )

      targetCursorX = event.clientX
      targetCursorY = event.clientY
      lastPointerX = event.clientX
      lastPointerY = event.clientY
      pointerActive = !isNearViewportEdge
      syncGridTarget()

      if (cursor) {
        if (isNearViewportEdge) {
          cursor.style.opacity = '0'
        }

        cursor.style.background = isOverOpenMenu ? '#f3c623' : '#1677ff'
      }

      scheduleRender()
    }

    const handlePointerLeave = () => {
      pointerActive = false
      if (gridActive) {
        gridNeedsDraw = true
      }
      gridActive = false
      if (cursor) {
        cursor.style.opacity = '0'
      }
      scheduleRender()
    }

    const handleScroll = () => {
      if (!pointerActive) {
        return
      }

      syncGridTarget()
      scheduleRender()
    }

    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    window.addEventListener('pointerleave', handlePointerLeave)
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleResize)
    scheduleRender()

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerleave', handlePointerLeave)
      window.removeEventListener('scroll', handleScroll)
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
    const heroSlimePath = heroSlimePathRef.current
    const section = portraitSectionRef.current
    const canvas = portraitGridRef.current
    const closingSection = closingSectionRef.current
    const closingSlimePath = closingSlimePathRef.current
    const fourthSection = fourthSectionRef.current
    const closingCanvas = closingGridRef.current
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    if (
      !deckStage ||
      !heroSection ||
      !heroSlimePath ||
      !section ||
      !canvas ||
      !closingSection ||
      !closingSlimePath ||
      !fourthSection ||
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
    let parallaxFrame = 0
    let slimeFrame = 0
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
    let lastPointerX = window.innerWidth / 2
    let lastPointerY = window.innerHeight / 2
    let hasPointer = false
    let portraitNeedsDraw = true
    let closingNeedsDraw = true
    let snapTimeout = 0
    let lastHeroProgress = 0
    let hasMeasuredHeroProgress = false
    let lastClosingProgress = 0
    let hasMeasuredClosingProgress = false
    let lastFourthProgress = 0
    let hasMeasuredFourthProgress = false
    let slimePosition = 0
    let slimeTarget = 0
    let closingSlimePosition = 0
    let closingSlimeTarget = 0
    let closingBottomSlimePosition = 0
    let closingBottomSlimeTarget = 0

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

    const setHeroSlimePath = (amount: number) => {
      const strength = Math.min(1, Math.abs(amount))
      const isScrollDownReaction = amount >= 0
      const slimeEdge = isScrollDownReaction
        ? 1 - strength * 0.42
        : 1 - strength * 0.02
      const slimeShoulder = 1 - strength * 0.18
      const slimePeak = isScrollDownReaction
        ? 1 - strength * 0.02
        : 1 - strength * 0.42
      const clipLeft = -0.02
      const clipRight = 1.02
      const slimePath = [
        `M ${clipLeft} 0 H ${clipRight}`,
        `V ${slimeEdge.toFixed(4)}`,
        `C 0.9 ${slimeEdge.toFixed(4)}, 0.84 ${slimeEdge.toFixed(4)}, 0.76 ${slimeShoulder.toFixed(4)}`,
        `C 0.66 ${slimePeak.toFixed(4)}, 0.6 ${slimePeak.toFixed(4)}, 0.5 ${slimePeak.toFixed(4)}`,
        `C 0.4 ${slimePeak.toFixed(4)}, 0.34 ${slimePeak.toFixed(4)}, 0.24 ${slimeShoulder.toFixed(4)}`,
        `C 0.16 ${slimeEdge.toFixed(4)}, 0.1 ${slimeEdge.toFixed(4)}, ${clipLeft} ${slimeEdge.toFixed(4)}`,
        'V 0 Z',
      ].join(' ')

      heroSlimePath.setAttribute('d', slimePath)
    }

    const setClosingSlimePath = (topAmount: number, bottomAmount: number) => {
      const topStrength = Math.min(1, Math.abs(topAmount))
      const isTopScrollDownReaction = topAmount >= 0
      const topEdge = isTopScrollDownReaction
        ? topStrength * 0.02
        : topStrength * 0.42
      const topShoulder = topStrength * 0.18
      const topPeak = isTopScrollDownReaction
        ? topStrength * 0.42
        : topStrength * 0.02
      const bottomStrength = Math.min(1, Math.abs(bottomAmount))
      const isBottomScrollDownReaction = bottomAmount >= 0
      const bottomEdge = isBottomScrollDownReaction
        ? 1 - bottomStrength * 0.42
        : 1 - bottomStrength * 0.02
      const bottomShoulder = 1 - bottomStrength * 0.18
      const bottomPeak = isBottomScrollDownReaction
        ? 1 - bottomStrength * 0.02
        : 1 - bottomStrength * 0.42
      const clipLeft = -0.02
      const clipRight = 1.02
      const slimePath = [
        `M ${clipLeft} ${topEdge.toFixed(4)}`,
        `C 0.1 ${topEdge.toFixed(4)}, 0.16 ${topEdge.toFixed(4)}, 0.24 ${topShoulder.toFixed(4)}`,
        `C 0.34 ${topPeak.toFixed(4)}, 0.4 ${topPeak.toFixed(4)}, 0.5 ${topPeak.toFixed(4)}`,
        `C 0.6 ${topPeak.toFixed(4)}, 0.66 ${topPeak.toFixed(4)}, 0.76 ${topShoulder.toFixed(4)}`,
        `C 0.84 ${topEdge.toFixed(4)}, 0.9 ${topEdge.toFixed(4)}, ${clipRight} ${topEdge.toFixed(4)}`,
        `V ${bottomEdge.toFixed(4)}`,
        `C 0.9 ${bottomEdge.toFixed(4)}, 0.84 ${bottomEdge.toFixed(4)}, 0.76 ${bottomShoulder.toFixed(4)}`,
        `C 0.66 ${bottomPeak.toFixed(4)}, 0.6 ${bottomPeak.toFixed(4)}, 0.5 ${bottomPeak.toFixed(4)}`,
        `C 0.4 ${bottomPeak.toFixed(4)}, 0.34 ${bottomPeak.toFixed(4)}, 0.24 ${bottomShoulder.toFixed(4)}`,
        `C 0.16 ${bottomEdge.toFixed(4)}, 0.1 ${bottomEdge.toFixed(4)}, ${clipLeft} ${bottomEdge.toFixed(4)}`,
        'Z',
      ].join(' ')

      closingSlimePath.setAttribute('d', slimePath)
    }

    const scheduleSlimeRender = () => {
      if (slimeFrame) {
        return
      }

      slimeFrame = window.requestAnimationFrame(renderSlime)
    }

    const renderSlime = () => {
      slimeFrame = 0
      slimeTarget *= 0.82
      slimePosition += (slimeTarget - slimePosition) * 0.14
      closingSlimeTarget *= 0.82
      closingSlimePosition +=
        (closingSlimeTarget - closingSlimePosition) * 0.14
      closingBottomSlimeTarget *= 0.82
      closingBottomSlimePosition +=
        (closingBottomSlimeTarget - closingBottomSlimePosition) * 0.14

      if (
        Math.abs(slimePosition) < 0.002 &&
        Math.abs(slimeTarget) < 0.002 &&
        Math.abs(closingSlimePosition) < 0.002 &&
        Math.abs(closingSlimeTarget) < 0.002 &&
        Math.abs(closingBottomSlimePosition) < 0.002 &&
        Math.abs(closingBottomSlimeTarget) < 0.002
      ) {
        slimePosition = 0
        slimeTarget = 0
        closingSlimePosition = 0
        closingSlimeTarget = 0
        closingBottomSlimePosition = 0
        closingBottomSlimeTarget = 0
        setHeroSlimePath(0)
        setClosingSlimePath(0, 0)
        return
      }

      setHeroSlimePath(slimePosition)
      setClosingSlimePath(closingSlimePosition, closingBottomSlimePosition)
      scheduleSlimeRender()
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
      const fourthProgress = Math.min(
        1,
        Math.max(0, (-deckRect.top - viewportHeight * 3) / viewportHeight),
      )
      const heroDelta = heroProgress - lastHeroProgress
      const closingDelta = closingProgress - lastClosingProgress
      const fourthDelta = fourthProgress - lastFourthProgress

      if (
        hasMeasuredHeroProgress &&
        Math.abs(heroDelta) > 0.0004 &&
        heroProgress > 0.01 &&
        heroProgress < 0.99
      ) {
        slimeTarget = Math.max(-1, Math.min(1, heroDelta * -46.4))
        scheduleSlimeRender()
      }

      if (
        hasMeasuredClosingProgress &&
        Math.abs(closingDelta) > 0.0004 &&
        closingProgress > 0.01 &&
        closingProgress < 0.99
      ) {
        closingSlimeTarget = Math.max(-1, Math.min(1, closingDelta * -46.4))
        scheduleSlimeRender()
      }

      if (
        hasMeasuredFourthProgress &&
        Math.abs(fourthDelta) > 0.0004 &&
        fourthProgress > 0.01 &&
        fourthProgress < 0.99
      ) {
        closingBottomSlimeTarget = Math.max(
          -1,
          Math.min(1, fourthDelta * -46.4),
        )
        scheduleSlimeRender()
      }

      hasMeasuredHeroProgress = true
      hasMeasuredClosingProgress = true
      hasMeasuredFourthProgress = true
      lastHeroProgress = heroProgress
      lastClosingProgress = closingProgress
      lastFourthProgress = fourthProgress

      heroSection.style.setProperty(
        '--hero-scroll-progress',
        heroProgress.toString(),
      )
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
        '--closing-exit-progress',
        fourthProgress.toString(),
      )
      closingSection.style.setProperty(
        '--closing-word-progress',
        closingWordProgress.toString(),
      )
      fourthSection.style.setProperty(
        '--fourth-underlay-progress',
        fourthProgress > 0.001 ? '1' : '0',
      )
    }

    const syncPointerTargets = () => {
      const rect = canvas.getBoundingClientRect()
      const closingRect = closingCanvas.getBoundingClientRect()
      const isInsideSection =
        lastPointerX >= rect.left &&
        lastPointerX <= rect.right &&
        lastPointerY >= rect.top &&
        lastPointerY <= rect.bottom
      const isInsideClosingSection =
        lastPointerX >= closingRect.left &&
        lastPointerX <= closingRect.right &&
        lastPointerY >= closingRect.top &&
        lastPointerY <= closingRect.bottom
      const nextPointerActive =
        hasPointer && isInsideSection && getViewportCoverage(section) >= 0.7
      const nextClosingPointerActive =
        hasPointer &&
        isInsideClosingSection &&
        getViewportCoverage(closingSection) >= 0.7

      targetGridX = lastPointerX - rect.left
      targetGridY = lastPointerY - rect.top
      targetClosingGridX = lastPointerX - closingRect.left
      targetClosingGridY = lastPointerY - closingRect.top

      if (pointerActive !== nextPointerActive) {
        portraitNeedsDraw = true
      }

      if (closingPointerActive !== nextClosingPointerActive) {
        closingNeedsDraw = true
      }

      pointerActive = nextPointerActive
      closingPointerActive = nextClosingPointerActive
    }

    const scheduleDotRender = () => {
      if (animationFrame) {
        return
      }

      animationFrame = window.requestAnimationFrame(render)
    }

    const scheduleParallaxUpdate = () => {
      if (parallaxFrame) {
        return
      }

      parallaxFrame = window.requestAnimationFrame(() => {
        parallaxFrame = 0
        updateParallax()

        if (hasPointer) {
          syncPointerTargets()
          scheduleDotRender()
        }
      })
    }

    const snapToNearestSection = () => {
      const viewportHeight = window.innerHeight || 1
      const deckTop = deckStage.getBoundingClientRect().top + window.scrollY
      const relativeScroll = window.scrollY - deckTop
      const maxSnapDistance = viewportHeight * 0.18
      const snapPoints = [0, viewportHeight, viewportHeight * 2, viewportHeight * 3]
      const nearestPoint = snapPoints.reduce((nearest, point) =>
        Math.abs(point - relativeScroll) < Math.abs(nearest - relativeScroll)
          ? point
          : nearest,
      )

      if (Math.abs(nearestPoint - relativeScroll) > maxSnapDistance) {
        return
      }

      window.scrollTo({
        top: deckTop + nearestPoint,
        behavior: 'smooth',
      })
    }

    const scheduleSectionSnap = () => {
      window.clearTimeout(snapTimeout)
      snapTimeout = window.setTimeout(snapToNearestSection, 120)
    }

    const handleDeckScroll = () => {
      scheduleParallaxUpdate()
      scheduleSectionSnap()
    }

    const render = () => {
      animationFrame = 0
      const gridDeltaX = targetGridX - gridX
      const gridDeltaY = targetGridY - gridY
      const closingGridDeltaX = targetClosingGridX - closingGridX
      const closingGridDeltaY = targetClosingGridY - closingGridY

      gridX += (targetGridX - gridX) * 0.18
      gridY += (targetGridY - gridY) * 0.18
      closingGridX += (targetClosingGridX - closingGridX) * 0.18
      closingGridY += (targetClosingGridY - closingGridY) * 0.18

      const portraitMoving =
        Math.abs(gridDeltaX) > 0.08 ||
        Math.abs(gridDeltaY) > 0.08
      const closingMoving =
        Math.abs(closingGridDeltaX) > 0.08 ||
        Math.abs(closingGridDeltaY) > 0.08

      if (portraitNeedsDraw || pointerActive) {
        drawDots(
          context,
          canvasWidth,
          canvasHeight,
          gridX,
          gridY,
          pointerActive,
          'rgb(255 255 255 / 0.3)',
        )
        portraitNeedsDraw = false
      }

      if (closingNeedsDraw || closingPointerActive) {
        drawDots(
          closingContext,
          closingCanvasWidth,
          closingCanvasHeight,
          closingGridX,
          closingGridY,
          closingPointerActive,
          'rgb(255 255 255 / 0.12)',
        )
        closingNeedsDraw = false
      }

      if (
        (pointerActive && portraitMoving) ||
        (closingPointerActive && closingMoving)
      ) {
        scheduleDotRender()
      }
    }

    const handlePointerMove = (event: PointerEvent) => {
      lastPointerX = event.clientX
      lastPointerY = event.clientY
      hasPointer = true
      syncPointerTargets()
      scheduleDotRender()
    }

    const handlePointerLeave = () => {
      hasPointer = false
      if (pointerActive) {
        portraitNeedsDraw = true
        pointerActive = false
      }
      if (closingPointerActive) {
        closingNeedsDraw = true
        closingPointerActive = false
      }
      scheduleDotRender()
    }

    const handleResize = () => {
      resizeCanvas()
      updateParallax()
      syncPointerTargets()
      portraitNeedsDraw = true
      closingNeedsDraw = true
      scheduleDotRender()
    }

    resizeCanvas()
    updateParallax()
    drawDots(
      context,
      canvasWidth,
      canvasHeight,
      gridX,
      gridY,
      false,
      'rgb(255 255 255 / 0.3)',
    )
    drawDots(
      closingContext,
      closingCanvasWidth,
      closingCanvasHeight,
      closingGridX,
      closingGridY,
      false,
      'rgb(255 255 255 / 0.12)',
    )
    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    window.addEventListener('pointerleave', handlePointerLeave)
    window.addEventListener('scroll', handleDeckScroll, { passive: true })
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerleave', handlePointerLeave)
      window.removeEventListener('scroll', handleDeckScroll)
      window.removeEventListener('resize', handleResize)
      window.clearTimeout(snapTimeout)
      window.cancelAnimationFrame(animationFrame)
      window.cancelAnimationFrame(parallaxFrame)
      window.cancelAnimationFrame(slimeFrame)
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
      <svg className="hero-slime-defs" aria-hidden="true">
        <defs>
          <clipPath id="hero-slime-clip" clipPathUnits="objectBoundingBox">
            <path ref={heroSlimePathRef} d="M -0.02 0 H 1.02 V 1 H -0.02 Z" />
          </clipPath>
          <clipPath id="closing-slime-clip" clipPathUnits="objectBoundingBox">
            <path ref={closingSlimePathRef} d="M -0.02 0 H 1.02 V 1 H -0.02 Z" />
          </clipPath>
        </defs>
      </svg>
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
            className={`portrait-wordmark ${
              isWordmarkRevealed ? 'is-revealed' : ''
            }`}
            src="/uxbyabhi.svg"
            alt=""
            aria-hidden="true"
          />
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
        <section
          ref={fourthSectionRef}
          className="fourth-section"
          aria-label="Selected work"
        />
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
