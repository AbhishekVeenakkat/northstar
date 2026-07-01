import {
  type CSSProperties,
  type FormEvent,
  type MouseEvent,
  type WheelEvent as ReactWheelEvent,
  useEffect,
  useRef,
  useState,
} from 'react'
import { motion, useAnimationControls, useReducedMotion } from 'framer-motion'
import './App.css'

const introText = 'ux by abhi'
const nameText = 'Abhishek Veenakkat'
const loadingTexts = ['Namàsté', 'Vanàkkam', 'Swàgatham', 'Welcome']
const loadingTotalDuration = 2000
const loadingExitDuration = 500
const loadingMorphDuration = loadingTotalDuration - loadingExitDuration
const heroIcons = [
  {
    alt: 'AI sparkle',
    className: 'hero-icon-ai',
    delay: 0.1,
    src: '/hero-icons/ai.png',
  },
  {
    alt: 'Pen nib',
    className: 'hero-icon-pen',
    delay: 0.24,
    src: '/hero-icons/pen.png',
  },
] as const
const manifestoLines = [
  ['Each', 'project', "we've", 'touched', 'holds'],
  ['sentimental', 'importance', 'and'],
  ['showcases', 'our', 'passion', 'for', 'art.'],
]
const contactActions = ['Say hi', 'Lets start a project', 'lets talk'] as const
const menuLinks = [
  { href: '#about', label: 'About' },
  { href: '#works', label: 'Works' },
  { href: '#taste', label: 'Taste' },
  { href: '#contact', label: 'Contact' },
] as const
const workGridItems = Array.from({ length: 10 }, (_, index) => ({
  alt: `Temporary work preview ${index + 1}`,
  className:
    index % 5 === 0
      ? 'is-wide'
      : index % 4 === 0
        ? 'is-tall'
        : '',
  subtitle: [
    'Product Design',
    'Interface System',
    'Frontend Build',
    'Visual Direction',
    'Experience Audit',
  ][index % 5],
  title: [
    'Commerce Flow',
    'Fleet Console',
    'Health Dashboard',
    'Creator Tools',
    'Finance Workspace',
    'Delivery Ops',
    'Insight Cards',
    'Mobile Journey',
    'Admin Suite',
    'Growth Lab',
  ][index],
  src: `https://picsum.photos/seed/uxbyabhi-work-${index + 1}/900/650`,
}))
const tastemaxxingGridItems = Array.from({ length: 10 }, (_, index) => ({
  alt: `Temporary Tastemaxxing visual experiment ${index + 1}`,
  className:
    index % 4 === 1
      ? 'is-wide'
      : index % 5 === 2
        ? 'is-tall'
        : '',
  subtitle: [
    'Visual UI Experiment',
    'Motion Study',
    'Micro Interaction',
    'Aesthetic System',
    'Interface Mood',
  ][index % 5],
  title: [
    'Glass Controls',
    'Taste Panels',
    'Gradient Ritual',
    'Soft Chrome',
    'Ambient Cards',
    'Depth Buttons',
    'Signal Shapes',
    'Playful Stack',
    'Hyper Detail',
    'Mood Board',
  ][index],
  src: `https://picsum.photos/seed/tastemaxxing-${index + 1}/900/650`,
}))
type ContactAction = (typeof contactActions)[number]

const getBrowserLocationLabel = () => {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone

  if (timezone === 'Asia/Kolkata' || timezone === 'Asia/Calcutta') {
    return 'India'
  }

  const timezoneCity = timezone?.split('/').at(-1)?.replaceAll('_', ' ')

  return timezoneCity || 'your corner of the world'
}

const getDayPeriod = () => {
  const hour = new Date().getHours()

  if (hour < 5) {
    return 'night'
  }

  if (hour < 12) {
    return 'morning'
  }

  if (hour < 17) {
    return 'afternoon'
  }

  if (hour < 21) {
    return 'evening'
  }

  return 'night'
}

const getViewportCoverage = (element: Element) => {
  const rect = element.getBoundingClientRect()
  const viewportHeight = window.innerHeight || 1
  const visibleHeight = Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0)

  return Math.max(0, Math.min(1, visibleHeight / viewportHeight))
}

type HeroIconProps = (typeof heroIcons)[number] & {
  reducedMotion: boolean | null
}

function FloatingHeroIcon({
  alt,
  className,
  delay,
  reducedMotion,
  src,
}: HeroIconProps) {
  const controls = useAnimationControls()
  const returnTimeoutRef = useRef<number>(0)

  useEffect(
    () => () => {
      window.clearTimeout(returnTimeoutRef.current)
    },
    [],
  )

  return (
    <motion.div
      className={`hero-floating-icon ${className}`}
      initial={reducedMotion ? false : { opacity: 0, scale: 0.42 }}
      animate={
        reducedMotion
          ? { opacity: 1, scale: 1 }
          : {
              opacity: 1,
              scale: 1,
              transition: {
                delay,
                duration: 0.72,
                ease: [0.16, 1, 0.3, 1],
              },
            }
      }
    >
      <motion.img
        src={src}
        alt={alt}
        draggable={false}
        drag={reducedMotion ? false : true}
        dragElastic={0.16}
        dragMomentum={false}
        animate={controls}
        onDragStart={() => {
          window.clearTimeout(returnTimeoutRef.current)
          controls.stop()
        }}
        onDragEnd={() => {
          returnTimeoutRef.current = window.setTimeout(() => {
            void controls.start({
              x: 0,
              y: 0,
              transition: {
                duration: 4.5,
                ease: [0.16, 1, 0.3, 1],
              },
            })
          }, 2000)
        }}
        whileDrag={reducedMotion ? undefined : { scale: 1.08 }}
      />
    </motion.div>
  )
}

function App() {
  const prefersReducedWordmarkMotion = useReducedMotion()
  const cursorRef = useRef<HTMLDivElement>(null)
  const deckStageRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLCanvasElement>(null)
  const heroSectionRef = useRef<HTMLElement>(null)
  const heroSlimePathRef = useRef<SVGPathElement>(null)
  const loadingSlimePathRef = useRef<SVGPathElement>(null)
  const portraitGridRef = useRef<HTMLCanvasElement>(null)
  const portraitSectionRef = useRef<HTMLElement>(null)
  const closingGridRef = useRef<HTMLCanvasElement>(null)
  const timelineGridRef = useRef<HTMLCanvasElement>(null)
  const closingSlimePathRef = useRef<SVGPathElement>(null)
  const closingSectionRef = useRef<HTMLElement>(null)
  const fourthSectionRef = useRef<HTMLElement>(null)
  const worksSectionRef = useRef<HTMLElement>(null)
  const tastemaxxingSectionRef = useRef<HTMLElement>(null)
  const experienceIntroRef = useRef<HTMLDivElement>(null)
  const experienceDroneRef = useRef<HTMLDivElement>(null)
  const experienceCurrentRef = useRef<HTMLDivElement>(null)
  const timelineIntroRef = useRef<HTMLDivElement>(null)
  const timelinePanelRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const loadingTextOneRef = useRef<HTMLSpanElement>(null)
  const loadingTextTwoRef = useRef<HTMLSpanElement>(null)
  const contactRevealStageRef = useRef<HTMLDivElement>(null)
  const contactCardRef = useRef<HTMLDivElement>(null)
  const contactCardContentRef = useRef<HTMLDivElement>(null)
  const contactPopAudioRef = useRef<AudioContext | null>(null)
  const contactPopCooldownRef = useRef(0)
  const timelineHoverCooldownRef = useRef(0)
  const isIdCardDragSoundActiveRef = useRef(false)
  const worksScrollHandoffTimeoutRef = useRef(0)
  const activeShowcaseSectionRef = useRef<HTMLElement | null>(null)
  const isMenuNavigationRef = useRef(false)
  const menuNavigationTimeoutRef = useRef(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoaderExiting, setIsLoaderExiting] = useState(false)
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
  const [isIdCardRevealed, setIsIdCardRevealed] = useState(() => {
    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return true
    }

    return false
  })
  const [isWorksGridRevealed, setIsWorksGridRevealed] = useState(() => {
    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return true
    }

    return false
  })
  const [isTastemaxxingGridRevealed, setIsTastemaxxingGridRevealed] =
    useState(() => {
      if (
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ) {
        return true
      }

      return false
    })
  const [isTimelineRevealed, setIsTimelineRevealed] = useState(() => {
    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return true
    }

    return false
  })
  const [expandedTimelineCard, setExpandedTimelineCard] = useState<
    'baton' | 'fantacode' | 'bamboo' | null
  >(null)
  const [isDroneRevealed, setIsDroneRevealed] = useState(() => {
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
  const [contactLocation, setContactLocation] = useState(() => {
    if (typeof window === 'undefined') {
      return 'your corner of the world'
    }

    return getBrowserLocationLabel()
  })
  const [contactDayPeriod, setContactDayPeriod] = useState(() => {
    if (typeof window === 'undefined') {
      return 'afternoon'
    }

    return getDayPeriod()
  })
  const [selectedContactAction, setSelectedContactAction] =
    useState<ContactAction | null>(null)
  const [isContactSubmitted, setIsContactSubmitted] = useState(false)
  const [contactCardHeight, setContactCardHeight] = useState<number | null>(
    null,
  )

  const resetShowcaseGrid = (
    section: HTMLElement | null,
    behavior: ScrollBehavior = 'smooth',
  ) => {
    const gridScroller =
      section?.querySelector<HTMLElement>('.works-grid-scroll')

    gridScroller?.scrollTo({
      top: 0,
      behavior,
    })
  }

  const handleMenuLinkClick = (
    event: MouseEvent<HTMLAnchorElement>,
    href: (typeof menuLinks)[number]['href'],
  ) => {
    event.preventDefault()
    setIsMenuOpen(false)
    window.clearTimeout(menuNavigationTimeoutRef.current)
    isMenuNavigationRef.current = true

    const targetSection = document.querySelector<HTMLElement>(href)

    targetSection?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })

    if (href === '#works' || href === '#taste') {
      window.setTimeout(() => {
        resetShowcaseGrid(targetSection)
      }, 680)
    }

    window.history.replaceState(null, '', href)
    menuNavigationTimeoutRef.current = window.setTimeout(() => {
      isMenuNavigationRef.current = false
    }, 1200)
  }

  const getPortfolioAudioContext = () => {
    if (typeof window === 'undefined') {
      return null
    }

    const AudioContextConstructor =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext

    if (!AudioContextConstructor) {
      return null
    }

    const audioContext =
      contactPopAudioRef.current ?? new AudioContextConstructor()
    contactPopAudioRef.current = audioContext

    if (audioContext.state === 'suspended') {
      void audioContext.resume()
    }

    return audioContext
  }

  const unlockPortfolioAudio = () => {
    const audioContext = getPortfolioAudioContext()

    if (!audioContext) {
      return
    }

    const source = audioContext.createBufferSource()
    const gain = audioContext.createGain()

    source.buffer = audioContext.createBuffer(1, 1, audioContext.sampleRate)
    gain.gain.setValueAtTime(0.0001, audioContext.currentTime)
    source.connect(gain)
    gain.connect(audioContext.destination)
    source.start(audioContext.currentTime)
    source.stop(audioContext.currentTime + 0.01)
    source.onended = () => {
      source.disconnect()
      gain.disconnect()
    }
  }

  const playContactBubblePop = () => {
    if (
      typeof window === 'undefined' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return
    }

    const now = window.performance.now()

    if (now - contactPopCooldownRef.current < 110) {
      return
    }

    contactPopCooldownRef.current = now

    const audioContext = getPortfolioAudioContext()

    if (!audioContext || audioContext.state !== 'running') {
      return
    }

    const startTime = audioContext.currentTime
    const oscillator = audioContext.createOscillator()
    const gain = audioContext.createGain()

    oscillator.type = 'sine'
    oscillator.frequency.setValueAtTime(520, startTime)
    oscillator.frequency.exponentialRampToValueAtTime(980, startTime + 0.052)

    gain.gain.setValueAtTime(0.0001, startTime)
    gain.gain.exponentialRampToValueAtTime(0.075, startTime + 0.012)
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.13)

    oscillator.connect(gain)
    gain.connect(audioContext.destination)
    oscillator.start(startTime)
    oscillator.stop(startTime + 0.14)
    oscillator.onended = () => {
      oscillator.disconnect()
      gain.disconnect()
    }
  }

  const playTimelineCardHover = () => {
    if (
      typeof window === 'undefined' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return
    }

    const now = window.performance.now()

    if (now - timelineHoverCooldownRef.current < 170) {
      return
    }

    timelineHoverCooldownRef.current = now

    const audioContext = getPortfolioAudioContext()

    if (!audioContext || audioContext.state !== 'running') {
      return
    }

    const startTime = audioContext.currentTime
    const oscillator = audioContext.createOscillator()
    const gain = audioContext.createGain()

    oscillator.type = 'triangle'
    oscillator.frequency.setValueAtTime(310, startTime)
    oscillator.frequency.exponentialRampToValueAtTime(430, startTime + 0.04)
    oscillator.frequency.exponentialRampToValueAtTime(260, startTime + 0.12)

    gain.gain.setValueAtTime(0.0001, startTime)
    gain.gain.exponentialRampToValueAtTime(0.052, startTime + 0.012)
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.16)

    oscillator.connect(gain)
    gain.connect(audioContext.destination)
    oscillator.start(startTime)
    oscillator.stop(startTime + 0.17)
    oscillator.onended = () => {
      oscillator.disconnect()
      gain.disconnect()
    }
  }

  const playIdCardUiTone = (tone: 'lift' | 'settle') => {
    if (
      typeof window === 'undefined' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return
    }

    const audioContext = getPortfolioAudioContext()

    if (!audioContext || audioContext.state !== 'running') {
      return
    }

    const startTime = audioContext.currentTime
    const primary = audioContext.createOscillator()
    const secondary = audioContext.createOscillator()
    const gain = audioContext.createGain()
    const endTime = startTime + 0.18

    primary.type = 'sine'
    secondary.type = 'triangle'

    if (tone === 'lift') {
      primary.frequency.setValueAtTime(360, startTime)
      primary.frequency.exponentialRampToValueAtTime(620, startTime + 0.12)
      secondary.frequency.setValueAtTime(720, startTime)
      secondary.frequency.exponentialRampToValueAtTime(930, startTime + 0.1)
    } else {
      primary.frequency.setValueAtTime(560, startTime)
      primary.frequency.exponentialRampToValueAtTime(280, startTime + 0.14)
      secondary.frequency.setValueAtTime(740, startTime)
      secondary.frequency.exponentialRampToValueAtTime(410, startTime + 0.14)
    }

    gain.gain.setValueAtTime(0.0001, startTime)
    gain.gain.exponentialRampToValueAtTime(
      tone === 'lift' ? 0.038 : 0.03,
      startTime + 0.018,
    )
    gain.gain.exponentialRampToValueAtTime(0.0001, endTime)

    primary.connect(gain)
    secondary.connect(gain)
    gain.connect(audioContext.destination)
    primary.start(startTime)
    secondary.start(startTime)
    primary.stop(endTime)
    secondary.stop(endTime)
    primary.onended = () => {
      primary.disconnect()
      secondary.disconnect()
      gain.disconnect()
    }
  }

  const startIdCardDragSound = () => {
    if (isIdCardDragSoundActiveRef.current) {
      return
    }

    isIdCardDragSoundActiveRef.current = true
    playIdCardUiTone('lift')
  }

  const stopIdCardDragSound = () => {
    isIdCardDragSoundActiveRef.current = false
    playIdCardUiTone('settle')
  }

  const handleWorksGridWheel = (event: ReactWheelEvent<HTMLDivElement>) => {
    const gridScroller = event.currentTarget
    const worksSection =
      gridScroller.closest<HTMLElement>('.works-showcase-section')
    const viewportHeight = window.innerHeight || 1
    const worksRect = worksSection?.getBoundingClientRect()
    const isWorksSettled =
      worksRect !== undefined &&
      Math.abs(worksRect.top) <= 8 &&
      Math.abs(worksRect.bottom - viewportHeight) <= 8

    if (
      window.innerWidth > 720 &&
      worksSection &&
      !isWorksSettled &&
      Math.abs(event.deltaY) >= 4
    ) {
      event.preventDefault()

      if (!worksScrollHandoffTimeoutRef.current) {
        worksSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        })

        worksScrollHandoffTimeoutRef.current = window.setTimeout(() => {
          worksScrollHandoffTimeoutRef.current = 0
        }, 620)
      }

      return
    }

    const isAtTop = gridScroller.scrollTop <= 1
    const isAtBottom =
      gridScroller.scrollTop + gridScroller.clientHeight >=
      gridScroller.scrollHeight - 1
    const isScrollingUp = event.deltaY < 0
    const isScrollingDown = event.deltaY > 0

    if (
      window.innerWidth <= 720 ||
      Math.abs(event.deltaY) < 4 ||
      worksScrollHandoffTimeoutRef.current ||
      ((!isAtTop || !isScrollingUp) && (!isAtBottom || !isScrollingDown))
    ) {
      return
    }

    const targetSection = isScrollingDown
      ? worksSection?.nextElementSibling
      : worksSection?.previousElementSibling

    if (!(targetSection instanceof HTMLElement)) {
      return
    }

    event.preventDefault()
    targetSection.scrollIntoView({
      behavior: 'smooth',
      block: isScrollingUp ? 'end' : 'start',
    })

    worksScrollHandoffTimeoutRef.current = window.setTimeout(() => {
      worksScrollHandoffTimeoutRef.current = 0
    }, 720)
  }

  const handleContactSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsContactSubmitted(true)
  }

  useEffect(() => {
    const exitTimeout = window.setTimeout(() => {
      setIsLoaderExiting(true)
    }, loadingMorphDuration)
    const loadingTimeout = window.setTimeout(() => {
      setIsLoading(false)
    }, loadingTotalDuration)

    return () => {
      window.clearTimeout(exitTimeout)
      window.clearTimeout(loadingTimeout)
    }
  }, [])

  useEffect(
    () => () => {
      window.clearTimeout(menuNavigationTimeoutRef.current)
      window.clearTimeout(worksScrollHandoffTimeoutRef.current)
    },
    [],
  )

  useEffect(() => {
    const unlockAudio = () => {
      unlockPortfolioAudio()
    }

    window.addEventListener('pointerdown', unlockAudio, {
      capture: true,
      once: true,
    })
    window.addEventListener('keydown', unlockAudio, {
      capture: true,
      once: true,
    })

    return () => {
      window.removeEventListener('pointerdown', unlockAudio, {
        capture: true,
      })
      window.removeEventListener('keydown', unlockAudio, {
        capture: true,
      })
    }
  }, [])

  useEffect(() => {
    setContactDayPeriod(getDayPeriod())
    setContactLocation(getBrowserLocationLabel())
  }, [])

  useEffect(() => {
    const showcaseSections = [
      worksSectionRef.current,
      tastemaxxingSectionRef.current,
    ].filter((section): section is HTMLElement => Boolean(section))

    if (!showcaseSections.length) {
      return undefined
    }

    const resetSettledGrid = () => {
      const viewportHeight = window.innerHeight || 1
      const settledSection = showcaseSections.find((section) => {
        const rect = section.getBoundingClientRect()

        return (
          Math.abs(rect.top) <= viewportHeight * 0.18 &&
          rect.bottom >= viewportHeight * 0.72
        )
      })

      if (!settledSection) {
        activeShowcaseSectionRef.current = null
        return
      }

      if (activeShowcaseSectionRef.current === settledSection) {
        return
      }

      activeShowcaseSectionRef.current = settledSection
      resetShowcaseGrid(settledSection)
    }

    resetSettledGrid()
    window.addEventListener('scroll', resetSettledGrid, { passive: true })
    window.addEventListener('resize', resetSettledGrid)

    return () => {
      window.removeEventListener('scroll', resetSettledGrid)
      window.removeEventListener('resize', resetSettledGrid)
    }
  }, [])

  useEffect(() => {
    const revealTargets = [
      {
        isRevealed: isWorksGridRevealed,
        ref: worksSectionRef,
        reveal: () => setIsWorksGridRevealed(true),
      },
      {
        isRevealed: isTastemaxxingGridRevealed,
        ref: tastemaxxingSectionRef,
        reveal: () => setIsTastemaxxingGridRevealed(true),
      },
    ].filter(({ isRevealed, ref }) => !isRevealed && ref.current)

    if (!revealTargets.length) {
      return undefined
    }

    const revealVisibleTargets = () => {
      const viewportHeight = window.innerHeight || 1

      revealTargets.forEach(({ ref, reveal }) => {
        const target = ref.current

        if (!target) {
          return
        }

        const rect = target.getBoundingClientRect()
        const isNearViewport =
          rect.top < viewportHeight * 0.9 && rect.bottom > viewportHeight * 0.1

        if (isNearViewport) {
          reveal()
        }
      })
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting || entry.intersectionRatio < 0.28) {
            return
          }

          const target = revealTargets.find(
            ({ ref }) => ref.current === entry.target,
          )

          target?.reveal()
          observer.unobserve(entry.target)
        })
      },
      { threshold: [0.28] },
    )

    revealTargets.forEach(({ ref }) => {
      if (ref.current) {
        observer.observe(ref.current)
      }
    })

    revealVisibleTargets()
    window.addEventListener('scroll', revealVisibleTargets, { passive: true })
    window.addEventListener('resize', revealVisibleTargets)

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', revealVisibleTargets)
      window.removeEventListener('resize', revealVisibleTargets)
    }
  }, [isTastemaxxingGridRevealed, isWorksGridRevealed])

  useEffect(() => {
    const card = contactCardRef.current
    const content = contactCardContentRef.current

    if (!card || !content) {
      return undefined
    }

    const updateContactCardHeight = () => {
      const cardStyles = window.getComputedStyle(card)
      const paddingBlock =
        parseFloat(cardStyles.paddingTop) + parseFloat(cardStyles.paddingBottom)
      const minHeight = parseFloat(cardStyles.minHeight)
      const contentHeight = isContactSubmitted
        ? Number.isNaN(minHeight)
          ? 0
          : minHeight
        : content.scrollHeight + paddingBlock
      const nextHeight = Math.ceil(
        Math.max(Number.isNaN(minHeight) ? 0 : minHeight, contentHeight),
      )

      setContactCardHeight((currentHeight) =>
        currentHeight === nextHeight ? currentHeight : nextHeight,
      )
    }

    updateContactCardHeight()

    const resizeObserver = new ResizeObserver(updateContactCardHeight)
    resizeObserver.observe(content)
    window.addEventListener('resize', updateContactCardHeight)

    return () => {
      resizeObserver.disconnect()
      window.removeEventListener('resize', updateContactCardHeight)
    }
  }, [isContactSubmitted, selectedContactAction])

  useEffect(() => {
    const stage = contactRevealStageRef.current

    if (!stage) {
      return undefined
    }

    let animationFrame = 0
    const updateHiddenCardProgress = () => {
      animationFrame = 0
      const section = stage.closest<HTMLElement>('.portfolio-contact-section')
      const rect = section?.getBoundingClientRect() ?? stage.getBoundingClientRect()
      const revealDistance = 150
      const revealStartOffset = parseFloat(
        window.getComputedStyle(stage).paddingBottom,
      )
      const rawProgress = Math.max(
        0,
        Math.min(1, (-rect.top - revealStartOffset) / revealDistance),
      )
      const easedProgress = Math.pow(rawProgress, 0.82)

      stage.style.setProperty(
        '--contact-hidden-card-progress',
        easedProgress.toFixed(3),
      )
    }

    const scheduleHiddenCardProgress = () => {
      if (animationFrame) {
        return
      }

      animationFrame = window.requestAnimationFrame(updateHiddenCardProgress)
    }

    updateHiddenCardProgress()
    window.addEventListener('scroll', scheduleHiddenCardProgress, {
      passive: true,
    })
    window.addEventListener('resize', scheduleHiddenCardProgress)

    return () => {
      window.removeEventListener('scroll', scheduleHiddenCardProgress)
      window.removeEventListener('resize', scheduleHiddenCardProgress)
      window.cancelAnimationFrame(animationFrame)
    }
  }, [])

  useEffect(() => {
    if (!isLoading) {
      return undefined
    }

    const textOne = loadingTextOneRef.current
    const textTwo = loadingTextTwoRef.current

    if (!textOne || !textTwo) {
      return undefined
    }

    const segmentDuration = loadingMorphDuration / loadingTexts.length
    const holdRatio = 0.34
    const morphRatio = 0.5
    const startTime = window.performance.now()
    let frame = 0

    const setReadable = (text: string) => {
      textOne.textContent = text
      textTwo.textContent = ''
      textOne.style.filter = 'blur(0px)'
      textTwo.style.filter = 'blur(100px)'
      textOne.style.opacity = '100%'
      textTwo.style.opacity = '0%'
    }

    const setMorph = (currentText: string, nextText: string, fraction: number) => {
      const safeFraction = Math.max(0.001, Math.min(1, fraction))
      const inverseFraction = Math.max(0.001, 1 - safeFraction)

      textOne.textContent = currentText
      textTwo.textContent = nextText
      textTwo.style.filter = `blur(${Math.min(8 / safeFraction - 8, 100)}px)`
      textTwo.style.opacity = `${Math.pow(safeFraction, 0.4) * 100}%`
      textOne.style.filter = `blur(${Math.min(8 / inverseFraction - 8, 100)}px)`
      textOne.style.opacity = `${Math.pow(inverseFraction, 0.4) * 100}%`
    }

    const renderMorph = (now: number) => {
      const elapsed = Math.min(loadingMorphDuration - 1, now - startTime)
      const segmentIndex = Math.min(
        loadingTexts.length - 1,
        Math.floor(elapsed / segmentDuration),
      )
      const localProgress = (elapsed - segmentIndex * segmentDuration) / segmentDuration
      const currentText = loadingTexts[segmentIndex]
      const nextText = loadingTexts[Math.min(segmentIndex + 1, loadingTexts.length - 1)]

      if (segmentIndex === loadingTexts.length - 1 || localProgress < holdRatio) {
        setReadable(currentText)
      } else {
        const morphProgress = Math.min(
          1,
          (localProgress - holdRatio) / morphRatio,
        )
        setMorph(currentText, nextText, morphProgress)
      }

      frame = window.requestAnimationFrame(renderMorph)
    }

    setReadable(loadingTexts[0])
    frame = window.requestAnimationFrame(renderMorph)

    return () => {
      window.cancelAnimationFrame(frame)
    }
  }, [isLoading])

  useEffect(() => {
    const intro = experienceIntroRef.current

    if (!intro || isDroneRevealed) {
      return undefined
    }

    let revealTimeout = 0
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting || entry.intersectionRatio < 0.4) {
          return
        }

        revealTimeout = window.setTimeout(() => {
          setIsDroneRevealed(true)
        }, 1000)
        observer.disconnect()
      },
      { threshold: [0.4] },
    )

    observer.observe(intro)

    return () => {
      window.clearTimeout(revealTimeout)
      observer.disconnect()
    }
  }, [isDroneRevealed])

  useEffect(() => {
    if (!isLoaderExiting) {
      loadingSlimePathRef.current?.setAttribute(
        'd',
        'M -0.02 0 H 1.02 V 1 H -0.02 Z',
      )
      return undefined
    }

    const loadingSlimePath = loadingSlimePathRef.current

    if (!loadingSlimePath) {
      return undefined
    }

    let frame = 0
    const startTime = window.performance.now()

    const easeOutCubic = (progress: number) => 1 - Math.pow(1 - progress, 3)

    const renderLoadingSlime = (now: number) => {
      const progress = Math.min(1, (now - startTime) / loadingExitDuration)
      const easedProgress = easeOutCubic(progress)
      const edge = easedProgress * 0.28
      const shoulder = easedProgress * 0.13
      const peak = easedProgress * 0.02
      const clipLeft = -0.02
      const clipRight = 1.02
      const path = [
        `M ${clipLeft} 1 H ${clipRight}`,
        `V ${edge.toFixed(4)}`,
        `C 0.9 ${edge.toFixed(4)}, 0.84 ${edge.toFixed(4)}, 0.76 ${shoulder.toFixed(4)}`,
        `C 0.66 ${peak.toFixed(4)}, 0.6 ${peak.toFixed(4)}, 0.5 ${peak.toFixed(4)}`,
        `C 0.4 ${peak.toFixed(4)}, 0.34 ${peak.toFixed(4)}, 0.24 ${shoulder.toFixed(4)}`,
        `C 0.16 ${edge.toFixed(4)}, 0.1 ${edge.toFixed(4)}, ${clipLeft} ${edge.toFixed(4)}`,
        'V 1 Z',
      ].join(' ')

      loadingSlimePath.setAttribute('d', path)

      if (progress < 1) {
        frame = window.requestAnimationFrame(renderLoadingSlime)
      }
    }

    frame = window.requestAnimationFrame(renderLoadingSlime)

    return () => {
      window.cancelAnimationFrame(frame)
    }
  }, [isLoaderExiting])

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
    if (isIdCardRevealed) {
      return undefined
    }

    const fourthSection = fourthSectionRef.current

    if (!fourthSection) {
      return undefined
    }

    let frame = 0

    const revealWhenVisible = () => {
      frame = 0

      if (getViewportCoverage(fourthSection) >= 0.82) {
        setIsIdCardRevealed(true)
      }
    }

    const scheduleRevealCheck = () => {
      if (frame) {
        return
      }

      frame = window.requestAnimationFrame(revealWhenVisible)
    }

    scheduleRevealCheck()
    window.addEventListener('scroll', scheduleRevealCheck, { passive: true })
    window.addEventListener('resize', scheduleRevealCheck)

    return () => {
      window.removeEventListener('scroll', scheduleRevealCheck)
      window.removeEventListener('resize', scheduleRevealCheck)
      window.cancelAnimationFrame(frame)
    }
  }, [isIdCardRevealed])

  useEffect(() => {
    if (isTimelineRevealed) {
      return undefined
    }

    const timelinePanel = timelinePanelRef.current

    if (!timelinePanel) {
      return undefined
    }

    let frame = 0

    const revealWhenVisible = () => {
      frame = 0

      if (getViewportCoverage(timelinePanel) >= 0.48) {
        setIsTimelineRevealed(true)
      }
    }

    const scheduleRevealCheck = () => {
      if (frame) {
        return
      }

      frame = window.requestAnimationFrame(revealWhenVisible)
    }

    scheduleRevealCheck()
    window.addEventListener('scroll', scheduleRevealCheck, { passive: true })
    window.addEventListener('resize', scheduleRevealCheck)

    return () => {
      window.removeEventListener('scroll', scheduleRevealCheck)
      window.removeEventListener('resize', scheduleRevealCheck)
      window.cancelAnimationFrame(frame)
    }
  }, [isTimelineRevealed])

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
      const isOverNativePointer = Boolean(
        target instanceof Element &&
          target.closest('a, button, [role="button"], input, textarea, select'),
      )
      const isOverWorkCard = Boolean(
        target instanceof Element && target.closest('.work-grid-card'),
      )

      targetCursorX = event.clientX
      targetCursorY = event.clientY
      lastPointerX = event.clientX
      lastPointerY = event.clientY
      pointerActive = !isNearViewportEdge && !isOverNativePointer
      syncGridTarget()

      if (cursor) {
        if (isNearViewportEdge || isOverNativePointer) {
          cursor.style.opacity = '0'
        }

        cursor.classList.toggle('is-work-card', isOverWorkCard)
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
        cursor.classList.remove('is-work-card')
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
    const experienceCurrent = experienceCurrentRef.current
    const timelineIntro = timelineIntroRef.current
    const closingCanvas = closingGridRef.current
    const timelineCanvas = timelineGridRef.current
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
      !experienceCurrent ||
      !timelineIntro ||
      !experienceDroneRef.current ||
      !closingCanvas ||
      !timelineCanvas ||
      prefersReducedMotion
    ) {
      return undefined
    }

    const context = canvas.getContext('2d')
    const closingContext = closingCanvas.getContext('2d')
    const timelineContext = timelineCanvas.getContext('2d')
    if (!context || !closingContext || !timelineContext) {
      return undefined
    }

    const experienceDrone = experienceDroneRef.current

    if (!experienceDrone) {
      return undefined
    }

    let animationFrame = 0
    let parallaxFrame = 0
    let slimeFrame = 0
    let canvasWidth = 0
    let canvasHeight = 0
    let closingCanvasWidth = 0
    let closingCanvasHeight = 0
    let timelineCanvasWidth = 0
    let timelineCanvasHeight = 0
    let pixelRatio = 1
    let gridX = window.innerWidth / 2
    let gridY = window.innerHeight / 2
    let targetGridX = gridX
    let targetGridY = gridY
    let closingGridX = window.innerWidth / 2
    let closingGridY = window.innerHeight / 2
    let targetClosingGridX = closingGridX
    let targetClosingGridY = closingGridY
    let timelineGridX = window.innerWidth / 2
    let timelineGridY = window.innerHeight / 2
    let targetTimelineGridX = timelineGridX
    let targetTimelineGridY = timelineGridY
    let closingPointerActive = false
    let timelinePointerActive = false
    let pointerActive = false
    let lastPointerX = window.innerWidth / 2
    let lastPointerY = window.innerHeight / 2
    let hasPointer = false
    let portraitNeedsDraw = true
    let closingNeedsDraw = true
    let timelineNeedsDraw = true
    let snapTimeout = 0
    let snapFrame = 0
    let isSnapping = false
    let lastDocumentScroll = window.scrollY
    let lastRelativeScroll = 0
    let lastScrollDirection = 0
    let scrollGestureBaseIndex = 0
    let scrollGestureDirection = 0
    let scrollGestureTimeout = 0
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
      const timelineRect = timelineCanvas.getBoundingClientRect()
      pixelRatio = Math.min(window.devicePixelRatio || 1, 2)
      canvasWidth = Math.round(rect.width)
      canvasHeight = Math.round(rect.height)
      closingCanvasWidth = Math.round(closingRect.width)
      closingCanvasHeight = Math.round(closingRect.height)
      timelineCanvasWidth = Math.round(timelineRect.width)
      timelineCanvasHeight = Math.round(timelineRect.height)
      canvas.width = Math.round(canvasWidth * pixelRatio)
      canvas.height = Math.round(canvasHeight * pixelRatio)
      closingCanvas.width = Math.round(closingCanvasWidth * pixelRatio)
      closingCanvas.height = Math.round(closingCanvasHeight * pixelRatio)
      timelineCanvas.width = Math.round(timelineCanvasWidth * pixelRatio)
      timelineCanvas.height = Math.round(timelineCanvasHeight * pixelRatio)
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
      closingContext.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
      timelineContext.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
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
      const edgePull = 0.24
      const shoulderPull = 0.1
      const slimeEdge = isScrollDownReaction
        ? 1 - strength * edgePull
        : 1 - strength * 0.02
      const slimeShoulder = 1 - strength * shoulderPull
      const slimePeak = isScrollDownReaction
        ? 1 - strength * 0.02
        : 1 - strength * edgePull
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
      const edgePull = 0.24
      const shoulderPull = 0.1
      const topEdge = isTopScrollDownReaction
        ? topStrength * 0.02
        : topStrength * edgePull
      const topShoulder = topStrength * shoulderPull
      const topPeak = isTopScrollDownReaction
        ? topStrength * edgePull
        : topStrength * 0.02
      const bottomStrength = Math.min(1, Math.abs(bottomAmount))
      const isBottomScrollDownReaction = bottomAmount >= 0
      const bottomEdge = isBottomScrollDownReaction
        ? 1 - bottomStrength * edgePull
        : 1 - bottomStrength * 0.02
      const bottomShoulder = 1 - bottomStrength * shoulderPull
      const bottomPeak = isBottomScrollDownReaction
        ? 1 - bottomStrength * 0.02
        : 1 - bottomStrength * edgePull
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
      slimeTarget *= 0.72
      slimePosition += (slimeTarget - slimePosition) * 0.22
      closingSlimeTarget *= 0.72
      closingSlimePosition +=
        (closingSlimeTarget - closingSlimePosition) * 0.22
      closingBottomSlimeTarget *= 0.72
      closingBottomSlimePosition +=
        (closingBottomSlimeTarget - closingBottomSlimePosition) * 0.22

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
      const sectionScrollUnit =
        Math.max(1, deckStage.offsetHeight - viewportHeight) / 6 ||
        viewportHeight
      const heroProgress = Math.min(
        1,
        Math.max(0, -deckRect.top / sectionScrollUnit),
      )
      const closingProgress = Math.min(
        1,
        Math.max(0, (-deckRect.top - sectionScrollUnit) / sectionScrollUnit),
      )
      const closingWordProgress = Math.min(
        1,
        Math.max(0, (-deckRect.top - sectionScrollUnit * 2) / sectionScrollUnit),
      )
      const fourthProgress = Math.min(
        1,
        Math.max(0, (-deckRect.top - sectionScrollUnit * 3) / sectionScrollUnit),
      )
      const experienceEntryProgress = Math.min(
        1,
        Math.max(0, (-deckRect.top - sectionScrollUnit * 4) / sectionScrollUnit),
      )
      const timelineProgress = Math.min(
        1,
        Math.max(0, (-deckRect.top - sectionScrollUnit * 5) / sectionScrollUnit),
      )
      const timelineSlideProgress = timelineProgress
      const timelineLineProgress = timelineSlideProgress
      const experienceTrackProgress =
        experienceEntryProgress * 0.5 + timelineSlideProgress * 0.5
      const clampValue = (value: number, min: number, max: number) =>
        Math.min(max, Math.max(min, value))
      const sectionWidth =
        fourthSection.getBoundingClientRect().width || window.innerWidth || 1
      const sectionRect = fourthSection.getBoundingClientRect()
      const heading = experienceCurrent.querySelector('h2')
      const headingRect = heading?.getBoundingClientRect()
      const timelineIntroTitle = timelineIntro.querySelector('h2')
      const timelineIntroRect = timelineIntroTitle?.getBoundingClientRect()
      const isResponsiveExperience = sectionWidth <= 900
      const isMobileExperience = sectionWidth <= 640
      const droneWidth = isResponsiveExperience
        ? Math.min(168, sectionWidth * 0.43)
        : Math.min(230, sectionWidth * 0.42)
      const droneGap = clampValue(sectionWidth * 0.014, 8, 16)
      const introImageHalf = Math.min(125, sectionWidth * 0.26)
      const droneStartX =
        sectionWidth / 2 - introImageHalf - droneGap / 2 - droneWidth / 2
      const droneStartY = isMobileExperience
        ? clampValue(viewportHeight * 0.15, 108, 142)
        : clampValue(viewportHeight * 0.15, 92, 142)
      const droneTargetX =
        headingRect && !isResponsiveExperience
          ? headingRect.left -
            sectionRect.left +
            headingRect.width / 2 -
            droneWidth / 2 -
            clampValue(sectionWidth * 0.045, 42, 72)
          : sectionWidth / 2 -
            droneWidth / 2 -
            clampValue(sectionWidth * 0.018, 4, 10)
      const droneTargetY =
        isResponsiveExperience
          ? clampValue(viewportHeight * 0.29, 224, 270)
          : headingRect
            ? headingRect.top - sectionRect.top - droneWidth * 1.12
            : clampValue(viewportHeight * 0.04, 24, 42)
      const droneTimelineY = isResponsiveExperience
        ? clampValue(viewportHeight * 0.14, 108, 136)
        : timelineIntroRect
          ? timelineIntroRect.bottom - sectionRect.top + 22
          : clampValue(viewportHeight * 0.28, 170, 230)
      const droneTimelineX =
        timelineIntroRect && !isResponsiveExperience
          ? timelineIntroRect.left -
            (1 - timelineSlideProgress) * sectionWidth -
            sectionRect.left +
            timelineIntroRect.width / 2 -
            droneWidth / 2
          : sectionWidth / 2 - droneWidth / 2
      const droneXBeforeTimeline =
        droneStartX + (droneTargetX - droneStartX) * experienceEntryProgress
      const droneYBeforeTimeline =
        droneStartY + (droneTargetY - droneStartY) * experienceEntryProgress
      const droneX =
        droneXBeforeTimeline +
        (droneTimelineX - droneXBeforeTimeline) * timelineProgress
      const droneY =
        droneYBeforeTimeline +
        (droneTimelineY - droneYBeforeTimeline) * timelineProgress
      const heroDelta = heroProgress - lastHeroProgress
      const closingDelta = closingProgress - lastClosingProgress
      const fourthDelta = fourthProgress - lastFourthProgress

      if (
        hasMeasuredHeroProgress &&
        Math.abs(heroDelta) > 0.0004 &&
        heroProgress > 0.01 &&
        heroProgress < 0.99
      ) {
        slimeTarget = Math.max(-0.72, Math.min(0.72, heroDelta * -28))
        scheduleSlimeRender()
      }

      if (
        hasMeasuredClosingProgress &&
        Math.abs(closingDelta) > 0.0004 &&
        closingProgress > 0.01 &&
        closingProgress < 0.99
      ) {
        closingSlimeTarget = Math.max(-0.72, Math.min(0.72, closingDelta * -28))
        scheduleSlimeRender()
      }

      if (
        hasMeasuredFourthProgress &&
        Math.abs(fourthDelta) > 0.0004 &&
        fourthProgress > 0.01 &&
        fourthProgress < 0.99
      ) {
        closingBottomSlimeTarget = Math.max(
          -0.72,
          Math.min(0.72, fourthDelta * -28),
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
      fourthSection.style.setProperty(
        '--experience-timeline-progress',
        timelineSlideProgress.toString(),
      )
      fourthSection.style.setProperty(
        '--experience-track-progress',
        experienceTrackProgress.toString(),
      )
      fourthSection.style.setProperty(
        '--experience-entry-progress',
        experienceEntryProgress.toString(),
      )
      fourthSection.style.setProperty('--drone-x', `${droneX.toFixed(2)}px`)
      fourthSection.style.setProperty('--drone-y', `${droneY.toFixed(2)}px`)
      experienceDrone.style.setProperty(
        '--drone-x',
        `${droneX.toFixed(2)}px`,
      )
      experienceDrone.style.setProperty(
        '--drone-y',
        `${droneY.toFixed(2)}px`,
      )
      fourthSection.style.setProperty(
        '--timeline-continuity-progress',
        timelineProgress.toString(),
      )
      fourthSection.style.setProperty(
        '--timeline-line-progress',
        timelineLineProgress.toString(),
      )

      if (!isIdCardRevealed && experienceEntryProgress >= 0.75) {
        setIsIdCardRevealed(true)
      }
    }

    const syncPointerTargets = () => {
      const rect = canvas.getBoundingClientRect()
      const closingRect = closingCanvas.getBoundingClientRect()
      const timelineRect = timelineCanvas.getBoundingClientRect()
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
      const isInsideTimelineSection =
        lastPointerX >= timelineRect.left &&
        lastPointerX <= timelineRect.right &&
        lastPointerY >= timelineRect.top &&
        lastPointerY <= timelineRect.bottom
      const nextPointerActive =
        hasPointer && isInsideSection && getViewportCoverage(section) >= 0.7
      const nextClosingPointerActive =
        hasPointer &&
        isInsideClosingSection &&
        getViewportCoverage(closingSection) >= 0.7
      const nextTimelinePointerActive =
        hasPointer &&
        isInsideTimelineSection &&
        getViewportCoverage(timelineCanvas) >= 0.45

      targetGridX = lastPointerX - rect.left
      targetGridY = lastPointerY - rect.top
      targetClosingGridX = lastPointerX - closingRect.left
      targetClosingGridY = lastPointerY - closingRect.top
      targetTimelineGridX = lastPointerX - timelineRect.left
      targetTimelineGridY = lastPointerY - timelineRect.top

      if (pointerActive !== nextPointerActive) {
        portraitNeedsDraw = true
      }

      if (closingPointerActive !== nextClosingPointerActive) {
        closingNeedsDraw = true
      }

      if (timelinePointerActive !== nextTimelinePointerActive) {
        timelineNeedsDraw = true
      }

      pointerActive = nextPointerActive
      closingPointerActive = nextClosingPointerActive
      timelinePointerActive = nextTimelinePointerActive
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

    const resetScrollGesture = () => {
      const viewportHeight = window.innerHeight || 1
      const deckTop = deckStage.getBoundingClientRect().top + window.scrollY
      const sectionScrollUnit =
        Math.max(1, deckStage.offsetHeight - viewportHeight) / 6 ||
        viewportHeight

      lastDocumentScroll = window.scrollY
      lastRelativeScroll = window.scrollY - deckTop
      scrollGestureDirection = 0
      scrollGestureBaseIndex = Math.max(
        0,
        Math.min(6, Math.round(lastRelativeScroll / sectionScrollUnit)),
      )
    }

    const scheduleScrollGestureReset = () => {
      window.clearTimeout(scrollGestureTimeout)
      scrollGestureTimeout = window.setTimeout(resetScrollGesture, 180)
    }

    const animateSoftSnap = (targetScroll: number) => {
      const startScroll = window.scrollY
      const distance = targetScroll - startScroll

      if (Math.abs(distance) < 2) {
        return
      }

      window.cancelAnimationFrame(snapFrame)
      isSnapping = true

      const duration = Math.min(620, Math.max(320, Math.abs(distance) * 1.8))
      const startTime = window.performance.now()
      const easeSnap = (progress: number) =>
        progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2

      const animateSnap = (now: number) => {
        const progress = Math.min(1, (now - startTime) / duration)
        const easedProgress = easeSnap(progress)

        window.scrollTo(0, startScroll + distance * easedProgress)
        scheduleParallaxUpdate()

        if (progress < 1) {
          snapFrame = window.requestAnimationFrame(animateSnap)
          return
        }

        snapFrame = 0
        isSnapping = false
        resetScrollGesture()
      }

      snapFrame = window.requestAnimationFrame(animateSnap)
    }

    const snapToNearbySection = () => {
      if (isSnapping) {
        return
      }

      const viewportHeight = window.innerHeight || 1
      const deckTop = deckStage.getBoundingClientRect().top + window.scrollY
      const sectionScrollUnit =
        Math.max(1, deckStage.offsetHeight - viewportHeight) / 6 ||
        viewportHeight
      const relativeScroll = window.scrollY - deckTop
      const deckSnapPoints = Array.from({ length: 7 }, (_, index) =>
        deckTop + sectionScrollUnit * index,
      )
      const extraSnapPoints = Array.from(
        document.querySelectorAll<HTMLElement>(
          '.works-showcase-section, .portfolio-extra-section, .portfolio-contact-section, .portfolio-wordmark-section',
        ),
      ).map((extraSection) => extraSection.getBoundingClientRect().top + window.scrollY)
      const isNearDeck =
        relativeScroll > -viewportHeight * 0.2 &&
        relativeScroll < sectionScrollUnit * 6 + viewportHeight * 0.2
      const candidatePoints = isNearDeck ? deckSnapPoints : extraSnapPoints

      if (!candidatePoints.length) {
        return
      }

      const nearestPoint = candidatePoints.reduce((nearest, point) =>
        Math.abs(point - window.scrollY) < Math.abs(nearest - window.scrollY)
          ? point
          : nearest,
      )
      const snapThreshold = Math.min(viewportHeight * 0.14, 110)

      if (Math.abs(nearestPoint - window.scrollY) > snapThreshold) {
        return
      }

      animateSoftSnap(nearestPoint)
    }

    const scheduleNearbySectionSnap = () => {
      window.clearTimeout(snapTimeout)
      snapTimeout = window.setTimeout(snapToNearbySection, 130)
    }

    const handleDeckScroll = () => {
      scheduleParallaxUpdate()

      if (isSnapping) {
        return
      }

      const deckTop = deckStage.getBoundingClientRect().top + window.scrollY
      const relativeScroll = window.scrollY - deckTop
      const documentScroll = window.scrollY
      const viewportHeight = window.innerHeight || 1
      const sectionScrollUnit =
        Math.max(1, deckStage.offsetHeight - viewportHeight) / 6 ||
        viewportHeight
      const scrollDelta = documentScroll - lastDocumentScroll

      if (isMenuNavigationRef.current) {
        lastRelativeScroll = relativeScroll
        lastDocumentScroll = documentScroll
        return
      }

      if (Math.abs(scrollDelta) > 0.5) {
        lastScrollDirection = scrollDelta > 0 ? 1 : -1
      }

      const isInsideDeck =
        relativeScroll > -2 && relativeScroll < sectionScrollUnit * 6 + 2

      if (isInsideDeck && lastScrollDirection !== 0) {
        if (scrollGestureDirection !== lastScrollDirection) {
          scrollGestureBaseIndex = Math.max(
            0,
            Math.min(6, Math.round(lastRelativeScroll / sectionScrollUnit)),
          )
          scrollGestureDirection = lastScrollDirection
        }

        const gestureTargetIndex = Math.max(
          0,
          Math.min(6, scrollGestureBaseIndex + scrollGestureDirection),
        )
        const gestureLimit = gestureTargetIndex * sectionScrollUnit
        const hasCrossedGestureLimit =
          scrollGestureDirection > 0
            ? relativeScroll > gestureLimit
            : relativeScroll < gestureLimit

        if (hasCrossedGestureLimit) {
          const limitedScroll = deckTop + gestureLimit

          window.scrollTo(0, limitedScroll)
          lastRelativeScroll = gestureLimit
          lastDocumentScroll = limitedScroll
          scheduleScrollGestureReset()
          return
        }

        scheduleScrollGestureReset()
      }

      const extraSnapPoints = Array.from(
        document.querySelectorAll<HTMLElement>(
          '.works-showcase-section, .portfolio-extra-section, .portfolio-contact-section, .portfolio-wordmark-section',
        ),
      ).map((extraSection) => extraSection.getBoundingClientRect().top + window.scrollY)
      const firstExtraSnapPoint = extraSnapPoints[0]
      const isInsideExtraSections =
        firstExtraSnapPoint !== undefined &&
        documentScroll >= firstExtraSnapPoint - viewportHeight * 0.45

      if (!isInsideDeck && isInsideExtraSections && lastScrollDirection !== 0) {
        const nearestExtraIndex =
          firstExtraSnapPoint !== undefined &&
          lastDocumentScroll < firstExtraSnapPoint - 2 &&
          lastScrollDirection > 0
            ? -1
            : extraSnapPoints.reduce(
                (nearest, point, index) =>
                  Math.abs(point - lastDocumentScroll) <
                  Math.abs(extraSnapPoints[nearest] - lastDocumentScroll)
                    ? index
                    : nearest,
                0,
              )
        const extraGestureTargetIndex = Math.max(
          0,
          Math.min(
            extraSnapPoints.length - 1,
            nearestExtraIndex + lastScrollDirection,
          ),
        )
        const isPastLastExtraSnap =
          lastScrollDirection > 0 &&
          nearestExtraIndex >= extraSnapPoints.length - 1

        const isRevealingContactCard =
          lastScrollDirection > 0 &&
          document
            .querySelector<HTMLElement>('.portfolio-contact-section')
            ?.contains(
              document.elementFromPoint(
                window.innerWidth / 2,
                window.innerHeight / 2,
              ),
            ) &&
          documentScroll < (extraSnapPoints[nearestExtraIndex + 1] ?? Infinity) - 80

        if (isRevealingContactCard) {
          lastRelativeScroll = relativeScroll
          lastDocumentScroll = documentScroll
          scheduleScrollGestureReset()
          return
        }

        if (isPastLastExtraSnap) {
          lastRelativeScroll = relativeScroll
          lastDocumentScroll = documentScroll
          scheduleScrollGestureReset()
          return
        }

        const extraGestureLimit = extraSnapPoints[extraGestureTargetIndex]
        const extraOvershootLimit = viewportHeight * 0.55
        const hasCrossedExtraGestureLimit =
          extraGestureLimit !== undefined &&
          (lastScrollDirection > 0
            ? documentScroll > extraGestureLimit + extraOvershootLimit
            : documentScroll < extraGestureLimit - extraOvershootLimit)

        if (hasCrossedExtraGestureLimit) {
          window.scrollTo(0, extraGestureLimit)
          lastDocumentScroll = extraGestureLimit
          scheduleScrollGestureReset()
          return
        }
      }

      lastRelativeScroll = relativeScroll
      lastDocumentScroll = documentScroll
      scheduleNearbySectionSnap()
    }

    const render = () => {
      animationFrame = 0
      const gridDeltaX = targetGridX - gridX
      const gridDeltaY = targetGridY - gridY
      const closingGridDeltaX = targetClosingGridX - closingGridX
      const closingGridDeltaY = targetClosingGridY - closingGridY
      const timelineGridDeltaX = targetTimelineGridX - timelineGridX
      const timelineGridDeltaY = targetTimelineGridY - timelineGridY

      gridX += (targetGridX - gridX) * 0.18
      gridY += (targetGridY - gridY) * 0.18
      closingGridX += (targetClosingGridX - closingGridX) * 0.18
      closingGridY += (targetClosingGridY - closingGridY) * 0.18
      timelineGridX += (targetTimelineGridX - timelineGridX) * 0.18
      timelineGridY += (targetTimelineGridY - timelineGridY) * 0.18

      const portraitMoving =
        Math.abs(gridDeltaX) > 0.08 ||
        Math.abs(gridDeltaY) > 0.08
      const closingMoving =
        Math.abs(closingGridDeltaX) > 0.08 ||
        Math.abs(closingGridDeltaY) > 0.08
      const timelineMoving =
        Math.abs(timelineGridDeltaX) > 0.08 ||
        Math.abs(timelineGridDeltaY) > 0.08

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

      if (timelineNeedsDraw || timelinePointerActive) {
        drawDots(
          timelineContext,
          timelineCanvasWidth,
          timelineCanvasHeight,
          timelineGridX,
          timelineGridY,
          timelinePointerActive,
          'rgb(21 19 15 / 0.17)',
        )
        timelineNeedsDraw = false
      }

      if (
        (pointerActive && portraitMoving) ||
        (closingPointerActive && closingMoving) ||
        (timelinePointerActive && timelineMoving)
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
      if (timelinePointerActive) {
        timelineNeedsDraw = true
        timelinePointerActive = false
      }
      scheduleDotRender()
    }

    const handleResize = () => {
      resizeCanvas()
      updateParallax()
      syncPointerTargets()
      portraitNeedsDraw = true
      closingNeedsDraw = true
      timelineNeedsDraw = true
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
    drawDots(
      timelineContext,
      timelineCanvasWidth,
      timelineCanvasHeight,
      timelineGridX,
      timelineGridY,
      false,
      'rgb(21 19 15 / 0.17)',
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
      window.clearTimeout(scrollGestureTimeout)
      window.cancelAnimationFrame(animationFrame)
      window.cancelAnimationFrame(parallaxFrame)
      window.cancelAnimationFrame(slimeFrame)
      window.cancelAnimationFrame(snapFrame)
    }
  }, [])

	  useEffect(() => {
	    const prefersReducedMotion = window.matchMedia(
	      '(prefers-reduced-motion: reduce)',
	    ).matches

	    if (isLoading) {
	      return undefined
	    }

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
	  }, [isLoading])

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
      {isLoading && (
        <div
          className={`loading-screen ${isLoaderExiting ? 'is-exiting' : ''}`}
          role="status"
          aria-live="polite"
        >
          <div className="loading-words" aria-label="Namàsté Vanàkkam Swàgatham Welcome">
            <span ref={loadingTextOneRef}>Namàsté</span>
            <span ref={loadingTextTwoRef} />
          </div>
        </div>
      )}
      <svg className="hero-slime-defs" aria-hidden="true">
        <defs>
          <clipPath id="loading-slime-clip" clipPathUnits="objectBoundingBox">
            <path ref={loadingSlimePathRef} d="M -0.02 0 H 1.02 V 1 H -0.02 Z" />
          </clipPath>
          <clipPath id="hero-slime-clip" clipPathUnits="objectBoundingBox">
            <path ref={heroSlimePathRef} d="M -0.02 0 H 1.02 V 1 H -0.02 Z" />
          </clipPath>
          <clipPath id="closing-slime-clip" clipPathUnits="objectBoundingBox">
            <path ref={closingSlimePathRef} d="M -0.02 0 H 1.02 V 1 H -0.02 Z" />
          </clipPath>
          <filter id="loading-threshold">
            <feColorMatrix
              in="SourceGraphic"
              type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 255 -140"
            />
          </filter>
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
          {isTypingComplete && (
            <div className="hero-icon-field" aria-label="Floating design tools">
              {heroIcons.map((icon) => (
                <FloatingHeroIcon
                  key={icon.src}
                  {...icon}
                  reducedMotion={prefersReducedWordmarkMotion}
                />
              ))}
            </div>
          )}
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
          <ul
            className={`portrait-statement ${
              isWordmarkRevealed ? 'is-revealed' : ''
            }`}
            aria-label="Design and development roles"
          >
            <li>Product Designer</li>
            <li>UI/UX Designer</li>
            <li>UI Developer</li>
          </ul>
          <div className="portrait-wordmark-shell" aria-hidden="true">
            <motion.img
              className="portrait-wordmark"
              src="/uxbyabhi.svg"
              alt=""
              initial={
                prefersReducedWordmarkMotion
                  ? false
                  : {
                      clipPath: 'ellipse(0% 42% at 50% 50%)',
                      filter: 'blur(12px)',
                      opacity: 0,
                      scale: 0.92,
                    }
              }
              animate={
                isWordmarkRevealed
                  ? {
                      clipPath: 'ellipse(100% 100% at 50% 50%)',
                      filter: 'blur(0px)',
                      opacity: 0.86,
                      scale: 1,
                    }
                  : {
                      clipPath: 'ellipse(0% 42% at 50% 50%)',
                      filter: 'blur(12px)',
                      opacity: 0,
                      scale: 0.92,
                    }
              }
              transition={
                prefersReducedWordmarkMotion
                  ? { duration: 0 }
                  : {
                      clipPath: {
                        duration: 1.05,
                        ease: [0.16, 1, 0.3, 1],
                      },
                      filter: {
                        duration: 0.72,
                        ease: [0.16, 1, 0.3, 1],
                      },
                      opacity: {
                        duration: 0.42,
                        ease: 'easeOut',
                      },
                      scale: {
                        type: 'spring',
                        stiffness: 170,
                        damping: 22,
                        mass: 0.9,
                      },
                    }
              }
            />
          </div>
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
          id="about"
          ref={fourthSectionRef}
          className="fourth-section"
          aria-label="Experience"
        >
          <div
            ref={experienceDroneRef}
            className={`experience-drone-stage ${
              isDroneRevealed ? 'is-drone-revealed' : ''
            }`}
            aria-hidden="true"
          >
            <video
              className="experience-drone-video"
              src="/delivery-drone.webm"
              autoPlay
              loop
              muted
              playsInline
            />
          </div>
          <div className="experience-track">
            <div
              className="experience-slide experience-slide-blank"
              aria-label="Design and development experience"
            >
              <div
                ref={experienceIntroRef}
                className={`experience-intro ${
                  isDroneRevealed ? 'is-drone-revealed' : ''
                }`}
              >
                <div className="experience-intro-media" aria-hidden="true">
                  <img
                    className="experience-intro-image"
                    src="/vr-jumping-man.png"
                    alt=""
                    draggable={false}
                  />
                </div>
                <p className="experience-intro-copy">
                  <span className="experience-intro-years">6+</span>
                  <span>
                    years delivering production{' '}
                    <span className="experience-intro-emphasis">
                      designs and apps
                    </span>
                    .
                  </span>
                </p>
              </div>
            </div>
            <div className="experience-slide">
              <div className="experience-panel">
                <div ref={experienceCurrentRef} className="experience-current">
                  <p className="experience-period">2022 - 2026</p>
                  <h2>UX Engineer</h2>
                  <p className="experience-company">
                    Raaho - Quickdigital Technologies Pvt. Ltd.
                  </p>
                  <p>
                    At Raaho, I led web development across internal operations
                    suites and customer-facing product experiences.
                  </p>
                </div>
                <div className="experience-id-card" aria-label="Raaho ID card">
                  <motion.img
                    src="/raaho-id-card.png"
                    alt="Raaho ID card"
                    draggable={false}
                    drag={prefersReducedWordmarkMotion ? false : true}
                    dragConstraints={{
                      top: -18,
                      right: 18,
                      bottom: 22,
                      left: -18,
                    }}
                    dragElastic={0.18}
                    dragMomentum={false}
                    dragSnapToOrigin
                    onDragStart={startIdCardDragSound}
                    onDragEnd={stopIdCardDragSound}
                    whileDrag={{
                      scale: 1.012,
                      rotate: -0.8,
                      transition: {
                        type: 'spring',
                        stiffness: 210,
                        damping: 22,
                      },
                    }}
                    initial={
                      prefersReducedWordmarkMotion
                        ? false
                        : {
                            opacity: 0,
                            rotate: -5,
                            y: '-78vh',
                          }
                    }
                    animate={
                      isIdCardRevealed
                        ? prefersReducedWordmarkMotion
                          ? {
                              opacity: 1,
                              rotate: -1.5,
                              y: 0,
                            }
                          : {
                              opacity: 1,
                              rotate: [-1.5, -0.7, -1.9, -1.5],
                              y: 0,
                            }
                        : {
                            opacity: 0,
                            rotate: -5,
                            y: '-78vh',
                          }
                    }
                    transition={
                      prefersReducedWordmarkMotion
                        ? { duration: 0 }
                        : {
                            opacity: {
                              duration: 0.2,
                              ease: 'easeOut',
                            },
                            rotate: {
                              duration: 4.8,
                              ease: 'easeInOut',
                              repeat: Infinity,
                              repeatDelay: 0.9,
                            },
                            y: {
                              type: 'spring',
                              stiffness: 78,
                              damping: 16,
                              mass: 1,
                            },
                          }
                    }
                  />
                </div>
              </div>
            </div>
            <div className="experience-slide experience-slide-timeline">
              <canvas
                ref={timelineGridRef}
                className="timeline-dot-grid"
                aria-hidden="true"
              />
              <div
                ref={timelinePanelRef}
                className={`timeline-panel ${
                  isTimelineRevealed ? 'is-revealed' : ''
                }`}
                aria-label="Previous contributions"
              >
                <div ref={timelineIntroRef} className="timeline-intro">
                  <h2>Previous Contributions</h2>
                </div>
                <ol className="timeline-rail">
                  <li
                    className="timeline-item timeline-item-top"
                    style={
                      {
                        '--timeline-item-index': 0,
                        '--timeline-item-x': '18%',
                      } as CSSProperties
                    }
                  >
                    <span className="timeline-dot" aria-hidden="true" />
                    <div
                      className={`timeline-entry timeline-entry-baton ${
                        expandedTimelineCard === 'baton' ? 'is-expanded' : ''
                      }`}
                      onClick={() =>
                        setExpandedTimelineCard((current) =>
                          current === 'baton' ? null : 'baton',
                        )
                      }
                      onFocus={playTimelineCardHover}
                      onPointerEnter={playTimelineCardHover}
                    >
                      <span className="timeline-duration">2022</span>
                      <a
                        className="timeline-logo timeline-logo-baton"
                        href="https://batonsystems.com/"
                        target="_blank"
                        rel="noreferrer"
                      >
                        <img src="/baton-logo.png" alt="Baton" />
                      </a>
                      <strong>Developer</strong>
                      <p>
                        Designed and developed user interfaces for fintech
                        platform. Collaborated with cross-functional teams to
                        deliver seamless experiences.
                      </p>
                    </div>
                  </li>
                  <li
                    className="timeline-item timeline-item-bottom"
                    style={
                      {
                        '--timeline-item-index': 1,
                        '--timeline-item-x': '50%',
                      } as CSSProperties
                    }
                  >
                    <span className="timeline-dot" aria-hidden="true" />
                    <div
                      className={`timeline-entry timeline-entry-fantacode ${
                        expandedTimelineCard === 'fantacode'
                          ? 'is-expanded'
                          : ''
                      }`}
                      onClick={() =>
                        setExpandedTimelineCard((current) =>
                          current === 'fantacode' ? null : 'fantacode',
                        )
                      }
                      onFocus={playTimelineCardHover}
                      onPointerEnter={playTimelineCardHover}
                    >
                      <span className="timeline-duration">2018 - 2019</span>
                      <a
                        className="timeline-logo"
                        href="https://fantacode.com/"
                        target="_blank"
                        rel="noreferrer"
                      >
                        <img src="/fantacode-logo.avif" alt="FantaCode" />
                      </a>
                      <strong>UI/UX Designer</strong>
                      <p>
                        Created design systems and interactive prototypes for
                        web applications. Worked on multiple client projects
                        from concept to launch.
                      </p>
                    </div>
                  </li>
                  <li
                    className="timeline-item timeline-item-top"
                    style={
                      {
                        '--timeline-item-index': 2,
                        '--timeline-item-x': '82%',
                      } as CSSProperties
                    }
                  >
                    <span className="timeline-dot" aria-hidden="true" />
                    <div
                      className={`timeline-entry timeline-entry-bamboo ${
                        expandedTimelineCard === 'bamboo' ? 'is-expanded' : ''
                      }`}
                      onClick={() =>
                        setExpandedTimelineCard((current) =>
                          current === 'bamboo' ? null : 'bamboo',
                        )
                      }
                      onFocus={playTimelineCardHover}
                      onPointerEnter={playTimelineCardHover}
                    >
                      <span className="timeline-duration">2017 - 2018</span>
                      <div className="timeline-logo timeline-logo-bamboo">
                        <img src="/bamboo-logo.png" alt="Bamboo" />
                      </div>
                      <strong>Mobile App Developer</strong>
                      <p>
                        Designed user interfaces and marketing materials.
                        Learned fundamentals of product design and
                        user-centered development.
                      </p>
                    </div>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </section>
      </div>
      <section
        id="works"
        ref={worksSectionRef}
        className={`works-section works-showcase-section ${
          isWorksGridRevealed ? 'is-grid-revealed' : ''
        }`}
        aria-label="My works"
      >
        <aside className="works-copy">
          <h2>My works</h2>
          <p>
            A running collection of product interfaces, visual systems, and
            useful digital details shaped across design and frontend craft.
          </p>
          <p>
            Each piece starts with a practical problem and ends as something
            people can understand, trust, and move through easily.
          </p>
          <strong>Thoughtful products, built for use.</strong>
        </aside>
        <div
          className="works-grid-scroll"
          onWheel={handleWorksGridWheel}
        >
          <div className="works-grid">
            {workGridItems.map((item, index) => (
              <figure
                key={item.src}
                className={`work-grid-card ${item.className}`}
                style={{ '--work-item-index': index } as CSSProperties}
                tabIndex={0}
                onFocus={playTimelineCardHover}
                onPointerEnter={playTimelineCardHover}
              >
                <img src={item.src} alt={item.alt} loading="lazy" />
                <figcaption className="work-grid-card__caption">
                  <strong>{item.title}</strong>
                  <span>{item.subtitle}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
      <section
        id="taste"
        ref={tastemaxxingSectionRef}
        className={`works-section works-showcase-section tastemaxxing-section ${
          isTastemaxxingGridRevealed ? 'is-grid-revealed' : ''
        }`}
        aria-label="Tastemaxxing"
      >
        <div className="works-grid-scroll" onWheel={handleWorksGridWheel}>
          <div className="works-grid">
            {tastemaxxingGridItems.map((item, index) => (
              <figure
                key={item.src}
                className={`work-grid-card ${item.className}`}
                style={{ '--work-item-index': index } as CSSProperties}
                tabIndex={0}
                onFocus={playTimelineCardHover}
                onPointerEnter={playTimelineCardHover}
              >
                <img src={item.src} alt={item.alt} loading="lazy" />
                <figcaption className="work-grid-card__caption">
                  <strong>{item.title}</strong>
                  <span>{item.subtitle}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
        <aside className="works-copy">
          <h2>Some taste</h2>
          <p>
            A visual playground for UI experiments, interaction moods, and
            small interface ideas that lean into taste first.
          </p>
          <p>
            These are explorations where composition, motion, type, and surface
            details get room to become the main experience.
          </p>
          <strong>Visual UI experiments with feeling.</strong>
        </aside>
      </section>
      <section className="portfolio-extra-section" aria-label="Hobbies">
        <h2>Hobbies</h2>
      </section>
      <section
        id="contact"
        className="portfolio-contact-section"
        aria-label="Contacts"
      >
        <div
          ref={contactRevealStageRef}
          className="contact-reveal-stage"
          style={
            {
              '--contact-card-height': contactCardHeight
                ? `${contactCardHeight}px`
                : undefined,
            } as CSSProperties
          }
        >
          <div
            ref={contactCardRef}
            className={`contact-card ${
              selectedContactAction ? 'is-form-open' : ''
            } ${isContactSubmitted ? 'is-submitted' : ''
            }`}
          >
            <button
              className="contact-back"
              type="button"
              aria-label="Back to contact options"
              onClick={() => {
                setSelectedContactAction(null)
                setIsContactSubmitted(false)
              }}
            />
            <div className="contact-card__content" ref={contactCardContentRef}>
              <div className="contact-card__intro">
                <video
                  className="contact-card__video"
                  src={
                    selectedContactAction
                      ? '/contact-chatbot-laptop.webm'
                      : '/contact-robot.webm'
                  }
                  autoPlay
                  loop
                  muted
                  playsInline
                  aria-hidden="true"
                />
                <h2>
                  {selectedContactAction ?? (
                    <>
                      Hey there!
                      <br />
                      How can I help you
                    </>
                  )}
                  <span>
                    {selectedContactAction ? (
                      'Give me more deets'
                    ) : (
                      <>
                        on this {contactDayPeriod} in{' '}
                        <em>{contactLocation}</em>?
                      </>
                    )}
                  </span>
                </h2>
                <div className="contact-actions" aria-label="Contact actions">
                  {contactActions.map((contactAction) => (
                    <button
                      key={contactAction}
                      className="contact-action"
                      type="button"
                      onClick={() => {
                        setSelectedContactAction(contactAction)
                        setIsContactSubmitted(false)
                      }}
                      onFocus={playContactBubblePop}
                      onPointerEnter={playContactBubblePop}
                    >
                      {contactAction}
                    </button>
                  ))}
                </div>
              </div>
              <div className="contact-card__response">
                <div className="contact-success" role="status" aria-live="polite">
                  <strong>Sucessfully Submitted</strong>
                  <p>
                    Your submission is in. Now relax, I&apos;ll contact you soon.
                  </p>
                </div>
                <form className="contact-form" onSubmit={handleContactSubmit}>
                  <label className="contact-form__full-name">
                    <span>Full Name</span>
                    <input
                      name="name"
                      type="text"
                      autoComplete="name"
                      placeholder="Full Name"
                    />
                  </label>
                  <label>
                    <span>Email</span>
                    <input
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder="Email"
                    />
                  </label>
                  <label>
                    <span>Phone</span>
                    <input
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      placeholder="Phone"
                    />
                  </label>
                  <label className="contact-form__message">
                    <span>Message</span>
                    <textarea name="message" rows={4} placeholder="Message" />
                  </label>
                  <button className="contact-submit" type="submit">
                    Submit
                  </button>
                </form>
              </div>
            </div>
          </div>
          <footer className="contact-hidden-card" aria-label="Footer">
            <div className="contact-footer-brand">
              <div>
                <strong>Abhishek Veenakkat</strong>
                <p>
                  Senior UI/UX Designer and Frontend Engineer building
                  thoughtful digital products.
                </p>
              </div>
            </div>
            <div className="contact-footer-meta">
              <span>Location</span>
              <strong>Calicut, Kerala, India</strong>
              <p>
                Available for selected freelance and full-time opportunities.
              </p>
            </div>
          </footer>
        </div>
      </section>
      <section className="portfolio-wordmark-section" aria-label="Wordmark">
        <p>2026 - Made with Codex + ReactJS</p>
        <img src="/uxbyabhi.svg" alt="" aria-hidden="true" />
      </section>
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
          {menuLinks.map((menuLink) => (
            <a
              key={menuLink.href}
              href={menuLink.href}
              tabIndex={isMenuOpen ? 0 : -1}
              onClick={(event) => {
                handleMenuLinkClick(event, menuLink.href)
              }}
            >
              {menuLink.label}
            </a>
          ))}
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
