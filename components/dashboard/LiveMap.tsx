'use client';

import { useState, useEffect } from 'react';
import { MapPin, User, UserPlus } from 'lucide-react';
import { getAllUsers, followUser, isFollowing } from '@/lib/supabase';
import ViewProfile from '@/components/profile/ViewProfile';
import { useAuth } from '@/components/AuthProvider';

interface OnlineUser {
  id: string;
  name: string;
  current_city: string;
  current_district: string;
  profile_image_url?: string;
  is_online: boolean;
}

export default function LiveMap() {
  const { user } = useAuth();
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [followingStatus, setFollowingStatus] = useState<Record<string, boolean>>({});
  const [viewingProfile, setViewingProfile] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadOnlineUsers();
  }, []);

  const loadOnlineUsers = async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }
    
    try {
      const data = await getAllUsers();
      const onlineData = data.filter((u: OnlineUser) => u.is_online && u.id !== user.id);
      setOnlineUsers(onlineData);
      
      // Check following status for each user
      const followingMap: Record<string, boolean> = {};
      for (const onlineUser of onlineData) {
        const isFollowingUser = await isFollowing(user.id, onlineUser.id);
        followingMap[onlineUser.id] = isFollowingUser;
      }
      setFollowingStatus(followingMap);
    } catch (error) {
      console.error('Error loading online users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewProfile = (userId: string) => {
    setViewingProfile(userId);
  };

  const handleFollow = async (userId: string) => {
    if (!user?.id || actionLoading.has(userId)) return;
    
    const userName = onlineUsers.find(u => u.id === userId)?.name;
    const isCurrentlyFollowing = followingStatus[userId];
    
    setActionLoading(prev => new Set(prev).add(userId));
    
    try {
      if (!isCurrentlyFollowing) {
        await followUser(user.id, userId);
        setFollowingStatus(prev => ({ ...prev, [userId]: true }));
        alert(`Now following ${userName}! 🎉`);
      } else {
        alert(`You're already following ${userName}!`);
      }
    } catch (error) {
      console.error('Error following user:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setActionLoading(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-white/90 rounded-2xl p-4 animate-pulse">
            <div className="w-12 h-12 bg-gray-300 rounded-full mx-auto mb-2"></div>
            <div className="h-3 bg-gray-300 rounded mb-1"></div>
            <div className="h-2 bg-gray-300 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 text-center">
        <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-700 rounded-full font-semibold">
          <div className="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse"></div>
          {onlineUsers.length} travelers online now
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {onlineUsers.map((onlineUser) => (
          <div key={onlineUser.id} className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-4 hover:scale-105 border border-gray-100">
            <div className="text-center">
              <div className="relative inline-block mb-3">
                <div className="w-16 h-16 rounded-full overflow-hidden mx-auto bg-gradient-to-r from-green-500 to-teal-500 p-1">
                  <div className="w-full h-full rounded-full overflow-hidden bg-white">
                    {onlineUser.profile_image_url ? (
                      <img 
                        src={onlineUser.profile_image_url} 
                        alt={onlineUser.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-green-500 text-lg font-bold">
                        {onlineUser.name.charAt(0)}
                      </div>
                    )}
                  </div>
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                </div>
              </div>
              
              <h3 className="font-semibold text-sm text-gray-800 mb-1">{onlineUser.name}</h3>
              
              <div className="flex items-center justify-center text-gray-600 text-xs mb-3">
                <MapPin className="w-3 h-3 mr-1 text-green-500" />
                <span>{onlineUser.current_city}</span>
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={() => handleViewProfile(onlineUser.id)}
                  className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 text-white py-2 px-3 rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-300 flex items-center justify-center gap-1 text-xs font-semibold"
                >
                  <User className="w-3 h-3" />
                  View
                </button>
                <button 
                  onClick={() => handleFollow(onlineUser.id)}
                  disabled={actionLoading.has(onlineUser.id)}
                  className={`flex-1 py-2 px-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-1 text-xs font-semibold disabled:opacity-50 ${
                    followingStatus[onlineUser.id]
                      ? 'bg-gradient-to-r from-green-500 to-teal-500 text-white hover:from-green-600 hover:to-teal-600'
                      : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600'
                  }`}
                >
                  {actionLoading.has(onlineUser.id) ? (
                    <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <UserPlus className="w-3 h-3" />
                  )}
                  {actionLoading.has(onlineUser.id) ? 'Loading...' : followingStatus[onlineUser.id] ? 'Following' : 'Follow'}
                </button>
              </div>
            </div>
          </div>
        ))}
        
        {onlineUsers.length === 0 && !loading && (
          <div className="col-span-full text-center py-12">
            <div className="text-gray-400 text-lg">No one is online right now</div>
            <p className="text-gray-500 mt-2">Check back later to see who's exploring!</p>
          </div>
        )}
      </div>
      
      {viewingProfile && (
        <ViewProfile 
          userId={viewingProfile} 
          onClose={() => setViewingProfile(null)} 
        />
      )}
    </div>
  );
}