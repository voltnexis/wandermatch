'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Download, Smartphone } from 'lucide-react'

export default function CTA() {
  return (
    <section className="section-padding bg-gradient-to-r from-primary-600 via-primary-700 to-accent-600 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>

      <div className="max-w-7xl mx-auto relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl sm:text-5xl font-display font-bold mb-6">
              Your next adventure starts with a{' '}
              <span className="text-accent-200">connection</span>
            </h2>
            
            <p className="text-xl mb-8 text-primary-100 leading-relaxed">
              Join over 50,000 travelers who have discovered authentic experiences, 
              meaningful relationships, and lifelong friendships through WanderMatch.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <a href="/download" className="bg-white text-primary-600 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 flex items-center justify-center">
                <Download className="mr-2 h-5 w-5" />
                Download for iOS
              </a>
              <a href="/download" className="bg-primary-800 text-white px-8 py-4 rounded-full font-semibold hover:bg-primary-900 transition-all duration-300 flex items-center justify-center border border-primary-500">
                <Download className="mr-2 h-5 w-5" />
                Download for Android
              </a>
            </div>

            <div className="flex items-center text-primary-200">
              <Smartphone className="h-5 w-5 mr-2" />
              <span className="text-sm">Available on all devices • Free to start</span>
            </div>
          </motion.div>

          {/* Visual */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative z-10">
              {/* Phone Mockup */}
              <div className="bg-gray-900 rounded-[3rem] p-2 mx-auto w-80 h-[600px] shadow-2xl">
                <div className="bg-white rounded-[2.5rem] h-full relative overflow-hidden">
                  {/* Status Bar */}
                  <div className="bg-gray-900 h-8 rounded-t-[2.5rem] flex items-center justify-center">
                    <div className="w-20 h-1 bg-gray-600 rounded-full"></div>
                  </div>
                  
                  {/* App Content */}
                  <div className="p-6 h-full bg-gradient-to-br from-primary-50 to-accent-50">
                    <div className="text-center mb-6">
                      <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-accent-500 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                        <span className="text-white font-bold text-xl">W</span>
                      </div>
                      <h3 className="font-bold text-gray-900">WanderMatch</h3>
                      <p className="text-gray-600 text-sm">Find your travel companion</p>
                    </div>
                    
                    {/* Mock Profile Cards */}
                    <div className="space-y-4">
                      <div className="bg-white rounded-2xl p-4 shadow-sm">
                        <div className="flex items-center mb-3">
                          <div className="w-12 h-12 bg-primary-200 rounded-full mr-3"></div>
                          <div>
                            <div className="font-semibold text-gray-900">Sarah, 28</div>
                            <div className="text-gray-600 text-sm">Tokyo, Japan</div>
                          </div>
                        </div>
                        <div className="text-gray-700 text-sm">Looking for local food experiences...</div>
                      </div>
                      
                      <div className="bg-white rounded-2xl p-4 shadow-sm">
                        <div className="flex items-center mb-3">
                          <div className="w-12 h-12 bg-accent-200 rounded-full mr-3"></div>
                          <div>
                            <div className="font-semibold text-gray-900">Marco, 32</div>
                            <div className="text-gray-600 text-sm">Barcelona, Spain</div>
                          </div>
                        </div>
                        <div className="text-gray-700 text-sm">Local photographer & guide...</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -top-4 -right-4 w-20 h-20 bg-white/20 rounded-full"
            />
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 5, repeat: Infinity }}
              className="absolute -bottom-8 -left-8 w-32 h-32 bg-accent-400/20 rounded-full"
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}