import React, { useState, useEffect } from "react"
import { FaGithub, FaTwitter, FaBars, FaTimes } from "react-icons/fa"
import { PiNumberZeroBold } from "react-icons/pi"

const navLinks = [
  { href: "/secure-guide", label: "Docs" },
  { href: "/about", label: "About" },
]



const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [currentRoute, setCurrentRoute] = useState("/")

  useEffect(() => {
    const handleRouteChange = () => setCurrentRoute(window.location.pathname)
    window.addEventListener("popstate", handleRouteChange)
    handleRouteChange()
    return () => window.removeEventListener("popstate", handleRouteChange)
  }, [])

  const isActive = (href: string) => currentRoute === href

  return (
    <header className="bg-neutral-900  text-white sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex justify-between items-center h-16 px-4">
        {/* Logo */}
        <a href="/" className="flex items-center space-x-2">
          <div className="bg-white p-1 rounded">
            <PiNumberZeroBold className="text-black w-5 h-5" />
          </div>
          <span className="font-semibold  text-2xl">ZeroLeaks</span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-4">
          {navLinks.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className={`px-3 py-1 rounded transition-colors duration-150 ${
                isActive(href) ? "bg-blue-600" : "hover:bg-gray-700"
              }`}
            >
              {label}
            </a>
          ))}
        </nav>

        {/* Socials */}
        <div className="hidden md:flex space-x-3">
          <a href="https://github.com/kinshukjainn/zeroleaks" title="GitHub" className="hover:text-blue-400">
            <FaGithub />
          </a>
          <a href="https://twitter.com/realkinshuk004" title="Twitter" className="hover:text-blue-400">
            <FaTwitter />
          </a>
        </div>

        {/* Mobile Button */}
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden">
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-neutral-950 px-4 py-3 space-y-3">
          {navLinks.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className={`block px-3 py-2 rounded ${
                isActive(href) ? "bg-blue-600/30" : "hover:bg-gray-700"
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {label}
            </a>
          ))}
          <div className="flex space-x-2 pt-2 bg-[#171717] p-2 align-items items-center rounded border border-[#444444]">
            <h1 className ="font-semibold">Social Links : </h1>
            <a href="#" title="GitHub" className="hover:text-blue-400">
              <FaGithub />
            </a>
            <a href="#" title="Twitter" className="hover:text-blue-400">
              <FaTwitter />
            </a>
          </div>
        </div>
      )}
    </header>
  )
}

export default Header;

