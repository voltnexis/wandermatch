'use client';

import { useState, useEffect } from 'react';
import { MapPin, MessageCircle, UserMinus, Heart } from 'lucide-react';
import { getFollowing, unfollowUser, likeUser, unlikeUser, isLiked } from '@/lib/supabase';
import { useAuth } from '@/components/AuthProvider';
import { sanitizeText } from '@/utils/sanitize';
import { createChatRoom } from '@/lib/supabase';

interface FollowedUser {
  id: string;
  name: string;
  age: number;
  current_city: string;
  current_district: string;
  profile_image_url?: string;
  bio?: string;
  is_online: boolean;
}

interface FollowingGridProps {
  onSwitchToChat?: () => void;
}

export default function FollowingGrid({ onSwitchToChat }: FollowingGridProps) {
  const { user } = useAuth();
  const [following, setFollowing] = useState<FollowedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [likedUsers, setLikedUsers] = useState<Set<string>>(new Set());
  const [actionLoading, setActionLoading] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (user?.id) {
      loadFollowing();
      loadLikedUsers();
    }
  }, [user]);

  const loadFollowing = async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }
    
    try {
      const followedUsers = await getFollowing(user.id);
      setFollowing(followedUsers);
    } catch (error) {
      console.error('Error loading following:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const loadLikedUsers = async () => {
    if (!user?.id) return;
    
    try {
      const likedIds = new Set<string>();
      for (const followedUser of following) {
        if (followedUser.id) {
          const liked = await isLiked(user.id, followedUser.id);
          if (liked) {
            likedIds.add(followedUser.id);
          }
        }
      }
      setLikedUsers(likedIds);
    } catch (error) {
      console.error('Error loading liked users:', error);
    }
  };
  
  useEffect(() => {
    if (following.length > 0) {
      loadLikedUsers();
    }
  }, [following, user]);

  const handleUnfollow = async (userId: string) => {
    if (!user?.id || actionLoading.has(userId)) return;
    
    const userName = following.find(u => u.id === userId)?.name;
    if (!confirm(`Unfollow ${userName}?`)) return;
    
    setActionLoading(prev => new Set(prev).add(userId));
    
    try {
      await unfollowUser(user.id, userId);
      setFollowing(following.filter(u => u.id !== userId));
      setLikedUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
      alert(`Unfollowed ${userName}! 👋`);
    } catch (error) {
      console.error('Error unfollowing user:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setActionLoading(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    }
  };

  const handleLike = async (userId: string) => {
    if (!user?.id || actionLoading.has(userId)) return;
    
    const isCurrentlyLiked = likedUsers.has(userId);
    const userName = following.find(u => u.id === userId)?.name;
    
    setActionLoading(prev => new Set(prev).add(userId));
    
    try {
      if (isCurrentlyLiked) {
        await unlikeUser(user.id, userId);
        setLikedUsers(prev => {
          const newSet = new Set(prev);
          newSet.delete(userId);
          return newSet;
        });
        alert(`Unliked ${userName}! 💔`);
      } else {
        await likeUser(user.id, userId);
        setLikedUsers(prev => new Set(prev).add(userId));
        alert(`Liked ${userName}! 💖`);
      }
    } catch (error) {
      console.error('Error liking/unliking user:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setActionLoading(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    }
  };

  const handleChat = async (userId: string, onSwitchToChat?: () => void) => {
    if (!user?.id) return;
    
    const userName = following.find(u => u.id === userId)?.name;
    const isRomantic = likedUsers.has(userId);
    
    try {
      const chatRoom = await createChatRoom(user.id, userId, isRomantic);
      localStorage.setItem('wandermatch-selected-chat', chatRoom.id);
      if (onSwitchToChat) {
        onSwitchToChat();
      } else {
        alert(`Chat created with ${userName}! Go to Messages tab to start chatting! ${isRomantic ? '💕' : '💬'}`);
      }
    } catch (error) {
      console.error('Error creating chat:', error);
      alert('Failed to create chat');
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-3xl shadow-lg p-6 animate-pulse">
            <div className="w-20 h-20 bg-gray-300 rounded-full mx-auto mb-4"></div>
            <div className="h-4 bg-gray-300 rounded mb-2"></div>
            <div className="h-3 bg-gray-300 rounded mb-4"></div>
            <div className="h-8 bg-gray-300 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {following.map((followedUser) => (
        <div key={followedUser.id} className="group bg-white/90 backdrop-blur-md rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 p-6 hover:scale-105 border border-gray-100">
          <div className="text-center mb-6">
            <div className="relative inline-block mb-4">
              <div className="w-24 h-24 rounded-full overflow-hidden mx-auto bg-gradient-to-r from-blue-500 to-purple-500 p-1">
                <div className="w-full h-full rounded-full overflow-hidden bg-white">
                  {followedUser.profile_image_url ? (
                    <img 
                      src={followedUser.profile_image_url} 
                      alt={followedUser.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-blue-500 text-2xl font-bold">
                      {followedUser.name.charAt(0)}
                    </div>
                  )}
                </div>
              </div>
              {followedUser.is_online && (
                <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 rounded-full border-3 border-white flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                </div>
              )}
            </div>
            
            <h3 className="font-display font-bold text-xl text-gray-800 mb-1">
              {sanitizeText(followedUser.name) || 'Unknown'}, {followedUser.age}
            </h3>
            
            <div className="flex items-center justify-center text-gray-600 text-sm mb-3">
              <MapPin className="w-4 h-4 mr-1 text-primary-500" />
              <span className="font-medium">
                {sanitizeText(followedUser.current_city) || 'Unknown'}, 
                {sanitizeText(followedUser.current_district) || 'Unknown'}
              </span>
            </div>
          </div>

          {followedUser.bio && (
            <div className="bg-gray-50 rounded-2xl p-4 mb-6">
              <p className="text-gray-700 text-sm text-center line-clamp-3 leading-relaxed">
                {sanitizeText(followedUser.bio)}
              </p>
            </div>
          )}

          <div className="flex gap-2 mb-3">
            <button 
              onClick={() => handleLike(followedUser.id)}
              disabled={actionLoading.has(followedUser.id)}
              className={`flex-1 py-3 px-4 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
                likedUsers.has(followedUser.id)
                  ? 'bg-gradient-to-r from-gray-500 to-gray-600 text-white hover:from-gray-600 hover:to-gray-700'
                  : 'bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600'
              }`}
            >
              {actionLoading.has(followedUser.id) ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Heart className="w-4 h-4" />
              )}
              {actionLoading.has(followedUser.id) ? 'Loading...' : likedUsers.has(followedUser.id) ? 'Unlike' : 'Like'}
            </button>
            <button 
              onClick={() => handleChat(followedUser.id, onSwitchToChat)}
              className={`flex-1 py-3 px-4 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 ${
                likedUsers.has(followedUser.id)
                  ? 'bg-gradient-to-r from-pink-500 to-red-500 text-white hover:from-pink-600 hover:to-red-600'
                  : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600'
              }`}
            >
              <MessageCircle className="w-4 h-4" />
              {likedUsers.has(followedUser.id) ? '💕 Chat' : 'Chat'}
            </button>
          </div>

          <button 
            onClick={() => handleUnfollow(followedUser.id)}
            disabled={actionLoading.has(followedUser.id)}
            className="w-full bg-gradient-to-r from-gray-500 to-gray-600 text-white py-2 px-4 rounded-2xl hover:from-gray-600 hover:to-gray-700 transition-all duration-300 flex items-center justify-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {actionLoading.has(followedUser.id) ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <UserMinus className="w-4 h-4" />
            )}
            {actionLoading.has(followedUser.id) ? 'Loading...' : 'Unfollow'}
          </button>
        </div>
      ))}
      
      {following.length === 0 && !loading && (
        <div className="col-span-full text-center py-12">
          <div className="text-gray-400 text-lg">You're not following anyone yet</div>
          <p className="text-gray-500 mt-2">Start following travelers to see them here!</p>
        </div>
      )}
    </div>
  );
}