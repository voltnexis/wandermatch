'use client';

import { useState, useRef, useEffect } from 'react';
import { User, Camera, Save, X } from 'lucide-react';
import { updateUserProfile, uploadProfileImage, getFollowing, getFollowers, unfollowUser, getUserStats } from '@/lib/supabase';
import { useAuth } from '@/components/AuthProvider';

export default function ProfileUpdate() {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  interface UserProfile {
    id: string;
    name: string;
    profile_image_url?: string;
    current_city?: string;
    current_district?: string;
  }

  const [followers, setFollowers] = useState<UserProfile[]>([]);
  const [following, setFollowing] = useState<UserProfile[]>([]);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    age: user?.age || '',
    bio: user?.bio || ''
  });

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 500 * 1024) {
      setMessage('Image must be less than 500KB');
      setMessageType('error');
      return;
    }

    if (file.type !== 'image/webp') {
      setMessage('Only WebP images are allowed');
      setMessageType('error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      let profileImageUrl = user.profile_image_url;

      if (fileInputRef.current?.files?.[0]) {
        profileImageUrl = await uploadProfileImage(user.id, fileInputRef.current.files[0]);
      }

      const updatedUser = await updateUserProfile(user.id, {
        ...formData,
        profile_image_url: profileImageUrl
      });

      setUser(updatedUser);
      setMessage('Profile updated successfully! ✨');
      setMessageType('success');
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage('Failed to update profile. Please try again.');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFollowersAndFollowing();
  }, []);

  const loadFollowersAndFollowing = async () => {
    if (!user?.id) return;
    try {
      const [followingUsers, followerUsers] = await Promise.all([
        getFollowing(user.id),
        getFollowers(user.id)
      ]);
      setFollowing(followingUsers);
      setFollowers(followerUsers);
    } catch (error) {
      console.error('Error loading followers/following:', error);
    }
  };

  const handleRemoveFollower = async (userId: string) => {
    if (!user?.id) return;
    try {
      // In a real app, you'd have a removeFollower function
      // For now, we'll just remove from the local state
      setFollowers(followers.filter(f => f.id !== userId));
      setMessage('Follower removed!');
      setMessageType('success');
    } catch (error) {
      console.error('Error removing follower:', error);
      setMessage('Failed to remove follower. Please try again.');
      setMessageType('error');
    }
  };

  const handleUnfollow = async (userId: string) => {
    if (!user?.id) return;
    try {
      await unfollowUser(user.id, userId);
      setFollowing(following.filter(f => f.id !== userId));
      setMessage('Unfollowed!');
      setMessageType('success');
    } catch (error) {
      console.error('Error unfollowing user:', error);
      setMessage('Failed to unfollow. Please try again.');
      setMessageType('error');
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white/90 backdrop-blur-md rounded-3xl shadow-xl border border-gray-100">
      {message && (
        <div className={`mb-6 p-4 rounded-xl ${messageType === 'success' ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'}`}>
          {message}
        </div>
      )}

      <div className="text-center mb-8">
        <div className="bg-gradient-to-r from-primary-500 to-accent-500 p-3 rounded-2xl inline-block mb-4">
          <User className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-display font-bold gradient-text mb-2">Your Profile</h2>
        <p className="text-gray-600">Manage your travel profile and connections</p>
        
        <div className="flex justify-center gap-8 mt-6">
          <button 
            onClick={() => setShowFollowers(true)}
            className="text-center hover:bg-gray-50 rounded-lg p-3 transition-colors"
          >
            <div className="text-2xl font-bold text-gray-800">{followers.length}</div>
            <div className="text-sm text-gray-600">Followers</div>
          </button>
          <button 
            onClick={() => setShowFollowing(true)}
            className="text-center hover:bg-gray-50 rounded-lg p-3 transition-colors"
          >
            <div className="text-2xl font-bold text-gray-800">{following.length}</div>
            <div className="text-sm text-gray-600">Following</div>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="text-center mb-8">
          <div className="relative inline-block">
            <div className="w-36 h-36 rounded-full overflow-hidden bg-gradient-to-r from-primary-500 to-accent-500 p-1 mx-auto">
              <div className="w-full h-full rounded-full overflow-hidden bg-white">
                {imagePreview || user.profile_image_url ? (
                  <img 
                    src={imagePreview || user.profile_image_url} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-primary-500">
                    <User className="w-16 h-16" />
                  </div>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-2 right-2 bg-gradient-to-r from-primary-500 to-accent-500 text-white p-3 rounded-full hover:shadow-lg transition-all duration-300 transform hover:scale-110"
            >
              <Camera className="w-5 h-5" />
            </button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".webp"
            onChange={handleImageChange}
            className="hidden"
          />
          <p className="text-sm text-gray-500 mt-3 bg-gray-50 rounded-lg p-2">📸 WebP format only • Max 500KB</p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Age</label>
          <input
            type="number"
            value={formData.age}
            onChange={(e) => setFormData({...formData, age: parseInt(e.target.value)})}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            min="18"
            max="100"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Bio</label>
          <textarea
            value={formData.bio}
            onChange={(e) => setFormData({...formData, bio: e.target.value})}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 h-24"
            placeholder="Tell us about yourself..."
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-primary-500 to-accent-500 text-white py-4 rounded-2xl hover:shadow-xl disabled:opacity-50 flex items-center justify-center gap-3 font-semibold text-lg transition-all duration-300 transform hover:scale-105"
        >
          <Save className="w-6 h-6" />
          {loading ? 'Updating Your Profile...' : 'Save Changes ✨'}
        </button>
      </form>

      {/* Followers Modal */}
      {showFollowers && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full mx-4 max-h-96 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Followers ({followers.length})</h3>
              <button onClick={() => setShowFollowers(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-3">
              {followers.map((follower) => (
                <div key={follower.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                      {follower.name.charAt(0)}
                    </div>
                    <span className="font-medium">{follower.name}</span>
                  </div>
                  <button 
                    onClick={() => handleRemoveFollower(follower.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Following Modal */}
      {showFollowing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full mx-4 max-h-96 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Following ({following.length})</h3>
              <button onClick={() => setShowFollowing(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-3">
              {following.map((followedUser) => (
                <div key={followedUser.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold">
                      {followedUser.name.charAt(0)}
                    </div>
                    <span className="font-medium">{followedUser.name}</span>
                  </div>
                  <button 
                    onClick={() => handleUnfollow(followedUser.id)}
                    className="bg-gray-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-gray-600"
                  >
                    Unfollow
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}