'use client'

import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'

const testimonials = [
  {
    name: 'Priya Nair',
    location: 'Software Engineer, Bangalore',
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    rating: 5,
    text: 'WanderMatch helped me discover Kerala\'s hidden gems! I found a local guide in Munnar who showed me secret tea plantation trails. The Malayalam support made everything so easy!'
  },
  {
    name: 'Arjun Menon',
    location: 'Local Guide, Alleppey',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    rating: 5,
    text: 'As a houseboat guide, WanderMatch connects me with travelers who truly want authentic backwater experiences. My business has grown 300% since joining!'
  },
  {
    name: 'Meera Krishnan',
    location: 'Travel Blogger, Chennai',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    rating: 5,
    text: 'I\'ve explored all 14 Kerala districts through WanderMatch connections. From Wayanad\'s spice gardens to Varkala\'s cliffs - every trip was magical with local companions.'
  },
  {
    name: 'Rahul Sharma',
    location: 'Photographer, Delhi',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    rating: 5,
    text: 'Kerala\'s monsoon photography became incredible with WanderMatch locals. They knew exactly when and where to capture the perfect shots in Munnar and Thekkady.'
  }
]

export default function Testimonials() {
  return (
    <section className="section-padding bg-gradient-to-br from-primary-50 to-accent-50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-display font-bold mb-6">
            Loved by{' '}
            <span className="gradient-text">travelers worldwide</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join thousands of happy travelers who have found meaningful connections 
            and unforgettable experiences through WanderMatch.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-8 card-hover relative"
            >
              <Quote className="absolute top-6 right-6 h-8 w-8 text-primary-200" />
              
              <div className="flex items-center mb-6">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-16 h-16 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {testimonial.name}
                  </h4>
                  <p className="text-gray-600 text-sm">
                    {testimonial.location}
                  </p>
                  <div className="flex mt-2">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>
              </div>
              
              <p className="text-gray-700 leading-relaxed">
                "{testimonial.text}"
              </p>
            </motion.div>
          ))}
        </div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="bg-white rounded-2xl p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div>
                <div className="text-3xl font-bold text-primary-600 mb-2">4.8★</div>
                <p className="text-gray-600 text-sm">App Store Rating</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600 mb-2">25K+</div>
                <p className="text-gray-600 text-sm">Kerala Users</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-2">14</div>
                <p className="text-gray-600 text-sm">Kerala Districts</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-600 mb-2">5K+</div>
                <p className="text-gray-600 text-sm">Kerala Connections</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}