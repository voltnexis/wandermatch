'use client'

import { ArrowRight, Play, MapPin, Users, Heart } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-accent-50"></div>
      
      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
          className="absolute top-20 left-10 w-20 h-20 bg-primary-100 rounded-full opacity-60"
        />
        <motion.div
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-40 right-20 w-32 h-32 bg-accent-100 rounded-full opacity-40"
        />
        <motion.div
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 7, repeat: Infinity }}
          className="absolute bottom-20 left-1/4 w-16 h-16 bg-primary-200 rounded-full opacity-50"
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-primary-100 rounded-full text-primary-700 text-sm font-medium mb-8">
            <MapPin className="w-4 h-4 mr-2" />
            Now Live in Kerala & India
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-bold mb-6">
            Meet travelers &{' '}
            <span className="gradient-text">locals</span>
            <br />
            wherever your{' '}
            <span className="gradient-text">journey</span> takes you
          </h1>

          {/* Subtitle */}
          <p className="text-xl sm:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Connect with fellow travelers exploring Kerala's backwaters, hill stations, and beaches. 
            Meet locals who know the hidden gems of God's Own Country.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <a href="/dashboard" className="btn-primary text-lg px-8 py-4 flex items-center">
              Explore Dashboard
              <ArrowRight className="ml-2 h-5 w-5" />
            </a>
            <a href="/download" className="btn-secondary text-lg px-8 py-4 flex items-center">
              <Play className="mr-2 h-5 w-5" />
              Download App
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-center"
            >
              <div className="flex items-center justify-center mb-2">
                <Users className="h-6 w-6 text-primary-500 mr-2" />
                <span className="text-3xl font-bold text-gray-900">25K+</span>
              </div>
              <p className="text-gray-600">Kerala Travelers</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-center"
            >
              <div className="flex items-center justify-center mb-2">
                <MapPin className="h-6 w-6 text-accent-500 mr-2" />
                <span className="text-3xl font-bold text-gray-900">14</span>
              </div>
              <p className="text-gray-600">Kerala Districts</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-center"
            >
              <div className="flex items-center justify-center mb-2">
                <Heart className="h-6 w-6 text-red-500 mr-2" />
                <span className="text-3xl font-bold text-gray-900">5K+</span>
              </div>
              <p className="text-gray-600">Kerala Connections</p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}