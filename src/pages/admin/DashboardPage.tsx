import { useEffect, useState } from 'react';
import { BarChart3, Users, UtensilsCrossed, Calendar } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

interface AnalyticsData {
  totalBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  noShowBookings: number;
  totalRevenue: number;
  averagePartySize: number;
}

interface DailyBookings {
  date: string;
  count: number;
}

function AdminDashboardPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [dailyBookings, setDailyBookings] = useState<DailyBookings[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        // Get last 30 days bookings
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const { data: bookings, error } = await supabase
          .from('bookings')
          .select('*')
          .gte('date', thirtyDaysAgo.toISOString().split('T')[0]);

        if (error) throw error;

        // Calculate analytics
        const analytics: AnalyticsData = {
          totalBookings: bookings.length,
          completedBookings: bookings.filter(b => b.status === 'completed').length,
          cancelledBookings: bookings.filter(b => b.status === 'cancelled').length,
          noShowBookings: bookings.filter(b => b.status === 'no_show').length,
          totalRevenue: bookings
            .filter(b => b.status === 'completed')
            .reduce((sum, b) => sum + (b.party_size * 30), 0), // Assuming $30 per person
          averagePartySize: bookings.length > 0 
            ? bookings.reduce((sum, b) => sum + b.party_size, 0) / bookings.length 
            : 0
        };

        // Calculate daily bookings
        const dailyCount = bookings.reduce((acc: Record<string, number>, booking) => {
          const date = booking.date;
          acc[date] = (acc[date] || 0) + 1;
          return acc;
        }, {});

        const dailyBookings = Object.entries(dailyCount)
          .map(([date, count]) => ({ date, count }))
          .sort((a, b) => a.date.localeCompare(b.date));

        setAnalytics(analytics);
        setDailyBookings(dailyBookings);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching analytics:', error);
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Total Bookings</h3>
            <Calendar className="h-6 w-6 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{analytics?.totalBookings}</p>
          <p className="text-sm text-gray-600 mt-2">Last 30 days</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Completion Rate</h3>
            <BarChart3 className="h-6 w-6 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {analytics && ((analytics.completedBookings / analytics.totalBookings) * 100).toFixed(1)}%
          </p>
          <p className="text-sm text-gray-600 mt-2">
            {analytics?.completedBookings} completed bookings
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Total Revenue</h3>
            <Users className="h-6 w-6 text-purple-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">
            ${analytics?.totalRevenue.toLocaleString()}
          </p>
          <p className="text-sm text-gray-600 mt-2">
            Avg. party size: {analytics?.averagePartySize.toFixed(1)}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">No-shows</h3>
            <UtensilsCrossed className="h-6 w-6 text-red-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{analytics?.noShowBookings}</p>
          <p className="text-sm text-gray-600 mt-2">
            {analytics && ((analytics.noShowBookings / analytics.totalBookings) * 100).toFixed(1)}% of bookings
          </p>
        </div>
      </div>

      {/* Bookings Chart */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-6">Daily Bookings</h2>
        <div className="h-64">
          <div className="flex h-full items-end space-x-2">
            {dailyBookings.map((day) => (
              <div
                key={day.date}
                className="flex-1 bg-blue-600 hover:bg-blue-700 transition-colors rounded-t"
                style={{ height: `${(day.count / Math.max(...dailyBookings.map(d => d.count))) * 100}%` }}
                title={`${day.date}: ${day.count} bookings`}
              />
            ))}
          </div>
        </div>
        <div className="flex justify-between mt-4 text-sm text-gray-600">
          <span>{dailyBookings[0]?.date}</span>
          <span>{dailyBookings[dailyBookings.length - 1]?.date}</span>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboardPage;