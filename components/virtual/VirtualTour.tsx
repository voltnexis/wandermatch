'use client'

import { useState, useEffect } from 'react'
import { getKeralaLocations, getLocationsByType, KeralLocation } from '../../lib/supabase'

export default function VirtualTour() {
  const [locations, setLocations] = useState<KeralLocation[]>([])
  const [selectedLocation, setSelectedLocation] = useState<KeralLocation | null>(null)
  const [filter, setFilter] = useState<string>('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadLocations()
  }, [filter])

  const loadLocations = async () => {
    try {
      setLoading(true)
      let data: KeralLocation[]
      
      if (filter === 'all') {
        data = await getKeralaLocations()
      } else {
        data = await getLocationsByType(filter)
      }
      
      setLocations(data)
    } catch (error) {
      console.error('Error loading locations:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStartTour = (location: KeralLocation) => {
    setSelectedLocation(location)
    // Here you would integrate with actual 360° tour service
    console.log('Starting virtual tour for:', location.name)
  }

  const filterTypes = [
    { id: 'all', name: 'All Locations', emoji: '🌍' },
    { id: 'backwater', name: 'Backwaters', emoji: '🚤' },
    { id: 'hillstation', name: 'Hill Stations', emoji: '🏔️' },
    { id: 'beach', name: 'Beaches', emoji: '🏖️' },
    { id: 'cultural', name: 'Cultural Sites', emoji: '🏛️' }
  ]

  return (
    <div className="bg-white rounded-3xl p-8 shadow-xl">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Virtual Kerala Tours</h2>
        <p className="text-gray-600">Explore Kerala's beauty from anywhere in the world</p>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        {filterTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => setFilter(type.id)}
            className={`flex items-center space-x-2 px-6 py-3 rounded-full font-medium transition-all ${
              filter === type.id
                ? 'bg-blue-500 text-white shadow-lg transform scale-105'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <span className="text-lg">{type.emoji}</span>
            <span>{type.name}</span>
            {type.id !== 'all' && (
              <span className="bg-white/20 px-2 py-1 rounded-full text-xs">
                {locations.filter(loc => loc.type === type.id).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Kerala locations...</p>
        </div>
      ) : locations.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <p className="text-gray-600">No locations found for this category</p>
        </div>
      ) : (
        /* Location Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {locations.map((location) => (
            <div
              key={location.id}
              className="bg-gradient-to-br from-blue-50 to-orange-50 rounded-2xl p-6 cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2 group"
            >
              {/* Location Image/Icon */}
              <div className="text-center mb-4">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-orange-500 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-4 group-hover:scale-110 transition-transform">
                  {location.type === 'backwater' && '🚤'}
                  {location.type === 'hillstation' && '🏔️'}
                  {location.type === 'beach' && '🏖️'}
                  {location.type === 'cultural' && '🏛️'}
                </div>
                {location.is_featured && (
                  <div className="inline-flex items-center px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full mb-2">
                    ⭐ Featured
                  </div>
                )}
              </div>

              <h3 className="font-bold text-lg mb-2 text-center">{location.name}</h3>
              <p className="text-sm text-gray-600 mb-2 text-center">{location.district} District</p>
              <p className="text-sm text-gray-700 mb-4 text-center">{location.description}</p>
              
              <div className="space-y-2">
                <button 
                  onClick={() => handleStartTour(location)}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all font-medium"
                >
                  🌐 Start Virtual Tour
                </button>
                <button className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-all font-medium">
                  👥 Find Travel Companions
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Virtual Tour Modal */}
      {selectedLocation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">{selectedLocation.name}</h2>
              <button
                onClick={() => setSelectedLocation(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            
            {/* Virtual Tour Viewer */}
            <div className="bg-gradient-to-br from-blue-100 to-orange-100 rounded-2xl h-64 flex items-center justify-center mb-6 relative overflow-hidden">
              <div className="text-center">
                <div className="text-6xl mb-4">
                  {selectedLocation.type === 'backwater' && '🚤'}
                  {selectedLocation.type === 'hillstation' && '🏔️'}
                  {selectedLocation.type === 'beach' && '🏖️'}
                  {selectedLocation.type === 'cultural' && '🏛️'}
                </div>
                <div className="text-xl font-bold">360° Virtual Experience</div>
                <div className="text-gray-600">Immersive Kerala exploration</div>
              </div>
              
              {/* Tour Controls */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                <button className="bg-white/80 hover:bg-white px-3 py-1 rounded-full text-sm font-medium transition-colors">
                  🔄 Rotate
                </button>
                <button className="bg-white/80 hover:bg-white px-3 py-1 rounded-full text-sm font-medium transition-colors">
                  🔍 Zoom
                </button>
                <button className="bg-white/80 hover:bg-white px-3 py-1 rounded-full text-sm font-medium transition-colors">
                  📱 VR Mode
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold mb-3">About this location</h3>
                <p className="text-gray-600 mb-4">{selectedLocation.description}</p>
                <div className="space-y-2">
                  <div><strong>District:</strong> {selectedLocation.district}</div>
                  <div><strong>Type:</strong> {selectedLocation.type}</div>
                  <div><strong>Best time to visit:</strong> October - March</div>
                  <div><strong>Coordinates:</strong> {selectedLocation.coordinates?.lat?.toFixed(4) || 'N/A'}, {selectedLocation.coordinates?.lng?.toFixed(4) || 'N/A'}</div>
                </div>
              </div>
              
              <div>
                <h3 className="font-bold mb-3">Connect with locals</h3>
                <div className="space-y-3">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="font-medium">Ravi Kumar - Local Guide</div>
                    <div className="text-sm text-gray-600">15+ years experience in {selectedLocation.district}</div>
                    <div className="text-xs text-green-600 mt-1">✓ Verified Guide</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="font-medium">Priya Nair - Photographer</div>
                    <div className="text-sm text-gray-600">Specializes in {selectedLocation.type} photography</div>
                    <div className="text-xs text-blue-600 mt-1">⭐ Top Rated</div>
                  </div>
                </div>
                
                <div className="mt-4 space-y-2">
                  <button className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors font-medium">
                    💬 Chat with Local Guides
                  </button>
                  <button className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors font-medium">
                    👥 Find Travel Companions
                  </button>
                  <button className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition-colors font-medium">
                    📅 Plan Your Visit
                  </button>
                </div>
              </div>
            </div>

            {/* Tour Navigation */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="font-bold mb-3">Explore More Locations</h4>
              <div className="flex space-x-4 overflow-x-auto">
                {locations.filter(loc => loc.id !== selectedLocation.id).slice(0, 4).map((loc) => (
                  <button
                    key={loc.id}
                    onClick={() => setSelectedLocation(loc)}
                    className="flex-shrink-0 bg-gray-50 hover:bg-gray-100 p-3 rounded-lg transition-colors"
                  >
                    <div className="text-2xl mb-1">
                      {loc.type === 'backwater' && '🚤'}
                      {loc.type === 'hillstation' && '🏔️'}
                      {loc.type === 'beach' && '🏖️'}
                      {loc.type === 'cultural' && '🏛️'}
                    </div>
                    <div className="text-sm font-medium">{loc.name}</div>
                    <div className="text-xs text-gray-600">{loc.district}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}