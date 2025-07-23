"use client"

import { useState } from "react"
import {
  FaShieldAlt,
  FaKey,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaRandom,
  FaCheck,
  FaTimes,
  FaExclamationTriangle,
  FaInfoCircle,
  FaLightbulb,
  FaCopy,
  FaMobile,
  FaFingerprint,
  FaUserShield,
  FaDatabase,
  FaWifi,
  FaEnvelope,
  FaBug,
} from "react-icons/fa"

const SecureGuide = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [generatedPassword, setGeneratedPassword] = useState("")
  const [passwordStrength, setPasswordStrength] = useState(0)

  const generatePassword = () => {
    const lowercase = "abcdefghijklmnopqrstuvwxyz"
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    const numbers = "0123456789"
    const symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?"
    const allChars = lowercase + uppercase + numbers + symbols

    let password = ""
    // Ensure at least one character from each category
    password += lowercase[Math.floor(Math.random() * lowercase.length)]
    password += uppercase[Math.floor(Math.random() * uppercase.length)]
    password += numbers[Math.floor(Math.random() * numbers.length)]
    password += symbols[Math.floor(Math.random() * symbols.length)]

    // Fill the rest randomly
    for (let i = 4; i < 16; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)]
    }

    // Shuffle the password
    password = password
      .split("")
      .sort(() => Math.random() - 0.5)
      .join("")
    setGeneratedPassword(password)
    calculateStrength(password)
  }

  const calculateStrength = (password: string) => {
    let score = 0
    if (password.length >= 8) score += 1
    if (password.length >= 12) score += 1
    if (/[a-z]/.test(password)) score += 1
    if (/[A-Z]/.test(password)) score += 1
    if (/[0-9]/.test(password)) score += 1
    if (/[^A-Za-z0-9]/.test(password)) score += 1
    setPasswordStrength(score)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const StrengthMeter = ({ strength }: { strength: number }) => {
    const getColor = () => {
      if (strength <= 2) return "bg-red-500"
      if (strength <= 4) return "bg-yellow-500"
      return "bg-green-500"
    }

    const getLabel = () => {
      if (strength <= 2) return "Weak"
      if (strength <= 4) return "Medium"
      return "Strong"
    }

    return (
      <div className="mt-2">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm text-gray-300">Strength:</span>
          <span
            className={`text-sm font-medium ${
              strength <= 2 ? "text-red-400" : strength <= 4 ? "text-yellow-400" : "text-green-400"
            }`}
          >
            {getLabel()}
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${getColor()}`}
          ></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-gray-100">

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Table of Contents */}
        <nav className=" p-4 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-white flex items-center gap-2">
            <FaInfoCircle className="text-blue-400" />
            Table of Contents
          </h2>
          <ul className="space-y-2 text-gray-300 underline">
            <li>
              <a href="#introduction" className="hover:text-blue-400 transition-colors">
                1. Introduction
              </a>
            </li>
            <li>
              <a href="#passwords" className="hover:text-blue-400 transition-colors">
                2. Password Security
              </a>
            </li>
            <li>
              <a href="#entropy" className="hover:text-blue-400 transition-colors">
                3. Understanding Entropy
              </a>
            </li>
            <li>
              <a href="#generator" className="hover:text-blue-400 transition-colors">
                4. Password Generator
              </a>
            </li>
            <li>
              <a href="#management" className="hover:text-blue-400 transition-colors">
                5. Password Management
              </a>
            </li>
            <li>
              <a href="#2fa" className="hover:text-blue-400 transition-colors">
                6. Two-Factor Authentication
              </a>
            </li>
            <li>
              <a href="#best-practices" className="hover:text-blue-400 transition-colors">
                7. Best Practices
              </a>
            </li>
            <li>
              <a href="#threats" className="hover:text-blue-400 transition-colors">
                8. Common Threats
              </a>
            </li>
          </ul>
        </nav>

        {/* Introduction */}
        <section id="introduction" className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-white flex items-center gap-3">
            <FaUserShield className="text-blue-400" />
            Introduction
          </h2>
          <div className="bg-[#212121] rounded-lg p-6 border border-gray-800">
            <p className="text-gray-300 text-lg leading-relaxed mb-4">
              In today's digital world, your online accounts contain some of your most valuable information. From
              personal photos and messages to financial data and work documents, securing these accounts is crucial for
              protecting your digital identity and privacy.
            </p>
            <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <FaLightbulb className="text-blue-400 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-blue-300 mb-2">Why Account Security Matters</h3>
                  <ul className="text-gray-300 space-y-1 text-sm">
                    <li>• Protect personal and financial information</li>
                    <li>• Prevent identity theft and fraud</li>
                    <li>• Maintain privacy and control over your data</li>
                    <li>• Avoid account takeovers and unauthorized access</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Password Security */}
        <section id="passwords" className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-white flex items-center gap-3">
            <FaKey className="text-green-400" />
            Password Security Fundamentals
          </h2>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-[#212121] rounded-lg p-6 border border-gray-800">
              <h3 className="text-xl font-semibold mb-4 text-green-300 flex items-center gap-2">
                <FaCheck className="text-green-400" />
                Strong Password Characteristics
              </h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start gap-2">
                  <FaCheck className="text-green-400 mt-1 flex-shrink-0 text-sm" />
                  <span>
                    <strong>Length:</strong> At least 12-16 characters
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <FaCheck className="text-green-400 mt-1 flex-shrink-0 text-sm" />
                  <span>
                    <strong>Complexity:</strong> Mix of uppercase, lowercase, numbers, symbols
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <FaCheck className="text-green-400 mt-1 flex-shrink-0 text-sm" />
                  <span>
                    <strong>Uniqueness:</strong> Different for each account
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <FaCheck className="text-green-400 mt-1 flex-shrink-0 text-sm" />
                  <span>
                    <strong>Unpredictability:</strong> No personal information
                  </span>
                </li>
              </ul>
            </div>

            <div className="bg-[#212121] rounded-lg p-6 border border-gray-800">
              <h3 className="text-xl font-semibold mb-4 text-red-300 flex items-center gap-2">
                <FaTimes className="text-red-400" />
                Weak Password Examples
              </h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start gap-2">
                  <FaTimes className="text-red-400 mt-1 flex-shrink-0 text-sm" />
                  <span>
                    <code className="bg-gray-800 px-2 py-1 rounded">password123</code> - Too common
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <FaTimes className="text-red-400 mt-1 flex-shrink-0 text-sm" />
                  <span>
                    <code className="bg-gray-800 px-2 py-1 rounded">john1985</code> - Personal info
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <FaTimes className="text-red-400 mt-1 flex-shrink-0 text-sm" />
                  <span>
                    <code className="bg-gray-800 px-2 py-1 rounded">qwerty</code> - Keyboard pattern
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <FaTimes className="text-red-400 mt-1 flex-shrink-0 text-sm" />
                  <span>
                    <code className="bg-gray-800 px-2 py-1 rounded">Password</code> - Too simple
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Entropy Section */}
        <section id="entropy" className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-white flex items-center gap-3">
            <FaRandom className="text-purple-400" />
            Understanding Password Entropy
          </h2>

          <div className="bg-[#212121] rounded-lg p-6 border border-gray-800 mb-6">
            <h3 className="text-xl font-semibold mb-4 text-purple-300">What is Entropy?</h3>
            <p className="text-gray-300 mb-4 leading-relaxed">
              Password entropy measures the randomness and unpredictability of a password. Higher entropy means a
              password is harder to guess or crack through brute force attacks. It's calculated based on the character
              set size and password length.
            </p>

            <div className="bg-purple-900/20 border border-purple-800 rounded-lg p-4 mb-4">
              <h4 className="font-semibold text-purple-300 mb-2">Entropy Formula</h4>
              <code className="text-purple-200 bg-gray-800 px-3 py-2 rounded block">
                Entropy = log₂(Character Set Size^Password Length)
              </code>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-gray-800 rounded-lg p-4">
                <h4 className="font-semibold text-gray-200 mb-2">Character Sets</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>Lowercase: 26 chars</li>
                  <li>Uppercase: 26 chars</li>
                  <li>Numbers: 10 chars</li>
                  <li>Symbols: ~32 chars</li>
                  <li>
                    <strong>Total: ~94 chars</strong>
                  </li>
                </ul>
              </div>

              <div className="bg-gray-800 rounded-lg p-4">
                <h4 className="font-semibold text-gray-200 mb-2">Entropy Levels</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>{"<"} 30 bits: Very Weak</li>
                  <li>30-50 bits: Weak</li>
                  <li>50-70 bits: Good</li>
                  <li>70+ bits: Strong</li>
                </ul>
              </div>

              <div className="bg-gray-800 rounded-lg p-4">
                <h4 className="font-semibold text-gray-200 mb-2">Time to Crack</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>40 bits: Minutes</li>
                  <li>50 bits: Days</li>
                  <li>60 bits: Years</li>
                  <li>70+ bits: Centuries</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Password Generator */}
        <section id="generator" className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-white flex items-center gap-3">
            <FaRandom className="text-yellow-400" />
            Password Generator
          </h2>

          <div className="bg-[#212121] rounded-lg p-6 border border-gray-800">
            <div className="mb-6">
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <button
                  onClick={generatePassword}
                  className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors font-medium"
                >
                  <FaBug />
                  Generate Secure Password
                </button>

                {generatedPassword && (
                  <button
                    onClick={() => copyToClipboard(generatedPassword)}
                    className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors font-medium"
                  >
                    <FaCopy />
                    Copy Password
                  </button>
                )}
              </div>

              {generatedPassword && (
                <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                  <div className="flex items-center gap-2 mb-2">
                    <FaKey className="text-yellow-400" />
                    <span className="font-medium text-gray-200">Generated Password:</span>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <code className="bg-gray-700 px-3 py-2 rounded flex-1 text-green-300 font-mono text-sm break-all">
                      {showPassword ? generatedPassword : "•".repeat(generatedPassword.length)}
                    </code>
                    <button
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-400 hover:text-gray-200 p-2"
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  <StrengthMeter strength={passwordStrength} />
                </div>
              )}
            </div>

            <div className="bg-yellow-900/20 border border-yellow-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <FaExclamationTriangle className="text-yellow-400 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-yellow-300 mb-2">Security Note</h4>
                  <p className="text-gray-300 text-sm">
                    This generator creates passwords locally in your browser. For maximum security, use a dedicated
                    password manager's generator and never share generated passwords.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Password Management */}
        <section id="management" className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-white flex items-center gap-3">
            <FaDatabase className="text-indigo-400" />
            Password Management
          </h2>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-[#212121] rounded-lg p-6 border border-gray-800">
              <h3 className="text-xl font-semibold mb-4 text-indigo-300">Password Managers</h3>
              <p className="text-gray-300 mb-4">
                Password managers are essential tools that generate, store, and autofill strong, unique passwords for
                all your accounts.
              </p>

              <h4 className="font-semibold text-gray-200 mb-2">Popular Options:</h4>
              <ul className="space-y-2 text-gray-300 mb-4">
                <li>
                  • <strong>1Password</strong> - Premium features, family sharing
                </li>
                <li>
                  • <strong>Bitwarden</strong> - Open source, free tier available
                </li>
                <li>
                  • <strong>LastPass</strong> - User-friendly, cross-platform
                </li>
                <li>
                  • <strong>Dashlane</strong> - VPN included, dark web monitoring
                </li>
              </ul>

              <div className="bg-indigo-900/20 border border-indigo-800 rounded-lg p-3">
                <p className="text-indigo-200 text-sm">
                  <strong>Pro Tip:</strong> Choose a password manager with end-to-end encryption and zero-knowledge
                  architecture.
                </p>
              </div>
            </div>

            <div className="bg-[#212121] rounded-lg p-6 border border-gray-800">
              <h3 className="text-xl font-semibold mb-4 text-indigo-300">Best Practices</h3>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <FaCheck className="text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-gray-200">Use Unique Passwords</h4>
                    <p className="text-gray-400 text-sm">Never reuse passwords across multiple accounts</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <FaCheck className="text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-gray-200">Enable Auto-fill</h4>
                    <p className="text-gray-400 text-sm">Reduces typing and prevents keyloggers</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <FaCheck className="text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-gray-200">Regular Updates</h4>
                    <p className="text-gray-400 text-sm">Change passwords after security breaches</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <FaCheck className="text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-gray-200">Secure Master Password</h4>
                    <p className="text-gray-400 text-sm">Use a strong, memorable master password</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Two-Factor Authentication */}
        <section id="2fa" className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-white flex items-center gap-3">
            <FaMobile className="text-cyan-400" />
            Two-Factor Authentication (2FA)
          </h2>

          <div className="bg-[#212121] rounded-lg p-6 border border-gray-800 mb-6">
            <p className="text-gray-300 text-lg mb-6 leading-relaxed">
              Two-Factor Authentication adds an extra layer of security by requiring a second form of verification
              beyond your password. Even if someone steals your password, they still can't access your account without
              the second factor.
            </p>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gray-800 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <FaMobile className="text-cyan-400" />
                  <h3 className="font-semibold text-cyan-300">SMS/Text</h3>
                </div>
                <p className="text-gray-300 text-sm mb-2">Codes sent to your phone</p>
                <div className="text-xs">
                  <span className="text-yellow-400">⚠️ Vulnerable to SIM swapping</span>
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <FaFingerprint className="text-cyan-400" />
                  <h3 className="font-semibold text-cyan-300">Authenticator Apps</h3>
                </div>
                <p className="text-gray-300 text-sm mb-2">Google Auth, Authy, Microsoft Auth</p>
                <div className="text-xs">
                  <span className="text-green-400">✓ More secure than SMS</span>
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <FaKey className="text-cyan-400" />
                  <h3 className="font-semibold text-cyan-300">Hardware Keys</h3>
                </div>
                <p className="text-gray-300 text-sm mb-2">YubiKey, Google's Titan Security Key</p>
                <div className="text-xs">
                  <span className="text-green-400">✓ Highest security level</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-cyan-900/20 border border-cyan-800 rounded-lg p-4">
            <h4 className="font-semibold text-cyan-300 mb-2 flex items-center gap-2">
              <FaLightbulb />
              Setup Priority
            </h4>
            <p className="text-gray-300 text-sm">
              Enable 2FA on your most important accounts first: email, banking, social media, and work accounts. These
              often serve as recovery methods for other services.
            </p>
          </div>
        </section>

        {/* Best Practices */}
        <section id="best-practices" className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-white flex items-center gap-3">
            <FaShieldAlt className="text-emerald-400" />
            Security Best Practices
          </h2>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="bg-[#212121] rounded-lg p-6 border border-gray-800">
                <h3 className="text-xl font-semibold mb-4 text-emerald-300 flex items-center gap-2">
                  <FaEnvelope className="text-emerald-400" />
                  Email Security
                </h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• Use a secure email provider (ProtonMail, Tutanota)</li>
                  <li>• Enable 2FA on your email account</li>
                  <li>• Be cautious of phishing emails</li>
                  <li>• Use different emails for different purposes</li>
                </ul>
              </div>

              <div className="bg-[#212121] rounded-lg p-6 border border-gray-800">
                <h3 className="text-xl font-semibold mb-4 text-emerald-300 flex items-center gap-2">
                  <FaWifi className="text-emerald-400" />
                  Network Security
                </h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• Avoid public Wi-Fi for sensitive activities</li>
                  <li>• Use a VPN when on public networks</li>
                  <li>• Keep your router firmware updated</li>
                  <li>• Use WPA3 encryption on home networks</li>
                </ul>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-[#212121] rounded-lg p-6 border border-gray-800">
                <h3 className="text-xl font-semibold mb-4 text-emerald-300 flex items-center gap-2">
                  <FaLock className="text-emerald-400" />
                  Device Security
                </h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• Keep devices updated with latest security patches</li>
                  <li>• Use device lock screens with PINs/biometrics</li>
                  <li>• Enable automatic screen locks</li>
                  <li>• Install apps only from official stores</li>
                </ul>
              </div>

              <div className="bg-[#212121] rounded-lg p-6 border border-gray-800">
                <h3 className="text-xl font-semibold mb-4 text-emerald-300 flex items-center gap-2">
                  <FaBug className="text-emerald-400" />
                  Social Engineering
                </h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• Verify requests for sensitive information</li>
                  <li>• Don't share personal details on social media</li>
                  <li>• Be skeptical of urgent security warnings</li>
                  <li>• Never give passwords over phone/email</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Common Threats */}
        <section id="threats" className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-white flex items-center gap-3">
            <FaExclamationTriangle className="text-red-400" />
            Common Security Threats
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-[#212121] rounded-lg p-6 border border-gray-800">
              <h3 className="text-xl font-semibold mb-4 text-red-300">Phishing Attacks</h3>
              <p className="text-gray-300 mb-4">
                Fraudulent attempts to steal credentials through fake websites or emails that mimic legitimate services.
              </p>
              <div className="bg-red-900/20 border border-red-800 rounded-lg p-3">
                <h4 className="font-medium text-red-300 mb-2">How to Protect:</h4>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>• Always check URLs carefully</li>
                  <li>• Look for HTTPS and valid certificates</li>
                  <li>• Don't click links in suspicious emails</li>
                  <li>• Type URLs directly into browser</li>
                </ul>
              </div>
            </div>

            <div className="bg-[#212121] rounded-lg p-6 border border-gray-800">
              <h3 className="text-xl font-semibold mb-4 text-red-300">Data Breaches</h3>
              <p className="text-gray-300 mb-4">
                When companies' databases are compromised, exposing user passwords and personal information to
                criminals.
              </p>
              <div className="bg-red-900/20 border border-red-800 rounded-lg p-3">
                <h4 className="font-medium text-red-300 mb-2">How to Protect:</h4>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>• Use unique passwords for each account</li>
                  <li>• Monitor breach notifications</li>
                  <li>• Change passwords after breaches</li>
                  <li>• Use services like HaveIBeenPwned</li>
                </ul>
              </div>
            </div>

            <div className="bg-[#212121] rounded-lg p-6 border border-gray-800">
              <h3 className="text-xl font-semibold mb-4 text-red-300">Brute Force Attacks</h3>
              <p className="text-gray-300 mb-4">
                Automated attempts to guess passwords by trying millions of combinations until the correct one is found.
              </p>
              <div className="bg-red-900/20 border border-red-800 rounded-lg p-3">
                <h4 className="font-medium text-red-300 mb-2">How to Protect:</h4>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>• Use long, complex passwords</li>
                  <li>• Enable account lockouts</li>
                  <li>• Use 2FA as additional protection</li>
                  <li>• Monitor login attempts</li>
                </ul>
              </div>
            </div>

            <div className="bg-[#212121] rounded-lg p-6 border border-gray-800">
              <h3 className="text-xl font-semibold mb-4 text-red-300">Social Engineering</h3>
              <p className="text-gray-300 mb-4">
                Psychological manipulation to trick people into revealing confidential information or performing actions
                that compromise security.
              </p>
              <div className="bg-red-900/20 border border-red-800 rounded-lg p-3">
                <h4 className="font-medium text-red-300 mb-2">How to Protect:</h4>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>• Verify identity before sharing info</li>
                  <li>• Be skeptical of urgent requests</li>
                  <li>• Don't share personal details publicly</li>
                  <li>• Train yourself to recognize tactics</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-[#212121] rounded-lg p-6 border border-gray-800 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <FaShieldAlt className="text-blue-400" />
            <span className="font-semibold text-white">Stay Secure</span>
          </div>
          <p className="text-gray-400 text-sm">
            Remember: Security is an ongoing process, not a one-time setup. Regularly review and update your security
            practices to stay protected.
          </p>
        </footer>
      </div>
    </div>
  )
}

export default SecureGuide;
