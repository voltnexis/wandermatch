'use client';

import { useState } from 'react';
import { Users, Heart, MessageCircle, User, Globe, MapPin, Settings, Calendar, Navigation } from 'lucide-react';
import TravelersGrid from '@/components/dashboard/TravelersGrid';
import MatchesGrid from '@/components/dashboard/MatchesGrid';
import FollowingGrid from '@/components/dashboard/FollowingGrid';
import LiveMap from '@/components/dashboard/LiveMap';
import SupabaseChatSystem from '@/components/chat/SupabaseChatSystem';
import CommunityFeed from '@/components/dashboard/CommunityFeed';
import TripPlanner from '@/components/dashboard/TripPlanner';
import KeralaLocations from '@/components/dashboard/KeralaLocations';
import { useAuth } from '@/components/AuthProvider';
import Link from 'next/link';

export default function DashboardPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('live');

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-3xl shadow-xl">
          <Globe className="w-16 h-16 text-primary-500 mx-auto mb-4" />
          <h2 className="text-3xl font-display font-bold mb-4 gradient-text">Welcome to WanderMatch</h2>
          <p className="text-gray-600 mb-6">Please sign in to access your travel dashboard</p>
          <Link href="/signin" className="btn-primary">
            Sign In to Continue
          </Link>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'live', label: 'Live Map', icon: MapPin, color: 'from-green-500 to-teal-500' },
    { id: 'following', label: 'Following', icon: Users, color: 'from-blue-500 to-purple-500' },
    { id: 'matches', label: 'Matches', icon: Heart, color: 'from-red-500 to-pink-500' },
    { id: 'chat', label: 'Messages', icon: MessageCircle, color: 'from-purple-500 to-indigo-500' },
    { id: 'community', label: 'Community', icon: Globe, color: 'from-indigo-500 to-purple-500' },
    { id: 'travelers', label: 'Discover', icon: Users, color: 'from-orange-500 to-amber-500' },
    { id: 'planner', label: 'Trip Planner', icon: Calendar, color: 'from-cyan-500 to-blue-500' },
    { id: 'locations', label: 'Locations', icon: Navigation, color: 'from-emerald-500 to-green-500' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-r from-primary-500 to-accent-500 p-1">
                  <div className="w-full h-full rounded-full overflow-hidden bg-white">
                    {user.profile_image_url ? (
                      <img src={user.profile_image_url} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-primary-500 text-xl font-bold">
                        {user.name.charAt(0)}
                      </div>
                    )}
                  </div>
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <h1 className="text-2xl font-display font-bold gradient-text">Welcome back, {user.name}!</h1>
                <div className="flex items-center text-gray-600 mt-1">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{user.current_city}, {user.current_district}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Link href="/profile" className="btn-secondary flex items-center space-x-2">
                <Settings className="w-4 h-4" />
                <span>Profile</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-3 py-4 px-6 font-medium text-sm transition-all duration-300 rounded-t-2xl relative ${
                    activeTab === tab.id
                      ? 'bg-white text-primary-600 shadow-lg transform -translate-y-1'
                      : 'text-gray-600 hover:text-primary-600 hover:bg-white/50'
                  }`}
                >
                  <div className={`p-2 rounded-xl bg-gradient-to-r ${tab.color} ${activeTab === tab.id ? 'text-white' : 'text-white/70'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="font-semibold">{tab.label}</span>
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full"></div>
                  )}
                </button>
              );
            })}
          </nav>
          
          {/* Mobile Navigation - 3 per line */}
          <nav className="lg:hidden grid grid-cols-3 gap-1 py-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex flex-col items-center py-3 px-2 font-medium text-xs transition-all duration-300 rounded-xl ${
                    activeTab === tab.id
                      ? 'bg-white text-primary-600 shadow-lg'
                      : 'text-gray-600 hover:text-primary-600 hover:bg-white/50'
                  }`}
                >
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${tab.color} mb-1`}>
                    <Icon className="w-3 h-3 text-white" />
                  </div>
                  <span className="font-semibold text-center leading-tight">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl p-8">
          {activeTab === 'live' && (
            <div>
              <div className="mb-8 text-center">
                <h2 className="text-4xl font-display font-bold gradient-text mb-3">Live Travelers Map</h2>
                <p className="text-gray-600 text-lg">See who's online and exploring right now across Kerala</p>
              </div>
              <LiveMap />
            </div>
          )}

          {activeTab === 'following' && (
            <div>
              <div className="mb-8 text-center">
                <h2 className="text-4xl font-display font-bold gradient-text mb-3">People You Follow</h2>
                <p className="text-gray-600 text-lg">Your travel connections and favorite explorers</p>
              </div>
              <FollowingGrid onSwitchToChat={() => setActiveTab('chat')} />
            </div>
          )}

          {activeTab === 'matches' && (
            <div>
              <div className="mb-8 text-center">
                <h2 className="text-4xl font-display font-bold gradient-text mb-3">Your Travel Matches</h2>
                <p className="text-gray-600 text-lg">People who liked you back - mutual connections!</p>
              </div>
              <MatchesGrid onSwitchToChat={() => setActiveTab('chat')} />
            </div>
          )}

          {activeTab === 'chat' && (
            <div>
              <div className="mb-8 text-center">
                <h2 className="text-4xl font-display font-bold gradient-text mb-3">Your Conversations</h2>
                <p className="text-gray-600 text-lg">Chat with your travel connections and plan amazing adventures</p>
              </div>
              <SupabaseChatSystem />
            </div>
          )}

          {activeTab === 'community' && (
            <div>
              <div className="mb-8 text-center">
                <h2 className="text-4xl font-display font-bold gradient-text mb-3">Community Posts</h2>
                <p className="text-gray-600 text-lg">Share experiences and discover amazing places</p>
              </div>
              <CommunityFeed />
            </div>
          )}

          {activeTab === 'travelers' && (
            <div>
              <div className="mb-8 text-center">
                <h2 className="text-4xl font-display font-bold gradient-text mb-3">Discover Amazing Travelers</h2>
                <p className="text-gray-600 text-lg">Follow fellow adventurers and local guides across Kerala</p>
              </div>
              <TravelersGrid onSwitchToChat={() => setActiveTab('chat')} />
            </div>
          )}

          {activeTab === 'planner' && (
            <div>
              <div className="mb-8 text-center">
                <h2 className="text-4xl font-display font-bold gradient-text mb-3">Trip Planner</h2>
                <p className="text-gray-600 text-lg">Plan your perfect Kerala adventure</p>
              </div>
              <TripPlanner />
            </div>
          )}

          {activeTab === 'locations' && (
            <div>
              <div className="mb-8 text-center">
                <h2 className="text-4xl font-display font-bold gradient-text mb-3">Kerala Locations</h2>
                <p className="text-gray-600 text-lg">Discover God's Own Country</p>
              </div>
              <KeralaLocations />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
