'use client';

import { useState, useEffect, useRef } from 'react';
import { MapPin, Star, Send, User, Image as ImageIcon, X } from 'lucide-react';
import { createPost, getPosts, rateLocation, getLocationRating, getUserStats, getUserPosts } from '@/lib/supabase';
import { useAuth } from '@/components/AuthProvider';

interface Post {
  id: string;
  content: string;
  location_tag?: string;
  created_at: string;
  image_url?: string;
  user: {
    id: string;
    name: string;
    profile_image_url?: string;
    current_city: string;
    current_district: string;
  };
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
      <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto">
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
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{profileUser.name}</h2>
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
            <div className="text-center">
              <div className="text-xl font-bold text-gray-800">{userPosts.length}</div>
              <div className="text-sm text-gray-600">Posts</div>
            </div>
          </div>
          
          {userPosts.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-800 mb-3">Recent Posts</h3>
              <div className="space-y-3 max-h-40 overflow-y-auto">
                {userPosts.slice(0, 3).map((post) => (
                  <div key={post.id} className="bg-gray-50 rounded-lg p-3 text-left">
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

function LocationRating({ locationName }: { locationName: string }) {
  const { user } = useAuth();
  const [rating, setRating] = useState({ average: 0, count: 0 });
  const [userRating, setUserRating] = useState(0);

  useEffect(() => {
    loadRating();
  }, [locationName]);

  const loadRating = async () => {
    try {
      const data = await getLocationRating(locationName);
      setRating(data);
    } catch (error) {
      console.error('Error loading rating:', error);
    }
  };

  const handleRate = async (stars: number) => {
    if (!user?.id) return;
    
    try {
      await rateLocation(user.id, locationName, stars);
      setUserRating(stars);
      loadRating();
    } catch (error) {
      console.error('Error rating location:', error);
    }
  };

  return (
    <div className="flex items-center gap-2 text-sm">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => handleRate(star)}
            className={`text-lg ${star <= rating.average ? 'text-yellow-400' : 'text-gray-300'} hover:text-yellow-400`}
          >
            ★
          </button>
        ))}
      </div>
      <span className="text-gray-600">
        {rating.average.toFixed(1)} ({rating.count} ratings)
      </span>
    </div>
  );
}

export default function CommunityFeed() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState('');
  const [locationTag, setLocationTag] = useState('');
  const [selectedProfile, setSelectedProfile] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const data = await getPosts();
      setPosts(data);
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async () => {
    if (!user?.id || !newPost.trim()) return;

    try {
      await createPost(user.id, newPost, locationTag || undefined, selectedImage || undefined);
      setNewPost('');
      setLocationTag('');
      setSelectedImage(null);
      setImagePreview(null);
      loadPosts();
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post');
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be less than 5MB');
      return;
    }

    setSelectedImage(file);
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-3xl p-6 animate-pulse">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-3 bg-gray-300 rounded w-1/2"></div>
              </div>
            </div>
            <div className="h-20 bg-gray-300 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Create Post */}
      <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-xl p-6">
        <h3 className="text-xl font-bold mb-4">Share with Community</h3>
        <div className="space-y-4">
          <textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="Share your travel experience..."
            className="w-full p-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
            rows={3}
          />
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={locationTag}
                onChange={(e) => setLocationTag(e.target.value)}
                placeholder="Tag a location (optional)"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="bg-gray-500 text-white px-4 py-3 rounded-xl hover:bg-gray-600 flex items-center gap-2"
              >
                <ImageIcon className="w-4 h-4" />
                Image
              </button>
              <button
                onClick={handleCreatePost}
                disabled={!newPost.trim()}
                className="bg-gradient-to-r from-primary-500 to-accent-500 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300 flex items-center gap-2 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                Post
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />
          </div>
          
          {imagePreview && (
            <div className="mt-4 relative">
              <img src={imagePreview} alt="Preview" className="max-w-full h-32 object-cover rounded-lg" />
              <button
                onClick={removeImage}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Posts Feed */}
      <div className="space-y-6">
        {posts.map((post) => (
          <div key={post.id} className="bg-white/90 backdrop-blur-md rounded-3xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <button
                onClick={() => setSelectedProfile(post.user)}
                className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-r from-primary-500 to-accent-500 p-1 hover:scale-105 transition-transform"
              >
                <div className="w-full h-full rounded-full overflow-hidden bg-white">
                  {post.user.profile_image_url ? (
                    <img src={post.user.profile_image_url} alt={post.user.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-primary-500 text-lg font-bold">
                      {post.user.name.charAt(0)}
                    </div>
                  )}
                </div>
              </button>
              <div className="flex-1">
                <button
                  onClick={() => setSelectedProfile(post.user)}
                  className="font-semibold text-gray-800 hover:text-primary-600 transition-colors"
                >
                  {post.user.name}
                </button>
                <p className="text-sm text-gray-600">{post.user.current_city}, {post.user.current_district}</p>
                <p className="text-xs text-gray-500">{new Date(post.created_at).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-gray-800 leading-relaxed">{post.content}</p>
              {(post as any).image_url && (
                <img 
                  src={(post as any).image_url} 
                  alt="Post image" 
                  className="w-full max-h-64 object-cover rounded-lg mt-3 cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => setEnlargedImage((post as any).image_url || null)}
                />
              )}
            </div>

            {post.location_tag && (
              <div className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-2xl p-4 border border-primary-200">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4 text-primary-600" />
                  <span className="font-semibold text-primary-800">{post.location_tag}</span>
                </div>
                <LocationRating locationName={post.location_tag} />
              </div>
            )}
          </div>
        ))}

        {posts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg">No posts yet</div>
            <p className="text-gray-500 mt-2">Be the first to share your travel experience!</p>
          </div>
        )}
      </div>

      {selectedProfile && (
        <ViewProfile 
          user={selectedProfile} 
          onClose={() => setSelectedProfile(null)} 
        />
      )}
      
      {enlargedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 cursor-pointer"
          onClick={() => setEnlargedImage(null)}
        >
          <img 
            src={enlargedImage} 
            alt="Enlarged" 
            className="max-w-[90vw] max-h-[90vh] object-contain"
          />
        </div>
      )}
    </div>
  );
}
