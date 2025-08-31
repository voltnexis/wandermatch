'use client'

import { useState } from 'react'
import { useAuth } from './AuthProvider'
import { Menu, X, Globe, Heart, MapPin, User, LogOut } from 'lucide-react'

export default function Header() {
  const { user, loading, signOut } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    setShowUserMenu(false)
  }

  return (
    <header className="fixed top-0 w-full bg-white/95 backdrop-blur-md z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-primary-500 to-accent-500 p-2 rounded-xl">
              <Globe className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-display font-bold gradient-text">
              WanderMatch
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="/" className="text-gray-700 hover:text-primary-600 transition-colors">
              Home
            </a>
            <a href="/features" className="text-gray-700 hover:text-primary-600 transition-colors">
              Features
            </a>
            <a href="/about" className="text-gray-700 hover:text-primary-600 transition-colors">
              About
            </a>
            <a href="/safety" className="text-gray-700 hover:text-primary-600 transition-colors">
              Safety
            </a>
            <a href="/pricing" className="text-gray-700 hover:text-primary-600 transition-colors">
              Pricing
            </a>
            <a href="/contact" className="text-gray-700 hover:text-primary-600 transition-colors">
              Contact
            </a>
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {loading ? (
              <div className="w-8 h-8 animate-spin border-2 border-primary-500 border-t-transparent rounded-full"></div>
            ) : user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 font-medium"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {user.name.charAt(0)}
                  </div>
                  <span>{user.name}</span>
                </button>
                
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                    <a href="/dashboard" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                      <User className="inline w-4 h-4 mr-2" />
                      Dashboard
                    </a>
                    <a href="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                      <User className="inline w-4 h-4 mr-2" />
                      Profile
                    </a>
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut className="inline w-4 h-4 mr-2" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <a href="/signin" className="text-primary-600 hover:text-primary-700 font-medium">
                  Sign In
                </a>
                <a href="/signup" className="btn-primary">
                  Sign Up
                </a>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <div className="flex flex-col space-y-4">
              <a href="/" className="text-gray-700 hover:text-primary-600">
                Home
              </a>
              <a href="/features" className="text-gray-700 hover:text-primary-600">
                Features
              </a>
              <a href="/about" className="text-gray-700 hover:text-primary-600">
                About
              </a>
              <a href="/safety" className="text-gray-700 hover:text-primary-600">
                Safety
              </a>
              <a href="/pricing" className="text-gray-700 hover:text-primary-600">
                Pricing
              </a>
              <a href="/contact" className="text-gray-700 hover:text-primary-600">
                Contact
              </a>
              <div className="flex flex-col space-y-2 pt-4">
                {user ? (
                  <>
                    <a href="/dashboard" className="text-primary-600 font-medium text-left">
                      Dashboard
                    </a>
                    <a href="/profile" className="text-primary-600 font-medium text-left">
                      Profile
                    </a>
                    <button
                      onClick={handleSignOut}
                      className="text-gray-600 font-medium text-left"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <a href="/signin" className="text-primary-600 font-medium text-left">
                      Sign In
                    </a>
                    <a href="/signup" className="btn-primary text-center">
                      Sign Up
                    </a>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}