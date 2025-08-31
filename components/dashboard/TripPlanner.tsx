'use client';

import { useState, useEffect } from 'react';
import { Calendar, MapPin, Plus, X, Edit, Trash2 } from 'lucide-react';
import { getTravelPlans, createTravelPlan } from '@/lib/supabase';
import { useAuth } from '@/components/AuthProvider';
import { sanitizeText } from '@/utils/sanitize';

export default function TripPlanner() {
  const { user } = useAuth();
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    destination: '',
    district: '',
    start_date: '',
    end_date: '',
    travel_type: 'leisure',
    description: ''
  });

  useEffect(() => {
    if (user?.id) {
      loadPlans();
    }
  }, [user]);

  const loadPlans = async () => {
    if (!user?.id) return;
    
    try {
      const data = await getTravelPlans(user.id);
      setPlans(data);
    } catch (error) {
      console.error('Error loading travel plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    try {
      await createTravelPlan({
        ...formData,
        user_id: user.id,
        is_active: true
      });
      setFormData({
        destination: '',
        district: '',
        start_date: '',
        end_date: '',
        travel_type: 'leisure',
        description: ''
      });
      setShowForm(false);
      loadPlans();
    } catch (error) {
      console.error('Error creating travel plan:', error);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-3xl p-6 animate-pulse">
            <div className="h-6 bg-gray-300 rounded mb-4"></div>
            <div className="h-4 bg-gray-300 rounded mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Trip Planner</h2>
          <p className="text-gray-600">Plan your Kerala adventures</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-2xl hover:shadow-lg transition-all flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          New Trip
        </button>
      </div>

      {/* Travel Plans */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {plans.map((plan) => (
          <div key={plan.id} className="bg-white/90 backdrop-blur-md rounded-3xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-1">
                  {sanitizeText(plan.destination)}
                </h3>
                <div className="flex items-center text-gray-600 text-sm">
                  <MapPin className="w-4 h-4 mr-1" />
                  {sanitizeText(plan.district)}
                </div>
              </div>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {plan.travel_type}
              </span>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4 mb-4">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center text-blue-700">
                  <Calendar className="w-4 h-4 mr-1" />
                  {new Date(plan.start_date).toLocaleDateString()}
                </div>
                <div className="text-gray-500">→</div>
                <div className="flex items-center text-purple-700">
                  <Calendar className="w-4 h-4 mr-1" />
                  {new Date(plan.end_date).toLocaleDateString()}
                </div>
              </div>
            </div>

            {plan.description && (
              <p className="text-gray-700 text-sm mb-4">
                {sanitizeText(plan.description)}
              </p>
            )}

            <div className="flex gap-2">
              <button className="flex-1 bg-gradient-to-r from-green-500 to-teal-500 text-white py-2 px-4 rounded-xl text-sm font-medium hover:shadow-lg transition-all">
                View Details
              </button>
              <button className="bg-gray-500 text-white p-2 rounded-xl hover:bg-gray-600 transition-colors">
                <Edit className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {plans.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🗺️</div>
          <div className="text-gray-400 text-lg">No travel plans yet</div>
          <p className="text-gray-500 mt-2">Create your first Kerala adventure!</p>
        </div>
      )}

      {/* Create Plan Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">New Travel Plan</h3>
              <button onClick={() => setShowForm(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Destination</label>
                <input
                  type="text"
                  value={formData.destination}
                  onChange={(e) => setFormData({...formData, destination: e.target.value})}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">District</label>
                <select
                  value={formData.district}
                  onChange={(e) => setFormData({...formData, district: e.target.value})}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select District</option>
                  <option value="Thiruvananthapuram">Thiruvananthapuram</option>
                  <option value="Kollam">Kollam</option>
                  <option value="Pathanamthitta">Pathanamthitta</option>
                  <option value="Alappuzha">Alappuzha</option>
                  <option value="Kottayam">Kottayam</option>
                  <option value="Idukki">Idukki</option>
                  <option value="Ernakulam">Ernakulam</option>
                  <option value="Thrissur">Thrissur</option>
                  <option value="Palakkad">Palakkad</option>
                  <option value="Malappuram">Malappuram</option>
                  <option value="Kozhikode">Kozhikode</option>
                  <option value="Wayanad">Wayanad</option>
                  <option value="Kannur">Kannur</option>
                  <option value="Kasaragod">Kasaragod</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Start Date</label>
                  <input
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">End Date</label>
                  <input
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Travel Type</label>
                <select
                  value={formData.travel_type}
                  onChange={(e) => setFormData({...formData, travel_type: e.target.value})}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="leisure">Leisure</option>
                  <option value="adventure">Adventure</option>
                  <option value="cultural">Cultural</option>
                  <option value="business">Business</option>
                  <option value="family">Family</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 h-20"
                  placeholder="Describe your travel plans..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                Create Plan
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}