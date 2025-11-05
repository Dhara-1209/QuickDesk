import React, { useState } from 'react';

const ProfileEditPage = () => {
  // Placeholder user data
  const [user, setUser] = useState({
    name: 'John Doe',
    username: 'johndoe',
    email: 'john.doe@example.com',
    avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=4f46e5&color=fff&size=256',
    bio: 'Full Stack Developer. Building cool stuff with React and Node.js. Coffee enthusiast.',
    followers: 128,
    following: 56,
    repos: 24,
  });
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState(user);

  const handleEdit = () => {
    setEditData(user);
    setEditMode(true);
  };
  const handleCancel = () => {
    setEditMode(false);
  };
  const handleChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };
  const handleSave = (e) => {
    e.preventDefault();
    setUser(editData);
    setEditMode(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        <div className={`glassmorphism shadow-2xl rounded-2xl p-8 text-white flex flex-col md:flex-row gap-8 transition-all duration-500 ease-in-out ${editMode ? 'md:items-start' : 'md:items-center'}`}> 
          {/* Profile Card */}
          <div className={`flex-shrink-0 flex flex-col items-center md:items-start w-full md:w-1/3 transition-all duration-500 ease-in-out ${editMode ? 'md:w-1/2' : 'md:w-1/3'}`}
            style={{ minWidth: editMode ? '260px' : '220px' }}
          >
            <img
              src={editMode ? editData.avatar : user.avatar}
              alt="Profile"
              className={`rounded-full border-4 border-indigo-500 shadow-lg object-cover mb-4 transition-all duration-500 ${editMode ? 'w-32 h-32' : 'w-40 h-40'}`}
            />
            {!editMode && (
              <button
                className="w-full md:w-auto px-6 py-2 bg-black hover:bg-gray-800 border border-gray-700 rounded-lg font-semibold text-base mt-2 transition-all duration-200"
                onClick={handleEdit}
              >
                Edit Profile
              </button>
            )}
            {!editMode && (
              <>
                <div className="flex flex-col md:flex-row md:items-center gap-2 mt-4 mb-2">
                  <h2 className="text-3xl font-bold mr-2">{user.name}</h2>
                  <span className="text-indigo-300 text-lg">@{user.username}</span>
                </div>
                <p className="text-gray-300 mb-4 text-center md:text-left">{user.bio}</p>
                <div className="flex items-center gap-6 mb-4">
                  <span className="text-gray-400"><strong className="text-white">{user.followers}</strong> Followers</span>
                  <span className="text-gray-400"><strong className="text-white">{user.following}</strong> Following</span>
                  <span className="text-gray-400"><strong className="text-white">{user.repos}</strong> Public Repos</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
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
                    name="name"
                    value={editData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Username</label>
                  <input
                    type="text"
                    name="username"
                    value={editData.username}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={editData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Bio</label>
                  <textarea
                    name="bio"
                    value={editData.bio}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Avatar URL</label>
                  <input
                    type="text"
                    name="avatar"
                    value={editData.avatar}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
                  />
                </div>
                <div className="flex gap-4 mt-4">
                  <button
                    type="submit"
                    className="flex-1 py-2 px-4 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    className="flex-1 py-2 px-4 bg-gray-600 hover:bg-gray-700 rounded-lg font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                    onClick={handleCancel}
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

export default ProfileEditPage;
