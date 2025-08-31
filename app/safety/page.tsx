'use client'

import Header from '../../components/Header'
import Footer from '../../components/Footer'
import { Shield, CheckCircle, AlertTriangle, Eye, Lock, UserCheck, Phone, MapPin } from 'lucide-react'

const safetyFeatures = [
  {
    icon: UserCheck,
    title: 'Kerala ID Verification',
    description: 'Aadhaar-based verification for locals, passport verification for tourists. Every profile is authentic.',
    stats: '99.8% verified profiles'
  },
  {
    icon: Eye,
    title: 'AI Content Moderation',
    description: 'Advanced AI trained on Malayalam and English content to detect inappropriate behavior instantly.',
    stats: '<2min response time'
  },
  {
    icon: Lock,
    title: 'End-to-End Encryption',
    description: 'Military-grade encryption protects all your conversations and personal information.',
    stats: '256-bit encryption'
  },
  {
    icon: AlertTriangle,
    title: 'Kerala Emergency Network',
    description: 'Direct connection to Kerala Police, Tourist Helpline (1938), and local emergency services.',
    stats: '24/7 emergency support'
  },
  {
    icon: MapPin,
    title: 'Safe Meeting Spots',
    description: 'Curated list of safe public places across Kerala with CCTV coverage and good lighting.',
    stats: '500+ verified locations'
  },
  {
    icon: Phone,
    title: 'Local Safety Contacts',
    description: 'Emergency contacts for each district, including police stations, hospitals, and tourist offices.',
    stats: 'All 14 districts covered'
  }
]

const emergencyContacts = [
  { name: 'Kerala Police', number: '100', description: 'Emergency police assistance' },
  { name: 'Tourist Helpline', number: '1938', description: 'Kerala Tourism support' },
  { name: 'Women Helpline', number: '1091', description: 'Women safety support' },
  { name: 'Medical Emergency', number: '108', description: 'Ambulance services' }
]

export default function Safety() {
  return (
    <main className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-red-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-red-100 rounded-full text-red-700 text-sm font-medium mb-6">
            <Shield className="w-4 h-4 mr-2" />
            Kerala's Safest Travel Platform
          </div>
          
          <h1 className="text-4xl sm:text-6xl font-display font-bold mb-6">
            Your safety is our{' '}
            <span className="gradient-text">top priority</span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Travel with confidence across Kerala. Our comprehensive safety features are designed 
            specifically for Kerala's tourism landscape and local culture.
          </p>
        </div>
      </section>

      {/* Safety Features */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {safetyFeatures.map((feature, index) => (
              <div
                key={feature.title}
                className="bg-gray-50 rounded-2xl p-8 card-hover"
              >
                <div className="inline-flex p-3 rounded-xl bg-red-50 mb-6">
                  <feature.icon className="h-6 w-6 text-red-500" />
                </div>
                
                <h3 className="text-xl font-semibold mb-4 text-gray-900">
                  {feature.title}
                </h3>
                
                <p className="text-gray-600 leading-relaxed mb-4">
                  {feature.description}
                </p>

                <div className="text-sm font-semibold text-primary-600">
                  {feature.stats}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency Contacts */}
      <section className="section-padding bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-6">Kerala Emergency Contacts</h2>
            <p className="text-xl text-gray-600">
              Quick access to all important emergency numbers across Kerala
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {emergencyContacts.map((contact, index) => (
              <div key={contact.name} className="bg-white rounded-2xl p-6 text-center card-hover">
                <div className="text-3xl font-bold text-red-600 mb-2">{contact.number}</div>
                <div className="font-semibold text-gray-900 mb-2">{contact.name}</div>
                <div className="text-sm text-gray-600">{contact.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Safety Guidelines */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-8">Kerala Travel Safety Guidelines</h2>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-4 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-2">Meet in Public Places</h4>
                    <p className="text-gray-600">Always meet new connections in busy public areas like malls, cafes, or tourist spots.</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-4 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-2">Share Your Plans</h4>
                    <p className="text-gray-600">Inform friends or family about your travel plans and meeting locations.</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-4 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-2">Trust Your Instincts</h4>
                    <p className="text-gray-600">If something feels wrong, don't hesitate to leave or contact our support team.</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-4 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-2">Verify Local Guides</h4>
                    <p className="text-gray-600">Check for our verified guide badges and read reviews from other travelers.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-primary-50 to-accent-50 rounded-3xl p-8">
              <h3 className="text-2xl font-bold mb-6 text-center">Safety Stats</h3>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">99.8%</div>
                  <p className="text-gray-600">Safe Meetings</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">24/7</div>
                  <p className="text-gray-600">Support Available</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">&lt;2min</div>
                  <p className="text-gray-600">Emergency Response</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600 mb-2">500+</div>
                  <p className="text-gray-600">Safe Locations</p>
                </div>
              </div>

              <div className="mt-8 text-center">
                <button className="bg-red-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-red-600 transition-colors">
                  Emergency Support
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="section-padding bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Trusted by Kerala Tourism</h2>
          <p className="text-xl mb-8 opacity-90">
            Official partner with Kerala Tourism Department and recognized by local authorities 
            for promoting safe and responsible tourism.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-primary-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors">
              Download Safe App
            </button>
            <button className="bg-primary-800 text-white px-8 py-3 rounded-full font-semibold hover:bg-primary-900 transition-colors border border-primary-400">
              Safety Guidelines
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}