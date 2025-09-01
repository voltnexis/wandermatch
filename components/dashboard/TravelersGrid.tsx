'use client';

import { useState, useEffect } from 'react';
import { MapPin, UserPlus, UserMinus, MessageCircle, Star } from 'lucide-react';
import { getAllUsers, followUser, unfollowUser, isFollowing, getUserStats, getUserPosts } from '@/lib/supabase';
import { useAuth } from '@/components/AuthProvider';
// Removed Firebase import

interface TravelersGridProps {
  onSwitchToChat?: () => void;
}

interface ViewProfileProps {
  user: any;
  onClose: () => void;
}

function ViewProfile({ user: profileUser, onClose }: ViewProfileProps) {
  const [stats, setStats] = useState({ followers: 0, following: 0, likes: 0 });
  const [userPosts, setUserPosts] = useState<any[]>([]);
  
  useEffect(() => {
    const loadData = async () => {
      try {
        const [userStats, posts] = await Promise.all([
          getUserStats(profileUser.id),
          getUserPosts(profileUser.id)
        ]);
        setStats(userStats);
        setUserPosts(posts);
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };
    loadData();
  }, [profileUser.id]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4">
        <div className="text-center mb-6">
          <div className="w-24 h-24 rounded-full overflow-hidden mx-auto bg-gradient-to-r from-primary-500 to-accent-500 p-1 mb-4">
            <div className="w-full h-full rounded-full overflow-hidden bg-white">
              {profileUser.profile_image_url ? (
                <img src={profileUser.profile_image_url} alt={profileUser.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-primary-500 text-2xl font-bold">
                  {profileUser.name.charAt(0)}
                </div>
              )}
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{profileUser.name}, {profileUser.age}</h2>
          <p className="text-gray-600 mb-4">{profileUser.current_city}, {profileUser.current_district}</p>
          
          <div className="flex justify-center gap-8 mb-6">
            <div className="text-center">
              <div className="text-xl font-bold text-gray-800">{stats.followers}</div>
              <div className="text-sm text-gray-600">Followers</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-gray-800">{stats.following}</div>
              <div className="text-sm text-gray-600">Following</div>
            </div>
          </div>
          
          {profileUser.bio && (
            <div className="bg-gray-50 rounded-2xl p-4 mb-6">
              <p className="text-gray-700 text-sm">{profileUser.bio}</p>
            </div>
          )}
          
          {userPosts.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-800 mb-3">Recent Posts ({userPosts.length})</h3>
              <div className="space-y-3 max-h-40 overflow-y-auto">
                {userPosts.slice(0, 3).map((post) => (
                  <div key={post.id} className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm text-gray-700">{post.content}</p>
                    {post.location_tag && (
                      <p className="text-xs text-primary-600 mt-1">📍 {post.location_tag}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">{new Date(post.created_at).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <button 
          onClick={onClose}
          className="w-full bg-gradient-to-r from-gray-500 to-gray-600 text-white py-3 rounded-2xl font-semibold"
        >
          Close
        </button>
      </div>
    </div>
  );
}

interface User {
  id: string;
  name: string;
  age: number;
  current_city: string;
  current_district: string;
  profile_image_url?: string;
  bio?: string;
  subscription_type: string;
  is_online: boolean;
}

export default function TravelersGrid({ onSwitchToChat }: TravelersGridProps) {
  const { user } = useAuth();
  const [travelers, setTravelers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProfile, setSelectedProfile] = useState<User | null>(null);
  const [followedUsers, setFollowedUsers] = useState<Set<string>>(new Set());
  const [followLoading, setFollowLoading] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadTravelers();
    loadFollowedUsers();
  }, [user]);

  const loadTravelers = async () => {
    try {
      const { getUsersWithOnlineStatus } = await import('@/lib/supabase');
      const data = await getUsersWithOnlineStatus();
      const filteredData = data.filter((u: User) => u.id !== user?.id);
      setTravelers(filteredData);
    } catch (error) {
      console.error('Error loading travelers:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const loadFollowedUsers = async () => {
    if (!user?.id) return;
    
    try {
      const following = await getAllUsers();
      const followedIds = new Set<string>();
      
      for (const traveler of following) {
        if (traveler.id && traveler.id !== user.id) {
          const isFollowingUser = await isFollowing(user.id, traveler.id);
          if (isFollowingUser) {
            followedIds.add(traveler.id);
          }
        }
      }
      
      setFollowedUsers(followedIds);
    } catch (error) {
      console.error('Error loading followed users:', error);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
            <div className="w-20 h-20 bg-gray-300 rounded-full mx-auto mb-4"></div>
            <div className="h-4 bg-gray-300 rounded mb-2"></div>
            <div className="h-3 bg-gray-300 rounded mb-4"></div>
            <div className="h-8 bg-gray-300 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  const handleFollow = async (travelerId: string) => {
    if (!user?.id || followLoading.has(travelerId)) return;
    
    const isCurrentlyFollowing = followedUsers.has(travelerId);
    const userName = travelers.find(t => t.id === travelerId)?.name;
    
    setFollowLoading(prev => new Set(prev).add(travelerId));
    
    try {
      if (isCurrentlyFollowing) {
        await unfollowUser(user.id, travelerId);
        setFollowedUsers(prev => {
          const newSet = new Set(prev);
          newSet.delete(travelerId);
          return newSet;
        });
        alert(`Unfollowed ${userName}! 👋`);
      } else {
        await followUser(user.id, travelerId);
        setFollowedUsers(prev => new Set(prev).add(travelerId));
        alert(`Following ${userName}! 👥`);
      }
    } catch (error) {
      console.error('Error following/unfollowing user:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setFollowLoading(prev => {
        const newSet = new Set(prev);
        newSet.delete(travelerId);
        return newSet;
      });
    }
  };

  const handleChat = async (travelerId: string) => {
    if (!user?.id) return;
    
    try {
      // Check if it's a romantic match
      const { isMutualLike, createChatRoom } = await import('@/lib/supabase');
      const isRomantic = await isMutualLike(user.id, travelerId);
      
      // Create chat in Supabase
      await createChatRoom(user.id, travelerId, isRomantic);
      
      onSwitchToChat?.();
    } catch (error) {
      console.error('Error creating chat:', error);
      alert('Failed to create chat');
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {travelers.map((traveler) => (
        <div key={traveler.id} className="group bg-white/90 backdrop-blur-md rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 p-6 hover:scale-105 border border-gray-100">
          <div className="text-center mb-6">
            <div className="relative inline-block mb-4">
              <button 
                onClick={() => setSelectedProfile(traveler)}
                className="w-24 h-24 rounded-full overflow-hidden mx-auto bg-gradient-to-r from-primary-500 to-accent-500 p-1 hover:scale-105 transition-transform"
              >
                <div className="w-full h-full rounded-full overflow-hidden bg-white">
                  {traveler.profile_image_url ? (
                    <img 
                      src={traveler.profile_image_url} 
                      alt={traveler.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-primary-500 text-2xl font-bold">
                      {traveler.name.charAt(0)}
                    </div>
                  )}
                </div>
              </button>
              {Math.random() > 0.6 && (
                <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 rounded-full border-3 border-white flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                </div>
              )}
            </div>
            
            <h3 className="font-display font-bold text-xl text-gray-800 mb-1">{traveler.name}, {traveler.age}</h3>
            
            <div className="flex items-center justify-center text-gray-600 text-sm mb-3">
              <MapPin className="w-4 h-4 mr-1 text-primary-500" />
              <span className="font-medium">{traveler.current_city}, {traveler.current_district}</span>
            </div>

            {traveler.subscription_type !== 'free' && (
              <div className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs rounded-full font-semibold mb-3">
                <Star className="w-3 h-3 mr-1" />
                {traveler.subscription_type === 'wanderer' ? 'Wanderer ✨' : 'Guide Pro 👑'}
              </div>
            )}
          </div>

          {traveler.bio && (
            <div className="bg-gray-50 rounded-2xl p-4 mb-6">
              <p className="text-gray-700 text-sm text-center line-clamp-3 leading-relaxed">
                {traveler.bio}
              </p>
            </div>
          )}

          <div className="flex gap-3">
            <button 
              onClick={() => handleFollow(traveler.id)}
              disabled={followLoading.has(traveler.id)}
              className={`${followedUsers.has(traveler.id) ? 'flex-1' : 'w-full'} py-3 px-4 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
                followedUsers.has(traveler.id)
                  ? 'bg-gradient-to-r from-gray-500 to-gray-600 text-white hover:from-gray-600 hover:to-gray-700'
                  : 'bg-gradient-to-r from-green-500 to-teal-500 text-white hover:from-green-600 hover:to-teal-600'
              }`}
            >
              {followLoading.has(traveler.id) ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : followedUsers.has(traveler.id) ? (
                <UserMinus className="w-4 h-4" />
              ) : (
                <UserPlus className="w-4 h-4" />
              )}
              {followLoading.has(traveler.id) ? 'Loading...' : followedUsers.has(traveler.id) ? 'Unfollow' : 'Follow'}
            </button>
            {followedUsers.has(traveler.id) && (
              <button 
                onClick={() => handleChat(traveler.id)}
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 px-4 rounded-2xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 flex items-center justify-center gap-2 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <MessageCircle className="w-4 h-4" />
                Chat
              </button>
            )}
          </div>
        </div>
      ))}
      
      {travelers.length === 0 && !loading && (
        <div className="col-span-full text-center py-12">
          <div className="text-gray-400 text-lg">No travelers found</div>
          <p className="text-gray-500 mt-2">Check back later for new connections!</p>
        </div>
      )}
      
      {selectedProfile && (
        <ViewProfile 
          user={selectedProfile} 
          onClose={() => setSelectedProfile(null)} 
        />
      )}
    </div>
  );
}
