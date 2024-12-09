'use client';

import { useState, useEffect, useRef } from 'react';
import Image from "next/image";
import Dropdown from "../dropdown";
import Link from "next/link";
import { WishlistPopup } from "../wishlist_popup";
import { Heart } from "@/components/ui/Heart";
import { Loader } from '@googlemaps/js-api-loader';

export default function HomePage() {
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [locationInMap, setLocationInMap] = useState<{ lat: number; lng: number } | null>(null);
  const [coffeeShops, setCoffeeShops] = useState<google.maps.places.PlaceResult[]>([]);
  const mapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);

  useEffect(() => {
    const initializeMap = async () => {
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY as string,
        version: 'quarterly',
        libraries: ['places'],
      });

      await loader.load();

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLocationInMap({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          },
          (err) => {
            console.error("Cannot retrieve location:", err.message);
          }
        );
      } else {
        console.error("Browser does not support Geolocation");
      }
    };

    initializeMap();
  }, []);

  useEffect(() => {
    const loadMapAndFetchCoffeeShops = async () => {
      if (locationInMap && mapRef.current && google) {
        const map = new google.maps.Map(mapRef.current, {
          center: locationInMap,
          zoom: 15,
          mapId: 'NEXT_MAPS_TUTS',
        });

        mapInstanceRef.current = map;

        const userMarker = new google.maps.Marker({
          map: map,
          position: locationInMap,
        });

        const autocomplete = new google.maps.places.Autocomplete(inputRef.current as HTMLInputElement);
        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();
          if (place.geometry && place.geometry.location) {
            const newLocation = place.geometry.location.toJSON();
            setLocationInMap(newLocation);
            map.setCenter(newLocation);
            userMarker.setPosition(newLocation);

            markersRef.current.forEach((marker) => marker.setMap(null));
            markersRef.current = [];

            fetchCoffeeShops(map, newLocation);
          } else {
            alert('Invalid location. Please select another location.');
          }
        });

        fetchCoffeeShops(map, locationInMap);
      }
    };

    const fetchCoffeeShops = (map: google.maps.Map, location: { lat: number; lng: number }) => {
      const service = new google.maps.places.PlacesService(map);
      const infoWindow = new google.maps.InfoWindow();

      service.nearbySearch(
        {
          location: location,
          radius: 5000,
          type: 'cafe',
        },
        (results, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && results) {
            setCoffeeShops(results);

            results.forEach((place) => {
              if (place.geometry && place.geometry.location) {
                const marker = new google.maps.Marker({
                  map: map,
                  position: place.geometry.location,
                  title: place.name,
                  icon: {
                    url: '/marker_coffee_icon.png',
                    scaledSize: new google.maps.Size(30, 30),
                  },
                });

                markersRef.current.push(marker);

                marker.addListener('click', () => {
                  const contentString = `
                    <div>
                      <h3>${place.name}</h3>
                      <p>${place.vicinity}</p>
                      ${place.rating ? `<p>Rating: ${place.rating}</p>` : ''}
                      ${place.user_ratings_total ? `<p>Total Ratings: ${place.user_ratings_total}</p>` : ''}
                      ${place.opening_hours && place.opening_hours.isOpen()
                        ? `<p>Status: Open Now</p>`
                        : `<p>Status: Closed</p>`}
                    </div>
                  `;

                  infoWindow.setContent(contentString);
                  infoWindow.open(map, marker);
                });
              }
            });
          } else {
            console.error('Error fetching coffee shops:', status);
          }
        }
      );
    };

    loadMapAndFetchCoffeeShops();
  }, [locationInMap]);

  const focusOnPlace = (place: google.maps.places.PlaceResult) => {
    if (mapInstanceRef.current && place.geometry && place.geometry.location) {
      mapInstanceRef.current.setCenter(place.geometry.location);
      mapInstanceRef.current.setZoom(18);
    }
  };

  const getPlaceImageUrl = (photos: google.maps.places.PlacePhoto[] | undefined) => {
    if (photos && photos.length > 0) {
      return photos[0].getUrl({ maxWidth: 400, maxHeight: 400 });
    }
    return '/default-cafe-image.jpg';
  };

    return (
      <div className="bg-gray-100 min-h-screen flex flex-col relative">
        <header className="bg-white p-4 shadow-md z-10">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <div className="text-xl font-bold text-red-500">
              <Link href={"/"}>Where is my cafein</Link>
            </div>
            <div className="flex items-center space-x-4">
              <input
                ref={inputRef}
                type="text"
                placeholder="Tìm kiếm"
                className="p-2 border rounded-full w-64 text-black"
              />
              <button className="bg-red-500 text-white px-6 py-2 rounded-full hover:bg-red-600">
                Tìm kiếm
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <button className="text-gray-600 hover:text-gray-800">
                <Link href={'/signup'}>Sign up</Link>
              </button>
              <button className="text-gray-600 hover:text-gray-800">
                <Link href={'/login'}>Log in</Link>
              </button>
            </div>
            <Dropdown />
          </div>
        </header>
        
        <main className="flex-grow py-8 bg-gray-200 flex">
          <div className="w-1/4 p-4 overflow-y-auto h-[calc(100vh-64px)]">
            <h2 className="text-3xl font-semibold mb-8 text-black">Nổi bật</h2>
            <div className="space-y-6">
            {coffeeShops.map((shop, index) => (
              <div
                key={index}
                className="bg-white shadow-lg rounded-lg overflow-hidden relative cursor-pointer"
                onClick={() => focusOnPlace(shop)}
              >
                <div className="relative">
                  <Image
                    src={getPlaceImageUrl(shop.photos)}
                    alt={`Image of ${shop.name}`}
                    width={400}
                    height={400}
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-black font-semibold">{shop.name}</h3>
                  <p className="text-gray-500">{shop.vicinity}</p>
                  {shop.rating && <p className="text-gray-500">Rating: {shop.rating}</p>}
                  {shop.user_ratings_total && (
                    <p className="text-gray-500">Total Ratings: {shop.user_ratings_total}</p>
                  )}
                  <div className="absolute bottom-4 right-4 flex items-center gap-2">
                    <a
                      href={`/detail/${shop.place_id}`}
                      className="text-blue-500"
                      onClick={(e) => e.stopPropagation()}
                      aria-label={`More details about ${shop.name}`}
                    >
                      More
                    </a>
                    <button
                      className="text-red-500"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsWishlistOpen(true);
                      }}
                    >
                      <Heart />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            </div>
          </div>
          <div className="w-3/4 p-4" ref={mapRef} style={{ height: 'calc(100vh - 64px)' }} />
        </main>

        <footer className="bg-gray-800 text-white py-6">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <p>&copy; 2024 Where is my cafein. All rights reserved.</p>
          </div>
        </footer>
        <WishlistPopup isOpen={isWishlistOpen} onClose={() => setIsWishlistOpen(false)} />
      </div>
    );
  }
