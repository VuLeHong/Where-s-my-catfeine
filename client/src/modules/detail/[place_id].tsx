"use client"

import { useEffect, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import Link from 'next/link';
import Dropdown from '../dropdown';
import { WishlistPopup } from "../wishlist_popup";
import { Heart } from '@/components/ui/Heart';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Star } from 'lucide-react';
import { useToast } from "@/hooks/use-toast"

interface User {
  userId: number,
  userName: string,
  userEmail: string,
  roles: [],
  wishList: []
  createdAt: Date,
}

export default function DetailPage({ token }: { token: string | undefined }) {
  const [shopDetails, setShopDetails] = useState<google.maps.places.PlaceResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [userToken, setUserToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [currentData, setCurrentData] = useState<string | null>(null);
  const path = window.location.pathname;
  const { toast } = useToast()

  useEffect(() => {
    const regex = /\/detail\/([^/]+)$/;
    const match = path.match(regex);
    if (match) {
      setCurrentData(match[1]);
    } else {
      setCurrentData(null);
    }
  }, [path]);

  const placeId = currentData;

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
        setUserId(data.userId)
      })();
    }
  }, [userData?.userId, userToken]);

  const formatTime = (time: string) => {
    const hour = time.slice(0, 2);
    const minute = time.slice(2, 4);
    return `${hour}h${minute}`;
  };

  useEffect(() => {
    const fetchShopDetails = async () => {
      try {
        const loader = new Loader({
          apiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY as string,
          version: 'quarterly',
          libraries: ['places'],
        });

        const google = await loader.load();
        const service = new google.maps.places.PlacesService(document.createElement('div'));

        service.getDetails(
          { placeId: placeId as string },
          (result, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && result) {
              setShopDetails(result);
              setIsLoading(false);
            } else {
              console.error('Failed to fetch details:', status);
              setIsLoading(false);
            }
          }
        );
      } catch (error) {
        console.error('Error fetching details:', error);
        setIsLoading(false);
      }
    };

    if (placeId) {
      fetchShopDetails();
    }
  }, [placeId]);

  if (isLoading) return <p>Loading...</p>;
  if (!shopDetails) return <p>Could not find details.</p>;

  const openingHours = shopDetails.opening_hours?.periods?.[0];

  const nonEmptyReviews = shopDetails.reviews?.filter(review => review.text?.trim() !== '') || [];

  return (
    placeId ?
      <div className="bg-gray-100 min-h-screen flex flex-col">
        <header className="bg-white p-4 shadow-md sticky top-0 z-10">
          <div className="max-w-6xl mx-auto flex justify-around items-center">
            <div className="text-xl font-bold text-red-500">
              <Link href={"/"}>Where is my cafein</Link>
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

        <main className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 flex flex-col gap-8 mt-6 pb-12">
          <section className="flex flex-col items-center">
            <div className="flex items-center justify-between w-full mb-4">
              <h1 className="text-4xl font-bold text-gray-800 text-center">{shopDetails.name}</h1>
              <button
                className="text-red-500"
                onClick={(e) => {
                  e.stopPropagation();
                  if (!userData) {
                    toast({
                      title: 'Please login to add to wishlist',
                    })
                  } else {
                    setIsWishlistOpen(true);
                    setSelectedPlaceId(shopDetails.place_id || null);
                  }
                }}
              >
                <Heart />
              </button>
            </div>
            {shopDetails.photos && shopDetails.photos.length > 0 && (
              <Carousel
                opts={{
                  align: "start",
                }}
                className="w-full max-w-7xl mx-auto "
              >
                <CarouselContent >
                  {shopDetails.photos.map((photo, index) => (
                    <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                      <div className="p-1">
                        <span className="text-3xl font-semibold">
                          <Image
                            src={photo.getUrl({ maxWidth: 450, maxHeight: 450 })}
                            alt={`${shopDetails.name} - Photo ${index + 1}`}
                            className=" h-60 object-cover rounded-lg"
                            width={400}
                            height={400}
                          />
                        </span>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            )}
          </section>

          <section className="flex justify-between gap-8">
            <div className="flex flex-col gap-8 flex-1">
              <div>
                <h2 className="text-2xl font-semibold text-gray-800">Địa chỉ</h2>
                <p className="text-gray-600">
                  {shopDetails.formatted_address || 'No description available.'}
                </p>
              </div>

              {openingHours && (
                <div>
                  <h2 className="text-2xl font-semibold text-gray-800">Giờ mở cửa</h2>
                  <p className="text-gray-600">
                    {openingHours.open?.time && openingHours.close?.time
                      ? `${formatTime(openingHours.open.time)} - ${formatTime(openingHours.close.time)}`
                      : 'Not available'}
                  </p>
                </div>
              )}

              <div>
                <h2 className="text-2xl font-semibold text-gray-800">Nhận xét</h2>
                {nonEmptyReviews.length > 0 ? (
                  <ul className="space-y-4 mt-4">
                    {nonEmptyReviews.map((review, index) => (
                      <li key={index} className="bg-white p-4 rounded-lg shadow-md">
                        <div className="flex items-center">
                          <div className="flex items-center text-black text-xl font-semibold">
                            {review.rating}
                            <Star className="w-5 h-5 ml-1 text-black" />
                          </div>
                          <p className="ml-2 text-sm text-gray-500">{review.author_name}</p>
                        </div>
                        <p className="mt-2 text-gray-700">{review.text}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">No reviews available</p>
                )}
              </div>
            </div>

            <div className="flex items-start justify-center w-1/3">
              {shopDetails.rating !== undefined ? (
                <div className="flex flex-col items-center justify-center text-center space-y-2  bg-white px-20 py-4 m-10 sticky top-40 border-2 border-black rounded-lg">
                  <span className="font-semibold text-black text-3xl">
                    {shopDetails.rating}
                  </span>
                  <span className="flex items-center gap-1 text-black text-3xl">
                    <Star />
                    <Star />
                    <Star />
                    <Star />
                    <Star />
                  </span>
                  <span className="text-gray-500 text-lg">
                    ({shopDetails.user_ratings_total} đánh giá)
                  </span>
                </div>
              ) : (
                <p className="text-gray-500">No rating available</p>
              )}
            </div>
          </section>
        </main>

        <footer className="bg-gray-800 text-white py-6 mt-auto">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <p>&copy; 2024 Where is my cafein. All rights reserved.</p>
          </div>
        </footer>

        <WishlistPopup
          isOpen={isWishlistOpen}
          onClose={() => setIsWishlistOpen(false)}
          onOpen={() => setIsWishlistOpen(true)}
          userToken={userToken}
          userId={userId}
          placeId={selectedPlaceId}
        />
      </div>
      : <p>Loading...</p>
  );
}