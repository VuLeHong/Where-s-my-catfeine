import { useEffect, useRef, useState, SyntheticEvent } from "react";
import { useToast } from "@/hooks/use-toast"
import Link from "next/link";
import { BookmarkPlus } from 'lucide-react';
import { BookmarkCheck } from 'lucide-react';
import { Trash2 } from 'lucide-react';

interface WishlistPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
  userToken: string | null
  userId: string | null
  placeId: string | null
}

interface Collection {
  coffeeIds: string[],
  collectionId: string,
  createdAt: Date,
  name: string,
  updatedAt: Date
}

export function WishlistPopup({ isOpen, onClose, onOpen, userToken, userId, placeId }: WishlistPopupProps) {
  const popupRef = useRef<HTMLDivElement | null>(null);
  const [isCreatePopupOpen, setCreatePopupOpen] = useState(false);
  const [name, setName] = useState("");
  const { toast } = useToast()
  const [userWishlistState, setUserWishlistState] = useState<Collection[]>([]);

  useEffect(() => {
    if (userId && userToken) {
      (async () => {
        const response = await fetch(`http://localhost:8080/user/get/${userId}`, {
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
  }, [userId, userToken]);

  useEffect(() => {
    if (isOpen || isCreatePopupOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, isCreatePopupOpen]);

  const handleOutsideClick = (e: React.MouseEvent) => {
    if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  const handleCreateWishlist = () => {
    setCreatePopupOpen(true);
    onClose();
  };

  const handleCreateSubmit = async (e: SyntheticEvent) => {
    try {
      e.preventDefault();
      const response = await fetch(`http://localhost:8080/collection/create/${userId}`, {
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
      onOpen();
      setName("");

      (async () => {
        const response = await fetch(`http://localhost:8080/user/get/${userId}`, {
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
      setCreatePopupOpen(false);
      onOpen();
      (async () => {
        const response = await fetch(`http://localhost:8080/user/get/${userId}`, {
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
      console.error(error);
      toast({ title: "Error", description: "Failed to delete wishlist." });
    }
  }

  const handleAddCoffeeToWishlist = async (
    e: SyntheticEvent,
    collectionId: string,
    coffeeId: string | null
  ) => {
    e.stopPropagation();

    try {
      const response = await fetch(
        `http://localhost:8080/collection/add-coffee/${collectionId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
          body: JSON.stringify({
            coffeeId: coffeeId,
          }),
        });

      if (!response.ok) {
        throw new Error("Failed to add coffee shop to wishlist");
      }

      onOpen();
      toast({
        title: "Add coffee success",
      });

      (async () => {
        const response = await fetch(`http://localhost:8080/user/get/${userId}`, {
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
      console.error("Error adding coffee to wishlist:", error);
    }
  };

  const handleDeleteCoffeeId = async (e: SyntheticEvent,
    collectionId: string,
    coffeeId: string | null) => {
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
            coffeeId: coffeeId,
          }),
        });

      if (!response.ok) {
        toast({
          title: "Delete failed",
        })
      }

      toast({
        title: "Delete success",
      });
      onOpen();

      (async () => {
        const response = await fetch(`http://localhost:8080/user/get/${userId}`, {
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
      console.error(error);
      toast({ title: "Error", description: "Failed to delete coffee shop from wishlist" });
    }
  }


  const handleCloseCreatePopup = () => {
    setCreatePopupOpen(false);
    onClose();
  };

  if (!isOpen && !isCreatePopupOpen) return null;

  return (
    <div
      className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-40"
      onClick={handleOutsideClick}
    >
      {!isCreatePopupOpen && (
        <div
          ref={popupRef}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] bg-white shadow-lg rounded-lg z-50 p-6 flex flex-col items-center"
        >
          <div className="flex flex-col justify-center items-center w-full">
            <button
              onClick={onClose}
              className="absolute top-4 left-4 text-xl font-bold text-gray-800 hover:text-red-500"
            >
              x
            </button>

            <h3 className="text-2xl font-semibold text-gray-800 text-center mb-6">
              Save to your wishlist
            </h3>

            <ul className="mt-4 space-y-4 w-full">
              {userWishlistState.length > 0 ? (
                userWishlistState.map((wishlist, index) => (
                  <li
                    key={index}
                    className="grid grid-cols-3 p-3 rounded-lg hover:bg-gray-100 cursor-pointer"
                  >
                    <Link
                      href={`/detail_collection/${wishlist.collectionId}`}
                      className="col-span-2"
                    >
                      <span className="text-gray-700">{wishlist.name}
                      </span>
                    </Link>
                    <div className="flex items-center col-span-1">
                      {placeId && wishlist.coffeeIds.includes(placeId) ?
                        <button
                          onClick={(e: SyntheticEvent) => handleDeleteCoffeeId(e, wishlist.collectionId, placeId)}
                          className="text-green-500 hover:text-green-700 font-bold ml-4 text-xl hover:bg-green-200 p-2 rounded-full transition-all"
                        >
                          <BookmarkCheck />
                        </button>
                        :
                        <button
                          onClick={(e: SyntheticEvent) => handleAddCoffeeToWishlist(e, wishlist.collectionId, placeId)}
                          className="text-green-500 hover:text-green-700 font-bold ml-4 text-xl hover:bg-green-200 p-2 rounded-full transition-all"
                        >
                          <BookmarkPlus />
                        </button>
                      }
                      <button
                        onClick={(e: SyntheticEvent) => handleDeleteWishlist(e, wishlist.collectionId)}
                        className="text-red-500 hover:text-red-700 font-bold ml-4 text-xl hover:bg-red-200 p-2 rounded-full transition-all"
                      >
                        <Trash2 />
                      </button>
                    </div>
                  </li>
                ))
              ) : (
                <p className="text-gray-500 text-center">No items in your wishlist yet.</p>
              )}
            </ul>

            <button
              onClick={handleCreateWishlist}
              className="mt-6 w-full py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
            >
              Create new wishlist
            </button>
          </div>
        </div>
      )}

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
                onClick={handleCreateSubmit}
                className="w-full py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
              >
                Create Wishlist
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
