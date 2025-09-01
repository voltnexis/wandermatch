'use client';

import { useState, useEffect } from 'react';
import { Heart, MessageCircle, MapPin } from 'lucide-react';
import { getLikedUsers, getUsersWhoLikedMe, isLiked, createChatRoom } from '@/lib/supabase';
import { useAuth } from '@/components/AuthProvider';
import { sanitizeText } from '@/utils/sanitize';
import ViewProfile from '@/components/profile/ViewProfile';

export default function MatchesGrid({ onSwitchToChat }: { onSwitchToChat?: () => void }) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('liked');
  const [likedUsers, setLikedUsers] = useState<any[]>([]);
  const [likedBackUsers, setLikedBackUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewingProfile, setViewingProfile] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) {
      loadMatches();
    }
  }, [user]);

  const loadMatches = async () => {
    if (!user?.id) return;

    try {
      const [liked, whoLikedMe] = await Promise.all([
        getLikedUsers(user.id),
        getUsersWhoLikedMe(user.id)
      ]);

      setLikedUsers(liked);

      // Filter to only show users who liked back (mutual likes)
      const mutualLikes = [];
      for (const likedUser of whoLikedMe) {
        const isMutual = await isLiked(user.id, (likedUser as any).id);
        if (isMutual) {
          mutualLikes.push(likedUser);
        }
      }
      setLikedBackUsers(mutualLikes);
    } catch (error) {
      console.error('Error loading matches:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChat = async (userId: string) => {
    if (!user?.id) return;
    
    try {
      const isRomantic = likedBackUsers.some(u => u.id === userId);
      const chatRoom = await createChatRoom(user.id, userId, isRomantic);
      localStorage.setItem('wandermatch-selected-chat', chatRoom.id);
      if (onSwitchToChat) {
        onSwitchToChat();
      }
    } catch (error) {
      console.error('Error creating chat:', error);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex gap-4 mb-6">
          <div className="h-10 w-24 bg-gray-300 rounded-full animate-pulse"></div>
          <div className="h-10 w-32 bg-gray-300 rounded-full animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-3xl p-6 animate-pulse">
              <div className="w-20 h-20 bg-gray-300 rounded-full mx-auto mb-4"></div>
              <div className="h-4 bg-gray-300 rounded mb-2"></div>
              <div className="h-3 bg-gray-300 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const currentUsers = activeTab === 'liked' ? likedUsers : likedBackUsers;

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-4">
        <button
          onClick={() => setActiveTab('liked')}
          className={`px-6 py-3 rounded-full font-semibold transition-all ${
            activeTab === 'liked'
              ? 'bg-gradient-to-r from-pink-500 to-red-500 text-white shadow-lg'
              : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          💕 Liked ({likedUsers.length})
        </button>
        <button
          onClick={() => setActiveTab('likedback')}
          className={`px-6 py-3 rounded-full font-semibold transition-all ${
            activeTab === 'likedback'
              ? 'bg-gradient-to-r from-pink-500 to-red-500 text-white shadow-lg'
              : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          💖 Liked Back ({likedBackUsers.length})
        </button>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentUsers.map((matchUser) => (
          <div key={matchUser.id} className="bg-white/90 backdrop-blur-md rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 p-6 border border-pink-100">
            <div className="text-center mb-6">
              <button
                onClick={() => setViewingProfile(matchUser.id)}
                className="relative inline-block mb-4"
              >
                <div className="w-24 h-24 rounded-full overflow-hidden mx-auto bg-gradient-to-r from-pink-500 to-red-500 p-1">
                  <div className="w-full h-full rounded-full overflow-hidden bg-white">
                    {matchUser.profile_image_url ? (
                      <img 
                        src={matchUser.profile_image_url} 
                        alt={matchUser.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-pink-500 text-2xl font-bold">
                        {matchUser.name.charAt(0)}
                      </div>
                    )}
                  </div>
                </div>
                {activeTab === 'likedback' && (
                  <div className="absolute -top-1 -right-1 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
                    💕
                  </div>
                )}
              </button>
              
              <h3 className="font-display font-bold text-xl text-gray-800 mb-1">
                {sanitizeText(matchUser.name)}, {matchUser.age}
              </h3>
              
              <div className="flex items-center justify-center text-gray-600 text-sm mb-3">
                <MapPin className="w-4 h-4 mr-1 text-pink-500" />
                <span>{sanitizeText(matchUser.current_city)}, {sanitizeText(matchUser.current_district)}</span>
              </div>
            </div>

            {matchUser.bio && (
              <div className="bg-pink-50 rounded-2xl p-4 mb-6 border border-pink-200">
                <p className="text-gray-700 text-sm text-center line-clamp-3">
                  {sanitizeText(matchUser.bio)}
                </p>
              </div>
            )}

            <div className="flex gap-2">
              <button 
                onClick={() => handleChat(matchUser.id)}
                className={`flex-1 py-3 px-4 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 ${
                  activeTab === 'likedback'
                    ? 'bg-gradient-to-r from-pink-500 to-red-500 text-white hover:from-pink-600 hover:to-red-600'
                    : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600'
                }`}
              >
                <MessageCircle className="w-4 h-4" />
                {activeTab === 'likedback' ? '💕 Romantic Chat' : 'Chat'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {currentUsers.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">
            {activeTab === 'liked' ? '💕' : '💖'}
          </div>
          <div className="text-gray-400 text-lg">
            {activeTab === 'liked' ? 'No one liked yet' : 'No mutual likes yet'}
          </div>
          <p className="text-gray-500 mt-2">
            {activeTab === 'liked' ? 'Start liking travelers to see them here!' : 'When someone likes you back, they\'ll appear here!'}
          </p>
        </div>
      )}

      {viewingProfile && (
        <ViewProfile 
          userId={viewingProfile} 
          onClose={() => setViewingProfile(null)} 
        />
      )}
    </div>
  );
}
