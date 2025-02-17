const { createClient } = require('@supabase/supabase-js');
const { SUPABASE_URL, SUPABASE_KEY } = require('../config');

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Supabase configuration is missing!');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const getSubscription = async (userId) => {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    console.error('Error fetching subscription:', error);
    return null;
  }

  return data;
};

const createSubscription = async (userId, plan, expiresAt) => {
  const { data, error } = await supabase
    .from('subscriptions')
    .upsert({
      user_id: userId,
      plan: plan,
      status: 'active',
      expires_at: expiresAt,
      updated_at: new Date().toISOString()
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating subscription:', error);
    return null;
  }

  return data;
};

module.exports = {
  supabase,
  getSubscription,
  createSubscription
};