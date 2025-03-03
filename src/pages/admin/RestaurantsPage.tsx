import { useEffect, useState } from 'react';
import { Utensils, MapPin, Phone, Mail, Check, AlertCircle } from 'lucide-react';
import { useRestaurantStore } from '../../store/restaurantStore';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

function AdminRestaurantsPage() {
  const { restaurants, fetchRestaurants, isLoading, error } = useRestaurantStore();
  const [showApproved, setShowApproved] = useState(true);

  useEffect(() => {
    fetchRestaurants();
  }, [fetchRestaurants]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const filteredRestaurants = restaurants.filter(r => r.approved === showApproved);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Restaurants</h1>
        <div className="flex gap-4">
          <Button
            variant={showApproved ? 'primary' : 'outline'}
            onClick={() => setShowApproved(true)}
          >
            Approved
          </Button>
          <Button
            variant={!showApproved ? 'primary' : 'outline'}
            onClick={() => setShowApproved(false)}
          >
            Pending Approval
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            {error}
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="divide-y divide-gray-200">
          {filteredRestaurants.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No {showApproved ? 'approved' : 'pending'} restaurants found
            </div>
          ) : (
            filteredRestaurants.map((restaurant) => (
              <div key={restaurant.id} className="p-6 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold flex items-center gap-2">
                      <Utensils className="h-5 w-5 text-blue-600" />
                      {restaurant.name}
                    </h3>
                    <div className="mt-2 space-y-1 text-gray-600">
                      <p className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {restaurant.address.street}, {restaurant.address.city}, {restaurant.address.state}
                      </p>
                      <p className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        {restaurant.phone}
                      </p>
                      <p className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        {restaurant.email}
                      </p>
                    </div>
                    <p className="mt-3 text-sm text-gray-500">
                      Added on {new Date(restaurant.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {!showApproved && (
                      <Button
                        onClick={() => {/* Implement approve functionality */}}
                        className="flex items-center"
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminRestaurantsPage;