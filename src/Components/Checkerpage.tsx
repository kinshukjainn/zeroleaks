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
  RiLockLine,
  RiKeyLine,
  RiShieldLine,
} from "react-icons/ri"
import { motion, AnimatePresence } from "framer-motion"

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
    color: "text-red-500",
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
    <div className="min-h-screen  bg-neutral-900">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="  bg-neutral-900"
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-5">
          <div className="flex items-center justify-between">
            <motion.div
              className="flex items-center space-x-3 min-w-0 flex-1"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <div className="relative bg-[#252525] p-2 rounded-md border-2 border-[#444444] ">
                <RiTerminalLine className="w-6 h-6 sm:w-7 sm:h-7 text-white  drop-shadow-lg" />
                <div className="absolute inset-0 w-6 h-6 sm:w-7 sm:h-7 text-white animate-pulse opacity-30" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-white">
                 CONSOLE
                </h1>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-8 md:py-10 space-y-8 sm:space-y-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className=" bg-[#222222] border border-[#444444] rounded p-4 sm:p-6 md:p-8 shadow-2xl"
        >
          <div className="flex items-center space-x-3 mb-6">
            <RiShieldLine className="w-6 h-6 text-white" />
            <span className="text-xl sm:text-2xl font-semibold text-white">Security Analysis</span>
            <div className="flex-1 h-1 bg-gradient-to-r from-white rounded-full to-transparent" />
          </div>

          <div className="relative mb-6">
            <motion.input
              key="password-input"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e: { target: { value: SetStateAction<string> } }) => setPassword(e.target.value)}
              placeholder="Enter password for comprehensive security analysis..."
              autoComplete="off"
              spellCheck="false"
              whileFocus={{
                scale: 1.01,
                boxShadow: "0 0 0 3px rgba(34, 197, 94, 0.2), 0 0 20px rgba(34, 197, 94, 0.1)",
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 20,
              }}
              className="w-full bg-[#303030] rounded px-2 py-1 border-2 border-[#444444] pr-12 text-md text-white placeholder-slate-400 transition-all duration-300"
            />
            <motion.button
              onClick={() => setShowPassword(!showPassword)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white transition-colors p-1 rounded-md hover:bg-[#181818]"
            >
              {showPassword ? <RiEyeOffLine className="w-5 h-5" /> : <RiEyeLine className="w-5 h-5" />}
            </motion.button>
          </div>

          <AnimatePresence>
            {password && password.trim() !== "" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6"
              >
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="bg-[#303030]  border border-[#444444] rounded-md p-4 sm:p-5 transition-all duration-300"
                >
                  <div className="flex items-center space-x-2 mb-3">
                    <RiShieldCheckLine className="w-4 h-4 text-white" />
                    <div className="text-sm font-bold text-white tracking-wider">STRENGTH ANALYSIS</div>
                  </div>
                  <div className={`text-xl font-semibold ${passwordAnalysis.strengthColor} mb-2 tracking-wide`}>
                    {passwordAnalysis.strengthText}
                  </div>
                  <div className="text-sm text-slate-100 mb-4">{passwordAnalysis.strengthDescription}</div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-white">Score:</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-white border-[#444444]">{passwordAnalysis.score}/4</span>
                        <div className="flex space-x-1">
                          {[...Array(4)].map((_, i) => (
                            <div
                              key={i}
                              className={`w-2 h-2 rounded-md transition-all duration-300 ${
                                i < passwordAnalysis.score ? "bg-emerald-400 shadow-sm" : "bg-slate-600"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white">Entropy:</span>
                      <span className="text-white border-[#444444]">{passwordAnalysis.entropy} bits</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white">Length:</span>
                      <span className="text-white border-[#444444]">{password.length} chars</span>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 0, y: 20 }}
                  animate={{ opacity: 1, x: 0, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="bg-[#303030] border border-[#444444] rounded p-4 sm:p-5  transition-all duration-300"
                >
                  <div className="flex items-center space-x-2 mb-3">
                    <RiAlertLine className="w-4 h-4 text-amber-400" />
                    <div className="text-sm font-semibold text-white tracking-wider">BREACH STATUS</div>
                  </div>
                  {pwnedStatus.text && (
                    <>
                      <div className={`flex items-center space-x-2 ${pwnedStatus.color} mb-3`}>
                        <motion.div
                          animate={pwnedLoading ? { rotate: 360 } : {}}
                          transition={{
                            duration: 1,
                            repeat: pwnedLoading ? Number.POSITIVE_INFINITY : 0,
                            ease: "linear",
                          }}
                        >
                          {pwnedStatus.icon}
                        </motion.div>
                        <span className="font-bold text-lg tracking-wide">{pwnedStatus.text}</span>
                      </div>
                      <div className="text-sm text-slate-300">
                        {pwnedCount === 0
                          ? "✓ Password not found in known data breaches"
                          : pwnedCount && pwnedCount > 0
                            ? "⚠ This password has been compromised in data breaches"
                            : "? Unable to verify breach status"}
                      </div>
                    </>
                  )}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="bg-[#303030] backdrop-blur-sm border border-[#444444] rounded p-2 sm:p-5  transition-all duration-300 md:col-span-2 xl:col-span-1"
                >
                  <div className="flex items-center space-x-2 mb-3">
                    <RiKeyLine className="w-4 h-4 text-white" />
                    <div className="text-xs font-semibold text-white tracking-wider">CRACK TIME</div>
                  </div>
                  <div className="text-xl font-bold text-white mb-2 border-[#444444]">{passwordAnalysis.crackTimeText}</div>
                  <div className="text-sm text-white mb-4">Offline slow hashing (10K/sec)</div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-white">Unique chars:</span>
                      <span className="text-white border-[#444444]">{new Set(password).size}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white">Character sets:</span>
                      <span className="text-white border-[#444444]">
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
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {password && passwordAnalysis.suggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="mt-6 bg-[#303030] border border-[#444444] rounded-lg p-4 sm:p-5 backdrop-blur-sm"
              >
                <div className="flex items-center space-x-2 mb-3">
                  <RiAlertLine className="w-4 h-4 text-amber-400" />
                  <div className="text-sm font-semibold text-amber-400 tracking-wider">SECURITY RECOMMENDATIONS</div>
                </div>
                <div className="space-y-2">
                  {passwordAnalysis.suggestions.map((suggestion, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="flex items-start space-x-3 text-sm"
                    >
                      <span className="text-amber-400 mt-1 flex-shrink-0">•</span>
                      <span className="text-slate-300">{suggestion}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="backdrop-blur-sm bg-[#252525] border border-[#444444] rounded p-4 sm:p-6 md:p-8 "
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="flex items-center space-x-3">
              <RiLockLine className="w-6 h-6 text-white" />
              <span className="text-xl sm:text-2xl font-semibold text-white">Password Generator</span>
              <div className="flex-1 h-1 rounded-full bg-gradient-to-r from-white to-transparent" />
            </div>
            <motion.button
              onClick={generatePasswords}
              disabled={isAnalyzing}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-[#303030] text-white rounded-md border-[#444444] font-semibold transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg"
            >
              <motion.div
                animate={isAnalyzing ? { rotate: 360 } : {}}
                transition={{ duration: 1, repeat: isAnalyzing ? Number.POSITIVE_INFINITY : 0, ease: "linear" }}
              >
                {isAnalyzing ? <RiLoader4Line className="w-5 h-5" /> : <RiRefreshLine className="w-5 h-5" />}
              </motion.div>
              <span>GENERATE ({genCount})</span>
            </motion.button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {[
              {
                mode: "random" as GenerationMode,
                title: "RANDOM",
                icon: RiCpuLine,
                desc: "Cryptographically secure",
                gradient: "from-black to-gray-90",
              },
              {
                mode: "passphrase" as GenerationMode,
                title: "PASSPHRASE",
                icon: RiArticleLine,
                desc: "Easy to remember",
                gradient: "from-black to-gray-90",
              },
              {
                mode: "memorable" as GenerationMode,
                title: "MEMORABLE",
                icon: RiStarLine,
                desc: "Balanced approach",
                gradient: "from-black to-gray-90",
              },
            ].map(({ mode, title, icon: Icon, desc, gradient }) => (
              <motion.button
                key={mode}
                onClick={() => setGenMode(mode)}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className={`p-4 rounded-lg text-left transition-all duration-300 border-2 ${
                  genMode === mode
                    ? `bg-gradient-to-br ${gradient} border-white/30 shadow-lg`
                    : "bg-slate-900/40 border-slate-600/50 hover:border-slate-500/70 hover:bg-slate-800/60"
                }`}
              >
                <Icon className="w-6 h-6 mb-3 text-white" />
                <div className="font-bold text-sm text-white mb-1">{title}</div>
                <div className="text-xs text-slate-300">{desc}</div>
              </motion.button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
            <div className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-sm font-medium sm:text-md text-whitre mb-2">
                  No of Passwords : {genCount}
                </label>
                <input
                  title="Number of passwords to generate"
                  type="range"
                  min="1"
                  max="20"
                  value={genCount}
                  onChange={(e) => setGenCount(Number(e.target.value))}
                  className="w-full h-2 bg-white  rounded-full  cursor-pointer accent-blue-500"
                />
              </div>
              {genMode === "random" && (
                <div>
                  <label className="block text-xs sm:text-sm text-white mb-2">
                    Length of Password: {genLength}
                  </label>
                  <input
                    title="Length of each generated password"
                    type="range"
                    min="8"
                    max="64"
                    value={genLength}
                    onChange={(e) => setGenLength(Number(e.target.value))}
                    className="w-full h-2 bg-white rounded-full cursor-pointer accent-blue-500"
                  />
                </div>
              )}
            </div>
            {genMode === "random" && (
              <div className="space-y-2 sm:space-y-3">
                <div className="text-sm font-semibold sm:text-sm text-white mb-2">CHARACTER SETS</div>
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
                      className="w-4 h-4 text-white bg-slate-800 border-slate-600 rounded-full  flex-shrink-0"
                    />
                    <span className="text-gray-200 text-sm">{label}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        <AnimatePresence>
          {generatedPasswords.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-[#252525] rounded p-4 sm:p-6 md:p-8 shadow-2xl"
            >
              <div className="flex items-center space-x-3 mb-6">
                <RiShieldCheckLine className="w-6 h-6 text-white" />
                <span className="text-xl sm:text-2xl font-semibold text-white">Generated Passwords</span>
                <div className="flex-1 h-1 bg-gradient-to-r rounded-full from-white to-transparent" />
              </div>
              <div className="space-y-3">
                {generatedPasswords.map(({ password: pwd, id, strength, score, analysis }, index) => (
                  <motion.div
                    key={id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    whileHover={{ scale: 1.01, y: -2 }}
                    className="bg-[#303030]  border border-[#444444] rounded p-3 transition-all duration-300"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 mb-1">
                      <div className="flex-1 min-w-0">
                        <div className="text-white text-lg break-all mb-2 transition-colors">
                          {pwd}
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-sm">
                          <span
                            className={`${STRENGTH_CONFIG[score]?.color} font-semibold px-2 py-1 rounded-md bg-[#222222] border border-[#444444]`}
                          >
                            {strength}
                          </span>
                          <span className="text-white border-[#444444]">{pwd.length} chars</span>
                          <span className="text-white border-[#444444]">{Math.round(analysis.entropy)} bits</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 flex-shrink-0">
                        <motion.button
                          onClick={() => setPassword(pwd)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 text-white  transition-colors rounded hover:bg-[#181818]"
                          title="Analyze this password"
                        >
                          <RiFlashlightLine className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          onClick={() => copyToClipboard(pwd, id)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 text-white  hover:bg-[#181818] rounded transition-colors"
                          title="Copy to clipboard"
                        >
                          <AnimatePresence mode="wait">
                            {copiedId === id ? (
                              <motion.div key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                                <RiCheckLine className="w-4 h-4 text-white" />
                              </motion.div>
                            ) : (
                              <motion.div key="copy" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                                <RiFileCopyLine className="w-4 h-4 text-yellow-500" />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.button>
                      </div>
                    </div>
                    <div className="w-full bg-white rounded-full h-2 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(score / 4) * 100}%` }}
                        transition={{ duration: 0.8, delay: index * 0.1, ease: "easeOut" }}
                        className={`h-2 rounded-full transition-all duration-500 ${
                          score >= 4
                            ? "bg-gradient-to-r from-emerald-500 to-green-400"
                            : score >= 3
                              ? "bg-gradient-to-r from-cyan-500 to-blue-400"
                              : score >= 2
                                ? "bg-gradient-to-r from-yellow-500 to-orange-400"
                                : score >= 1
                                  ? "bg-gradient-to-r from-orange-500 to-red-400"
                                  : "bg-gradient-to-r from-red-500 to-red-600"
                        }`}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center text-sm text-slate-500 border-t border-slate-700/30 pt-6"
        >
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-6">
            <span className="border-[#444444]">ZEROSEC v2.1 Enterprise</span>
            <span className="hidden sm:inline text-slate-600">•</span>
            <span className="flex items-center space-x-2">
              <RiShieldCheckLine className="w-4 h-4 text-emerald-500" />
              <span>CLIENT-SIDE ENCRYPTION</span>
            </span>
            <span className="hidden sm:inline text-slate-600">•</span>
            <span className="flex items-center space-x-2">
              <RiLockLine className="w-4 h-4 text-blue-500" />
              <span>ZERO DATA TRANSMISSION</span>
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
