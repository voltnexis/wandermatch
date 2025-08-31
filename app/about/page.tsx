'use client'

import Header from '../../components/Header'
import Footer from '../../components/Footer'
import { motion } from 'framer-motion'
import { Heart, Users, MapPin, Award, Globe, Palmtree } from 'lucide-react'

export default function About() {
  return (
    <main className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-primary-50 to-accent-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-6xl font-display font-bold mb-6">
              Connecting Kerala's{' '}
              <span className="gradient-text">travel hearts</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Born in God's Own Country, WanderMatch is India's first travel dating platform 
              designed specifically for Kerala's unique tourism culture and hospitality.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Kerala Story</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                WanderMatch was born from a simple observation: Kerala attracts millions of travelers 
                seeking authentic experiences, but they often struggle to connect with locals who 
                truly understand the culture, traditions, and hidden gems of our beautiful state.
              </p>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Whether you're exploring the backwaters of Alleppey, trekking in Munnar's tea gardens, 
                or experiencing Kochi's colonial charm, WanderMatch helps you find the perfect local 
                companion or fellow traveler to share these magical moments.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-600">2023</div>
                  <p className="text-gray-600">Founded in Kochi</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent-600">25K+</div>
                  <p className="text-gray-600">Kerala Users</p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-primary-100 to-accent-100 rounded-3xl p-8">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-2xl p-6 text-center">
                  <Palmtree className="h-8 w-8 text-green-500 mx-auto mb-3" />
                  <div className="font-semibold">Backwaters</div>
                </div>
                <div className="bg-white rounded-2xl p-6 text-center">
                  <MapPin className="h-8 w-8 text-blue-500 mx-auto mb-3" />
                  <div className="font-semibold">Hill Stations</div>
                </div>
                <div className="bg-white rounded-2xl p-6 text-center">
                  <Globe className="h-8 w-8 text-purple-500 mx-auto mb-3" />
                  <div className="font-semibold">Beaches</div>
                </div>
                <div className="bg-white rounded-2xl p-6 text-center">
                  <Heart className="h-8 w-8 text-red-500 mx-auto mb-3" />
                  <div className="font-semibold">Culture</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="section-padding bg-gray-50">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12">Our Mission for Kerala Tourism</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8">
              <Users className="h-12 w-12 text-primary-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-4">Connect Travelers</h3>
              <p className="text-gray-600">
                Bridge the gap between Kerala's warm locals and curious travelers 
                seeking authentic experiences.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8">
              <Heart className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-4">Promote Culture</h3>
              <p className="text-gray-600">
                Showcase Kerala's rich traditions, festivals, cuisine, and art forms 
                through meaningful connections.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8">
              <Award className="h-12 w-12 text-accent-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-4">Boost Tourism</h3>
              <p className="text-gray-600">
                Support local guides, homestays, and small businesses while creating 
                unforgettable travel memories.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-6">Built by Kerala, for Kerala</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our team combines deep Kerala roots with global technology expertise 
              to create the perfect platform for our tourism community.
            </p>
          </div>
          
          <div className="bg-gradient-to-r from-primary-500 to-accent-500 rounded-3xl p-12 text-white text-center">
            <h3 className="text-2xl font-bold mb-6">Join the Kerala Travel Revolution</h3>
            <p className="text-lg mb-8 opacity-90">
              Whether you're a local guide, homestay owner, or travel enthusiast, 
              be part of Kerala's digital tourism transformation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-primary-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors">
                Become a Local Guide
              </button>
              <button className="bg-primary-800 text-white px-8 py-3 rounded-full font-semibold hover:bg-primary-900 transition-colors border border-primary-400">
                Partner with Us
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}