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

interface DetailPageProps {
  placeId: string;
}

export default function DetailPage({ placeId }: DetailPageProps) {
  const [shopDetails, setShopDetails] = useState<google.maps.places.PlaceResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

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
              console.log(result);
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
    setIsPopupOpen(true);
  };

  const handlePopupClose = () => {
    setIsPopupOpen(false);
  };

  if (isLoading) return <p>Loading...</p>;
  if (!shopDetails) return <p>Could not find details.</p>;

  const openingHours = shopDetails.opening_hours?.periods?.[0];

  const nonEmptyReviews = shopDetails.reviews?.filter(review => review.text?.trim() !== '') || [];

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

      <main className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 flex flex-col gap-8 mt-6 pb-12">
        <section className="flex flex-col items-center">
          <div className="flex items-center justify-between w-full mb-4">
            <h1 className="text-4xl font-bold text-gray-800 text-center">{shopDetails.name}</h1>
            <button onClick={handlePopupOpen} ><Heart /></button>
          </div>
          {shopDetails.photos && shopDetails.photos.length > 0 && (
            // <Swiper
            //   modules={[Navigation, Pagination]}
            //   navigation
            //   pagination={{ clickable: true }}
            //   spaceBetween={16}
            //   slidesPerView={1}
            //   loop={true}
            //   autoplay={{
            //     delay: 3000,
            //     disableOnInteraction: true,
            //   }}
            //   speed={500}
            //   className="rounded-lg w-full max-w-lg"
            // >
            //   {shopDetails.photos.map((photo, index) => (
            //     <SwiperSlide key={index}>
            //       <Image
            //         src={photo.getUrl({ maxWidth: 450, maxHeight: 450 })}
            //         alt={`${shopDetails.name} - Photo ${index + 1}`}
            //         className="w-full h-auto object-cover rounded-lg"
            //         width={400}
            //         height={400}
            //       />
            //     </SwiperSlide>
            //   ))}
            // </Swiper>
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

        <section className="flex  flex-col gap-8">
          <div className="flex-1">
            <div>
              <h2 className="text-2xl font-semibold text-gray-800">Address</h2>
              <p className="text-gray-600">{shopDetails.formatted_address || 'No description available.'}</p>
            </div>
            {openingHours && (
              <div className="mt-4">
                <h2 className="text-2xl font-semibold text-gray-800">Opening Hours</h2>
                <p className="text-gray-600">
                  {openingHours.open?.time && openingHours.close?.time
                    ? `${formatTime(openingHours.open.time)} - ${formatTime(openingHours.close.time)}`
                    : 'Not available'}
                </p>
              </div>
            )}
          </div>

          <div className="flex-1 w-2/3">
            <h2 className="text-2xl font-semibold text-gray-800">Reviews</h2>
            {nonEmptyReviews.length > 0 ? (
              <ul className="space-y-4 mt-4">
                {nonEmptyReviews.map((review, index) => (
                  <li key={index} className="bg-white p-4 rounded-lg shadow-md">
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
            ) : (
              <p className="text-gray-500">No reviews available</p>
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
        isOpen={isPopupOpen}
        onClose={handlePopupClose}
        placeId={placeId}
      />
    </div>
  );
}
