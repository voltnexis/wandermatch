'use client'

export default function Download() {
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

      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-full text-blue-700 text-sm font-medium mb-6">
            🌴 Now Live in Kerala & India
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
            Download WanderMatch
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Connect with Kerala travelers, find local guides, and discover God's Own Country like never before
          </p>
        </div>

        {/* Download Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="flex items-center justify-center w-16 h-16 bg-gray-900 rounded-2xl mb-6 mx-auto">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-center mb-4">Download for iOS</h3>
            <p className="text-gray-600 text-center mb-6">Available on the App Store</p>
            <button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 rounded-2xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl">
              Download Now
            </button>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="flex items-center justify-center w-16 h-16 bg-green-500 rounded-2xl mb-6 mx-auto">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-center mb-4">Download for Android</h3>
            <p className="text-gray-600 text-center mb-6">Get it on Google Play</p>
            <button className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 rounded-2xl font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl">
              Download Now
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-white rounded-3xl p-12 shadow-xl mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Trusted by Kerala Travelers</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">25K+</div>
              <div className="text-gray-600">Kerala Users</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">4.8★</div>
              <div className="text-gray-600">App Rating</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-600 mb-2">14</div>
              <div className="text-gray-600">Districts Covered</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">5K+</div>
              <div className="text-gray-600">Connections Made</div>
            </div>
          </div>
        </div>

        {/* Features Preview */}
        <div className="bg-gradient-to-r from-blue-500 to-orange-500 rounded-3xl p-12 text-white text-center">
          <h2 className="text-3xl font-bold mb-6">Kerala's Complete Travel Companion</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="text-2xl mb-2">🗺️</div>
              <div className="font-semibold">Interactive Maps</div>
              <div className="text-blue-100 text-sm">Real-time locations</div>
            </div>
            <div>
              <div className="text-2xl mb-2">💬</div>
              <div className="font-semibold">Malayalam Chat</div>
              <div className="text-blue-100 text-sm">Local language support</div>
            </div>
            <div>
              <div className="text-2xl mb-2">🛡️</div>
              <div className="font-semibold">Safe & Verified</div>
              <div className="text-blue-100 text-sm">Aadhaar verified profiles</div>
            </div>
          </div>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands discovering Kerala through authentic local connections
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors">
              Download for iOS
            </button>
            <button className="bg-blue-800 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-900 transition-colors border border-blue-400">
              Download for Android
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}