import Image from 'next/image';
import pic1 from '../../utils/cafeshop1.jpeg';
import pic2 from '../../utils/cafeshop2.jpeg';
import pic3 from '../../utils/cafeshop3.jpeg';
import Dropdown from '../dropdown';
import { HeartIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <header className="bg-white p-4 shadow-md z-10">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="text-xl font-bold text-red-500">
            <Link href={'/'}> Where is my cafein</Link>
          </div>
          <div className="flex items-center space-x-4">
            <input
              type="text"
              placeholder="Search"
              className="p-2 border rounded-full w-64"
            />
            <button className="bg-red-500 text-white px-6 py-2 rounded-full hover:bg-red-600">
              Search
            </button>
          </div>
          <div className="flex items-center space-x-4">
            <button className="text-gray-600 hover:text-gray-800"><Link href={'/signup'}>Sign up</Link></button>
            <button className="text-gray-600 hover:text-gray-800"><Link href={'/login'}>Log in</Link></button>
          </div>
          <Dropdown />
        </div>
      </header>
      <main className="flex-grow py-8 bg-gray-200">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-semibold mb-8 text-black">Popular Destinations</h2>
          <div className="flex space-x-8">
            <div className="flex-1 space-y-6">
              <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                <div className="relative w-full h-64">
                  <Image
                    src={pic1}
                    alt="New York"
                    className="w-full h-full object-cover"
                    layout="fill"
                  />
                </div>
                <div className="p-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-lg text-black">New York</h3>
                    <p className="text-gray-600">Explore the city that never sleeps.</p>
                  </div>
                  <HeartIcon className="w-6 h-6 text-red-700 cursor-pointer hover:text-red-800 transition" />
                </div>
              </div>
              <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                <div className="relative w-full h-64">
                  <Image
                    src={pic2} 
                    alt="Paris"
                    className="w-full h-full object-cover"
                    layout="fill"
                  />
                </div>
                <div className="p-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-lg text-black">Paris</h3>
                    <p className="text-gray-600">Experience romance in the city of lights.</p>
                  </div>
                  <HeartIcon className="w-6 h-6 text-gray-400 cursor-pointer hover:text-red-800 transition" />
                </div>
              </div>
              <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                <div className="relative w-full h-64">
                  <Image
                    src={pic3}
                    alt="Tokyo"
                    className="w-full h-full object-cover"
                    layout="fill"
                  />
                </div>
                <div className="p-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-lg text-black">Tokyo</h3>
                    <p className="text-gray-600">Discover the blend of tradition and modernity.</p>
                  </div>
                  <HeartIcon className="w-6 h-6 text-red-700 cursor-pointer hover:text-red-800 transition" />
                </div>
              </div>
            </div>
            <div className="flex-1">
              <div className="bg-white shadow-lg rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-4 text-black">Location</h3>
                <div className="relative w-full h-64 bg-gray-300">
                  <iframe
                    className="w-full h-full rounded"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2445.440933439224!2d-73.9751613839076!3d40.74881777932699!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259af2c7e5f7b%3A0xaadfe2baf6cc1c4!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1629071744635!5m2!1sen!2sus"
                    loading="lazy"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <footer className="bg-gray-800 text-white py-6">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p>&copy; 2024 Where is my cafein. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
