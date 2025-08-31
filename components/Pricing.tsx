'use client'

import { motion } from 'framer-motion'
import { Check, Star, Crown, Zap } from 'lucide-react'

const plans = [
  {
    name: 'Explorer',
    price: 'Free',
    description: 'Perfect for Kerala explorers',
    icon: Zap,
    features: [
      'Basic profile creation',
      '5 daily matches in Kerala',
      'Standard messaging',
      'Basic location filters',
      'Community safety features'
    ],
    cta: 'Get Started',
    popular: false
  },
  {
    name: 'Kerala Wanderer',
    price: '₹299',
    period: '/month',
    description: 'For active Kerala travelers',
    icon: Star,
    features: [
      'Unlimited Kerala matches',
      'Advanced filters & preferences',
      'Kerala travel plans integration',
      'Video call verification',
      'Priority customer support',
      'Ad-free experience',
      'Local Malayalam support'
    ],
    cta: 'Start Free Trial',
    popular: true
  },
  {
    name: 'Kerala Guide Pro',
    price: '₹599',
    period: '/month',
    description: 'For local guides & hosts',
    icon: Crown,
    features: [
      'Everything in Kerala Wanderer',
      'Browse all India destinations',
      'Profile boost & spotlight',
      'Verified Kerala guide badge',
      'Business analytics & insights',
      'Early access to new features',
      'Tourism business support',
      'Multi-language chat support'
    ],
    cta: 'Become a Guide',
    popular: false
  }
]

export default function Pricing() {
  return (
    <section id="pricing" className="section-padding bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-display font-bold mb-6">
            Choose your{' '}
            <span className="gradient-text">adventure plan</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Start free and upgrade as your travel connections grow. 
            All plans include our core safety and verification features.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className={`relative bg-white rounded-3xl p-8 card-hover ${
                plan.popular ? 'ring-2 ring-primary-500 scale-105' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-primary-500 to-accent-500 text-white px-6 py-2 rounded-full text-sm font-medium">
                    Most Popular
                  </div>
                </div>
              )}

              <div className="text-center mb-8">
                <div className="inline-flex p-3 bg-primary-50 rounded-2xl mb-4">
                  <plan.icon className="h-8 w-8 text-primary-600" />
                </div>
                
                <h3 className="text-2xl font-bold mb-2 text-gray-900">
                  {plan.name}
                </h3>
                
                <p className="text-gray-600 mb-6">
                  {plan.description}
                </p>
                
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-gray-600">
                      {plan.period}
                    </span>
                  )}
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <a
                href="/download"
                className={`w-full py-3 px-6 rounded-full font-semibold transition-all duration-300 text-center inline-block ${
                  plan.popular
                    ? 'btn-primary'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                {plan.cta}
              </a>
            </motion.div>
          ))}
        </div>

        {/* Money Back Guarantee */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center bg-white rounded-2xl p-8"
        >
          <div className="inline-flex p-3 bg-green-50 rounded-full mb-4">
            <Check className="h-6 w-6 text-green-500" />
          </div>
          
          <h3 className="text-2xl font-bold mb-4 text-gray-900">
            30-Day Money-Back Guarantee
          </h3>
          
          <p className="text-gray-600 max-w-2xl mx-auto">
            Try WanderMatch risk-free. If you're not completely satisfied with your premium 
            experience within 30 days, we'll refund your money, no questions asked.
          </p>
        </motion.div>
      </div>
    </section>
  )
}