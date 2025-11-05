import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';

const ProfilePage = () => {
  const { user: authUser } = useContext(AuthContext);
  const [user, setUser] = useState({
    displayName: '',
    email: '',
    role: '',
    bio: '',
    avatar: '',
    createdAt: ''
  });
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await fetch('/api/auth/profile', {
          headers: { 'Authorization': `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }

        const userData = await response.json();
        setUser({
          displayName: userData.displayName || '',
          email: userData.email || '',
          role: userData.role || '',
          bio: userData.bio || 'No bio available',
          avatar: userData.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.displayName || 'User')}&background=a78bfa&color=fff&size=256`,
          createdAt: userData.createdAt || ''
        });
        setEditData({
          displayName: userData.displayName || '',
          email: userData.email || '',
          bio: userData.bio || '',
          avatar: userData.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.displayName || 'User')}&background=a78bfa&color=fff&size=256`
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleEdit = () => {
    setEditData({
      displayName: user.displayName,
      email: user.email,
      bio: user.bio,
      avatar: user.avatar
    });
    setEditMode(true);
  };

  const handleCancel = () => {
    setEditMode(false);
  };

  const handleChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(editData),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const updatedUser = await response.json();
      setUser({
        ...user,
        displayName: updatedUser.displayName,
        email: updatedUser.email,
        bio: updatedUser.bio,
        avatar: updatedUser.avatar
      });
      setEditMode(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-gray-700 text-lg">Loading profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-red-500 text-lg">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        <div className={`bg-white/90 backdrop-blur shadow-xl rounded-2xl p-8 text-gray-900 border border-gray-200 flex flex-col md:flex-row gap-8 transition-all duration-500 ease-in-out ${editMode ? 'md:items-start' : 'md:items-center'}`}> 
          {/* Profile Card */}
          <div className={`flex-shrink-0 flex flex-col items-center md:items-start w-full md:w-1/3 transition-all duration-500 ease-in-out ${editMode ? 'md:w-1/2' : 'md:w-1/3'}`}
            style={{ minWidth: editMode ? '260px' : '220px' }}
          >
            <img
              src={editMode ? editData.avatar : user.avatar}
              alt="Profile"
              className={`rounded-full border-4 border-indigo-300 shadow object-cover mb-4 transition-all duration-500 ${editMode ? 'w-32 h-32' : 'w-40 h-40'}`}
            />
            {!editMode && (
              <button
                className="w-full md:w-auto px-6 py-2 bg-white border border-gray-200 hover:border-gray-300 rounded-lg font-semibold text-base mt-2 text-gray-700"
                onClick={handleEdit}
              >
                Edit Profile
              </button>
            )}
            {!editMode && (
              <>
                <div className="flex flex-col md:flex-row md:items-center gap-2 mt-4 mb-2">
                  <h2 className="text-3xl font-bold mr-2">{user.displayName}</h2>
                  <span className="text-indigo-600 text-lg">@{user.email.split('@')[0]}</span>
                </div>
                <p className="text-gray-600 mb-4 text-center md:text-left">{user.bio}</p>
                <div className="flex items-center gap-6 mb-4">
                  <span className="text-gray-500"><strong className="text-gray-900">{user.role}</strong> Role</span>
                  <span className="text-gray-500"><strong className="text-gray-900">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</strong> Joined</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z"/><path d="M12 2v2m0 16v2m10-10h-2M4 12H2m15.07 7.07-1.42-1.42M6.34 6.34 4.93 4.93m12.02 0-1.41 1.41M6.34 17.66l-1.41 1.41"/></svg>
                  <span>{user.email}</span>
                </div>
              </>
            )}
          </div>
          {/* Edit Form Slide In */}
          <div className={`flex-1 flex flex-col justify-center w-full transition-all duration-500 ease-in-out ${editMode ? 'opacity-100 translate-x-0' : 'opacity-0 md:-translate-x-10 pointer-events-none h-0 overflow-hidden'}`}
            style={{ minWidth: editMode ? '260px' : '0px' }}
          >
            {editMode && (
              <form onSubmit={handleSave} className="space-y-4 animate-fade-in">
                <div>
                  <label className="block text-sm mb-1">Full Name</label>
                  <input
                    type="text"
                    name="displayName"
                    value={editData.displayName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 text-gray-900"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={editData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 text-gray-900"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Bio</label>
                  <textarea
                    name="bio"
                    value={editData.bio}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-4 py-2 rounded-lg bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Avatar URL</label>
                  <input
                    type="text"
                    name="avatar"
                    value={editData.avatar}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 text-gray-900"
                  />
                </div>
                <div className="flex gap-4 mt-4">
                  <button
                    type="submit"
                    className="flex-1 py-2 px-4 bg-indigo-500 hover:bg-indigo-600 rounded-lg font-bold text-lg text-white"
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    type="button"
                    className="flex-1 py-2 px-4 bg-white border border-gray-200 hover:border-gray-300 rounded-lg font-bold text-lg text-gray-700"
                    onClick={handleCancel}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;