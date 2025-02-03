'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '../utils/supabaseClient';

const SecretPage1 = () => {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        setError(error.message);
        router.push('/');
      } else {
        setUser(data);
      }
    };

    fetchUser();
  }, [router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const handleDeleteAccount = async () => {
    const { error } = await supabase.auth.admin.deleteUser(user.id);
    if (error) setError(error.message);
    else router.push('/');
  };

  if (!user)
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin h-10 w-10 border-4 border-gray-300 border-t-gray-600 rounded-full"></div>
      </div>
    );

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">Secret Page 1</h1>
        <p className="text-gray-600">
          Your Secret Message:{' '}
          <span className="font-medium text-gray-800">{message || 'You have no secret message yet.'}</span>
        </p>

        <div className="mt-6 space-y-3">
          <button
            onClick={handleSignOut}
            className="w-full bg-red-500 text-white font-semibold py-2 rounded-lg hover:bg-red-600 transition duration-200"
          >
            Sign Out
          </button>

          <button
            onClick={handleDeleteAccount}
            className="w-full bg-gray-700 text-white font-semibold py-2 rounded-lg hover:bg-gray-800 transition duration-200"
          >
            Delete Account
          </button>
        </div>

        {/* Back to Homepage Button */}
        <button
          onClick={() => router.push('/')}
          className="mt-4 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition duration-200"
        >
          Back to Homepage
        </button>
      </div>

      {error && <p className="mt-4 text-red-500 text-sm text-center">{error}</p>}
    </div>
  );
};

export default SecretPage1;
