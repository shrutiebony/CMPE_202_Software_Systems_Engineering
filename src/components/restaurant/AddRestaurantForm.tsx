import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import Button from '../ui/Button';
import { MapPin, Phone, Mail, Globe, UtensilsCrossed, Clock, DollarSign } from 'lucide-react';

interface RestaurantFormData {
  name: string;
  description: string;
  cuisine: string[];
  priceRange: number;
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
  phone: string;
  email: string;
  website?: string;
  features: string[];
  hours: {
    [key: string]: { open: string; close: string; isClosed: boolean };
  };
}

const CUISINE_OPTIONS = [
  'American', 'Italian', 'Japanese', 'Chinese', 'Mexican', 
  'Thai', 'Indian', 'French', 'Mediterranean', 'Vegan',
  'Seafood', 'Steakhouse', 'Pizza', 'Sushi', 'BBQ'
];

const FEATURE_OPTIONS = [
  'Outdoor Seating', 'Takeout', 'Delivery', 'Vegetarian Options',
  'Vegan Options', 'Gluten-Free Options', 'Full Bar', 'Wine Bar',
  'Private Dining', 'Wheelchair Accessible', 'Free WiFi', 'Live Music',
  'Family Friendly', 'Pet Friendly', 'Romantic', 'Business Casual'
];

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

const initialHours = DAYS.reduce((acc, day) => ({
  ...acc,
  [day]: { open: '09:00', close: '22:00', isClosed: false }
}), {});

function AddRestaurantForm() {
  const [formData, setFormData] = useState<RestaurantFormData>({
    name: '',
    description: '',
    cuisine: [],
    priceRange: 2,
    streetAddress: '',
    city: '',
    state: '',
    postalCode: '',
    phone: '',
    email: '',
    website: '',
    features: [],
    hours: initialHours
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Get current user's session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;

      if (!session?.user) {
        throw new Error('You must be logged in to submit a restaurant');
      }

      // First, create the restaurant
      const { data: restaurant, error: restaurantError } = await supabase
        .from('restaurants')
        .insert([{
          name: formData.name,
          description: formData.description,
          cuisine: formData.cuisine,
          price_range: formData.priceRange,
          street_address: formData.streetAddress,
          city: formData.city,
          state: formData.state,
          postal_code: formData.postalCode,
          phone: formData.phone,
          email: formData.email,
          website: formData.website || null,
          features: formData.features,
          images: [
            'https://images.pexels.com/photos/67468/pexels-photo-67468.jpeg',
            'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg',
            'https://images.pexels.com/photos/941861/pexels-photo-941861.jpeg'
          ],
          owner_id: session.user.id,
          approved: false
        }])
        .select()
        .single();

      if (restaurantError) throw restaurantError;

      // Then, create the restaurant hours
      const hoursData = Object.entries(formData.hours).map(([day, hours]) => ({
        restaurant_id: restaurant.id,
        day,
        open_time: hours.open,
        close_time: hours.close,
        is_closed: hours.isClosed
      }));

      const { error: hoursError } = await supabase
        .from('restaurant_hours')
        .insert(hoursData);

      if (hoursError) throw hoursError;

      setSuccess(true);
      setFormData({
        name: '',
        description: '',
        cuisine: [],
        priceRange: 2,
        streetAddress: '',
        city: '',
        state: '',
        postalCode: '',
        phone: '',
        email: '',
        website: '',
        features: [],
        hours: initialHours
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit restaurant');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <UtensilsCrossed className="h-12 w-12 text-green-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-green-900 mb-2">
          Restaurant Submitted Successfully!
        </h3>
        <p className="text-green-700 mb-4">
          Your restaurant has been submitted for review. Our admin team will review and approve it shortly.
        </p>
        <Button onClick={() => setSuccess(false)}>Submit Another Restaurant</Button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold mb-6">Submit Your Restaurant</h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Restaurant Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full rounded-md"
                placeholder="Enter restaurant name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price Range *
              </label>
              <select
                value={formData.priceRange}
                onChange={(e) => setFormData(prev => ({ ...prev, priceRange: parseInt(e.target.value) }))}
                className="w-full rounded-md"
              >
                <option value={1}>$ (Under $15)</option>
                <option value={2}>$$ ($15-$30)</option>
                <option value={3}>$$$ ($31-$60)</option>
                <option value={4}>$$$$ (Above $60)</option>
              </select>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full rounded-md"
              placeholder="Tell us about your restaurant..."
            />
          </div>
        </div>

        {/* Cuisine Selection */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Cuisine Types *</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {CUISINE_OPTIONS.map((cuisine) => (
              <label key={cuisine} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.cuisine.includes(cuisine)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFormData(prev => ({
                        ...prev,
                        cuisine: [...prev.cuisine, cuisine]
                      }));
                    } else {
                      setFormData(prev => ({
                        ...prev,
                        cuisine: prev.cuisine.filter(c => c !== cuisine)
                      }));
                    }
                  }}
                  className="rounded text-primary-600"
                />
                <span className="text-sm">{cuisine}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Contact Information */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number *
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full pl-10 rounded-md"
                  placeholder="(555) 555-5555"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full pl-10 rounded-md"
                  placeholder="restaurant@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Website
              </label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                  className="w-full pl-10 rounded-md"
                  placeholder="https://example.com"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Address */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Address</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Street Address *
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  required
                  value={formData.streetAddress}
                  onChange={(e) => setFormData(prev => ({ ...prev, streetAddress: e.target.value }))}
                  className="w-full pl-10 rounded-md"
                  placeholder="123 Restaurant Street"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City *
              </label>
              <input
                type="text"
                required
                value={formData.city}
                onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                className="w-full rounded-md"
                placeholder="City"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                State *
              </label>
              <input
                type="text"
                required
                value={formData.state}
                onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                className="w-full rounded-md"
                placeholder="State"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Postal Code *
              </label>
              <input
                type="text"
                required
                value={formData.postalCode}
                onChange={(e) => setFormData(prev => ({ ...prev, postalCode: e.target.value }))}
                className="w-full rounded-md"
                placeholder="12345"
              />
            </div>
          </div>
        </div>

        {/* Operating Hours */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Operating Hours</h3>
          <div className="space-y-4">
            {DAYS.map((day) => (
              <div key={day} className="flex items-center space-x-4">
                <div className="w-24">
                  <span className="capitalize">{day}</span>
                </div>
                <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4 items-center">
                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-sm text-gray-600 mb-1">Opens</label>
                    <input
                      type="time"
                      value={formData.hours[day].open}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        hours: {
                          ...prev.hours,
                          [day]: { ...prev.hours[day], open: e.target.value }
                        }
                      }))}
                      className="w-full rounded-md"
                      disabled={formData.hours[day].isClosed}
                    />
                  </div>
                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-sm text-gray-600 mb-1">Closes</label>
                    <input
                      type="time"
                      value={formData.hours[day].close}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        hours: {
                          ...prev.hours,
                          [day]: { ...prev.hours[day], close: e.target.value }
                        }
                      }))}
                      className="w-full rounded-md"
                      disabled={formData.hours[day].isClosed}
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.hours[day].isClosed}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          hours: {
                            ...prev.hours,
                            [day]: { ...prev.hours[day], isClosed: e.target.checked }
                          }
                        }))}
                        className="rounded text-primary-600"
                      />
                      <span className="text-sm text-gray-600">Closed</span>
                    </label>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Features & Amenities</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {FEATURE_OPTIONS.map((feature) => (
              <label key={feature} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.features.includes(feature)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFormData(prev => ({
                        ...prev,
                        features: [...prev.features, feature]
                      }));
                    } else {
                      setFormData(prev => ({
                        ...prev,
                        features: prev.features.filter(f => f !== feature)
                      }));
                    }
                  }}
                  className="rounded text-primary-600"
                />
                <span className="text-sm">{feature}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <Button
            type="submit"
            disabled={isSubmitting}
            fullWidth
          >
            {isSubmitting ? 'Submitting...' : 'Submit Restaurant'}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default AddRestaurantForm;