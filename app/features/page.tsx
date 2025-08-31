'use client'

export default function Features() {
  const features = [
    {
      icon: '🗺️',
      title: 'Interactive Kerala Map',
      description: 'Real-time Google Maps integration showing travelers across all 14 districts. From Kasaragod beaches to Thiruvananthapuram heritage sites.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: '💬',
      title: 'Smart Chat System',
      description: 'End-to-end encrypted messaging with Malayalam translation. Video calls, voice messages, and location sharing.',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: '🤖',
      title: 'AI Travel Matching',
      description: 'Advanced AI analyzes your travel preferences, interests, and Kerala destinations to find perfect companions.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: '🏔️',
      title: 'Virtual Travel Mode',
      description: 'Explore Kerala virtually before visiting. 360° views of Munnar tea gardens, Alleppey backwaters, and more.',
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: '🛡️',
      title: 'Advanced Safety',
      description: 'Aadhaar verification, emergency contacts, live location sharing, and 24/7 Kerala tourism support.',
      color: 'from-red-500 to-pink-500'
    },
    {
      icon: '🎭',
      title: 'Cultural Calendar',
      description: 'Never miss Onam, Thrissur Pooram, or local temple festivals. Get notified about cultural events near you.',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      icon: '🚤',
      title: 'Backwater Experiences',
      description: 'Find houseboat companions, share costs, and discover hidden backwater routes in Alleppey and Kumarakom.',
      color: 'from-teal-500 to-blue-500'
    },
    {
      icon: '🌿',
      title: 'Ayurveda & Wellness',
      description: 'Connect with certified Ayurveda practitioners, wellness retreats, and traditional healing experiences.',
      color: 'from-green-500 to-teal-500'
    },
    {
      icon: '📸',
      title: 'Photography Network',
      description: 'Find photography partners for sunrise at Varkala, sunset at Fort Kochi, or monsoon shots in Munnar.',
      color: 'from-indigo-500 to-purple-500'
    }
  ]

  const virtualFeatures = [
    {
      title: 'Virtual Backwater Tours',
      description: 'Experience Alleppey houseboats in 360° before booking',
      image: '🚤'
    },
    {
      title: 'Hill Station Previews',
      description: 'Explore Munnar tea gardens and Wayanad spice plantations',
      image: '🏔️'
    },
    {
      title: 'Beach Experiences',
      description: 'Virtual walks on Varkala cliffs and Kovalam beaches',
      image: '🏖️'
    },
    {
      title: 'Cultural Sites',
      description: 'Tour temples, palaces, and heritage sites virtually',
      image: '🏛️'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-orange-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">W</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
              WanderMatch
            </span>
          </div>
          <a href="/" className="text-blue-600 hover:text-blue-700 font-medium">← Back to Home</a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-orange-100 rounded-full text-blue-700 text-sm font-medium mb-6">
            🚀 Powered by AI & Google Maps
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
            Advanced Features for
            <br />Kerala Travelers
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience the future of travel with AI-powered matching, virtual exploration, 
            and real-time connections across God's Own Country.
          </p>
        </div>

        {/* Main Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => (
            <div key={index} className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3">
              <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900 group-hover:text-blue-600 transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Virtual Travel Section */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl p-12 mb-20 text-white">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-6">Virtual Travel Experience</h2>
            <p className="text-xl text-purple-100 max-w-3xl mx-auto">
              Explore Kerala virtually before you visit. Our 360° virtual tours help you plan 
              the perfect trip and connect with locals who know these places best.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {virtualFeatures.map((feature, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300">
                <div className="text-4xl mb-4 text-center">{feature.image}</div>
                <h4 className="font-bold mb-3 text-center">{feature.title}</h4>
                <p className="text-purple-100 text-sm text-center">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Google Maps Integration */}
        <div className="bg-white rounded-3xl p-12 shadow-xl mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6 text-gray-900">
                Google Maps Integration
              </h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 font-bold">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Real-time Location Tracking</h4>
                    <p className="text-gray-600">See travelers and locals near you with live GPS integration</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-green-600 font-bold">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Smart Route Planning</h4>
                    <p className="text-gray-600">AI suggests optimal routes and meeting points across Kerala</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-orange-600 font-bold">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Local Hotspots</h4>
                    <p className="text-gray-600">Discover hidden gems recommended by verified local guides</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-100 to-orange-100 rounded-2xl p-8 h-80 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">🗺️</div>
                <div className="text-2xl font-bold text-gray-700">Interactive Map</div>
                <div className="text-gray-600">Live Kerala exploration</div>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Features */}
        <div className="bg-gradient-to-r from-green-500 to-teal-500 rounded-3xl p-12 text-white">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-6">Advanced Chat System</h2>
            <p className="text-xl text-green-100 max-w-3xl mx-auto">
              Connect with Kerala travelers through our secure, feature-rich messaging platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💬</span>
              </div>
              <h4 className="font-bold mb-3">Malayalam Translation</h4>
              <p className="text-green-100">Real-time translation between Malayalam, English, Hindi, and Tamil</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📹</span>
              </div>
              <h4 className="font-bold mb-3">Video Calls</h4>
              <p className="text-green-100">HD video calls for identity verification and trip planning</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📍</span>
              </div>
              <h4 className="font-bold mb-3">Location Sharing</h4>
              <p className="text-green-100">Share your location safely with trusted connections</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}