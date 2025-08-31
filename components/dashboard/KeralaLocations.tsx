'use client';

import { useState, useEffect } from 'react';
import { MapPin, Star, Eye } from 'lucide-react';
import { getKeralaLocations, rateLocation, getLocationRating, addLocationToTravelPlan } from '@/lib/supabase';
import { useAuth } from '@/components/AuthProvider';
import { sanitizeText } from '@/utils/sanitize';

export default function KeralaLocations() {
  const { user } = useAuth();
  const [locations, setLocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('all');
  const [selectedDistrict, setSelectedDistrict] = useState('all');

  useEffect(() => {
    loadLocations();
  }, []);

  const loadLocations = async () => {
    try {
      const filters = {
        type: selectedType,
        district: selectedDistrict
      };
      const data = await getKeralaLocations(filters);
      setLocations(data);
    } catch (error) {
      console.error('Error loading locations:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLocations();
  }, [selectedType, selectedDistrict]);

  const filteredLocations = locations;

  const types = [
    { key: 'all', label: 'All Places', emoji: '🌍' },
    { key: 'backwater', label: 'Backwaters', emoji: '🚤' },
    { key: 'hillstation', label: 'Hill Stations', emoji: '⛰️' },
    { key: 'beach', label: 'Beaches', emoji: '🏖️' },
    { key: 'cultural', label: 'Cultural', emoji: '🏛️' }
  ];

  const districts = [
    'all', 'Thiruvananthapuram', 'Kollam', 'Pathanamthitta', 'Alappuzha', 'Kottayam', 
    'Idukki', 'Ernakulam', 'Thrissur', 'Palakkad', 'Malappuram', 'Kozhikode', 
    'Wayanad', 'Kannur', 'Kasaragod'
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-3xl p-6 animate-pulse">
            <div className="h-40 bg-gray-300 rounded-2xl mb-4"></div>
            <div className="h-6 bg-gray-300 rounded mb-2"></div>
            <div className="h-4 bg-gray-300 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="space-y-4">
        {/* Type Filter */}
        <div className="flex flex-wrap gap-2">
          {types.map((type) => (
            <button
              key={type.key}
              onClick={() => setSelectedType(type.key)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedType === type.key
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {type.emoji} {type.label}
            </button>
          ))}
        </div>

        {/* District Filter */}
        <div className="flex gap-4">
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Districts</option>
            {districts.slice(1).map((district) => (
              <option key={district} value={district}>{district}</option>
            ))}
          </select>

          <button
            onClick={() => {
              setSelectedType('all');
              setSelectedDistrict('all');
            }}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Locations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLocations.map((location) => (
          <LocationCard key={location.id} location={location} user={user} />
        ))}
      </div>

      {filteredLocations.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg">No locations found</div>
          <p className="text-gray-500 mt-2">Try selecting a different category</p>
        </div>
      )}
    </div>
  );
}

function LocationCard({ location, user }: { location: any; user: any }) {
  const [rating, setRating] = useState({ average: 0, count: 0 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadRating();
  }, [location.name]);

  const loadRating = async () => {
    try {
      const data = await getLocationRating(location.name);
      setRating(data);
    } catch (error) {
      console.error('Error loading rating:', error);
    }
  };

  const handleRate = async (stars: number) => {
    if (!user?.id) return;
    
    try {
      await rateLocation(user.id, location.name, stars);
      loadRating();
    } catch (error) {
      console.error('Error rating location:', error);
    }
  };

  const handlePlanVisit = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      await addLocationToTravelPlan(user.id, location.name, location.district);
      alert(`Added ${location.name} to your travel plans!`);
    } catch (error) {
      console.error('Error adding to travel plan:', error);
      alert('Failed to add to travel plan');
    } finally {
      setLoading(false);
    }
  };

  const typeEmojis = {
    backwater: '🚤',
    hillstation: '⛰️',
    beach: '🏖️',
    cultural: '🏛️'
  };

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden group">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        {location.image_url ? (
          <img 
            src={location.image_url} 
            alt={location.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
            <span className="text-6xl">{typeEmojis[location.type as keyof typeof typeEmojis] || '🌍'}</span>
          </div>
        )}
        {location.is_featured && (
          <div className="absolute top-4 right-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-bold">
            ⭐ Featured
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-1">
              {sanitizeText(location.name)}
            </h3>
            <div className="flex items-center text-gray-600 text-sm">
              <MapPin className="w-4 h-4 mr-1" />
              {sanitizeText(location.district)}
            </div>
          </div>
          <span className="text-2xl">{typeEmojis[location.type as keyof typeof typeEmojis] || '🌍'}</span>
        </div>

        <p className="text-gray-700 text-sm mb-4 line-clamp-3">
          {sanitizeText(location.description)}
        </p>

        {/* Rating */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => handleRate(star)}
                className={`text-lg ${star <= rating.average ? 'text-yellow-400' : 'text-gray-300'} hover:text-yellow-400 transition-colors`}
              >
                ★
              </button>
            ))}
          </div>
          <span className="text-sm text-gray-600">
            {rating.average.toFixed(1)} ({rating.count})
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {location.virtual_tour_url && (
            <a
              href={location.virtual_tour_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-gradient-to-r from-green-500 to-teal-500 text-white py-2 px-4 rounded-xl text-center text-sm font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Eye className="w-4 h-4" />
              Virtual Tour
            </a>
          )}
          <button 
            onClick={handlePlanVisit}
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 px-4 rounded-xl text-sm font-medium hover:shadow-lg transition-all disabled:opacity-50"
          >
            {loading ? 'Adding...' : 'Plan Visit'}
          </button>
        </div>
      </div>
    </div>
  );
}