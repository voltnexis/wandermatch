'use client'

import Header from '../../components/Header'
import Footer from '../../components/Footer'
import { Check, Star, Crown, Zap, ArrowRight } from 'lucide-react'

const plans = [
  {
    name: 'Kerala Explorer',
    price: 'Free',
    description: 'Perfect for first-time Kerala visitors',
    icon: Zap,
    features: [
      'Basic profile creation',
      '5 daily matches in Kerala',
      'Standard messaging',
      'Basic location filters',
      'Community safety features',
      'Emergency contact access'
    ],
    cta: 'Start Exploring',
    popular: false,
    color: 'gray'
  },
  {
    name: 'Kerala Wanderer',
    price: '₹299',
    originalPrice: '₹499',
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
      'Malayalam chat support',
      'Festival calendar integration',
      'Monsoon mode features'
    ],
    cta: 'Start 7-Day Free Trial',
    popular: true,
    color: 'primary'
  },
  {
    name: 'Kerala Guide Pro',
    price: '₹599',
    originalPrice: '₹999',
    period: '/month',
    description: 'For local guides & tourism businesses',
    icon: Crown,
    features: [
      'Everything in Kerala Wanderer',
      'Browse all India destinations',
      'Profile boost & spotlight',
      'Verified Kerala guide badge',
      'Business analytics & insights',
      'Early access to new features',
      'Tourism business support',
      'Multi-language chat support',
      'Revenue tracking tools',
      'Customer review management'
    ],
    cta: 'Become a Verified Guide',
    popular: false,
    color: 'accent'
  }
]

const addOns = [
  { name: 'Profile Boost (24 hours)', price: '₹49', description: '10x more profile views' },
  { name: 'Super Like (5 pack)', price: '₹99', description: 'Stand out to potential matches' },
  { name: 'Travel Spotlight', price: '₹149', description: 'Featured in destination searches' },
  { name: 'Premium Badge', price: '₹199', description: 'Verified traveler status' }
]

export default function Pricing() {
  return (
    <main className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-primary-50 to-accent-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-6xl font-display font-bold mb-6">
            Affordable plans for{' '}
            <span className="gradient-text">every Kerala traveler</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Start free and upgrade as your Kerala travel connections grow. 
            Special pricing for Indian users with all payments in Rupees.
          </p>
          
          <div className="inline-flex items-center px-4 py-2 bg-green-100 rounded-full text-green-700 text-sm font-medium">
            <Star className="w-4 h-4 mr-2" />
            Limited Time: 40% off all premium plans
          </div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {plans.map((plan, index) => (
              <div
                key={plan.name}
                className={`relative bg-white rounded-3xl p-8 card-hover border-2 ${
                  plan.popular 
                    ? 'border-primary-500 scale-105 shadow-2xl' 
                    : 'border-gray-200'
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
                  <div className={`inline-flex p-3 rounded-2xl mb-4 ${
                    plan.color === 'primary' ? 'bg-primary-50' :
                    plan.color === 'accent' ? 'bg-accent-50' : 'bg-gray-50'
                  }`}>
                    <plan.icon className={`h-8 w-8 ${
                      plan.color === 'primary' ? 'text-primary-600' :
                      plan.color === 'accent' ? 'text-accent-600' : 'text-gray-600'
                    }`} />
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-2 text-gray-900">
                    {plan.name}
                  </h3>
                  
                  <p className="text-gray-600 mb-6">
                    {plan.description}
                  </p>
                  
                  <div className="mb-6">
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-4xl font-bold text-gray-900">
                        {plan.price}
                      </span>
                      {plan.originalPrice && (
                        <span className="text-lg text-gray-400 line-through">
                          {plan.originalPrice}
                        </span>
                      )}
                    </div>
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

                <button
                  className={`w-full py-3 px-6 rounded-full font-semibold transition-all duration-300 ${
                    plan.popular
                      ? 'btn-primary'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>

          {/* Add-ons */}
          <div className="bg-gray-50 rounded-3xl p-8">
            <h3 className="text-2xl font-bold text-center mb-8">Boost Your Experience</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {addOns.map((addon, index) => (
                <div key={addon.name} className="bg-white rounded-2xl p-6 text-center">
                  <div className="text-2xl font-bold text-primary-600 mb-2">{addon.price}</div>
                  <div className="font-semibold mb-2">{addon.name}</div>
                  <div className="text-sm text-gray-600 mb-4">{addon.description}</div>
                  <button className="text-primary-600 font-medium hover:text-primary-700">
                    Add to Plan
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section-padding bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6">
              <h4 className="font-semibold mb-3">Why are prices in Rupees?</h4>
              <p className="text-gray-600">WanderMatch is built for Indian travelers. All payments are processed in INR through UPI, cards, and net banking for your convenience.</p>
            </div>

            <div className="bg-white rounded-2xl p-6">
              <h4 className="font-semibold mb-3">Can I cancel my subscription anytime?</h4>
              <p className="text-gray-600">Yes, you can cancel your subscription anytime. You'll continue to have access to premium features until the end of your billing period.</p>
            </div>

            <div className="bg-white rounded-2xl p-6">
              <h4 className="font-semibold mb-3">Is there a discount for local guides?</h4>
              <p className="text-gray-600">Yes! Verified Kerala local guides get 50% off on Kerala Guide Pro plans. Contact our support team with your tourism license.</p>
            </div>

            <div className="bg-white rounded-2xl p-6">
              <h4 className="font-semibold mb-3">What payment methods do you accept?</h4>
              <p className="text-gray-600">We accept UPI, debit/credit cards, net banking, and digital wallets. All payments are secured by Razorpay.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Money Back Guarantee */}
      <section className="section-padding bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-3xl p-12">
            <div className="inline-flex p-3 bg-green-100 rounded-full mb-6">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            
            <h2 className="text-3xl font-bold mb-6">30-Day Money-Back Guarantee</h2>
            
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Try WanderMatch premium features risk-free. If you don't find meaningful Kerala 
              connections within 30 days, we'll refund your money completely.
            </p>

            <button className="btn-primary text-lg px-8 py-4 inline-flex items-center">
              Start Your Kerala Journey
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}