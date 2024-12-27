import { useEffect, useRef, useState, SyntheticEvent } from "react";
import { useToast } from "@/hooks/use-toast"

interface WishlistPopupProps {
  isOpen: boolean;
  onClose: () => void;
  userWishlist: { collectionId: string; name: string; count: number }[];
  userToken: string
  userId: string
  placeId: string | null
}

export function WishlistPopup({ isOpen, onClose, userWishlist, userToken, userId, placeId }: WishlistPopupProps) {
  const popupRef = useRef<HTMLDivElement | null>(null);
  const [isCreatePopupOpen, setCreatePopupOpen] = useState(false);
  const [name, setName] = useState("");
  const { toast } = useToast()

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
        body: JSON.stringify({name}),
      });

      if (!response.ok) {
        throw new Error("Failed to create a new wishlist");
      }

    } catch (error) {
      console.log(error);
    }
    setCreatePopupOpen(false);
    onClose();
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
            coffeeId: placeId,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to add coffee shop to wishlist");
        }
  
    } catch (error) {
      console.error("Error adding coffee to wishlist:", error);
    }
  };
  

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
            {userWishlist.length > 0 ? (
              userWishlist.map((wishlist, index) => (
              <li
                key={index}
                className="flex justify-between items-center p-3 rounded-lg hover:bg-gray-100 cursor-pointer"
              >
                <span className="text-gray-700">{wishlist.name}</span>
                <div className="flex items-center">
                  <button
                    onClick={(e: SyntheticEvent) => handleAddCoffeeToWishlist(e, wishlist.collectionId, placeId)}
                    className="text-green-500 hover:text-green-700 font-bold ml-4 text-xl hover:bg-green-200 p-2 rounded-full transition-all"
                  >
                    +
                  </button>
                  <button
                    onClick={(e: SyntheticEvent) => handleDeleteWishlist(e, wishlist.collectionId)}
                    className="text-red-500 hover:text-red-700 font-bold ml-4 text-xl hover:bg-red-200 p-2 rounded-full transition-all"
                  >
                    x
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
