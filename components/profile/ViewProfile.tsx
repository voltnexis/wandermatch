'use client';

import { useState, useEffect } from 'react';
import { User, X, MapPin } from 'lucide-react';
import { getUserById, getUserStats, getUserPosts, getFollowers, getFollowing, getTravelPlans, getKeralaLocations } from '@/lib/supabase';
import { sanitizeText } from '@/utils/sanitize';

interface ViewProfileProps {
  userId: string;
  onClose: () => void;
}

export default function ViewProfile({ userId, onClose }: ViewProfileProps) {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({ followers: 0, following: 0, likes: 0 });
  const [posts, setPosts] = useState<any[]>([]);
  const [followers, setFollowers] = useState<any[]>([]);
  const [following, setFollowing] = useState<any[]>([]);
  const [travelPlans, setTravelPlans] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('posts');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, [userId]);

  const loadUserData = async () => {
    try {
      const [userData, userStats, userPosts, userFollowers, userFollowing, userTravelPlans] = await Promise.all([
        getUserById(userId),
        getUserStats(userId),
        getUserPosts(userId),
        getFollowers(userId),
        getFollowing(userId),
        getTravelPlans(userId)
      ]);

      setUser(userData);
      setStats(userStats);
      setPosts(userPosts);
      setFollowers(userFollowers);
      setFollowing(userFollowing);
      setTravelPlans(userTravelPlans);
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-3xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="animate-pulse">
            <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4"></div>
            <div className="h-6 bg-gray-300 rounded mb-2"></div>
            <div className="h-4 bg-gray-300 rounded mb-4"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Profile</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Profile Header */}
        <div className="text-center mb-6">
          <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-500 p-1">
            <div className="w-full h-full rounded-full overflow-hidden bg-white">
              {user?.profile_image_url ? (
                <img src={user.profile_image_url} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-blue-500">
                  <User className="w-12 h-12" />
                </div>
              )}
            </div>
          </div>
          
          <h3 className="text-xl font-bold mb-1">{sanitizeText(user?.name)}, {user?.age}</h3>
          
          <div className="flex items-center justify-center text-gray-600 mb-4">
            <MapPin className="w-4 h-4 mr-1" />
            <span>{sanitizeText(user?.current_city)}, {sanitizeText(user?.current_district)}</span>
          </div>

          {user?.bio && (
            <p className="text-gray-700 mb-4">{sanitizeText(user.bio)}</p>
          )}

          <div className="flex justify-center gap-8 mb-6">
            <button 
              onClick={() => setActiveTab('followers')}
              className={`text-center p-2 rounded-lg ${activeTab === 'followers' ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
            >
              <div className="text-xl font-bold">{stats.followers}</div>
              <div className="text-sm text-gray-600">Followers</div>
            </button>
            <button 
              onClick={() => setActiveTab('following')}
              className={`text-center p-2 rounded-lg ${activeTab === 'following' ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
            >
              <div className="text-xl font-bold">{stats.following}</div>
              <div className="text-sm text-gray-600">Following</div>
            </button>
            <button 
              onClick={() => setActiveTab('posts')}
              className={`text-center p-2 rounded-lg ${activeTab === 'posts' ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
            >
              <div className="text-xl font-bold">{posts.length}</div>
              <div className="text-sm text-gray-600">Posts</div>
            </button>
            <button 
              onClick={() => setActiveTab('travel')}
              className={`text-center p-2 rounded-lg ${activeTab === 'travel' ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
            >
              <div className="text-xl font-bold">{travelPlans.length}</div>
              <div className="text-sm text-gray-600">Travel Plans</div>
            </button>
            <button 
              onClick={() => setActiveTab('kerala')}
              className={`text-center p-2 rounded-lg ${activeTab === 'kerala' ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
            >
              <div className="text-xl font-bold">🌴</div>
              <div className="text-sm text-gray-600">Kerala</div>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="max-h-64 overflow-y-auto">
          {activeTab === 'posts' && (
            <div className="space-y-4">
              {posts.map((post) => (
                <div key={post.id} className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-800">{sanitizeText(post.content)}</p>
                  {post.location_tag && (
                    <div className="flex items-center mt-2 text-sm text-gray-600">
                      <MapPin className="w-3 h-3 mr-1" />
                      {sanitizeText(post.location_tag)}
                    </div>
                  )}
                  <div className="text-xs text-gray-500 mt-2">
                    {new Date(post.created_at).toLocaleDateString()}
                  </div>
                </div>
              ))}
              {posts.length === 0 && (
                <div className="text-center text-gray-500 py-8">No posts yet</div>
              )}
            </div>
          )}

          {activeTab === 'followers' && (
            <div className="space-y-3">
              {followers.map((follower) => (
                <div key={follower.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                    {follower.name.charAt(0)}
                  </div>
                  <span className="font-medium">{sanitizeText(follower.name)}</span>
                </div>
              ))}
              {followers.length === 0 && (
                <div className="text-center text-gray-500 py-8">No followers yet</div>
              )}
            </div>
          )}

          {activeTab === 'following' && (
            <div className="space-y-3">
              {following.map((followedUser) => (
                <div key={followedUser.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold">
                    {followedUser.name.charAt(0)}
                  </div>
                  <span className="font-medium">{sanitizeText(followedUser.name)}</span>
                </div>
              ))}
              {following.length === 0 && (
                <div className="text-center text-gray-500 py-8">Not following anyone yet</div>
              )}
            </div>
          )}

          {activeTab === 'travel' && (
            <div className="space-y-4">
              {travelPlans.map((plan) => (
                <div key={plan.id} className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
                  <h4 className="font-semibold text-blue-800">{sanitizeText(plan.destination)}</h4>
                  <p className="text-sm text-blue-600">{sanitizeText(plan.district)}</p>
                  <div className="flex justify-between text-xs text-gray-600 mt-2">
                    <span>{new Date(plan.start_date).toLocaleDateString()}</span>
                    <span>{new Date(plan.end_date).toLocaleDateString()}</span>
                  </div>
                  {plan.description && (
                    <p className="text-sm text-gray-700 mt-2">{sanitizeText(plan.description)}</p>
                  )}
                </div>
              ))}
              {travelPlans.length === 0 && (
                <div className="text-center text-gray-500 py-8">No travel plans yet</div>
              )}
            </div>
          )}

          {activeTab === 'kerala' && (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">🌴</div>
              <div className="text-gray-600">Kerala Explorer</div>
              <p className="text-sm text-gray-500 mt-2">Discover God's Own Country</p>
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                  <div className="text-2xl mb-1">🚤</div>
                  <div className="text-sm font-medium text-green-800">Backwaters</div>
                </div>
                <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                  <div className="text-2xl mb-1">⛰️</div>
                  <div className="text-sm font-medium text-blue-800">Hill Stations</div>
                </div>
                <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
                  <div className="text-2xl mb-1">🏖️</div>
                  <div className="text-sm font-medium text-yellow-800">Beaches</div>
                </div>
                <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                  <div className="text-2xl mb-1">🏛️</div>
                  <div className="text-sm font-medium text-purple-800">Cultural</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}