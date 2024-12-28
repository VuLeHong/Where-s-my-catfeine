"use client";

import { useState } from "react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast"

export default function Dropdown({ token }: { token: string | undefined }) {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast()

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = async () => {
    try {
      if (token) {
        (async () => {
          const response = await fetch("http://localhost:8080/auth/logout", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token }),
          });
          const result = await response.json();
          if (result.code === 0) {
            toast({
              title: "Logout success",
              description: result.message,
            })
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          }
          else {
            toast({
              title: "Logout failed",
              description: result.message,
            })
          }
        })();
      }

    } catch (err: unknown) {
      toast({
        title: "Logout failed",
        description: err instanceof Error ? err.message : 'An unknown error occurred',
      })
      console.log(err);
    }


  };

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="bg-gray-100 p-2 rounded-full shadow-md flex flex-col justify-center items-center space-y-1"
      >
        <div className="w-6 h-1 bg-gray-700"></div>
        <div className="w-6 h-1 bg-gray-700"></div>
        <div className="w-6 h-1 bg-gray-700"></div>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
          <div className="p-2">
            <Link href={'/favorite'}>
              <button className="w-full text-left p-2 text-gray-700 hover:bg-gray-100">
                Favorite
              </button>
            </Link>
            <button
              onClick={handleLogout}
              className="w-full text-left p-2 text-red-500 hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
