'use client'

import { motion } from 'framer-motion'
import { UserPlus, MapPin, Heart, Plane } from 'lucide-react'
import { useMemo } from 'react'

const steps = [
  {
    icon: UserPlus,
    title: 'Sign Up & Verify',
    description: 'Create your profile with photo verification and travel preferences. Quick setup in under 2 minutes.',
    step: '01'
  },
  {
    icon: MapPin,
    title: 'Set Travel Plans',
    description: 'Add your current location and upcoming destinations. Connect with people before you arrive.',
    step: '02'
  },
  {
    icon: Heart,
    title: 'Discover & Connect',
    description: 'Browse the interactive map, find compatible travelers and locals, then start meaningful conversations.',
    step: '03'
  },
  {
    icon: Plane,
    title: 'Meet & Explore',
    description: 'Plan safe meetups, share experiences, and create unforgettable memories together.',
    step: '04'
  }
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="section-padding bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-display font-bold mb-6">
            Start connecting in{' '}
            <span className="gradient-text">4 simple steps</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From signup to your first travel connection, WanderMatch makes it easy 
            to find your perfect travel companion or local guide.
          </p>
        </motion.div>

        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-200 via-primary-300 to-accent-200 transform -translate-y-1/2"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4">
            {steps.map((step) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: parseInt(step.step) * 0.2 }}
                viewport={{ once: true }}
                className="relative text-center"
              >
                {/* Step Number */}
                <div className="relative z-10 inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary-500 to-accent-500 text-white font-bold text-lg rounded-full mb-6 mx-auto">
                  {step.step}
                </div>
                
                {/* Icon */}
                <div className="inline-flex p-4 bg-gray-50 rounded-2xl mb-6">
                  <step.icon className="h-8 w-8 text-primary-600" />
                </div>
                
                {/* Content */}
                <h3 className="text-xl font-semibold mb-4 text-gray-900">
                  {step.title}
                </h3>
                
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-gray-50 to-primary-50 rounded-3xl p-12">
            <h3 className="text-3xl font-bold mb-6 text-gray-900">
              Ready to start your journey?
            </h3>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of travelers who have already found their perfect travel companions 
              and local guides through WanderMatch.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="/download" className="btn-primary text-lg px-8 py-4">
                Download App
              </a>
              <a href="/about" className="btn-secondary text-lg px-8 py-4">
                Learn More
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}