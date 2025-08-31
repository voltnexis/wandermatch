// Database setup script for WanderMatch
// Run this after setting up your Supabase project

const { createClient } = require('@supabase/supabase-js');

// You'll need to replace these with your actual Supabase credentials
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Service role key for admin operations

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupDatabase() {
  console.log('🚀 Setting up WanderMatch database...');

  try {
    // Create dummy users
    const dummyUsers = [
      {
        id: 'user-1',
        email: 'priya@wandermatch.com',
        name: 'Priya Nair',
        age: 26,
        gender: 'female',
        bio: 'Love exploring Kerala backwaters and hill stations. Looking for travel companions to share amazing experiences!',
        current_city: 'Kochi',
        current_district: 'Ernakulam',
        is_verified: true,
        is_online: true,
        subscription_type: 'wanderer'
      },
      {
        id: 'user-2',
        email: 'arjun@wandermatch.com',
        name: 'Arjun Kumar',
        age: 29,
        gender: 'male',
        bio: 'Local guide from Munnar with 5+ years experience. Can show you the best tea gardens, trekking spots, and hidden gems!',
        current_city: 'Munnar',
        current_district: 'Idukki',
        is_verified: true,
        is_online: true,
        subscription_type: 'guide_pro'
      },
      {
        id: 'user-3',
        email: 'maya@wandermatch.com',
        name: 'Maya Pillai',
        age: 24,
        gender: 'female',
        bio: 'Beach lover from Varkala. Always up for sunset watching, water sports, and coastal adventures!',
        current_city: 'Varkala',
        current_district: 'Thiruvananthapuram',
        is_verified: false,
        is_online: false,
        subscription_type: 'free'
      },
      {
        id: 'user-4',
        email: 'ravi@wandermatch.com',
        name: 'Ravi Menon',
        age: 31,
        gender: 'male',
        bio: 'Professional photographer capturing Kerala\'s beauty. Join me for amazing photo walks and learn photography tips!',
        current_city: 'Alleppey',
        current_district: 'Alappuzha',
        is_verified: true,
        is_online: true,
        subscription_type: 'wanderer'
      },
      {
        id: 'user-5',
        email: 'anjali@wandermatch.com',
        name: 'Anjali Raj',
        age: 27,
        gender: 'female',
        bio: 'Ayurveda enthusiast exploring traditional wellness centers across Kerala. Seeking mindful travel companions.',
        current_city: 'Kovalam',
        current_district: 'Thiruvananthapuram',
        is_verified: true,
        is_online: false,
        subscription_type: 'free'
      }
    ];

    console.log('👥 Creating dummy users...');
    for (const user of dummyUsers) {
      const { error } = await supabase
        .from('users')
        .upsert(user, { onConflict: 'id' });
      
      if (error) {
        console.error(`Error creating user ${user.name}:`, error);
      } else {
        console.log(`✅ Created user: ${user.name}`);
      }
    }

    // Create some sample follows
    console.log('🤝 Creating sample follows...');
    const sampleFollows = [
      { follower_id: 'user-1', following_id: 'user-2' },
      { follower_id: 'user-1', following_id: 'user-4' },
      { follower_id: 'user-2', following_id: 'user-1' },
      { follower_id: 'user-2', following_id: 'user-3' },
      { follower_id: 'user-3', following_id: 'user-4' },
      { follower_id: 'user-4', following_id: 'user-1' },
      { follower_id: 'user-5', following_id: 'user-2' }
    ];

    for (const follow of sampleFollows) {
      const { error } = await supabase
        .from('user_follows')
        .upsert(follow, { onConflict: 'follower_id,following_id' });
      
      if (error) {
        console.error('Error creating follow:', error);
      }
    }

    // Create some sample likes
    console.log('❤️ Creating sample likes...');
    const sampleLikes = [
      { liker_id: 'user-1', liked_id: 'user-2' },
      { liker_id: 'user-2', liked_id: 'user-1' }, // This creates a match
      { liker_id: 'user-1', liked_id: 'user-4' },
      { liker_id: 'user-3', liked_id: 'user-4' },
      { liker_id: 'user-4', liked_id: 'user-3' } // This creates a match
    ];

    for (const like of sampleLikes) {
      const { error } = await supabase
        .from('user_likes')
        .upsert(like, { onConflict: 'liker_id,liked_id' });
      
      if (error) {
        console.error('Error creating like:', error);
      }
    }

    // Create matches for mutual likes
    console.log('💕 Creating matches...');
    const matches = [
      { user1_id: 'user-1', user2_id: 'user-2', status: 'matched', match_score: 92 },
      { user1_id: 'user-3', user2_id: 'user-4', status: 'matched', match_score: 88 }
    ];

    for (const match of matches) {
      const { error } = await supabase
        .from('matches')
        .upsert(match, { onConflict: 'user1_id,user2_id' });
      
      if (error) {
        console.error('Error creating match:', error);
      }
    }

    console.log('✨ Database setup completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`- Created ${dummyUsers.length} users`);
    console.log(`- Created ${sampleFollows.length} follow relationships`);
    console.log(`- Created ${sampleLikes.length} likes`);
    console.log(`- Created ${matches.length} matches`);
    console.log('\n🎉 Your WanderMatch app is ready to use!');

  } catch (error) {
    console.error('❌ Error setting up database:', error);
    process.exit(1);
  }
}

// Run the setup
setupDatabase();