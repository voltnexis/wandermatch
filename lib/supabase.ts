import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env.local file.')
}

if (supabaseUrl.includes('your_supabase_project_url_here')) {
  throw new Error('Please update your Supabase URL in .env.local with your actual project URL')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Auth helper
export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  
  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();
    
  return profile;
}

// Types
export interface User {
  id: string
  email: string
  name: string
  age?: number
  gender?: string
  bio?: string
  profile_image_url?: string
  current_city?: string
  current_district?: string
  is_verified: boolean
  is_online: boolean
  last_seen?: string
  subscription_type: 'free' | 'wanderer' | 'guide_pro'
  location?: {
    lat: number
    lng: number
  }
}

export interface TravelPlan {
  id: string
  user_id: string
  destination: string
  district: string
  start_date: string
  end_date: string
  travel_type?: string
  description?: string
  is_active: boolean
}

export interface KeralLocation {
  id: string
  name: string
  district: string
  type: 'backwater' | 'hillstation' | 'beach' | 'cultural'
  description: string
  coordinates: {
    lat: number
    lng: number
  }
  image_url?: string
  virtual_tour_url?: string
  is_featured: boolean
}

// User functions
export const getUsers = async () => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('is_online', { ascending: false })
  
  if (error) throw error
  return data as User[]
}

export const getUsersByDistrict = async (district: string) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('current_district', district)
  
  if (error) throw error
  return data as User[]
}

export const updateUserLocation = async (userId: string, lat: number, lng: number, city: string, district: string) => {
  const { error } = await supabase
    .from('users')
    .update({
      location: `POINT(${lng} ${lat})`,
      current_city: city,
      current_district: district,
      is_online: true,
      last_seen: new Date().toISOString()
    })
    .eq('id', userId)
  
  if (error) throw error
}

// Kerala locations
export const getKeralaLocations = async (filters?: { type?: string; district?: string }) => {
  let query = supabase
    .from('kerala_locations')
    .select('*')
    .order('is_featured', { ascending: false })
  
  if (filters?.type && filters.type !== 'all') {
    query = query.eq('type', filters.type)
  }
  
  if (filters?.district && filters.district !== 'all') {
    query = query.eq('district', filters.district)
  }
  
  const { data, error } = await query
  if (error) throw error
  return data as KeralLocation[]
}

export const getLocationsByType = async (type: string) => {
  const { data, error } = await supabase
    .from('kerala_locations')
    .select('*')
    .eq('type', type)
  
  if (error) throw error
  return data as KeralLocation[]
}

// Travel plans
export const getTravelPlans = async (userId: string) => {
  const { data, error } = await supabase
    .from('travel_plans')
    .select('*')
    .eq('user_id', userId)
    .eq('is_active', true)
  
  if (error) throw error
  return data as TravelPlan[]
}

export const createTravelPlan = async (plan: any) => {
  const { data, error } = await supabase
    .from('travel_plans')
    .insert([plan])
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function addLocationToTravelPlan(userId: string, locationName: string, district: string) {
  const plan = {
    user_id: userId,
    destination: locationName,
    district: district,
    start_date: new Date().toISOString().split('T')[0],
    end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    travel_type: 'leisure',
    description: `Visit ${locationName}`,
    is_active: true
  }
  
  return await createTravelPlan(plan)
}

export async function updateUserProfile(userId: string, updates: any) {
  const { interests, ...cleanUpdates } = updates;
  
  const { data, error } = await supabase
    .from('users')
    .update(cleanUpdates)
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function uploadProfileImage(userId: string, file: File): Promise<string> {
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    throw new Error('File size must be less than 5MB');
  }

  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Only JPEG, PNG, and WebP images are allowed');
  }

  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}-${Date.now()}.${fileExt}`;
  const filePath = `profile-images/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('profile-images')
    .upload(filePath, file);

  if (uploadError) throw uploadError;

  const { data } = supabase.storage
    .from('profile-images')
    .getPublicUrl(filePath);

  return data.publicUrl;
}

export async function getAllUsers() {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function initializeDemoData() {
  try {
    const { error } = await supabase.rpc('create_demo_users');
    if (error) throw error;
  } catch (error) {
    console.error('Error initializing demo data:', error);
  }
}

// Follow/Unfollow functions
export async function followUser(followerId: string, followingId: string) {
  const { data, error } = await supabase
    .from('user_follows')
    .insert([{ follower_id: followerId, following_id: followingId }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function unfollowUser(followerId: string, followingId: string) {
  const { error } = await supabase
    .from('user_follows')
    .delete()
    .eq('follower_id', followerId)
    .eq('following_id', followingId);

  if (error) throw error;
}

export async function getFollowing(userId: string) {
  const { data, error } = await supabase
    .from('user_follows')
    .select(`
      following_id,
      following:users!user_follows_following_id_fkey(*)
    `)
    .eq('follower_id', userId);

  if (error) throw error;
  return data.map((item: any) => ({
    ...item.following,
    is_online: item.following.is_online || false
  }));
}

export async function getFollowers(userId: string) {
  const { data, error } = await supabase
    .from('user_follows')
    .select(`
      follower_id,
      follower:users!user_follows_follower_id_fkey(*)
    `)
    .eq('following_id', userId);

  if (error) throw error;
  return data.map((item: any) => item.follower);
}

export async function isFollowing(followerId: string, followingId: string) {
  const { data, error } = await supabase
    .from('user_follows')
    .select('id')
    .eq('follower_id', followerId)
    .eq('following_id', followingId)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return !!data;
}

// Like/Unlike functions
export async function likeUser(likerId: string, likedId: string) {
  const { data, error } = await supabase
    .from('user_likes')
    .insert([{ liker_id: likerId, liked_id: likedId }])
    .select()
    .single();

  if (error) throw error;
  
  try {
    const { data: mutualLike, error: mutualError } = await supabase
      .from('user_likes')
      .select('id')
      .eq('liker_id', likedId)
      .eq('liked_id', likerId)
      .single();

    if (mutualLike && !mutualError) {
      await createMatch(likerId, likedId);
      const chatRoom = await createChatRoom(likerId, likedId, true);
      console.log('Romantic chat room created:', chatRoom);
    }
  } catch (mutualCheckError) {
    console.error('Error checking mutual like:', mutualCheckError);
  }

  return data;
}

export async function unlikeUser(likerId: string, likedId: string) {
  const { error } = await supabase
    .from('user_likes')
    .delete()
    .eq('liker_id', likerId)
    .eq('liked_id', likedId);

  if (error) throw error;

  await supabase
    .from('matches')
    .delete()
    .or(`and(user1_id.eq.${likerId},user2_id.eq.${likedId}),and(user1_id.eq.${likedId},user2_id.eq.${likerId})`);
}

export async function isLiked(likerId: string, likedId: string) {
  const { data, error } = await supabase
    .from('user_likes')
    .select('id')
    .eq('liker_id', likerId)
    .eq('liked_id', likedId)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return !!data;
}

export async function getLikedUsers(userId: string) {
  const { data, error } = await supabase
    .from('user_likes')
    .select(`
      liked_id,
      liked:users!user_likes_liked_id_fkey(*)
    `)
    .eq('liker_id', userId);

  if (error) throw error;
  return data.map((item: any) => item.liked);
}

export async function getUsersWhoLikedMe(userId: string) {
  const { data, error } = await supabase
    .from('user_likes')
    .select(`
      liker_id,
      liker:users!user_likes_liker_id_fkey(*)
    `)
    .eq('liked_id', userId);

  if (error) throw error;
  return data.map((item: any) => item.liker);
}

// Match functions
export async function createMatch(user1Id: string, user2Id: string) {
  const { data, error } = await supabase
    .from('matches')
    .insert([{ user1_id: user1Id, user2_id: user2Id }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Chat functions
export async function createChatRoom(user1Id: string, user2Id: string, isRomantic: boolean = false) {
  const { data: existingRoom } = await supabase
    .from('chat_rooms')
    .select('*')
    .or(`and(participant1_id.eq.${user1Id},participant2_id.eq.${user2Id}),and(participant1_id.eq.${user2Id},participant2_id.eq.${user1Id})`)
    .single();

  if (existingRoom) {
    if (isRomantic && !existingRoom.is_romantic) {
      const { data, error } = await supabase
        .from('chat_rooms')
        .update({ is_romantic: true })
        .eq('id', existingRoom.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    }
    return existingRoom;
  }

  const { data, error } = await supabase
    .from('chat_rooms')
    .insert([{
      participant1_id: user1Id,
      participant2_id: user2Id,
      is_romantic: isRomantic
    }])
    .select(`
      *,
      participant1:users!chat_rooms_participant1_id_fkey(*),
      participant2:users!chat_rooms_participant2_id_fkey(*)
    `)
    .single();

  if (error) throw error;
  return data;
}

export async function getChatRooms(userId: string) {
  const { data, error } = await supabase
    .from('chat_rooms')
    .select(`
      *,
      participant1:users!chat_rooms_participant1_id_fkey(*),
      participant2:users!chat_rooms_participant2_id_fkey(*)
    `)
    .or(`participant1_id.eq.${userId},participant2_id.eq.${userId}`)
    .order('last_message_time', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getChatMessages(roomId: string) {
  const { data, error } = await supabase
    .from('chat_messages')
    .select(`
      *,
      sender:users!chat_messages_sender_id_fkey(*)
    `)
    .eq('chat_room_id', roomId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data;
}

export async function sendChatMessage(roomId: string, senderId: string, content: string) {
  const { data, error } = await supabase
    .from('chat_messages')
    .insert([{
      chat_room_id: roomId,
      sender_id: senderId,
      content: content
    }])
    .select()
    .single();

  if (error) throw error;

  await supabase
    .from('chat_rooms')
    .update({
      last_message: content,
      last_message_time: new Date().toISOString()
    })
    .eq('id', roomId);

  return data;
}

// Community functions
export async function createPost(userId: string, content: string, locationTag?: string, image?: File) {
  let imageUrl = null;
  
  if (image) {
    const fileExt = image.name.split('.').pop();
    const fileName = `${userId}-${Date.now()}.${fileExt}`;
    const filePath = `post-images/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('post-images')
      .upload(filePath, image);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('post-images')
      .getPublicUrl(filePath);

    imageUrl = data.publicUrl;
  }

  const { data, error } = await supabase
    .from('community_posts')
    .insert([{
      user_id: userId,
      content: content,
      location_tag: locationTag,
      image_url: imageUrl
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getPosts() {
  const { data, error } = await supabase
    .from('community_posts')
    .select(`
      *,
      user:users!community_posts_user_id_fkey(*)
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getUserPosts(userId: string) {
  const { data, error } = await supabase
    .from('community_posts')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getUserStats(userId: string) {
  const [followersResult, followingResult] = await Promise.all([
    supabase.from('user_follows').select('id').eq('following_id', userId),
    supabase.from('user_follows').select('id').eq('follower_id', userId)
  ]);

  console.log('getUserStats debug:', {
    userId,
    followersResult: followersResult.data,
    followingResult: followingResult.data,
    followersError: followersResult.error,
    followingError: followingResult.error
  });

  return {
    followers: followersResult.data?.length || 0,
    following: followingResult.data?.length || 0,
    likes: 0
  };
}

// Location rating functions
export async function rateLocation(userId: string, locationName: string, rating: number) {
  const { data, error } = await supabase
    .from('location_ratings')
    .upsert([{
      user_id: userId,
      location_name: locationName,
      rating: rating
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getLocationRating(locationName: string) {
  const { data, error } = await supabase
    .from('location_ratings')
    .select('rating')
    .eq('location_name', locationName);

  if (error) throw error;
  
  if (!data || data.length === 0) {
    return { average: 0, count: 0 };
  }

  const ratings = data.map((r: any) => r.rating);
  const average = ratings.reduce((sum: number, rating: number) => sum + rating, 0) / ratings.length;
  
  return {
    average: Math.round(average * 10) / 10,
    count: ratings.length
  };
}

// Additional required functions
export async function updateOnlineStatus(userId: string, isOnline: boolean) {
  const { error } = await supabase
    .from('users')
    .update({ 
      is_online: isOnline, 
      last_seen: new Date().toISOString() 
    })
    .eq('id', userId);

  if (error) throw error;
}

export async function getUserById(userId: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data;
}

// Real-time online status
export async function setUserOnline(userId: string) {
  const { error } = await supabase
    .from('users')
    .update({ 
      is_online: true, 
      last_seen: new Date().toISOString() 
    })
    .eq('id', userId);

  if (error) throw error;
}

export async function setUserOffline(userId: string) {
  const { error } = await supabase
    .from('users')
    .update({ 
      is_online: false, 
      last_seen: new Date().toISOString() 
    })
    .eq('id', userId);

  if (error) throw error;
}

// Check if user was recently online (within 5 minutes)
export function isRecentlyOnline(lastSeen: string): boolean {
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
  return new Date(lastSeen) > fiveMinutesAgo;
}

export async function isMutualLike(user1Id: string, user2Id: string) {
  const [like1, like2] = await Promise.all([
    supabase.from('user_likes').select('id').eq('liker_id', user1Id).eq('liked_id', user2Id).single(),
    supabase.from('user_likes').select('id').eq('liker_id', user2Id).eq('liked_id', user1Id).single()
  ]);

  return !!(like1.data && like2.data);
}
