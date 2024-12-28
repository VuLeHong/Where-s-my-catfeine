"use client"

import React from 'react';
import Link from 'next/link';
import Dropdown from '../dropdown';
import { useState, useEffect, SyntheticEvent } from 'react';
import Image from "next/image";
import { Trash2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast"
import { useRouter } from 'next/navigation'

interface User {
  userId: number,
  userName: string,
  userEmail: string,
  roles: [],
  wishList: []
  createdAt: Date,
}

interface Collection {
  coffeeIds: string[],
  collectionId: string,
  createdAt: Date,
  name: string,
  updatedAt: Date
}

export function FavoritePage({ token }: { token: string | undefined }) {

  const [userData, setUserData] = useState<User | null>(null);
  const [userToken, setUserToken] = useState<string | null>(null);
  const [userWishlistState, setUserWishlistState] = useState<Collection[]>([]);
  const [isCreatePopupOpen, setCreatePopupOpen] = useState(false);
  const [name, setName] = useState("");
  const { toast } = useToast()
  const handleCloseCreatePopup = () => {
    setCreatePopupOpen(false);
  };
  const router = useRouter();

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
        console.log(data.result)
      })();
    }
  }, [token]);

  useEffect(() => {
    if (userData === undefined) {
      router.push("/");
    }
  }, [userData, router]);

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
        setUserWishlistState(data.wishList)
      })();
    }
  }, [userData?.userId, userToken]);

  const handleOpenPopUp = () => {
    setCreatePopupOpen(true);
  };

  const handleCreateWishlist = async (e: SyntheticEvent) => {
    try {
      e.preventDefault();
      if (!userData) {
        throw new Error("User data is not available");
      }
      const response = await fetch(`http://localhost:8080/collection/create/${userData.userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) {
        throw new Error("Failed to create a new wishlist");
      }

      toast({ title: "Create wishlist success" });
      setCreatePopupOpen(false);

      (async () => {
        const response = await fetch(`http://localhost:8080/user/get/${userData.userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
        });
        const data = await response.json();
        setUserWishlistState(data.wishList)
      })();
    } catch (error) {
      console.log(error);
    }
    toast({
      title: "Create wishlist success",
    })
  };

  const handleDeleteWishlist = async (e: SyntheticEvent, id: string) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8080/collection/delete/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete wishlist");
      }

      toast({ title: "Delete wishlist success" });
      (async () => {
        if (userData) {
          const response = await fetch(`http://localhost:8080/user/get/${userData.userId}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${userToken}`,
            },
          });
          const data = await response.json();
          setUserWishlistState(data.wishList)
        }
      })();

    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: "Failed to delete wishlist." });
    }
  }

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <header className="bg-white p-4 shadow-md sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="text-xl font-bold text-red-500">
            <Link href={"/"}>Where is my catfeine</Link>
          </div>
          {userData ? (
            <div className="flex items-center space-x-2">
              <Image
                src="/avatar.png"
                alt="Avatar"
                width={40}
                height={40}
                className="rounded-full"
              />
              <span className="text-gray-600">{userData.userEmail}</span>
              <Dropdown token={token} />
            </div>
          ) : (
            <div className='flex items-center justify-around space-x-4'>
              <button className="text-gray-600 hover:text-gray-800">
                <Link href={'/signup'}>Đăng Ký</Link>
              </button>
              <button className="text-gray-600 hover:text-gray-800">
                <Link href={'/login'}>Đăng Nhập</Link>
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="flex-grow py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-bold mr-2">Your Favorites</h1>
            <button
              className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-all"
              onClick={handleOpenPopUp}
            >
              Create a new wishlist
            </button>
            {isCreatePopupOpen && (
              <div
                className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-40"
                onClick={(e) => e.stopPropagation()}
              >
                <div
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[750px] h-[200px] bg-white shadow-lg rounded-lg z-50 p-6"
                >
                  <button
                    onClick={handleCloseCreatePopup}
                    className="absolute top-4 left-4 text-xl font-bold text-gray-800 hover:text-red-500"
                  >
                    x
                  </button>

                  <h3 className="text-2xl font-semibold text-gray-800 text-center mb-6">
                    Create New Wishlist
                  </h3>

                  <form>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter wishlist name"
                      className="w-full p-3 border border-gray-300 rounded-lg mb-4 text-black"
                    />

                    <button
                      onClick={handleCreateWishlist}
                      className="w-full py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
                    >
                      Create Wishlist
                    </button>
                  </form>
                </div>
              </div>
            )}

          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {userWishlistState.map((item, key) => (
              <div
                key={key}
                className="border p-4 rounded-lg shadow-md mb-4  grid grid-cols-4"
              >
                <Link href={`/detail_collection/${item.collectionId}`} className='col-span-3'><div>{item.name}</div></Link>
                <Trash2
                  className='text-red-500 cursor-pointer col-span-1'
                  onClick={(e) => handleDeleteWishlist(e, item.collectionId)}
                />
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
