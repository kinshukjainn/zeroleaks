"use client"

import type React from "react"
import { useState, useEffect, useCallback, useMemo, useRef, useReducer, type JSX } from "react"
import {
  RiEyeLine,
  RiEyeOffLine,
  RiShieldCheckLine,
  RiRefreshLine,
  RiFileCopyLine,
  RiCheckLine,
  RiAlertLine,
  RiLockLine,
  RiTerminalLine,
  RiBarChartLine,
  RiHistoryLine,
  RiLoader4Line,
  RiPassValidLine,
  RiSettings3Line,
  RiArticleLine,
  RiShieldStarLine,
  RiKeyLine,
  RiDatabaseLine,
  RiCpuLine,
  RiFlashlightLine,
} from "react-icons/ri"
import { FaCableCar } from "react-icons/fa6"

// TYPE DEFINITIONS
interface ZxcvbnResult {
  score: number
  entropy: number
  crackTimesDisplay: {
    offline_slow_hashing_1e4_per_second: string
    offline_fast_hashing_1e10_per_second: string
    online_throttling_100_per_hour: string
    online_no_throttling_10_per_second: string
  }
  feedback: {
    warning: string
    suggestions: string[]
  }
  sequence: Array<{
    pattern: string
    token: string
    entropy: number
  }>
}

interface GeneratedPassword {
  password: string
  analysis?: ZxcvbnResult
  timestamp: number
  id: string
  strength: string
  score: number
}

interface PasswordHistoryEntry {
  passwordHash: string
  score: number
  timestamp: number
  strength: string
  entropy: number
}

interface AnalysisState {
  status: "idle" | "loading" | "success" | "error"
  analysis?: ZxcvbnResult
  pwnedCount?: number
  error?: string
}

type AnalysisAction =
  | { type: "ANALYZE_START" }
  | { type: "ANALYZE_SUCCESS"; payload: { analysis: ZxcvbnResult; pwnedCount: number } }
  | { type: "ANALYZE_ERROR"; payload: { error: string } }
  | { type: "RESET" }

type TabType = "analyze" | "generate" | "history"
type GenerationMode = "random" | "passphrase"

interface StrengthConfig {
  strength: string
  color: string
  bgColor: string
  borderColor: string
  description: string
}

interface MetricPoint {
  label: string
  value: number
  color: string
}

// CONFIGURATION CONSTANTS
const STRENGTH_CONFIG: Record<number, StrengthConfig> = {
  4: {
    strength: "Fortress",
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/20",
    borderColor: "border-emerald-500/30",
    description: "Virtually uncrackable",
  },
  3: {
    strength: "Strong",
    color: "text-green-400",
    bgColor: "bg-green-500/20",
    borderColor: "border-green-500/30",
    description: "Highly secure",
  },
  2: {
    strength: "Moderate",
    color: "text-yellow-400",
    bgColor: "bg-yellow-500/20",
    borderColor: "border-yellow-500/30",
    description: "Reasonably secure",
  },
  1: {
    strength: "Weak",
    color: "text-orange-400",
    bgColor: "bg-orange-500/20",
    borderColor: "border-orange-500/30",
    description: "Easily compromised",
  },
  0: {
    strength: "Critical",
    color: "text-red-400",
    bgColor: "bg-red-500/20",
    borderColor: "border-red-500/30",
    description: "Immediately vulnerable",
  },
} as const

// SIMPLIFIED ANALYSIS FUNCTIONS (Client-side only)
const calculateEntropy = (password: string): number => {
  const charSets = {
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    numbers: /[0-9]/.test(password),
    symbols: /[^a-zA-Z0-9]/.test(password),
  }
  let charsetSize = 0
  if (charSets.lowercase) charsetSize += 26
  if (charSets.uppercase) charsetSize += 26
  if (charSets.numbers) charsetSize += 10
  if (charSets.symbols) charsetSize += 32
  return Math.log2(Math.pow(charsetSize, password.length))
}

const analyzePassword = (password: string): ZxcvbnResult => {
  const entropy = calculateEntropy(password)
  const length = password.length
  const hasLower = /[a-z]/.test(password)
  const hasUpper = /[A-Z]/.test(password)
  const hasNumbers = /[0-9]/.test(password)
  const hasSymbols = /[^a-zA-Z0-9]/.test(password)
  const uniqueChars = new Set(password).size

  // Simple scoring algorithm
  let score = 0
  if (length >= 12) score++
  if (length >= 16) score++
  if (hasLower && hasUpper && hasNumbers) score++
  if (hasSymbols && uniqueChars > length * 0.7) score++
  if (entropy > 60) score++
  score = Math.min(4, Math.max(0, score))

  const suggestions: string[] = []
  let warning = ""
  if (length < 8) {
    warning = "Password is too short"
    suggestions.push("Use at least 8 characters")
  }
  if (!hasUpper) suggestions.push("Add uppercase letters")
  if (!hasNumbers) suggestions.push("Add numbers")
  if (!hasSymbols) suggestions.push("Add symbols")
  if (uniqueChars < length * 0.5) suggestions.push("Avoid repeated characters")

  const crackTime = Math.pow(2, entropy / 2)
  const formatTime = (seconds: number): string => {
    if (seconds < 60) return "less than a minute"
    if (seconds < 3600) return `${Math.round(seconds / 60)} minutes`
    if (seconds < 86400) return `${Math.round(seconds / 3600)} hours`
    if (seconds < 31536000) return `${Math.round(seconds / 86400)} days`
    return `${Math.round(seconds / 31536000)} years`
  }

  return {
    score,
    entropy,
    crackTimesDisplay: {
      offline_slow_hashing_1e4_per_second: formatTime(crackTime / 10000),
      offline_fast_hashing_1e10_per_second: formatTime(crackTime / 10000000000),
      online_throttling_100_per_hour: formatTime(crackTime / (100 / 3600)),
      online_no_throttling_10_per_second: formatTime(crackTime / 10),
    },
    feedback: {
      warning,
      suggestions,
    },
    sequence: [],
  }
}

// PWNED PASSWORD CHECK
const checkPwnedPassword = async (password: string): Promise<number> => {
  try {
    const encoder = new TextEncoder()
    const data = encoder.encode(password)
    const hashBuffer = await crypto.subtle.digest("SHA-1", data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashHex = hashArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")
      .toUpperCase()

    const prefix = hashHex.substring(0, 5)
    const suffix = hashHex.substring(5)

    const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`)
    if (!response.ok) throw new Error("API unavailable")

    const text = await response.text()
    const lines = text.split("\r\n")

    for (const line of lines) {
      const [hashSuffix, count] = line.split(":")
      if (hashSuffix === suffix) {
        return Number.parseInt(count, 10)
      }
    }
    return 0
  } catch (error) {
    console.error("Pwned check failed:", error)
    return -1
  }
}

// MAIN COMPONENT
export default function PasswordAnalyzer(): JSX.Element {
  const [password, setPassword] = useState<string>("")
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [generatedPasswords, setGeneratedPasswords] = useState<GeneratedPassword[]>([])
  const [passwordHistory, setPasswordHistory] = useState<PasswordHistoryEntry[]>([])
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [visualMode, setVisualMode] = useState<boolean>(false)
  const [showGeneratorConfig, setShowGeneratorConfig] = useState<boolean>(false)
  const [activeTab, setActiveTab] = useState<TabType>("analyze")

  // Generator Options
  const [genLength, setGenLength] = useState<number>(16)
  const [genUseUppercase, setGenUseUppercase] = useState<boolean>(true)
  const [genUseNumbers, setGenUseNumbers] = useState<boolean>(true)
  const [genUseSymbols, setGenUseSymbols] = useState<boolean>(true)
  const [genMode, setGenMode] = useState<GenerationMode>("random")

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const analysisTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // State Management for Analysis
  const analysisReducer = (state: AnalysisState, action: AnalysisAction): AnalysisState => {
    switch (action.type) {
      case "ANALYZE_START":
        return { ...state, status: "loading" }
      case "ANALYZE_SUCCESS":
        return {
          status: "success",
          analysis: action.payload.analysis,
          pwnedCount: action.payload.pwnedCount,
        }
      case "ANALYZE_ERROR":
        return { status: "error", error: action.payload.error }
      case "RESET":
        return { status: "idle" }
      default:
        return state
    }
  }
  const [analysisState, dispatch] = useReducer(analysisReducer, { status: "idle" })

  // Secure Password Generation
  const generateSecurePassword = useCallback(async (): Promise<string> => {
    if (genMode === "passphrase") {
      const words: string[] = [
        "correct",
        "horse",
        "battery",
        "staple",
        "mountain",
        "river",
        "ocean",
        "forest",
        "thunder",
        "lightning",
        "rainbow",
        "sunset",
        "sunrise",
        "galaxy",
        "planet",
        "comet",
        "dragon",
        "phoenix",
        "unicorn",
        "wizard",
        "castle",
        "kingdom",
        "treasure",
        "adventure",
        "journey",
        "discovery",
        "mystery",
        "legend",
        "story",
        "dream",
        "vision",
        "hope",
      ]
      const passphrase: string[] = []
      const randomValues = new Uint32Array(4)
      crypto.getRandomValues(randomValues)
      for (let i = 0; i < 4; i++) {
        passphrase.push(words[randomValues[i] % words.length])
      }
      return passphrase.join("-")
    }

    const charsets = {
      lowercase: "abcdefghijklmnopqrstuvwxyz",
      uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
      numbers: "0123456789",
      symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?~`",
    }

    let allChars = charsets.lowercase
    const guaranteedChars: string[] = [
      charsets.lowercase[crypto.getRandomValues(new Uint32Array(1))[0] % charsets.lowercase.length],
    ]

    if (genUseUppercase) {
      allChars += charsets.uppercase
      guaranteedChars.push(
        charsets.uppercase[crypto.getRandomValues(new Uint32Array(1))[0] % charsets.uppercase.length],
      )
    }
    if (genUseNumbers) {
      allChars += charsets.numbers
      guaranteedChars.push(charsets.numbers[crypto.getRandomValues(new Uint32Array(1))[0] % charsets.numbers.length])
    }
    if (genUseSymbols) {
      allChars += charsets.symbols
      guaranteedChars.push(charsets.symbols[crypto.getRandomValues(new Uint32Array(1))[0] % charsets.symbols.length])
    }

    const randomLength = genLength - guaranteedChars.length
    const randomChars = Array.from(
      { length: Math.max(0, randomLength) },
      () => allChars[crypto.getRandomValues(new Uint32Array(1))[0] % allChars.length],
    )

    const result = [...guaranteedChars, ...randomChars]

    // Fisher-Yates shuffle
    for (let i = result.length - 1; i > 0; i--) {
      const j = crypto.getRandomValues(new Uint32Array(1))[0] % (i + 1)
      ;[result[i], result[j]] = [result[j], result[i]]
    }

    return result.join("")
  }, [genLength, genUseUppercase, genUseNumbers, genUseSymbols, genMode])

  // Generate batch of passwords
  const generatePasswords = useCallback(async (): Promise<void> => {
    const promises = Array.from({ length: 6 }, () => generateSecurePassword())
    const newPasswords = await Promise.all(promises)

    const analyzedPasswords: GeneratedPassword[] = newPasswords.map((pwd) => {
      const analysis = analyzePassword(pwd)
      const config = STRENGTH_CONFIG[analysis.score]
      return {
        password: pwd,
        analysis,
        timestamp: Date.now(),
        id: crypto.getRandomValues(new Uint32Array(1))[0].toString(36),
        strength: config.strength,
        score: analysis.score,
      }
    })
    setGeneratedPasswords(analyzedPasswords)
    // Auto-select the strongest password for analysis
    const strongest = analyzedPasswords.reduce((prev, current) => (current.score > prev.score ? current : prev))
    setPassword(strongest.password)
  }, [generateSecurePassword])

  // Clipboard functionality
  const copyToClipboard = useCallback((text: string, id: string): void => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopiedId(id)
        setTimeout(() => setCopiedId(null), 2000)
      })
      .catch((err) => console.error("Copy failed:", err))
  }, [])

  // Save to history
  const saveToHistory = useCallback((pwd: string, analysis: ZxcvbnResult): void => {
    if (!analysis) return

    // Simple hash for privacy
    const hashArray = Array.from(new TextEncoder().encode(pwd))
    const hashHex = hashArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")
      .substring(0, 12)

    const newEntry: PasswordHistoryEntry = {
      passwordHash: hashHex,
      score: analysis.score,
      timestamp: Date.now(),
      strength: STRENGTH_CONFIG[analysis.score].strength,
      entropy: Math.round(analysis.entropy),
    }
    setPasswordHistory((prev) => [newEntry, ...prev.slice(0, 49)])
  }, [])

  // Visualization
  const drawPasswordVisualization = useCallback((): void => {
    const canvas = canvasRef.current
    if (!canvas || analysisState.status !== "success" || !analysisState.analysis) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const { score, entropy } = analysisState.analysis
    const pwned = (analysisState.pwnedCount ?? 0) > 0

    const width = 280
    const height = 280
    canvas.width = width * 2
    canvas.height = height * 2
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`
    ctx.scale(2, 2)

    const centerX = width / 2
    const centerY = height / 2
    const radius = Math.min(centerX, centerY) - 40

    ctx.clearRect(0, 0, width, height)

    const metrics: MetricPoint[] = [
      { label: "Strength", value: (score + 1) / 5, color: "#10b981" },
      { label: "Entropy", value: Math.min(entropy, 100) / 100, color: "#3b82f6" },
      { label: "Length", value: Math.min(password.length, 32) / 32, color: "#8b5cf6" },
      { label: "Safety", value: pwned ? 0.1 : 1.0, color: "#f59e0b" },
      { label: "Unique", value: new Set(password).size / Math.min(password.length, 20), color: "#06b6d4" },
    ]

    const numMetrics = metrics.length
    const angleStep = (2 * Math.PI) / numMetrics

    // Draw grid
    ctx.strokeStyle = "#1f2937"
    ctx.lineWidth = 1
    for (let i = 1; i <= 4; i++) {
      const r = radius * (i / 4)
      ctx.beginPath()
      for (let j = 0; j < numMetrics; j++) {
        const angle = j * angleStep - Math.PI / 2
        const x = centerX + r * Math.cos(angle)
        const y = centerY + r * Math.sin(angle)
        if (j === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.closePath()
      ctx.stroke()
    }

    // Draw axes and labels
    ctx.font = "11px ui-monospace, monospace"
    ctx.fillStyle = "#9ca3af"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    for (let i = 0; i < numMetrics; i++) {
      const angle = i * angleStep - Math.PI / 2
      const labelRadius = radius + 20
      const x = centerX + labelRadius * Math.cos(angle)
      const y = centerY + labelRadius * Math.sin(angle)
      ctx.fillText(metrics[i].label, x, y)
    }

    // Draw data polygon
    ctx.beginPath()
    metrics.forEach((metric, i) => {
      const r = radius * metric.value
      const angle = i * angleStep - Math.PI / 2
      const x = centerX + r * Math.cos(angle)
      const y = centerY + r * Math.sin(angle)
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    })
    ctx.closePath()
    ctx.fillStyle = "rgba(16, 185, 129, 0.2)"
    ctx.fill()
    ctx.strokeStyle = "#10b981"
    ctx.lineWidth = 2
    ctx.stroke()

    // Draw data points
    metrics.forEach((metric, i) => {
      const r = radius * metric.value
      const angle = i * angleStep - Math.PI / 2
      const x = centerX + r * Math.cos(angle)
      const y = centerY + r * Math.sin(angle)
      ctx.beginPath()
      ctx.arc(x, y, 4, 0, 2 * Math.PI)
      ctx.fillStyle = metric.color
      ctx.fill()
    })
  }, [analysisState, password])

  // Debounced password analysis
  useEffect(() => {
    if (analysisTimeoutRef.current) clearTimeout(analysisTimeoutRef.current)

    if (!password) {
      dispatch({ type: "RESET" })
      return
    }

    dispatch({ type: "ANALYZE_START" })
    analysisTimeoutRef.current = setTimeout(async () => {
      try {
        const analysis = analyzePassword(password)
        const pwnedCount = await checkPwnedPassword(password)
        dispatch({
          type: "ANALYZE_SUCCESS",
          payload: { analysis, pwnedCount },
        })
      } catch (error) {
        dispatch({
          type: "ANALYZE_ERROR",
          payload: { error: error instanceof Error ? error.message : "Analysis failed" },
        })
      }
    }, 300)

    return () => {
      if (analysisTimeoutRef.current) clearTimeout(analysisTimeoutRef.current)
    }
  }, [password])

  // Save to history and draw visualization
  useEffect(() => {
    if (analysisState.status === "success" && analysisState.analysis && password) {
      saveToHistory(password, analysisState.analysis)
      if (visualMode) {
        drawPasswordVisualization()
      }
    }
  }, [analysisState, visualMode, password, saveToHistory, drawPasswordVisualization])

  // Derived state for UI
  const { score, strengthText, strengthColor, entropy, crackTimeText, suggestions, strengthDescription } =
    useMemo(() => {
      if (analysisState.status !== "success" || !analysisState.analysis) {
        return {
          score: 0,
          strengthText: "Enter password",
          strengthColor: "text-gray-500",
          entropy: 0,
          crackTimeText: "-",
          suggestions: [],
          strengthDescription: "Awaiting input",
        }
      }
      const { analysis } = analysisState
      const config = STRENGTH_CONFIG[analysis.score]
      return {
        score: analysis.score,
        strengthText: config.strength,
        strengthColor: config.color,
        entropy: Math.round(analysis.entropy),
        crackTimeText: analysis.crackTimesDisplay.offline_slow_hashing_1e4_per_second,
        suggestions: analysis.feedback.warning
          ? [analysis.feedback.warning, ...analysis.feedback.suggestions]
          : analysis.feedback.suggestions,
        strengthDescription: config.description,
      }
    }, [analysisState])

  const pwnedStatus = useMemo(() => {
    if (analysisState.status === "loading") {
      return {
        text: "Checking...",
        color: "text-gray-400",
        icon: <RiLoader4Line className="animate-spin" />,
      }
    }
    if (analysisState.status === "error" || analysisState.pwnedCount === undefined) {
      return {
        text: "Check failed",
        color: "text-yellow-400",
        icon: <RiAlertLine />,
      }
    }
    if (analysisState.pwnedCount > 0) {
      return {
        text: `Breached ${analysisState.pwnedCount.toLocaleString()}×`,
        color: "text-red-400",
        icon: <RiAlertLine />,
      }
    }
    return {
      text: "Secure",
      color: "text-emerald-400",
      icon: <RiShieldCheckLine />,
    }
  }, [analysisState])

  // Event handlers
  const handlePasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>): void => {
    setPassword(e.target.value)
  }, [])

  const handleShowPasswordToggle = useCallback((): void => {
    setShowPassword((prev) => !prev)
  }, [])

  const handleTabChange = useCallback((tab: TabType): void => {
    setActiveTab(tab)
  }, [])

  const handleVisualModeToggle = useCallback((): void => {
    setVisualMode((prev) => !prev)
  }, [])

  const handleGeneratorConfigToggle = useCallback((): void => {
    setShowGeneratorConfig((prev) => !prev)
  }, [])

  const handleGenModeChange = useCallback((mode: GenerationMode): void => {
    setGenMode(mode)
  }, [])

  const handleGenLengthChange = useCallback((e: React.ChangeEvent<HTMLInputElement>): void => {
    setGenLength(Number(e.target.value))
  }, [])

  const handlePasswordSelect = useCallback((pwd: string): void => {
    setPassword(pwd)
    setActiveTab("analyze") // Switch to analyze tab when a generated password is selected
  }, [])

  return (
    <div className="min-h-screen bg-black text-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="text-center mb-8 lg:mb-12">
          <div className="inline-flex items-center space-x-3 bg-gray-950 border border-gray-800 rounded-full px-6 py-3 mb-6">
            <RiTerminalLine className="w-5 h-5 text-emerald-400" />
            <span className="font-mono text-sm text-emerald-400 font-medium">Advanced Passcode Analysis</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-mono font-bold text-white mb-4 tracking-tight">
            ZeroLeaks<span className="text-emerald-400"> Console</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-gray-400 mb-8">
            Military-grade passcode analysis with real-time breach detection and quantum-resistant generation
          </p>
          {/* Navigation Tabs */}
          <div className="flex justify-center mb-8">
            <div className="bg-gray-950 border border-gray-800 rounded-lg p-1 inline-flex">
              {[
                { id: "analyze" as const, label: "Analyze", icon: RiShieldCheckLine },
                { id: "generate" as const, label: "Generate", icon: RiKeyLine },
                { id: "history" as const, label: "History", icon: RiHistoryLine },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => handleTabChange(id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    activeTab === id
                      ? "bg-emerald-600 text-white shadow-lg"
                      : "text-gray-400 hover:text-white hover:bg-gray-800"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Primary Panel */}
          <div className="xl:col-span-2 space-y-6">
            {activeTab === "analyze" && (
              <>
                {/* Password Input */}
                <div className="bg-gray-950 border border-gray-800 rounded-xl p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <RiShieldCheckLine className="w-5 h-5 text-emerald-400" />
                    <h2 className="text-xl font-semibold text-white">Security Analysis</h2>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={handlePasswordChange}
                      placeholder="Enter your password for comprehensive analysis..."
                      className="w-full bg-black border border-gray-700 rounded-lg px-4 py-4 pr-12 text-lg text-emerald-300 placeholder-gray-600 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all font-mono"
                      autoComplete="off"
                      spellCheck="false"
                    />
                    <button
                      onClick={handleShowPasswordToggle}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white p-2 rounded-md hover:bg-gray-800 transition-colors"
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <RiEyeOffLine size={20} /> : <RiEyeLine size={20} />}
                    </button>
                  </div>
                </div>

                {password && (
                  <>
                    {/* Strength Overview */}
                    <div className="bg-gray-950 border border-gray-800 rounded-xl p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                        <div>
                          <h3 className={`text-3xl font-bold ${strengthColor} mb-1`}>{strengthText}</h3>
                          <p className="text-gray-400">{strengthDescription}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-400 mb-1">Crack Time</p>
                          <p className="text-xl font-semibold text-white">{crackTimeText}</p>
                        </div>
                      </div>
                      <div className="w-full bg-gray-800 rounded-full h-3 mb-4">
                        <div
                          className={`h-3 rounded-full transition-all duration-700 ${STRENGTH_CONFIG[score]?.bgColor.replace("/20", "")}`}
                        />
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div className="bg-black rounded-lg p-3 text-center">
                          <div className="text-2xl font-bold text-white mb-1">{score}/4</div>
                          <div className="text-xs text-gray-400">Score</div>
                        </div>
                        <div className="bg-black rounded-lg p-3 text-center">
                          <div className="text-2xl font-bold text-white mb-1">{entropy}</div>
                          <div className="text-xs text-gray-400">Entropy</div>
                        </div>
                        <div className="bg-black rounded-lg p-3 text-center">
                          <div className="text-2xl font-bold text-white mb-1">{password.length}</div>
                          <div className="text-xs text-gray-400">Length</div>
                        </div>
                        <div className="bg-black rounded-lg p-3 text-center">
                          <div
                            className={`text-2xl font-bold mb-1 ${pwnedStatus.color} flex items-center justify-center`}
                          >
                            {pwnedStatus.icon}
                          </div>
                          <div className="text-xs text-gray-400">{pwnedStatus.text}</div>
                        </div>
                      </div>
                    </div>

                    {/* Detailed Analysis */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Recommendations */}
                      <div className="bg-gray-950 border border-gray-800 rounded-xl p-6">
                        <div className="flex items-center space-x-3 mb-4">
                          <RiPassValidLine className="w-5 h-5 text-emerald-400" />
                          <h3 className="text-lg font-semibold text-white">Recommendations</h3>
                        </div>
                        {suggestions.length > 0 ? (
                          <ul className="space-y-3">
                            {suggestions.map((suggestion, i) => (
                              <li key={i} className="flex items-start space-x-3">
                                <RiFlashlightLine className="w-4 h-4 text-yellow-400 mt-1 flex-shrink-0" />
                                <span className="text-gray-300 text-sm">{suggestion}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <div className="flex items-center space-x-3 text-emerald-400">
                            <RiCheckLine className="w-5 h-5" />
                            <span>Excellent security posture!</span>
                          </div>
                        )}
                      </div>

                      {/* Visual Analysis */}
                      <div className="bg-gray-950 border border-gray-800 rounded-xl p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <RiBarChartLine className="w-5 h-5 text-emerald-400" />
                            <h3 className="text-lg font-semibold text-white">Security Radar</h3>
                          </div>
                          <button
                            onClick={handleVisualModeToggle}
                            className={`px-3 py-1 rounded-md text-sm transition-colors ${
                              visualMode ? "bg-emerald-600 text-white" : "bg-gray-800 text-gray-400 hover:text-white"
                            }`}
                          >
                            {visualMode ? "Hide" : "Show"}
                          </button>
                        </div>
                        {visualMode ? (
                          <div className="flex justify-center">
                            <canvas ref={canvasRef} className="max-w-full" />
                          </div>
                        ) : (
                          <div className="text-center py-8 text-gray-500">
                            <RiBarChartLine className="w-12 h-12 mx-auto mb-2 opacity-50" />
                            <p>Enable visual mode to see security metrics</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </>
            )}

            {activeTab === "generate" && (
              <div className="space-y-6">
                {/* Generator Controls */}
                <div className="bg-gray-950 border border-gray-800 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <RiKeyLine className="w-5 h-5 text-emerald-400" />
                      <h2 className="text-xl font-semibold text-white">Password Generator</h2>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        title="Toggle generator settings"
                        onClick={handleGeneratorConfigToggle}
                        className={`p-2 rounded-md transition-colors ${
                          showGeneratorConfig
                            ? "bg-emerald-600 text-white"
                            : "bg-gray-800 text-gray-400 hover:text-white"
                        }`}
                      >
                        <RiSettings3Line className="w-4 h-4" />
                      </button>
                      <button
                        onClick={generatePasswords}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md transition-colors flex items-center space-x-2"
                      >
                        <RiRefreshLine className="w-4 h-4" />
                        <span>Generate</span>
                      </button>
                    </div>
                  </div>
                  {showGeneratorConfig && (
                    <div className="bg-black rounded-lg p-4 mb-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <label className="font-medium text-white">Generation Mode</label>
                        <div className="flex bg-gray-800 rounded-lg p-1">
                          <button
                            onClick={() => handleGenModeChange("random")}
                            className={`px-3 py-1 text-sm rounded-md transition-colors ${
                              genMode === "random" ? "bg-emerald-600 text-white" : "text-gray-400 hover:text-white"
                            }`}
                          >
                            <RiCpuLine className="inline mr-1 w-3 h-3" /> Random
                          </button>
                          <button
                            onClick={() => handleGenModeChange("passphrase")}
                            className={`px-3 py-1 text-sm rounded-md transition-colors ${
                              genMode === "passphrase" ? "bg-emerald-600 text-white" : "text-gray-400 hover:text-white"
                            }`}
                          >
                            <RiArticleLine className="inline mr-1 w-3 h-3" /> Passphrase
                          </button>
                        </div>
                      </div>
                      {genMode === "random" && (
                        <>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <label className="font-medium text-white">Length</label>
                              <span className="text-emerald-400 font-mono">{genLength}</span>
                            </div>
                            <input
                              title="Adjust password length"
                              type="range"
                              min="8"
                              max="64"
                              value={genLength}
                              onChange={handleGenLengthChange}
                              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                            />
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {[
                              {
                                key: "genUseUppercase",
                                label: "Uppercase",
                                value: genUseUppercase,
                                setter: setGenUseUppercase,
                              },
                              {
                                key: "genUseNumbers",
                                label: "Numbers",
                                value: genUseNumbers,
                                setter: setGenUseNumbers,
                              },
                              {
                                key: "genUseSymbols",
                                label: "Symbols",
                                value: genUseSymbols,
                                setter: setGenUseSymbols,
                              },
                            ].map(({ key, label, value, setter }) => (
                              <label key={key} className="flex items-center space-x-2 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={value}
                                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setter(e.target.checked)}
                                  className="w-4 h-4 text-emerald-600 bg-gray-800 border-gray-600 rounded focus:ring-emerald-500"
                                />
                                <span className="text-gray-300 text-sm">{label}</span>
                              </label>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* Generated Passwords */}
                <div className="bg-gray-950 border border-gray-800 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Generated Passwords</h3>
                  <div className="space-y-3">
                    {generatedPasswords.map(({ password: pwd, id, strength, score }) => (
                      <div key={id} className="bg-black rounded-lg p-4 flex items-center justify-between">
                        <div className="flex-1 min-w-0 mr-4">
                          <div className="font-mono text-emerald-300 text-sm sm:text-base break-all mb-1">{pwd}</div>
                          <div className="flex items-center space-x-4">
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${STRENGTH_CONFIG[score]?.bgColor} ${STRENGTH_CONFIG[score]?.color}`}
                            >
                              {strength}
                            </span>
                            <span className="text-xs text-gray-500">{pwd.length} chars</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handlePasswordSelect(pwd)}
                            className="p-2 text-gray-400 hover:text-emerald-400 transition-colors"
                            title="Analyze this password"
                          >
                            <FaCableCar className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => copyToClipboard(pwd, id)}
                            className="p-2 text-gray-400 hover:text-white transition-colors"
                            title="Copy to clipboard"
                          >
                            {copiedId === id ? (
                              <RiCheckLine className="w-4 h-4 text-emerald-400" />
                            ) : (
                              <RiFileCopyLine className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "history" && (
              <div className="bg-gray-950 border border-gray-800 rounded-xl p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <RiHistoryLine className="w-5 h-5 text-emerald-400" />
                  <h2 className="text-xl font-semibold text-white">Analysis History</h2>
                  <span className="bg-gray-800 text-gray-300 px-2 py-1 rounded-full text-xs">
                    {passwordHistory.length}
                  </span>
                </div>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {passwordHistory.length > 0 ? (
                    passwordHistory.map((entry, i) => (
                      <div key={i} className="bg-black rounded-lg p-4 flex items-center justify-between">
                        <div className="flex-1">
                          <div className="font-mono text-sm text-gray-500 mb-1">Hash: {entry.passwordHash}...</div>
                          <div className="text-xs text-gray-600">{new Date(entry.timestamp).toLocaleString()}</div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="text-right">
                            <div className="text-sm text-gray-400">{entry.entropy} bits</div>
                          </div>
                          <span
                            className={`px-3 py-1 text-xs font-medium rounded-full ${STRENGTH_CONFIG[entry.score]?.bgColor} ${STRENGTH_CONFIG[entry.score]?.color}`}
                          >
                            {entry.strength}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      <RiDatabaseLine className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No analysis history yet</p>
                      <p className="text-sm">Start analyzing passwords to build your history</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-gray-950 border border-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <RiShieldStarLine className="w-5 h-5 text-emerald-400 mr-2" />
                Security Overview
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Passwords Analyzed</span>
                  <span className="text-white font-semibold">{passwordHistory.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Generated Today</span>
                  <span className="text-white font-semibold">{generatedPasswords.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Current Strength</span>
                  <span className={`font-semibold ${strengthColor}`}>{strengthText}</span>
                </div>
              </div>
            </div>

            {/* Security Tips */}
            <div className="bg-gray-950 border border-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <RiLockLine className="w-5 h-5 text-emerald-400 mr-2" />
                Security Tips
              </h3>
              <div className="space-y-3 text-sm text-gray-400">
                <div className="flex items-start space-x-2">
                  <RiCheckLine className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span>Use unique passwords for each account</span>
                </div>
                <div className="flex items-start space-x-2">
                  <RiCheckLine className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span>Enable two-factor authentication</span>
                </div>
                <div className="flex items-start space-x-2">
                  <RiCheckLine className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span>Consider using a password manager</span>
                </div>
                <div className="flex items-start space-x-2">
                  <RiCheckLine className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span>Regularly update critical passwords</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
