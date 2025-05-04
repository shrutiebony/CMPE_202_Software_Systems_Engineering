import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Calendar, Clock, Users, MapPin, Search } from 'lucide-react';
import { getTodayString } from '../../utils/dateUtils';
import { useRestaurantStore } from '../../store/restaurantStore';

function SearchBar() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { restaurants } = useRestaurantStore();
  
  const [date, setDate] = useState(searchParams.get('date') || getTodayString());
  const [time, setTime] = useState(searchParams.get('time') || '19:00');
  const [people, setPeople] = useState(parseInt(searchParams.get('people') || '2'));
  const [searchTerm, setSearchTerm] = useState(searchParams.get('location') || searchParams.get('cuisine') || '');

  // Get unique cuisines from all restaurants
  const cuisines = [...new Set(restaurants.flatMap(r => r.cuisine))].sort();
  
  useEffect(() => {
    // Build query params
    const params = new URLSearchParams();
    params.append('date', date);
    params.append('time', time);
    params.append('people', people.toString());
    
    if (searchTerm) {
      // Check if the search term matches a cuisine
      const matchedCuisine = cuisines.find(
        cuisine => cuisine.toLowerCase() === searchTerm.toLowerCase()
      );
      
      if (matchedCuisine) {
        params.append('cuisine', matchedCuisine);
      } else {
        params.append('location', searchTerm);
      }
    }
    
    navigate(`/search?${params.toString()}`, { replace: true });
  }, [date, time, people, searchTerm, navigate, cuisines]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };
  
  return (
    <form 
      onSubmit={handleSubmit}
      className="bg-white rounded-lg shadow-md p-4 flex flex-col md:flex-row md:items-center gap-3"
    >
      <div className="flex items-center flex-1">
        <Calendar className="h-5 w-5 text-gray-400 mr-2" />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          min={getTodayString()}
          className="flex-1 border-0 focus:ring-0 text-gray-700 bg-transparent"
        />
      </div>
      
      <div className="flex items-center">
        <Clock className="h-5 w-5 text-gray-400 mr-2" />
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="border-0 focus:ring-0 text-gray-700 bg-transparent py-1"
          step="1800"
        />
      </div>
      
      <div className="flex items-center">
        <Users className="h-5 w-5 text-gray-400 mr-2" />
        <input
          type="number"
          min="1"
          max="12"
          value={people}
          onChange={(e) => setPeople(parseInt(e.target.value))}
          className="border-0 focus:ring-0 text-gray-700 bg-transparent py-1 w-16"
        />
      </div>
      
      <div className="flex items-center flex-1">
        <MapPin className="h-5 w-5 text-gray-400 mr-2" />
        <input
          type="text"
          placeholder="Location, Restaurant, or Cuisine"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 border-0 focus:ring-0 text-gray-700 bg-transparent"
        />
      </div>
      
      <button
        type="submit"
        className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 transition-colors flex items-center justify-center"
      >
        <Search className="h-5 w-5 md:mr-2" />
        <span className="hidden md:inline">Search</span>
      </button>
    </form>
  );
}

export default SearchBar;