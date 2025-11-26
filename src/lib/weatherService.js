import { supabase } from './supabaseClient';

// For now, we'll use a hardcoded user ID since auth is disabled
// In production, this would come from the authenticated user
const TEMP_USER_ID = 1;

/**
 * Fetch all favorite cities for the current user
 * Each city is stored as a separate row in the favorite_cities table
 */
export const getFavoriteCities = async () => {
  try {
    const { data, error } = await supabase
      .from('favorite_cities')
      .select('city_name')
      .eq('user_id', TEMP_USER_ID);

    if (error) {
      console.error('Error fetching favorite cities:', error);
      return [];
    }

    // Extract just the city names from the array of objects
    return data.map(row => row.city_name);
  } catch (error) {
    console.error('Error in getFavoriteCities:', error);
    return [];
  }
};

/**
 * Add a city to the user's favorites
 * Inserts a new row in the favorite_cities table
 */
export const addFavoriteCity = async (cityName) => {
  try {
    // Insert the new favorite city
    const { error } = await supabase
      .from('favorite_cities')
      .insert({
        user_id: TEMP_USER_ID,
        city_name: cityName
      });

    if (error) {
      console.error('Error adding favorite city:', error);
      return { success: false, message: `Failed to add city: ${error.message}` };
    }

    return { success: true };
  } catch (error) {
    console.error('Error in addFavoriteCity:', error);
    return { success: false, message: `An error occurred: ${error.message}` };
  }
};

/**
 * Remove a city from the user's favorites
 * Deletes the row from the favorite_cities table
 */
export const removeFavoriteCity = async (cityName) => {
  try {
    const { error } = await supabase
      .from('favorite_cities')
      .delete()
      .eq('user_id', TEMP_USER_ID)
      .eq('city_name', cityName);

    if (error) {
      console.error('Error removing favorite city:', error);
      return { success: false, message: `Failed to remove city: ${error.message}` };
    }

    return { success: true };
  } catch (error) {
    console.error('Error in removeFavoriteCity:', error);
    return { success: false, message: `An error occurred: ${error.message}` };
  }
};
