'use client'

import Header from '../../components/Header'
import Footer from '../../components/Footer'
import { Mail, Phone, MapPin, Clock, MessageCircle, Users, Headphones } from 'lucide-react'

const contactMethods = [
  {
    icon: Phone,
    title: 'Phone Support',
    description: 'Speak with our Kerala team',
    contact: '+91 484 123 4567',
    availability: '9 AM - 9 PM IST',
    color: 'text-green-500',
    bgColor: 'bg-green-50'
  },
  {
    icon: Mail,
    title: 'Email Support',
    description: 'Get detailed help via email',
    contact: 'hello@wandermatch.in',
    availability: '24/7 response',
    color: 'text-blue-500',
    bgColor: 'bg-blue-50'
  },
  {
    icon: MessageCircle,
    title: 'WhatsApp Support',
    description: 'Quick help in Malayalam/English',
    contact: '+91 9876 543 210',
    availability: '8 AM - 10 PM IST',
    color: 'text-green-600',
    bgColor: 'bg-green-50'
  },
  {
    icon: Headphones,
    title: 'Live Chat',
    description: 'Instant support on our app',
    contact: 'Available in app',
    availability: '24/7 available',
    color: 'text-purple-500',
    bgColor: 'bg-purple-50'
  }
]

const offices = [
  {
    city: 'Kochi (Headquarters)',
    address: 'InfoPark, Kakkanad, Kochi, Kerala 682042',
    phone: '+91 484 123 4567',
    email: 'kochi@wandermatch.in'
  },
  {
    city: 'Thiruvananthapuram',
    address: 'Technopark, Thiruvananthapuram, Kerala 695581',
    phone: '+91 471 123 4567',
    email: 'tvm@wandermatch.in'
  },
  {
    city: 'Kozhikode',
    address: 'Cyberpark, Kozhikode, Kerala 673016',
    phone: '+91 495 123 4567',
    email: 'calicut@wandermatch.in'
  }
]

export default function Contact() {
  return (
    <main className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-primary-50 to-accent-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-6xl font-display font-bold mb-6">
            We're here to{' '}
            <span className="gradient-text">help you</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Have questions about WanderMatch? Need help with your Kerala travel plans? 
            Our local team is ready to assist you in Malayalam, English, or Hindi.
          </p>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-6">Get in Touch</h2>
            <p className="text-xl text-gray-600">
              Choose the way that works best for you
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactMethods.map((method, index) => (
              <div
                key={method.title}
                className="bg-gray-50 rounded-2xl p-8 text-center card-hover"
              >
                <div className={`inline-flex p-3 rounded-xl ${method.bgColor} mb-6`}>
                  <method.icon className={`h-6 w-6 ${method.color}`} />
                </div>
                
                <h3 className="text-xl font-semibold mb-3 text-gray-900">
                  {method.title}
                </h3>
                
                <p className="text-gray-600 mb-4">
                  {method.description}
                </p>

                <div className="font-semibold text-gray-900 mb-2">
                  {method.contact}
                </div>

                <div className="text-sm text-gray-500">
                  {method.availability}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="section-padding bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-6">Send us a Message</h2>
            <p className="text-xl text-gray-600">
              Fill out the form below and we'll get back to you within 24 hours
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-xl">
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="+91 9876543210"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                    <option>General Inquiry</option>
                    <option>Technical Support</option>
                    <option>Become a Guide</option>
                    <option>Business Partnership</option>
                    <option>Safety Concern</option>
                    <option>Feedback</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Tell us how we can help you..."
                ></textarea>
              </div>

              <div className="text-center">
                <button className="btn-primary text-lg px-8 py-4">
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Office Locations */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-6">Our Kerala Offices</h2>
            <p className="text-xl text-gray-600">
              Visit us at any of our locations across Kerala
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {offices.map((office, index) => (
              <div key={office.city} className="bg-gray-50 rounded-2xl p-8">
                <h3 className="text-xl font-semibold mb-4 text-gray-900">
                  {office.city}
                </h3>
                
                <div className="space-y-3">
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-gray-400 mr-3 mt-1 flex-shrink-0" />
                    <span className="text-gray-600">{office.address}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
                    <span className="text-gray-600">{office.phone}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
                    <span className="text-gray-600">{office.email}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-padding bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-6">Quick Answers</h2>
            <p className="text-xl text-gray-600">
              Common questions from Kerala travelers
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6">
              <h4 className="font-semibold mb-3">How do I become a verified Kerala guide?</h4>
              <p className="text-gray-600">Contact our Kochi office with your tourism license, ID proof, and experience details. We'll verify and activate your guide profile within 48 hours.</p>
            </div>

            <div className="bg-white rounded-2xl p-6">
              <h4 className="font-semibold mb-3">Is customer support available in Malayalam?</h4>
              <p className="text-gray-600">Yes! Our entire support team is fluent in Malayalam, English, and Hindi. You can communicate in your preferred language.</p>
            </div>

            <div className="bg-white rounded-2xl p-6">
              <h4 className="font-semibold mb-3">How do I report a safety concern?</h4>
              <p className="text-gray-600">Use the emergency button in the app, call our 24/7 helpline, or contact Kerala Police directly. We take all safety reports seriously.</p>
            </div>

            <div className="bg-white rounded-2xl p-6">
              <h4 className="font-semibold mb-3">Can I partner with WanderMatch for my tourism business?</h4>
              <p className="text-gray-600">Absolutely! We partner with homestays, tour operators, and local businesses. Email us at partnerships@wandermatch.in for details.</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}