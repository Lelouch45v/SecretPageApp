'use client';

import { useState, useEffect } from 'react';
import supabase from '../utils/supabaseClient';
import { useRouter } from 'next/navigation';



const SecretPage3 = () => {
  const [friends, setFriends] = useState([]);
  const [message, setMessage] = useState('');
  const [friendId, setFriendId] = useState('');
  const [userId, setUserId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserAndFriends = async () => {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData?.user) {
        window.location.href = '/'; // Redirect if not authenticated
        return;
      }

      setUserId(userData.user.id);

      const { data: friendsData, error: friendsError } = await supabase
        .from('friends')
        .select(`
          id, status, 
          requester_id, recipient_id,
          requester:user_id!inner(id, name),
          recipient:recipient_id!inner(id, name)
        `)
        .or(`requester_id.eq.${userData.user.id},recipient_id.eq.${userData.user.id}`);

      if (friendsError) {
        alert(friendsError.message);
        return;
      }

      const processedFriends = friendsData.map(friend => {
        const friendUser = friend.requester_id === userData.user.id ? friend.recipient : friend.requester;
        return {
          id: friendUser.id,
          name: friendUser.name,
          status: friend.status,
        };
      });

      setFriends(processedFriends);
    };

    fetchUserAndFriends();
  }, []);

  const addFriend = async () => {
    if (!friendId) {
      alert('Please enter a valid user ID to add as a friend.');
      return;
    }

    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData?.user) {
      alert("Authentication error.");
      return;
    }

    const { error } = await supabase.from("friends").insert([
      {
        requester_id: userData.user.id,
        recipient_id: friendId,
        status: "pending"
      }
    ]);

    if (error) {
      alert(error.message);
    } else {
      alert("Friend request sent!");
      setFriendId(""); 
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      alert("User not authenticated.");
      return;
    }

    const { error } = await supabase
      .from('secret_messages')
      .upsert({ user_id: userId, message });

    if (error) {
      alert(error.message);
    } else {
      alert("Secret message saved!");
      setMessage(""); // Clear message input
    }
  };

  return (
    <div className="bg-white min-h-screen flex flex-col items-center justify-start">
        <header className="text-center py-6 bg-green-600 text-white w-full flex">
          <h1 className="text-3xl font-bold">Secret Page 3</h1>
          <button
            onClick={() => router.push('/')}
            className="mt-4 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition duration-200"
          >
           Back to Homepage
          </button>
        </header>
     

      {userId && (
        <div className="mt-8 space-y-8">
          {/* Secret Message Section */}
          <section className="bg-white p-6 rounded-lg shadow-md">
            <form onSubmit={handleSubmit}>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter your secret message"
              rows="5"
              className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
            />
              <button
                type="submit"
                className="mt-4 w-full bg-green-600 text-white p-3 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                Save Secret
              </button>
            </form>
          </section>

          {/* Friends List Section */}
          <section className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4 text-black">Your Friends</h2>
            <ul>
              {friends.length > 0 ? (
                friends.map((friend) => (
                  <li key={friend.id} className="p-3 bg-gray-100 rounded-md mb-3 text to-black">
                    {friend.name} ({friend.status})
                  </li>
                ))
              ) : (
                <p className='text-black'>No friends found.</p>
              )}
            </ul>
          </section>

          {/* Add Friend Section */}
          <section className="bg-white p-6 rounded-lg shadow-md ">
            <h3 className="text-xl font-semibold mb-4 text-black">Add Friend</h3>
            <input
              type="text"
              value={friendId}
              onChange={(e) => setFriendId(e.target.value)}
              placeholder="Enter Friend ID"
              className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 mb-4 text-black"
            />

            <button
              onClick={addFriend}
              className="w-full bg-green-600 text-white p-3 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Add Friend
            </button>
          </section>

         
        </div> 
      )}
    </div>
  );
};

export default SecretPage3;
