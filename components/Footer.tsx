'use client'

import { Globe, Mail, MapPin, Phone, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-6">
              <div className="bg-gradient-to-r from-primary-500 to-accent-500 p-2 rounded-xl">
                <Globe className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-display font-bold">
                WanderMatch
              </span>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Connecting travelers and locals worldwide for authentic cultural exchange 
              and meaningful relationships.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Product</h3>
            <ul className="space-y-4">
              <li><a href="/features" className="text-gray-400 hover:text-white transition-colors">Features</a></li>
              <li><a href="/pricing" className="text-gray-400 hover:text-white transition-colors">Pricing</a></li>
              <li><a href="/safety" className="text-gray-400 hover:text-white transition-colors">Safety</a></li>
              <li><a href="/download" className="text-gray-400 hover:text-white transition-colors">Mobile App</a></li>
              <li><a href="/contact" className="text-gray-400 hover:text-white transition-colors">API</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Company</h3>
            <ul className="space-y-4">
              <li><a href="/about" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
              <li><a href="/contact" className="text-gray-400 hover:text-white transition-colors">Careers</a></li>
              <li><a href="/contact" className="text-gray-400 hover:text-white transition-colors">Press</a></li>
              <li><a href="/contact" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
              <li><a href="/contact" className="text-gray-400 hover:text-white transition-colors">Partners</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Support</h3>
            <ul className="space-y-4">
              <li><a href="/contact" className="text-gray-400 hover:text-white transition-colors">Help Center</a></li>
              <li><a href="/contact" className="text-gray-400 hover:text-white transition-colors">Community</a></li>
              <li><a href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="/contact" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="/contact" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        {/* Contact Info */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="flex items-center">
              <Mail className="h-5 w-5 text-primary-400 mr-3" />
              <span className="text-gray-400">hello@wandermatch.in</span>
            </div>
            <div className="flex items-center">
              <Phone className="h-5 w-5 text-primary-400 mr-3" />
              <span className="text-gray-400">+91 484 123 4567</span>
            </div>
            <div className="flex items-center">
              <MapPin className="h-5 w-5 text-primary-400 mr-3" />
              <span className="text-gray-400">Kochi, Kerala, India</span>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 WanderMatch. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
              Privacy
            </a>
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
              Terms
            </a>
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}