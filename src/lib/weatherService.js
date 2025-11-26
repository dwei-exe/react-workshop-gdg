import { supabase } from './supabaseClient';

// Get the authenticated user's ID from Supabase
const getCurrentUserId = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id;
};

// Fetch all favorite cities for the current user from Supabase
export const getFavoriteCities = async () => {
  const userId = await getCurrentUserId();
  if (!userId) return [];

  const { data, error } = await supabase
    .from('favorite_cities')
    .select('city_name')
    .eq('user_id', userId);

  return error ? [] : data.map(row => row.city_name);
};

// Add a new city to the user's favorites in Supabase
export const addFavoriteCity = async (cityName) => {
  const userId = await getCurrentUserId();
  if (!userId) return { success: false, message: 'Not authenticated' };

  const { error } = await supabase
    .from('favorite_cities')
    .insert({ user_id: userId, city_name: cityName });

  return error 
    ? { success: false, message: error.message } 
    : { success: true };
};

// Remove a city from the user's favorites in Supabase
export const removeFavoriteCity = async (cityName) => {
  const userId = await getCurrentUserId();
  if (!userId) return { success: false, message: 'Not authenticated' };

  const { error } = await supabase
    .from('favorite_cities')
    .delete()
    .eq('user_id', userId)
    .eq('city_name', cityName);

  return error 
    ? { success: false, message: error.message } 
    : { success: true };
};
