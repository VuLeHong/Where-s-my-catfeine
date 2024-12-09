import { useEffect, useRef, useState } from "react";

interface WishlistPopupProps {
  isOpen: boolean;
  onClose: () => void;
  placeId?: string;  // Thêm placeId vào props nếu cần
}

export function WishlistPopup({ isOpen, onClose, placeId }: WishlistPopupProps) {
  const popupRef = useRef<HTMLDivElement | null>(null);
  const [isCreatePopupOpen, setCreatePopupOpen] = useState(false);
  const [newWishlistName, setNewWishlistName] = useState("");

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

  const handleCreateSubmit = () => {
    alert(`New Wishlist Created: ${newWishlistName}`);
    setCreatePopupOpen(false);
    setNewWishlistName("");
    onClose();
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
              {[{ id: 1, name: "Favorites", count: 3 }, { id: 2, name: "Dream Destinations", count: 5 }, { id: 3, name: "Weekend Getaways", count: 2 }].map((wishlist) => (
                <li
                  key={wishlist.id}
                  className="flex justify-between items-center p-3 rounded-lg hover:bg-gray-100 cursor-pointer"
                >
                  <span className="text-gray-700">{wishlist.name}</span>
                  <span className="text-sm text-gray-500">{wishlist.count} saved</span>
                </li>
              ))}
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

            <input
              type="text"
              value={newWishlistName}
              onChange={(e) => setNewWishlistName(e.target.value)}
              placeholder="Enter wishlist name"
              className="w-full p-3 border border-gray-300 rounded-lg mb-4 text-black"
            />

            <button
              onClick={handleCreateSubmit}
              className="w-full py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
            >
              Create Wishlist
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
