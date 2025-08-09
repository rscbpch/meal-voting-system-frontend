import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiLock, FiTrash2, FiArrowLeft, FiEye, FiEyeOff } from 'react-icons/fi';
import AuthService from '../services/authService';

const UserProfile = () => {
    const [activeTab, setActiveTab] = useState('profile');
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false
    });
    
    const [deactivatePassword, setDeactivatePassword] = useState('');
    const [showDeactivatePassword, setShowDeactivatePassword] = useState(false);
    const [showDeactivateConfirm, setShowDeactivateConfirm] = useState(false);
    
    const navigate = useNavigate();

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const fetchUserProfile = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await AuthService.getProfile();
            console.log('Profile response:', response); 
            
            if (response.success && response.data && response.data.user) {
                setUserProfile(response.data.user);
            } else if (response.data) {
                setUserProfile(response.data);
            } else if (response.user) {
                setUserProfile(response.user);
            } else {
                setUserProfile(response);
            }
        } catch (error) {
            setError('Failed to load profile. Please try again.');
            console.error('Profile fetch error:', error);
            
            if (error.message.includes('token') || error.message.includes('unauthorized') || error.message.includes('authentication')) {
                navigate('/login');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!currentPassword || !newPassword || !confirmNewPassword) {
            setError('Please fill in all password fields.');
            return;
        }

        if (newPassword !== confirmNewPassword) {
            setError('New passwords do not match.');
            return;
        }

        if (newPassword.length < 6) {
            setError('New password must be at least 6 characters long.');
            return;
        }

        if (currentPassword === newPassword) {
            setError('New password must be different from current password.');
            return;
        }

        try {
            setLoading(true);
            await AuthService.changePassword(currentPassword, newPassword);
            setSuccess('Password changed successfully!');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmNewPassword('');
        } catch (error) {
            setError(error.message || 'Failed to change password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleDeactivateAccount = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!deactivatePassword) {
            setError('Please enter your password to confirm account deactivation.');
            return;
        }

        try {
            setLoading(true);
            await AuthService.deactivateAccount(deactivatePassword);
            setSuccess('Account deactivated successfully. You will be logged out shortly.');
            
            setTimeout(async () => {
                await AuthService.logout();
                navigate('/');
                window.location.reload(); 
            }, 3000);
        } catch (error) {
            setError(error.message || 'Failed to deactivate account. Please try again.');
            setLoading(false);
        }
    };

    const togglePasswordVisibility = (field) => {
        setShowPasswords(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading && !userProfile) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-[#429818] mb-4"></div>
                <div className="text-lg font-title">Loading profile...</div>
            </div>
        );
    }

    if (!userProfile && !loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="text-lg font-title mb-4">Failed to load profile</div>
                    <button 
                        onClick={() => navigate('/login')}
                        className="main-button"
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 py-8">
            <div className="max-w-4xl mx-auto px-4">
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => navigate('/')}
                                className="flex items-center space-x-2 main-text-w-hover"
                            >
                                <FiArrowLeft size={20} />
                                <span>Back to Home</span>
                            </button>
                        </div>
                        <h1 className="text-2xl font-bold font-title main-text">User Profile</h1>
                    </div>
                </div>
                {error && (
                    <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                        {success}
                    </div>
                )}
                <div className="bg-white rounded-lg shadow-md mb-6">
                    <div className="border-b border-gray-200">
                        <nav className="flex space-x-8 px-6">
                            <button
                                onClick={() => setActiveTab('profile')}
                                className={`py-4 px-2 border-b-2 font-medium text-sm ${
                                    activeTab === 'profile'
                                        ? 'border-[#429818] main-text'
                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                <div className="flex items-center space-x-2">
                                    <FiUser size={16} />
                                    <span>Profile</span>
                                </div>
                            </button>
                            <button
                                onClick={() => setActiveTab('password')}
                                className={`py-4 px-2 border-b-2 font-medium text-sm ${
                                    activeTab === 'password'
                                        ? 'border-[#429818] main-text'
                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                <div className="flex items-center space-x-2">
                                    <FiLock size={16} />
                                    <span>Change Password</span>
                                </div>
                            </button>
                            <button
                                onClick={() => setActiveTab('deactivate')}
                                className={`py-4 px-2 border-b-2 font-medium text-sm ${
                                    activeTab === 'deactivate'
                                        ? 'border-red-500 text-red-500'
                                        : 'border-transparent text-gray-500 hover:text-red-500'
                                }`}
                            >
                                <div className="flex items-center space-x-2">
                                    <FiTrash2 size={16} />
                                    <span>Deactivate Account</span>
                                </div>
                            </button>
                        </nav>
                    </div>
                    <div className="p-6">
                        {activeTab === 'profile' && userProfile && (
                            <div className="space-y-6">
                                <h2 className="text-xl font-semibold font-title">Profile Information</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">User ID</label>
                                        <div className="p-3 bg-gray-50 rounded-lg border">
                                            <span className="font-mono text-sm">{userProfile.id || 'N/A'}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                        <div className="p-3 bg-gray-50 rounded-lg border">
                                            <span className="font-medium">{userProfile.email || 'N/A'}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                                        <div className="p-3 bg-gray-50 rounded-lg border">
                                            <span className="capitalize font-medium main-text">
                                                {userProfile.role || 'Student'}
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Account Status</label>
                                        <div className="p-3 bg-gray-50 rounded-lg border">
                                            <div className="flex items-center space-x-2">
                                                <span className={`inline-block w-3 h-3 rounded-full ${
                                                    userProfile.isActive ? 'bg-green-500' : 'bg-red-500'
                                                }`}></span>
                                                <span className={`font-medium ${
                                                    userProfile.isActive ? 'text-green-600' : 'text-red-600'
                                                }`}>
                                                    {userProfile.isActive ? 'Active' : 'Inactive'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Verification</label>
                                        <div className="p-3 bg-gray-50 rounded-lg border">
                                            <div className="flex items-center space-x-2">
                                                <span className={`inline-block w-3 h-3 rounded-full ${
                                                    userProfile.isVerified ? 'bg-green-500' : 'bg-yellow-500'
                                                }`}></span>
                                                <span className={`font-medium ${
                                                    userProfile.isVerified ? 'text-green-600' : 'text-yellow-600'
                                                }`}>
                                                    {userProfile.isVerified ? 'Verified' : 'Pending Verification'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Member Since</label>
                                        <div className="p-3 bg-gray-50 rounded-lg border">
                                            <span className="font-medium text-blue-600">
                                                {formatDate(userProfile.createdAt)}
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Last Updated</label>
                                        <div className="p-3 bg-gray-50 rounded-lg border">
                                            <span className="font-medium text-gray-600">
                                                {formatDate(userProfile.updatedAt)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                    <h3 className="font-medium text-blue-800 mb-2">Account Information</h3>
                                    <div className="text-sm text-blue-700 space-y-1">
                                        <p>• Your account is registered with the meal voting system</p>
                                        <p>• Role: <strong className="capitalize">{userProfile.role || 'Student'}</strong></p>
                                        <p>• You can participate in daily meal voting during voting hours (6:00 AM - 5:00 PM)</p>
                                        <p>• Your vote history and preferences are stored securely</p>
                                    </div>
                                </div>
                            </div>
                        )}
                        {activeTab === 'password' && (
                            <form onSubmit={handleChangePassword} className="space-y-6">
                                <h2 className="text-xl font-semibold font-title">Change Password</h2>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                                    <div className="relative">
                                        <input
                                            type={showPasswords.current ? 'text' : 'password'}
                                            value={currentPassword}
                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                            className="w-full p-3 border rounded-lg pr-10"
                                            placeholder="Enter your current password"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => togglePasswordVisibility('current')}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 option-button"
                                        >
                                            {showPasswords.current ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                                    <div className="relative">
                                        <input
                                            type={showPasswords.new ? 'text' : 'password'}
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            className="w-full p-3 border rounded-lg pr-10"
                                            placeholder="Enter your new password"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => togglePasswordVisibility('new')}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 option-button"
                                        >
                                            {showPasswords.new ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                                        </button>
                                    </div>
                                    <p className="text-sm text-gray-500 mt-1">Password must be at least 6 characters long</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                                    <div className="relative">
                                        <input
                                            type={showPasswords.confirm ? 'text' : 'password'}
                                            value={confirmNewPassword}
                                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                                            className="w-full p-3 border rounded-lg pr-10"
                                            placeholder="Confirm your new password"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => togglePasswordVisibility('confirm')}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 option-button"
                                        >
                                            {showPasswords.confirm ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                                        </button>
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="main-button disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Changing Password...' : 'Change Password'}
                                </button>
                            </form>
                        )}
                        {activeTab === 'deactivate' && (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-xl font-semibold font-title text-red-600">Deactivate Account</h2>
                                    <p className="text-gray-600 mt-2">
                                        Once you deactivate your account, you will be logged out and won't be able to access the system. 
                                        You can reactivate your account by registering again with the same email.
                                    </p>
                                </div>
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                    <h3 className="font-medium text-red-800 mb-2">Warning:</h3>
                                    <ul className="text-sm text-red-700 space-y-1">
                                        <li>• You will be immediately logged out</li>
                                        <li>• Your voting history will be preserved</li>
                                        <li>• You can reactivate by registering again with the same email</li>
                                        <li>• This action requires password confirmation</li>
                                    </ul>
                                </div>
                                {!showDeactivateConfirm ? (
                                    <button
                                        onClick={() => setShowDeactivateConfirm(true)}
                                        className="main-border-button text-red-600 border-red-600 hover:text-red-700 hover:border-red-700"
                                    >
                                        I want to deactivate my account
                                    </button>
                                ) : (
                                    <form onSubmit={handleDeactivateAccount} className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Enter your password to confirm deactivation
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type={showDeactivatePassword ? 'text' : 'password'}
                                                    value={deactivatePassword}
                                                    onChange={(e) => setDeactivatePassword(e.target.value)}
                                                    className="w-full p-3 border rounded-lg pr-10"
                                                    placeholder="Enter your password"
                                                    required
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowDeactivatePassword(!showDeactivatePassword)}
                                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 option-button"
                                                >
                                                    {showDeactivatePassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                                                </button>
                                            </div>
                                        </div>
                                        <div className="flex space-x-4">
                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className="main-button bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {loading ? 'Deactivating...' : 'Confirm Deactivation'}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setShowDeactivateConfirm(false);
                                                    setDeactivatePassword('');
                                                }}
                                                className="main-border-button"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;