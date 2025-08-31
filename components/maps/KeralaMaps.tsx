'use client'

import { useState, useEffect } from 'react'
import { getUsers, getUsersByDistrict, User } from '../../lib/supabase'
import { getCurrentLocation, keralaDistricts, getDistrictFromCoordinates } from '../../lib/maps-fallback'

export default function KeralaMaps() {
  const [travelers, setTravelers] = useState<User[]>([])
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all')
  const [selectedTraveler, setSelectedTraveler] = useState<User | null>(null)
  const [mapView, setMapView] = useState<'travelers' | 'attractions'>('travelers')
  const [loading, setLoading] = useState(true)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)

  useEffect(() => {
    loadTravelers()
    getUserLocation()
  }, [selectedDistrict])

  const loadTravelers = async () => {
    try {
      setLoading(true)
      let data: User[]
      
      if (selectedDistrict === 'all') {
        data = await getUsers()
      } else {
        data = await getUsersByDistrict(selectedDistrict)
      }
      
      setTravelers(data)
    } catch (error) {
      console.error('Error loading travelers:', error)
    } finally {
      setLoading(false)
    }
  }

  const getUserLocation = async () => {
    try {
      const location = await getCurrentLocation()
      setUserLocation(location)
    } catch (error) {
      console.error('Error getting location:', error)
    }
  }

  const handleConnectTraveler = async (traveler: User) => {
    // Implement connection logic
    console.log('Connecting with:', traveler.name)
    // This would create a match or send a connection request
  }

  return (
    <div className="bg-white rounded-3xl p-8 shadow-xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold mb-2">Kerala Live Map</h2>
          <p className="text-gray-600">Real-time travelers across God's Own Country</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setMapView('travelers')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              mapView === 'travelers'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Travelers ({travelers.length})
          </button>
          <button
            onClick={() => setMapView('attractions')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              mapView === 'attractions'
                ? 'bg-green-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Attractions
          </button>
        </div>
      </div>

      {/* District Filter */}
      <div className="mb-6">
        <select
          value={selectedDistrict}
          onChange={(e) => setSelectedDistrict(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Districts ({travelers.length} travelers)</option>
          {keralaDistricts.map(district => (
            <option key={district.name} value={district.name}>
              {district.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Map Area */}
        <div className="lg:col-span-2">
          <div className="bg-gradient-to-br from-green-100 to-blue-100 rounded-2xl h-96 relative overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">🗺️</div>
                <div className="text-2xl font-bold text-gray-700">Interactive Kerala Map</div>
                <div className="text-gray-600">Google Maps Integration</div>
                {userLocation && (
                  <div className="text-sm text-blue-600 mt-2">
                    Your location: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
                  </div>
                )}
              </div>
            </div>

            {/* Traveler Pins */}
            {mapView === 'travelers' && travelers.map((traveler, index) => (
              <div
                key={traveler.id}
                onClick={() => setSelectedTraveler(traveler)}
                className={`absolute w-12 h-12 rounded-full border-4 border-white shadow-lg cursor-pointer transform hover:scale-110 transition-all ${
                  traveler.is_online ? 'bg-green-500' : 'bg-gray-400'
                }`}
                style={{
                  left: `${20 + index * 15}%`,
                  top: `${30 + index * 10}%`
                }}
              >
                <div className="w-full h-full rounded-full flex items-center justify-center text-white text-lg">
                  {traveler.name.charAt(0)}
                </div>
                {traveler.is_online && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
                )}
              </div>
            ))}
          </div>

          {/* Map Controls */}
          <div className="flex justify-between items-center mt-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Online ({travelers.filter(t => t.is_online).length})</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                <span className="text-sm text-gray-600">Offline ({travelers.filter(t => !t.is_online).length})</span>
              </div>
            </div>
            <button
              onClick={getUserLocation}
              className="text-sm bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition-colors"
            >
              📍 My Location
            </button>
          </div>
        </div>

        {/* Traveler List */}
        <div className="space-y-4">
          <h3 className="font-bold text-lg">
            {selectedDistrict === 'all' ? 'All Kerala Travelers' : `${selectedDistrict} Travelers`}
          </h3>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
              <p className="text-gray-600 mt-2">Loading travelers...</p>
            </div>
          ) : travelers.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">🔍</div>
              <p className="text-gray-600">No travelers found in this area</p>
            </div>
          ) : (
            travelers.map((traveler) => (
              <div
                key={traveler.id}
                onClick={() => setSelectedTraveler(traveler)}
                className={`p-4 rounded-2xl cursor-pointer transition-all hover:shadow-lg ${
                  selectedTraveler?.id === traveler.id
                    ? 'bg-blue-50 border-2 border-blue-200'
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white text-xl">
                      {traveler.name.charAt(0)}
                    </div>
                    {traveler.is_online && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <div>
                    <div className="font-semibold">{traveler.name}{traveler.age && `, ${traveler.age}`}</div>
                    <div className="text-sm text-gray-600">
                      {traveler.current_city && traveler.current_district 
                        ? `${traveler.current_city}, ${traveler.current_district}`
                        : traveler.current_district || 'Kerala'
                      }
                    </div>
                    {traveler.subscription_type !== 'free' && (
                      <div className="text-xs bg-gold-100 text-gold-700 px-2 py-1 rounded-full inline-block mt-1">
                        {traveler.subscription_type === 'guide_pro' ? 'Guide Pro' : 'Wanderer'}
                      </div>
                    )}
                  </div>
                </div>
                {traveler.bio && (
                  <p className="text-sm text-gray-600 mb-2">{traveler.bio.substring(0, 100)}...</p>
                )}
                <div className="flex justify-between items-center">
                  <div className="text-xs text-gray-500">
                    {traveler.is_online ? 'Online now' : `Last seen ${traveler.last_seen ? new Date(traveler.last_seen).toLocaleDateString() : 'recently'}`}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleConnectTraveler(traveler)
                    }}
                    className="text-xs bg-blue-500 text-white px-3 py-1 rounded-full hover:bg-blue-600 transition-colors"
                  >
                    Connect
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Traveler Detail Modal */}
      {selectedTraveler && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Connect with {selectedTraveler.name}</h2>
              <button
                onClick={() => setSelectedTraveler(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white text-3xl mx-auto mb-4">
                {selectedTraveler.name.charAt(0)}
              </div>
              <div className="text-xl font-bold">{selectedTraveler.name}{selectedTraveler.age && `, ${selectedTraveler.age}`}</div>
              <div className="text-gray-600">{selectedTraveler.current_city}, {selectedTraveler.current_district}</div>
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm mt-2 ${
                selectedTraveler.is_online 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-gray-100 text-gray-600'
              }`}>
                <div className={`w-2 h-2 rounded-full mr-2 ${
                  selectedTraveler.is_online ? 'bg-green-500' : 'bg-gray-400'
                }`}></div>
                {selectedTraveler.is_online ? 'Online now' : 'Offline'}
              </div>
            </div>

            {selectedTraveler.bio && (
              <div className="mb-6">
                <h4 className="font-semibold mb-2">About</h4>
                <p className="text-gray-600">{selectedTraveler.bio}</p>
              </div>
            )}

            <div className="space-y-3">
              <button 
                onClick={() => handleConnectTraveler(selectedTraveler)}
                className="w-full bg-blue-500 text-white py-3 rounded-xl font-semibold hover:bg-blue-600 transition-colors"
              >
                Send Connection Request
              </button>
              <button className="w-full bg-green-500 text-white py-3 rounded-xl font-semibold hover:bg-green-600 transition-colors">
                Start Chat
              </button>
              <button className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors">
                View Full Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}