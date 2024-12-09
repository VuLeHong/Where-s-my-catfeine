import { useEffect, useState, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import Link from 'next/link';
import Dropdown from '../dropdown';
import { WishlistPopup } from "../wishlist_popup";

interface DetailPageProps {
  placeId: string;
}

export default function DetailPage({ placeId }: DetailPageProps) {
  const [shopDetails, setShopDetails] = useState<google.maps.places.PlaceResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPopupOpen, setIsPopupOpen] = useState(false); // Điều khiển việc mở popup

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
          { placeId },
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

  const handlePopupOpen = () => {
    setIsPopupOpen(true); // Mở popup
  };

  const handlePopupClose = () => {
    setIsPopupOpen(false); // Đóng popup
  };

  if (isLoading) return <p>Loading...</p>;
  if (!shopDetails) return <p>Could not find details.</p>;

  const openingHours = shopDetails.opening_hours?.periods?.[0];

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col relative">
      <header className="bg-white p-4 shadow-md z-10">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="text-xl font-bold text-red-500">
            <Link href={"/"}>Where is my cafein</Link>
          </div>
          <Dropdown />
        </div>
      </header>

      <div className="flex flex-col md:flex-row items-center md:items-start mt-6 ml-[3vh]">
        <div className="flex flex-col items-center md:items-start md:w-2/3">
          <h1 className="text-4xl font-bold text-gray-800">{shopDetails.name}</h1>
          <p className="text-xl text-gray-600">{shopDetails.vicinity}</p>

          {shopDetails.rating !== undefined ? (
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-yellow-500">
                {shopDetails.rating}⭐
              </span>
              <span className="text-gray-500">({shopDetails.user_ratings_total} reviews)</span>
            </div>
          ) : (
            <p className="text-gray-500">No rating available</p>
          )}

          {shopDetails.photos && shopDetails.photos.length > 0 && (
            <div className="my-6">
              <img
                src={shopDetails.photos[0].getUrl({ maxWidth: 900, maxHeight: 900 })}
                alt={shopDetails.name}
                className="rounded-lg w-full h-auto object-cover"
              />
            </div>
          )}
        </div>
      </div>

      <div className="md:w-full mt-6 space-y-6 pl-[3vh]">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">Address</h2>
          <p className="text-gray-600">{shopDetails.formatted_address || 'No description available.'}</p>
        </div>
        {openingHours && (
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">Opening Hours</h2>
            <p className="text-gray-600">
                {openingHours.open?.time && openingHours.close?.time
                ? `${formatTime(openingHours.open.time)} - ${formatTime(openingHours.close.time)}`
                : 'Not available'}
            </p>
          </div>
        )}
      </div>

      {shopDetails.reviews && shopDetails.reviews.length > 0 && (
        <div className="my-6 pl-[3vh]">
          <h2 className="text-2xl font-semibold text-gray-800">Reviews</h2>
          <ul className="space-y-4">
            {shopDetails.reviews.map((review, index) => (
              <li key={index} className="bg-gray-50 p-4 rounded-lg shadow-md">
                <div className="flex items-center">
                  <div className="text-yellow-500">
                    {review.rating}⭐
                  </div>
                  <p className="ml-2 text-sm text-gray-500">{review.author_name}</p>
                </div>
                <p className="mt-2 text-gray-700">{review.text}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-6 flex justify-center gap-6 mb-[3vh]">
        <button 
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            onClick={handlePopupOpen}
        >
          Add to Wishlist
        </button>
      </div>

      <footer className="bg-gray-800 text-white py-6">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p>&copy; 2024 Where is my cafein. All rights reserved.</p>
        </div>
      </footer>

      <WishlistPopup
        isOpen={isPopupOpen}
        onClose={handlePopupClose}
        placeId={placeId}
      />
    </div>
  );
}
