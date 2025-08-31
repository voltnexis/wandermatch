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
  // Remove interests field if it exists since it might not be in the table
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
  // Validate file size (max 5MB)
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    throw new Error('File size must be less than 5MB');
  }

  // Validate file type
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

// Initialize demo data (called from SQL schema)
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
  return data.map(item => ({
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
  return data.map(item => item.follower);
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
    // Check if it's a mutual like (creates a match)
    const { data: mutualLike, error: mutualError } = await supabase
      .from('user_likes')
      .select('id')
      .eq('liker_id', likedId)
      .eq('liked_id', likerId)
      .single();

    if (mutualLike && !mutualError) {
      // Create match
      await createMatch(likerId, likedId);
      
      // Create or update chat room to romantic mode
      const chatRoom = await createChatRoom(likerId, likedId, true);
      console.log('Romantic chat room created:', chatRoom);
    }
  } catch (mutualCheckError) {
    console.error('Error checking mutual like:', mutualCheckError);
    // Continue without creating match if check fails
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

  // Remove match if it exists
  await supabase
    .from('matches')
    .delete()
    .or(`and(user1_id.eq.${likerId},user2_id.eq.${likedId}),and(user1_id.eq.${likedId},user2_id.eq.${likerId})`);
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
  return data.map(item => item.liked);
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

export async function isMutualLike(user1Id: string, user2Id: string) {
  const { data, error } = await supabase
    .from('matches')
    .select('id')
    .or(`and(user1_id.eq.${user1Id},user2_id.eq.${user2Id}),and(user1_id.eq.${user2Id},user2_id.eq.${user1Id})`)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return !!data;
}

// Community functions
export async function createPost(userId: string, content: string, locationTag?: string, imageFile?: File) {
  let imageUrl = null;
  
  if (imageFile) {
    imageUrl = await uploadPostImage(userId, imageFile);
  }
  
  const { data, error } = await supabase
    .from('community_posts')
    .insert([{ user_id: userId, content, location_tag: locationTag, image_url: imageUrl }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function uploadPostImage(userId: string, file: File): Promise<string> {
  // Convert to WebP
  const webpFile = await convertToWebP(file);
  
  const fileName = `${userId}-${Date.now()}.webp`;
  const filePath = `post-images/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('post-images')
    .upload(filePath, webpFile);

  if (uploadError) throw uploadError;

  const { data } = supabase.storage
    .from('post-images')
    .getPublicUrl(filePath);

  return data.publicUrl;
}

async function convertToWebP(file: File): Promise<File> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    const img = new Image();
    
    img.onload = () => {
      // Resize if too large
      const maxWidth = 800;
      const maxHeight = 600;
      let { width, height } = img;
      
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width *= ratio;
        height *= ratio;
      }
      
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob((blob) => {
        const webpFile = new File([blob!], 'image.webp', { type: 'image/webp' });
        resolve(webpFile);
      }, 'image/webp', 0.8);
    };
    
    img.src = URL.createObjectURL(file);
  });
}

export async function getPosts() {
  const { data, error } = await supabase
    .from('community_posts')
    .select(`
      *,
      user:users(*)
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function rateLocation(userId: string, locationName: string, rating: number) {
  const { data, error } = await supabase
    .from('location_ratings')
    .upsert([{ user_id: userId, location_name: locationName, rating }])
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
  
  if (data.length === 0) return { average: 0, count: 0 };
  
  const average = data.reduce((sum, item) => sum + item.rating, 0) / data.length;
  return { average: Math.round(average * 10) / 10, count: data.length };
}

// Chat functions
export async function createChatRoom(user1Id: string, user2Id: string, isRomantic = false) {
  const { data, error } = await supabase
    .from('chat_rooms')
    .upsert([{ 
      participant1_id: user1Id < user2Id ? user1Id : user2Id,
      participant2_id: user1Id < user2Id ? user2Id : user1Id,
      is_romantic: isRomantic,
      romantic_started_by: isRomantic ? user1Id : null,
      romantic_started_at: isRomantic ? new Date().toISOString() : null
    }], {
      onConflict: 'participant1_id,participant2_id'
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function sendChatMessage(chatRoomId: string, senderId: string, content: string) {
  const { data, error } = await supabase
    .from('chat_messages')
    .insert([{ chat_room_id: chatRoomId, sender_id: senderId, content }])
    .select()
    .single();

  if (error) throw error;
  
  // Update last message in chat room
  await supabase
    .from('chat_rooms')
    .update({ last_message: content, last_message_time: new Date().toISOString() })
    .eq('id', chatRoomId);

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
    .or(`participant1_id.eq.${userId},participant2_id.eq.${userId}`);

  if (error) throw error;
  return data;
}

export async function getChatMessages(chatRoomId: string) {
  // Check if 20-day message should be sent
  await checkAndSendTwentyDayMessage(chatRoomId);
  
  const { data, error } = await supabase
    .from('chat_messages')
    .select(`
      *,
      sender:users(*)
    `)
    .eq('chat_room_id', chatRoomId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data;
}

export async function checkAndSendTwentyDayMessage(chatRoomId: string) {
  try {
    // Check if room needs 20-day message
    const { data: room, error: roomError } = await supabase
      .from('chat_rooms')
      .select('*, romantic_starter:users!chat_rooms_romantic_started_by_fkey(name)')
      .eq('id', chatRoomId)
      .eq('is_romantic', true)
      .eq('twenty_day_message_sent', false)
      .single();

    if (roomError || !room) return;

    // Check if 20 days have passed
    const twentyDaysAgo = new Date();
    twentyDaysAgo.setDate(twentyDaysAgo.getDate() - 20);
    
    if (new Date(room.romantic_started_at) <= twentyDaysAgo) {
      // Send system message
      const systemMessage = `${room.romantic_starter.name} has been in romantic mode with you for 20 days 💕`;
      
      await supabase
        .from('chat_messages')
        .insert([{ 
          chat_room_id: chatRoomId, 
          sender_id: null, // System message
          content: systemMessage,
          message_type: 'system'
        }]);

      // Mark as sent
      await supabase
        .from('chat_rooms')
        .update({ twenty_day_message_sent: true })
        .eq('id', chatRoomId);
    }
  } catch (error) {
    console.error('Error checking 20-day message:', error);
  }
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

// Match functions
export async function createMatch(user1Id: string, user2Id: string) {
  const { data, error } = await supabase
    .from('matches')
    .insert([{ 
      user1_id: user1Id, 
      user2_id: user2Id, 
      status: 'matched',
      match_score: 85 
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getMatches(userId: string) {
  const { data, error } = await supabase
    .from('matches')
    .select(`
      *,
      user1:users!matches_user1_id_fkey(*),
      user2:users!matches_user2_id_fkey(*)
    `)
    .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
    .eq('status', 'matched');

  if (error) throw error;
  return data;
}

// User stats
export async function getUserStats(userId: string) {
  const [followersCount, followingCount, likesCount] = await Promise.all([
    supabase.from('user_follows').select('id', { count: 'exact' }).eq('following_id', userId),
    supabase.from('user_follows').select('id', { count: 'exact' }).eq('follower_id', userId),
    supabase.from('user_likes').select('id', { count: 'exact' }).eq('liked_id', userId)
  ]);

  return {
    followers: followersCount.count || 0,
    following: followingCount.count || 0,
    likes: likesCount.count || 0
  };
}

// Get user by ID
export async function getUserById(userId: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data;
}

// Get users who liked the current user
export async function getUsersWhoLikedMe(userId: string) {
  const { data, error } = await supabase
    .from('user_likes')
    .select(`
      liker_id,
      liker:users!user_likes_liker_id_fkey(*)
    `)
    .eq('liked_id', userId);

  if (error) throw error;
  return data.map(item => item.liker);
}

// Update user online status
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

// Update chat room to romantic mode
export async function updateChatRoomToRomantic(chatRoomId: string, startedBy: string) {
  const { data, error } = await supabase
    .from('chat_rooms')
    .update({
      is_romantic: true,
      romantic_started_by: startedBy,
      romantic_started_at: new Date().toISOString()
    })
    .eq('id', chatRoomId)
    .select()
    .single();

  if (error) throw error;
  return data;
}