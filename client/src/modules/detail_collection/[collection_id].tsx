"use client"

import React, { useState, useEffect, SyntheticEvent } from 'react';
import Link from 'next/link';
import Dropdown from '../dropdown';
import Image from 'next/image';
import { Loader } from '@googlemaps/js-api-loader';
import { useToast } from "@/hooks/use-toast"

export function DetailCollectionPage({ token, collectionId }: { token: string | undefined; collectionId: string | undefined }) {
  const [userData, setUserData] = useState<any>(null);
  const [userToken, setUserToken] = useState<any>(null);
  const [userId, setUserId] = useState<any>(null);
  const [userWishlist, setUserWishlist] = useState<any[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<any>();
  const [coffeeShops, setCoffeeShops] = useState<any[]>([]);
  const { toast } = useToast()

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
        setUserId(data.userId);
        setUserWishlist(data.wishList);

        if (data.wishList && data.wishList.length > 0) {
          const matchingCollection = data.wishList.find(
            (item: any) => item.collectionId === collectionId
          );

          if (matchingCollection) {
            setSelectedCollection(matchingCollection);
            if (matchingCollection && matchingCollection.coffeeIds) {
              fetchCoffeeShopsByIds(matchingCollection.coffeeIds);
            }
          }
        }
      })();
    }
  }, [userData?.userId, userToken]);

  const fetchCoffeeShopsByIds = (coffeeIdsArray: string[]) => {
    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY as string,
        version: 'quarterly',
        libraries: ['places'],
    });

    loader.load().then(() => {
      const map = new google.maps.Map(document.createElement('div'));
      const service = new google.maps.places.PlacesService(map);

      coffeeIdsArray.forEach((placeId) => {
        service.getDetails(
          { placeId },
          (place, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && place) {
              setCoffeeShops((prev) => [
                ...prev,
                {
                  id: place.place_id,
                  name: place.name,
                  description: place.types?.join(', ') || 'No description available.',
                  location: place.formatted_address,
                  image: place.photos?.[0]?.getUrl() || '/placeholder-image.jpg',
                },
              ]);
            } else {
              console.error(`Error fetching details for Place ID ${placeId}:`, status);
            }
          }
        );
      });
    }).catch((error) => {
      console.error('Error loading Google Maps API:', error);
    });
  };

  const handleDeleteCoffeeId = async (e: SyntheticEvent, id: string) => {
      e.preventDefault();
      try {
        const response = await fetch(
          `http://localhost:8080/collection/delete-coffee/${collectionId}`, 
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userToken}`,
          },
          body: JSON.stringify({
            coffeeId: id,
          }),
        });
  
        if (!response.ok) {
          throw new Error("Failed to delete coffee shop from wishlist");
        }
    
      } catch (error) {
        console.error(error);
        toast({ title: "Error", description: "Failed to delete coffee shop from wishlist" });
      }
    }

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
        <h1 className="text-4xl font-bold mb-8">
          {selectedCollection ? selectedCollection.name : 'Loading...'}
        </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {coffeeShops.length > 0 ? (
              coffeeShops.map((item) => (
                <div key={item.id} className="bg-white shadow-lg rounded-lg overflow-hidden transition-all duration-300">
                  <div className="relative h-64">
                    <Image
                      src={item.image}
                      alt={item.name}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-t-lg"
                    />
                  </div>
                  <div className="p-4">
                    <h2 className="text-xl font-semibold text-black">{item.name}</h2>
                    <div className="mt-4 flex justify-between items-center">
                      <Link href={`/detail/${item.id}`}>
                        <span className="text-red-500 font-semibold hover:underline cursor-pointer">View Details</span>
                      </Link>
                      <button 
                        className="bg-transparent text-red-500 hover:bg-red-500 hover:text-white rounded-full p-2 transition-all duration-300 transform hover:scale-110"
                        onClick={(e: SyntheticEvent) => handleDeleteCoffeeId(e, item.id)}
                      >
                        <span className="text-xl font-bold">X</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">No coffee shops found in this collection.</p>
            )}
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
