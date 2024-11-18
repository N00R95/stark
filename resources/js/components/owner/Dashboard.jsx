import { useAuth } from '../../contexts/AuthContext';

export default function OwnerDashboard() {
    const { user } = useAuth();

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Property Owner Dashboard</h1>
            <div className="bg-white rounded-lg shadow p-6">
                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-4">Welcome, {user?.profile?.full_name}</h2>
                    <p className="text-gray-600">Manage your properties and tour requests here.</p>
                </div>
                
                {/* Add dashboard content here */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-blue-50 p-6 rounded-lg">
                        <h3 className="font-semibold mb-2">My Properties</h3>
                        <p className="text-gray-600">View and manage your listed properties</p>
                    </div>
                    
                    <div className="bg-green-50 p-6 rounded-lg">
                        <h3 className="font-semibold mb-2">Tour Requests</h3>
                        <p className="text-gray-600">Manage incoming tour requests</p>
                    </div>
                    
                    <div className="bg-purple-50 p-6 rounded-lg">
                        <h3 className="font-semibold mb-2">Business Profile</h3>
                        <p className="text-gray-600">Update your business information</p>
                    </div>
                </div>
            </div>
        </div>
    );
} 