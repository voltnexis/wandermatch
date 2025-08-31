'use client'

import { motion } from 'framer-motion'
import { Shield, CheckCircle, AlertTriangle, Eye, Lock, UserCheck } from 'lucide-react'

const safetyFeatures = [
  {
    icon: UserCheck,
    title: 'Profile Verification',
    description: 'Multi-step verification including photo ID, phone number, and social media authentication.'
  },
  {
    icon: Eye,
    title: 'AI Content Moderation',
    description: 'Advanced AI continuously monitors profiles and conversations for inappropriate content.'
  },
  {
    icon: Lock,
    title: 'End-to-End Encryption',
    description: 'All messages and calls are encrypted to protect your privacy and personal information.'
  },
  {
    icon: AlertTriangle,
    title: 'Emergency Features',
    description: 'Panic button, location sharing with trusted contacts, and 24/7 safety support.'
  },
  {
    icon: Shield,
    title: 'Safe Meeting Spots',
    description: 'Geo-fenced public locations recommended for first meetings with safety ratings.'
  },
  {
    icon: CheckCircle,
    title: 'Community Reporting',
    description: 'Easy reporting system with quick response times and community-driven safety ratings.'
  }
]

export default function Safety() {
  return (
    <section id="safety" className="section-padding bg-gradient-to-br from-red-50 via-white to-orange-50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center px-4 py-2 bg-red-100 rounded-full text-red-700 text-sm font-medium mb-6">
            <Shield className="w-4 h-4 mr-2" />
            Your Safety is Our Priority
          </div>
          
          <h2 className="text-4xl sm:text-5xl font-display font-bold mb-6">
            Travel with{' '}
            <span className="gradient-text">confidence & peace of mind</span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            WanderMatch implements industry-leading safety measures to ensure your travel 
            connections are authentic, secure, and trustworthy.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {safetyFeatures.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-8 card-hover border border-gray-100"
            >
              <div className="inline-flex p-3 rounded-xl bg-red-50 mb-6">
                <feature.icon className="h-6 w-6 text-red-500" />
              </div>
              
              <h3 className="text-xl font-semibold mb-4 text-gray-900">
                {feature.title}
              </h3>
              
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Safety Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-white rounded-3xl p-12 shadow-xl"
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4 text-gray-900">
              Trusted by travelers worldwide
            </h3>
            <p className="text-lg text-gray-600">
              Our safety measures have helped create thousands of secure connections
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">99.8%</div>
              <p className="text-gray-600">Verified Profiles</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">24/7</div>
              <p className="text-gray-600">Safety Support</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">&lt;2min</div>
              <p className="text-gray-600">Report Response Time</p>
            </div>
          </div>

          <div className="text-center mt-12">
            <a href="/safety" className="btn-primary text-lg px-8 py-4">
              Learn More About Safety
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}