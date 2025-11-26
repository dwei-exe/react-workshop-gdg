import { supabase } from './supabaseClient';

// For now, we'll use a hardcoded user ID since auth is disabled
// In production, this would come from the authenticated user
const TEMP_USER_ID = 1;

/**
 * Fetch all favorite cities for the current user
 */
export const getFavoriteCities = async () => {
  try {
    const { data, error } = await supabase
      .from('weather-auth')
      .select('favourite_cities')
      .eq('id', TEMP_USER_ID)
      .single();

    if (error) {
      console.error('Error fetching favorite cities:', error);
      return [];
    }

    console.log('Raw data from Supabase:', data);
    console.log('favourite_cities type:', typeof data?.favourite_cities);
    console.log('favourite_cities value:', data?.favourite_cities);

    // Handle different possible formats of the data
    let cities = data?.favourite_cities;
    
    // If it's null or undefined, return empty array
    if (!cities) {
      return [];
    }
    
    // If it's a string, try to parse it as JSON
    if (typeof cities === 'string') {
      try {
        cities = JSON.parse(cities);
      } catch (e) {
        console.error('Failed to parse favourite_cities as JSON:', e);
        return [];
      }
    }
    
    return cities;
  } catch (error) {
    console.error('Error in getFavoriteCities:', error);
    return [];
  }
};

/**
 * Add a city to the user's favorites
 */
export const addFavoriteCity = async (cityName) => {
  try {
    console.log('Adding city:', cityName);
    
    // First, get current favorites
    const currentFavorites = await getFavoriteCities();
    
    // Check if city already exists (case-insensitive)
    if (currentFavorites.some(city => city.toLowerCase() === cityName.toLowerCase())) {
      console.log('City already in favorites');
      return { success: false, message: 'City already in favorites' };
    }

    // Add new city to the array
    const updatedFavorites = [...currentFavorites, cityName];

    // Update the database
    const { error } = await supabase
      .from('weather-auth')
      .update({ favourite_cities: updatedFavorites })
      .eq('id', TEMP_USER_ID)
      .select();

    if (error) {
      console.error('Error adding favorite city:', error);
      return { success: false, message: `Failed to add city: ${error.message}` };
    }

    return { success: true, favorites: updatedFavorites };
  } catch (error) {
    console.error('Error in addFavoriteCity:', error);
    console.error('Error stack:', error.stack);
    return { success: false, message: `An error occurred: ${error.message}` };
  }
};

/**
 * Remove a city from the user's favorites
 */
export const removeFavoriteCity = async (cityName) => {
  try {
    console.log('Removing city:', cityName);
    
    // Get current favorites
    const currentFavorites = await getFavoriteCities();
    
    // Remove the city (case-insensitive)
    const updatedFavorites = currentFavorites.filter(
      city => city.toLowerCase() !== cityName.toLowerCase()
    );

    // Update the database
    const { error } = await supabase
      .from('weather-auth')
      .update({ favourite_cities: updatedFavorites })
      .eq('id', TEMP_USER_ID)
      .select();

    if (error) {
      console.error('Error removing favorite city:', error);
      return { success: false, message: `Failed to remove city: ${error.message}` };
    }


    return { success: true, favorites: updatedFavorites };
  } catch (error) {
    console.error('Error in removeFavoriteCity:', error);
    return { success: false, message: `An error occurred: ${error.message}` };
  }
};
