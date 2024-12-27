"use client"

import React from 'react';
import Link from 'next/link';
import Dropdown from '../dropdown';
import Image from 'next/image';
import { useState,useEffect } from 'react';

export function FavoritePage({ token }: { token: string  | undefined }) {

  const [userData, setUserData] = useState<any>(null);
  const [userToken, setUserToken] = useState<any>(null);
  const [userId, setUserId] = useState<any>(null);
  const [userWishlist, setUserWishlist] = useState<any[]>([]);

  useEffect(() => {
    if (token) {
      (async () => {
        const response = await fetch("http://localhost:8080/auth/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();
        setUserToken(token);
        setUserData(data.result);
      })();
    }
  }, [token]);

  useEffect(() => {
    if (userData?.userId && userToken) {
      (async () => {
          const response = await fetch(`http://localhost:8080/user/get/${userData.userId}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${userToken}`,
            },
          });
          const data = await response.json();
          console.log(data)
          setUserId(data.userId)
          setUserWishlist(data.wishList)
      })();
    }
  }, [userData?.userId, userToken]);

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">

      <header className="bg-white p-4 shadow-md sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="text-xl font-bold text-red-500">
            <Link href={"/"}>Where is my cafein</Link>
          </div>
          <Dropdown />
        </div>
      </header>

      <main className="flex-grow py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Your Favorites</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {userWishlist.map((item, key) => (
              <div 
                key={key} 
                className="border p-4 rounded-lg shadow-md mb-4"
                onClick={() => {window.location.href = `/detail_collection/${item.collectionId}`;}}
              >
                {item.name}
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="bg-gray-800 text-white py-6 mt-auto">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p>&copy; 2024 Where is my cafein. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
