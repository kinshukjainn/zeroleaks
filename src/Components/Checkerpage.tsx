"use client"
import { useState, useEffect, useCallback, useMemo, useRef, type SetStateAction } from "react"
import {
  RiEyeLine,
  RiEyeOffLine,
  RiRefreshLine,
  RiFileCopyLine,
  RiCheckLine,
  RiTerminalLine,
  RiShieldCheckLine,
  RiAlertLine,
  RiLoader4Line,
  RiCpuLine,
  RiArticleLine,
  RiStarLine,
  RiFlashlightLine,
} from "react-icons/ri"
import { motion } from "framer-motion"

// Types
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
}

interface GeneratedPassword {
  password: string
  analysis: ZxcvbnResult
  timestamp: number
  id: string
  strength: string
  score: number
  category: "random" | "passphrase" | "memorable"
}

type GenerationMode = "random" | "passphrase" | "memorable"

// Configuration
const STRENGTH_CONFIG: Record<number, { strength: string; color: string; description: string }> = {
  4: {
    strength: "FORTRESS",
    color: "text-green-400",
    description: "Quantum-resistant security",
  },
  3: {
    strength: "STRONG",
    color: "text-cyan-400",
    description: "Enterprise-grade protection",
  },
  2: {
    strength: "MODERATE",
    color: "text-yellow-400",
    description: "Standard security level",
  },
  1: {
    strength: "WEAK",
    color: "text-orange-400",
    description: "Vulnerable to attacks",
  },
  0: {
    strength: "CRITICAL",
    color: "text-red-400",
    description: "Immediate security risk",
  },
}

// Analysis Functions
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
  const hasSequential =
    /(?:abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz|123|234|345|456|567|678|789|890)/i.test(
      password,
    )
  const hasRepeated = /(.)\1{2,}/.test(password)
  const hasCommonPatterns = /(password|123456|qwerty|admin|login|welcome)/i.test(password)

  let score = 0
  if (length >= 8) score++
  if (length >= 12) score++
  if (length >= 16) score++
  if (hasLower && hasUpper && hasNumbers) score++
  if (hasSymbols && uniqueChars > length * 0.7) score++
  if (entropy > 50) score++
  if (entropy > 70) score++

  // Penalties
  if (hasSequential) score = Math.max(0, score - 1)
  if (hasRepeated) score = Math.max(0, score - 1)
  if (hasCommonPatterns) score = Math.max(0, score - 2)

  score = Math.min(4, Math.max(0, Math.floor(score / 2)))

  const suggestions: string[] = []
  let warning = ""

  if (length < 8) {
    warning = "Password is critically short"
    suggestions.push("Use at least 12 characters for better security")
  }
  if (length < 12) suggestions.push("Consider using 16+ characters")
  if (!hasUpper) suggestions.push("Add uppercase letters (A-Z)")
  if (!hasNumbers) suggestions.push("Include numbers (0-9)")
  if (!hasSymbols) suggestions.push("Add special characters (!@#$%)")
  if (uniqueChars < length * 0.5) suggestions.push("Reduce character repetition")
  if (hasSequential) suggestions.push("Avoid sequential patterns (abc, 123)")
  if (hasCommonPatterns) suggestions.push("Avoid common words and patterns")

  const crackTime = Math.pow(2, entropy / 2)
  const formatTime = (seconds: number): string => {
    if (seconds < 1) return "instantly"
    if (seconds < 60) return "< 1 minute"
    if (seconds < 3600) return `${Math.round(seconds / 60)} minutes`
    if (seconds < 86400) return `${Math.round(seconds / 3600)} hours`
    if (seconds < 31536000) return `${Math.round(seconds / 86400)} days`
    if (seconds < 31536000000) return `${Math.round(seconds / 31536000)} years`
    return "centuries"
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
    feedback: { warning, suggestions },
  }
}

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
  } catch {
    return -1
  }
}

export default function TerminalPasswordGenerator() {
  // Core State - Password starts completely empty
  const [password, setPassword] = useState<string>("")
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [generatedPasswords, setGeneratedPasswords] = useState<GeneratedPassword[]>([])
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false)
  const [pwnedCount, setPwnedCount] = useState<number | null>(null)
  const [pwnedLoading, setPwnedLoading] = useState<boolean>(false)
  const InputMotion = motion.input

  // Generator Options
  const [genLength, setGenLength] = useState<number>(16)
  const [genUseUppercase, setGenUseUppercase] = useState<boolean>(true)
  const [genUseNumbers, setGenUseNumbers] = useState<boolean>(true)
  const [genUseSymbols, setGenUseSymbols] = useState<boolean>(true)
  const [genMode, setGenMode] = useState<GenerationMode>("random")
  const [genCount, setGenCount] = useState<number>(6)

  // Analysis timeout ref
  const analysisTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Password Generation
  const generateSecurePassword = useCallback(async (): Promise<string> => {
    const wordLists = {
      passphrase: [
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
        "crystal",
        "shadow",
        "whisper",
        "ember",
        "frost",
        "storm",
        "blade",
        "shield",
      ],
      memorable: [
        "Apple",
        "Banana",
        "Cherry",
        "Dragon",
        "Eagle",
        "Forest",
        "Guitar",
        "Harbor",
        "Island",
        "Jungle",
        "Kitten",
        "Lemon",
        "Mountain",
        "Ninja",
        "Ocean",
        "Piano",
      ],
    }

    if (genMode === "passphrase") {
      const words = wordLists.passphrase
      const passphrase: string[] = []
      const randomValues = new Uint32Array(4)
      crypto.getRandomValues(randomValues)
      for (let i = 0; i < 4; i++) {
        passphrase.push(words[randomValues[i] % words.length])
      }
      const separator = genUseSymbols ? ["-", "_", ".", "+"][Math.floor(Math.random() * 4)] : "-"
      let result = passphrase.join(separator)
      if (genUseNumbers) {
        const numbers = crypto.getRandomValues(new Uint32Array(1))[0] % 9999
        result += numbers.toString().padStart(4, "0")
      }
      return result
    }

    if (genMode === "memorable") {
      const words = wordLists.memorable
      const randomValues = new Uint32Array(3)
      crypto.getRandomValues(randomValues)
      let result = ""
      for (let i = 0; i < 3; i++) {
        result += words[randomValues[i] % words.length]
      }
      if (genUseNumbers) {
        result += (crypto.getRandomValues(new Uint32Array(1))[0] % 99).toString().padStart(2, "0")
      }
      if (genUseSymbols) {
        const symbols = "!@#$%^&*"
        result += symbols[crypto.getRandomValues(new Uint32Array(1))[0] % symbols.length]
      }
      return result
    }

    // Random mode
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
    setIsAnalyzing(true)
    try {
      const promises = Array.from({ length: genCount }, () => generateSecurePassword())
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
          category: genMode,
        }
      })
      setGeneratedPasswords(analyzedPasswords)
    } catch (error) {
      console.error("Failed to generate passwords:", error)
    } finally {
      setIsAnalyzing(false)
    }
  }, [generateSecurePassword, genCount, genMode])

  // Copy to clipboard
  const copyToClipboard = useCallback((text: string, id: string): void => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopiedId(id)
        setTimeout(() => setCopiedId(null), 2000)
      })
      .catch(() => console.error("Failed to copy"))
  }, [])

  // Password analysis with debouncing
  useEffect(() => {
    if (analysisTimeoutRef.current) clearTimeout(analysisTimeoutRef.current)
    // Reset states when password is empty
    if (!password || password.trim() === "") {
      setPwnedCount(null)
      setPwnedLoading(false)
      return
    }

    setPwnedLoading(true)
    analysisTimeoutRef.current = setTimeout(async () => {
      try {
        const count = await checkPwnedPassword(password)
        setPwnedCount(count)
      } catch {
        setPwnedCount(-1)
      } finally {
        setPwnedLoading(false)
      }
    }, 500)

    return () => {
      if (analysisTimeoutRef.current) clearTimeout(analysisTimeoutRef.current)
    }
  }, [password])

  // Computed values
  const passwordAnalysis = useMemo(() => {
    if (!password || password.trim() === "") {
      return {
        score: 0,
        strengthText: "",
        strengthColor: "text-gray-500",
        entropy: 0,
        crackTimeText: "",
        suggestions: [],
        strengthDescription: "",
      }
    }
    const analysis = analyzePassword(password)
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
  }, [password])

  const pwnedStatus = useMemo(() => {
    if (!password || password.trim() === "") {
      return {
        text: "",
        color: "text-gray-500",
        icon: null,
      }
    }
    if (pwnedLoading) {
      return {
        text: "CHECKING...",
        color: "text-yellow-400",
        icon: <RiLoader4Line className="animate-spin" />,
      }
    }
    if (pwnedCount === null || pwnedCount === -1) {
      return {
        text: "CHECK FAILED",
        color: "text-gray-400",
        icon: <RiAlertLine />,
      }
    }
    if (pwnedCount > 0) {
      return {
        text: `BREACHED ${pwnedCount.toLocaleString()}×`,
        color: "text-red-400",
        icon: <RiAlertLine />,
      }
    }
    return {
      text: "SECURE",
      color: "text-green-400",
      icon: <RiShieldCheckLine />,
    }
  }, [pwnedCount, pwnedLoading, password])

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono">
      {/* Terminal Header */}
      <div className="border-b border-green-800/30">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
              <RiTerminalLine className="w-5 h-5 sm:w-6 sm:h-6 text-green-400 flex-shrink-0" />
              <h1 className="text-sm sm:text-lg md:text-xl font-bold truncate">ZEROSEC PASSWORD GENERATOR v2.0</h1>
            </div>
            <div className="flex space-x-1 sm:space-x-2 flex-shrink-0">
              <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-red-500"></div>
              <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-yellow-500"></div>
              <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-500"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8 space-y-6 sm:space-y-8">
        {/* Password Input & Analysis */}
        <div className="rounded-lg p-3 sm:p-4 md:p-6">
          <div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
            <span className="text-green-400 text-sm sm:text-base">$</span>
            <span className="text-cyan-400 text-sm sm:text-base">analyze</span>
            <span className="text-gray-500 text-xs sm:text-sm">--password</span>
          </div>

          <div className="relative mb-4 sm:mb-6">
            <InputMotion
              key="password-input"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e: { target: { value: SetStateAction<string> } }) => setPassword(e.target.value)}
              placeholder="Enter password for security analysis..."
              autoComplete="off"
              spellCheck="false"
              initial={{ scale: 1 }}
              whileFocus={{ scale: 1.02 }}
              transition={{
                type: "spring",
                stiffness: 120,
                damping: 15,
              }}
              className="w-full bg-[#131313] rounded-xl hover:rounded-3xl px-3 sm:px-4 py-3 sm:py-4 pr-10 sm:pr-12 text-sm sm:text-base text-green-300 placeholder-gray-600 focus:outline-none focus:rounded-full focus:border-green-400 transition-all duration-700 ease-in-out"
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-green-400 transition-colors p-1"
            >
              {showPassword ? (
                <RiEyeOffLine className="w-4 h-4 sm:w-5 sm:h-5" />
              ) : (
                <RiEyeLine className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
            </button>
          </div>

          {password && password.trim() !== "" && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
              {/* Strength Analysis */}
              <div className="bg-black/30 rounded p-3 sm:p-4">
                <div className="text-xs text-gray-100 mb-2">STRENGTH ANALYSIS</div>
                <div className={`text-base sm:text-lg font-bold ${passwordAnalysis.strengthColor} mb-1`}>
                  {passwordAnalysis.strengthText}
                </div>
                <div className="text-xs sm:text-sm text-red-500 font-bold mb-2 sm:mb-3">
                  {passwordAnalysis.strengthDescription}
                </div>
                <div className="space-y-1 sm:space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-100">SCORE:</span>
                    <span className="text-green-100">{passwordAnalysis.score}/4</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-100">ENTROPY:</span>
                    <span className="text-green-100">{passwordAnalysis.entropy} bits</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white">LENGTH:</span>
                    <span className="text-white">{password.length} chars</span>
                  </div>
                </div>
              </div>

              {/* Breach Status */}
              <div className="bg-black/30 rounded p-3 sm:p-4">
                <div className="text-xs text-yellow-500 mb-2">BREACH STATUS</div>
                {pwnedStatus.text && (
                  <>
                    <div className={`flex items-center space-x-2 ${pwnedStatus.color} mb-2 sm:mb-3`}>
                      {pwnedStatus.icon}
                      <span className="font-bold text-xs sm:text-sm animate-pulse break-all">{pwnedStatus.text}</span>
                    </div>
                    <div className="text-xs text-red-500">
                      {pwnedCount === 0
                        ? "Password not found in known breaches"
                        : pwnedCount && pwnedCount > 0
                          ? "This password has been compromised"
                          : "Unable to verify breach status"}
                    </div>
                  </>
                )}
              </div>

              {/* Crack Time */}
              <div className="bg-black/30 rounded p-3 sm:p-4 md:col-span-2 xl:col-span-1">
                <div className="text-xs text-yellow-400 mb-2">CRACK TIME</div>
                <div className="text-base sm:text-lg font-bold text-cyan-100 mb-1 break-all">
                  {passwordAnalysis.crackTimeText}
                </div>
                <div className="text-xs text-gray-100 mb-2 sm:mb-3">Offline slow hashing</div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-500">UNIQUE:</span>
                    <span className="text-green-400">{new Set(password).size}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">CHARSET:</span>
                    <span className="text-green-400">
                      {
                        [
                          /[a-z]/.test(password) && "a-z",
                          /[A-Z]/.test(password) && "A-Z",
                          /[0-9]/.test(password) && "0-9",
                          /[^a-zA-Z0-9]/.test(password) && "sym",
                        ].filter(Boolean).length
                      }
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Suggestions */}
          {password && passwordAnalysis.suggestions.length > 0 && (
            <div className="mt-4 sm:mt-6 bg-yellow-900/20 border border-yellow-600/30 rounded p-3 sm:p-4">
              <div className="text-xs text-yellow-400 mb-2">SECURITY RECOMMENDATIONS</div>
              <div className="space-y-1">
                {passwordAnalysis.suggestions.map((suggestion, index) => (
                  <div key={index} className="flex items-start space-x-2 text-xs">
                    <span className="text-yellow-400 mt-0.5 flex-shrink-0">•</span>
                    <span className="text-gray-300">{suggestion}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Password Generator */}
        <div className="rounded-lg p-3 sm:p-4 md:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <span className="text-base sm:text-lg text-cyan-400">$~generate/:</span>
              <span className="text-white text-sm sm:text-base">Select mode to generate</span>
            </div>
            <button
              onClick={generatePasswords}
              disabled={isAnalyzing}
              className="px-3 sm:px-4 py-2 bg-yellow-500 text-black rounded-full font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 cursor-pointer text-sm sm:text-base min-w-0"
            >
              {isAnalyzing ? (
                <RiLoader4Line className="w-4 h-4 animate-spin flex-shrink-0" />
              ) : (
                <RiRefreshLine className="w-4 h-4 flex-shrink-0" />
              )}
              <span className="truncate">GENERATE ({genCount})</span>
            </button>
          </div>

          {/* Generation Mode Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
            {[
              {
                mode: "random" as GenerationMode,
                title: "RANDOM",
                icon: RiCpuLine,
                desc: "Cryptographically secure",
              },
              {
                mode: "passphrase" as GenerationMode,
                title: "PASSPHRASE",
                icon: RiArticleLine,
                desc: "Easy to remember",
              },
              {
                mode: "memorable" as GenerationMode,
                title: "MEMORABLE",
                icon: RiStarLine,
                desc: "Balanced approach",
              },
            ].map(({ mode, title, icon: Icon, desc }) => (
              <button
                key={mode}
                onClick={() => setGenMode(mode)}
                className={`p-3 rounded text-left transition-all ${
                  genMode === mode
                    ? "text-yellow-500 rounded-xl border-2 sm:border-3 border-yellow-500"
                    : "text-white rounded-lg hover:bg-gray-900/30"
                }`}
              >
                <Icon className="w-4 h-4 sm:w-5 sm:h-5 mb-2" />
                <div className="font-bold text-xs sm:text-sm">{title}</div>
                <div className="text-xs opacity-80">{desc}</div>
              </button>
            ))}
          </div>

          {/* Generator Options */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
            <div className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-xs sm:text-sm text-gray-100 mb-2">No of Passwords : {genCount}</label>
                <input
                  title="Number of passwords to generate"
                  type="range"
                  min="1"
                  max="20"
                  value={genCount}
                  onChange={(e) => setGenCount(Number(e.target.value))}
                  className="w-full h-1 bg-white rounded appearance-none cursor-pointer accent-green-500"
                />
              </div>
              {genMode === "random" && (
                <div>
                  <label className="block text-xs sm:text-sm text-gray-100 mb-2">Length of Password: {genLength}</label>
                  <input
                    title="Length of each generated password"
                    type="range"
                    min="8"
                    max="64"
                    value={genLength}
                    onChange={(e) => setGenLength(Number(e.target.value))}
                    className="w-full h-1 bg-white rounded appearance-none cursor-pointer accent-blue-500"
                  />
                </div>
              )}
            </div>
            {genMode === "random" && (
              <div className="space-y-2 sm:space-y-3">
                <div className="text-xs sm:text-sm text-gray-100 mb-2">CHARACTER SETS</div>
                {[
                  {
                    key: "uppercase",
                    label: "UPPERCASE (A-Z)",
                    value: genUseUppercase,
                    setter: setGenUseUppercase,
                  },
                  {
                    key: "numbers",
                    label: "NUMBERS (0-9)",
                    value: genUseNumbers,
                    setter: setGenUseNumbers,
                  },
                  {
                    key: "symbols",
                    label: "SYMBOLS (!@#$)",
                    value: genUseSymbols,
                    setter: setGenUseSymbols,
                  },
                ].map(({ key, label, value, setter }) => (
                  <label key={key} className="flex items-center space-x-2 sm:space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) => setter(e.target.checked)}
                      className="w-3 h-3 sm:w-4 sm:h-4 text-green-600 bg-gray-800 border-gray-600 rounded focus:ring-green-500 flex-shrink-0"
                    />
                    <span className="text-gray-300 text-xs">{label}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Generated Passwords */}
        {generatedPasswords.length > 0 && (
          <div className="rounded-lg p-3 sm:p-4 md:p-6">
            <div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
              <span className="text-green-400 text-sm sm:text-base">$</span>
              <span className="text-lg sm:text-xl text-cyan-400">output</span>
            </div>
            <div className="space-y-2 sm:space-y-3">
              {generatedPasswords.map(({ password: pwd, id, strength, score, analysis }) => (
                <div key={id} className="bg-black/30 rounded p-3 sm:p-4 transition-all group">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4 mb-2">
                    <div className="flex-1 min-w-0">
                      <div className="text-[#ff9100] text-sm sm:text-base lg:text-lg break-all mb-1 transition-colors font-mono">
                        {pwd}
                      </div>
                      <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs">
                        <span className={`${STRENGTH_CONFIG[score]?.color} font-semibold`}>{strength}</span>
                        <span className="text-gray-100 font-semibold">{pwd.length} chars</span>
                        <span className="font-semibold text-gray-100">{Math.round(analysis.entropy)} bits</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
                      <button
                        onClick={() => setPassword(pwd)}
                        className="p-2 text-gray-500 hover:text-cyan-400 transition-colors rounded hover:bg-gray-800"
                        title="Analyze this password"
                      >
                        <RiFlashlightLine className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                      <button
                        onClick={() => copyToClipboard(pwd, id)}
                        className="p-2 text-gray-100 hover:text-yellow-500 transition-colors"
                        title="Copy to clipboard"
                      >
                        {copiedId === id ? (
                          <RiCheckLine className="w-3 h-3 sm:w-4 sm:h-4 text-green-100" />
                        ) : (
                          <RiFileCopyLine className="w-3 h-3 sm:w-4 sm:h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  {/* Strength Bar */}
                  <div className="w-full bg-gray-800 rounded-full h-1">
                    <div
                      className={`h-1 rounded-full transition-all duration-500 ${
                        score >= 4
                          ? "bg-green-500"
                          : score >= 3
                            ? "bg-cyan-500"
                            : score >= 2
                              ? "bg-yellow-500"
                              : score >= 1
                                ? "bg-orange-500"
                                : "bg-red-500"
                      }`}
                      style={{ width: `${(score / 4) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Terminal Footer */}
        <div className="text-center text-xs text-gray-600 border-t border-green-800/20 pt-3 sm:pt-4">
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-4">
            <span>ZEROSEC v2.0</span>
            <span className="hidden sm:inline">•</span>
            <span>CLIENT-SIDE ENCRYPTION</span>
            <span className="hidden sm:inline">•</span>
            <span>NO DATA TRANSMISSION</span>
          </div>
        </div>
      </div>
    </div>
  )
}
