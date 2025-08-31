'use client'

import { motion } from 'framer-motion'
import { 
  Map, 
  Brain, 
  MessageCircle, 
  Shield, 
  Star, 
  Compass,
  Users,
  Video,
  Globe
} from 'lucide-react'

const features = [
  {
    icon: Map,
    title: 'Interactive Global Map',
    description: 'Discover travelers and locals with our intuitive map interface. See who\'s nearby or explore your next destination.',
    color: 'text-blue-500',
    bgColor: 'bg-blue-50'
  },
  {
    icon: Brain,
    title: 'AI-Powered Matching',
    description: 'Smart recommendations based on travel goals, interests, and personality compatibility.',
    color: 'text-purple-500',
    bgColor: 'bg-purple-50'
  },
  {
    icon: MessageCircle,
    title: 'Instant Translation Chat',
    description: 'Break language barriers with real-time translation and end-to-end encrypted messaging.',
    color: 'text-green-500',
    bgColor: 'bg-green-50'
  },
  {
    icon: Shield,
    title: 'Safety First',
    description: 'Verified profiles, ID checks, and emergency features ensure your safety while traveling.',
    color: 'text-red-500',
    bgColor: 'bg-red-50'
  },
  {
    icon: Compass,
    title: 'Travel Plans Integration',
    description: 'Share your upcoming trips and connect with people before you arrive at your destination.',
    color: 'text-orange-500',
    bgColor: 'bg-orange-50'
  },
  {
    icon: Star,
    title: 'Local Experiences',
    description: 'Discover authentic local experiences and book directly through verified guides and hosts.',
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-50'
  },
  {
    icon: Video,
    title: 'Video Verification',
    description: 'Quick video calls for identity verification and planning safe meetups.',
    color: 'text-indigo-500',
    bgColor: 'bg-indigo-50'
  },
  {
    icon: Users,
    title: 'Community Verified',
    description: 'Badges for locals, guides, and hosts verified by our community and AI moderation.',
    color: 'text-pink-500',
    bgColor: 'bg-pink-50'
  },
  {
    icon: Globe,
    title: 'Passport Mode',
    description: 'Browse any city before you travel with our premium Passport Mode feature.',
    color: 'text-teal-500',
    bgColor: 'bg-teal-50'
  }
]

export default function Features() {
  return (
    <section id="features" className="section-padding bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-display font-bold mb-6">
            Everything you need for{' '}
            <span className="gradient-text">meaningful travel connections</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From AI-powered matching to safety features, WanderMatch provides all the tools 
            you need to connect authentically while exploring the world.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-8 card-hover"
            >
              <div className={`inline-flex p-3 rounded-xl ${feature.bgColor} mb-6`}>
                <feature.icon className={`h-6 w-6 ${feature.color}`} />
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

        {/* Premium Features Highlight */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-16 bg-gradient-to-r from-primary-500 to-accent-500 rounded-3xl p-8 text-center text-white"
        >
          <h3 className="text-2xl font-bold mb-4">
            Unlock Premium Features
          </h3>
          <p className="text-lg mb-6 opacity-90">
            Get unlimited access to Passport Mode, priority matching, and exclusive travel experiences
          </p>
          <a href="/pricing" className="bg-white text-primary-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors inline-block">
            Upgrade to Premium
          </a>
        </motion.div>
      </div>
    </section>
  )
}