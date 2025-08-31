'use client';

import { useState } from 'react';
import { MapPin, Calendar, Heart, MessageCircle, UserPlus, UserMinus, Users, Eye } from 'lucide-react';

interface UserProfileProps {
  user: {
    id: string;
    name: string;
    age: number;
    current_city: string;
    current_district: string;
    profile_image_url?: string;
    bio?: string;
    subscription_type: string;
    is_online: boolean;
  };
  isFollowing?: boolean;
  showFollowStats?: boolean;
}

export default function UserProfile({ user, isFollowing = false, showFollowStats = false }: UserProfileProps) {
  const [following, setFollowing] = useState(isFollowing);
  // Removed unused state variables

  const handleFollow = () => {
    setFollowing(!following);
    alert(`${following ? 'Unfollowed' : 'Following'} ${user.name}! ${following ? '👋' : '👥'}`);
  };

  const handleLike = () => {
    if (!following) {
      alert('You need to follow this person first to like them! 💙');
      return;
    }
    alert(`Liked ${user.name}! This creates a match! 💖`);
  };

  const handleChat = () => {
    if (!following) {
      alert('You need to follow this person first to chat! 💬');
      return;
    }
    alert(`Starting chat with ${user.name}! 💬`);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white/90 backdrop-blur-md rounded-3xl shadow-xl p-8 border border-gray-100">
      <div className="text-center mb-8">
        <div className="relative inline-block mb-6">
          <div className="w-32 h-32 rounded-full overflow-hidden mx-auto bg-gradient-to-r from-primary-500 to-accent-500 p-1">
            <div className="w-full h-full rounded-full overflow-hidden bg-white">
              {user.profile_image_url ? (
                <img 
                  src={user.profile_image_url} 
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-primary-500 text-4xl font-bold">
                  {user.name.charAt(0)}
                </div>
              )}
            </div>
          </div>
          {user.is_online && (
            <div className="absolute bottom-2 right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
            </div>
          )}
        </div>
        
        <h1 className="text-3xl font-display font-bold text-gray-800 mb-2">{user.name}, {user.age}</h1>
        
        <div className="flex items-center justify-center text-gray-600 mb-4">
          <MapPin className="w-5 h-5 mr-2 text-primary-500" />
          <span className="text-lg font-medium">{user.current_city}, {user.current_district}</span>
        </div>

        {user.subscription_type !== 'free' && (
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-sm rounded-full font-semibold mb-4">
            <Heart className="w-4 h-4 mr-2" />
            {user.subscription_type === 'wanderer' ? 'Wanderer ✨' : 'Guide Pro 👑'}
          </div>
        )}

        {showFollowStats && (
          <div className="flex justify-center gap-6 mb-6">
            <button 
              onClick={() => setShowFollowers(!showFollowers)}
              className="text-center hover:bg-gray-50 rounded-lg p-2 transition-colors"
            >
              <div className="text-2xl font-bold text-gray-800">156</div>
              <div className="text-sm text-gray-600">Followers</div>
            </button>
            <button 
              onClick={() => setShowFollowing(!showFollowing)}
              className="text-center hover:bg-gray-50 rounded-lg p-2 transition-colors"
            >
              <div className="text-2xl font-bold text-gray-800">89</div>
              <div className="text-sm text-gray-600">Following</div>
            </button>
          </div>
        )}
      </div>

      {user.bio && (
        <div className="bg-gray-50 rounded-2xl p-6 mb-8">
          <h3 className="font-semibold text-gray-800 mb-3">About</h3>
          <p className="text-gray-700 leading-relaxed">{user.bio}</p>
        </div>
      )}

      <div className="flex gap-3">
        <button 
          onClick={handleFollow}
          className={`flex-1 py-3 px-6 rounded-2xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 ${
            following 
              ? 'bg-gradient-to-r from-gray-500 to-gray-600 text-white hover:from-gray-600 hover:to-gray-700'
              : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600'
          }`}
        >
          {following ? <UserMinus className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
          {following ? 'Unfollow' : 'Follow'}
        </button>
        
        <button 
          onClick={handleLike}
          className={`flex-1 py-3 px-6 rounded-2xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 ${
            following
              ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
          disabled={!following}
        >
          <Heart className="w-5 h-5" />
          Like
        </button>
        
        <button 
          onClick={handleChat}
          className={`flex-1 py-3 px-6 rounded-2xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 ${
            following
              ? 'bg-gradient-to-r from-green-500 to-teal-500 text-white hover:from-green-600 hover:to-teal-600'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
          disabled={!following}
        >
          <MessageCircle className="w-5 h-5" />
          Chat
        </button>
      </div>

      {!showFollowStats && (
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            {following ? 'You can now like and chat with this person!' : 'Follow to unlock like and chat features'}
          </p>
        </div>
      )}
    </div>
  );
}