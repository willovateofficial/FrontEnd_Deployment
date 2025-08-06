import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import AddToCartModal from "../components/user/AddToCartModal";
import { HiChevronRight } from "react-icons/hi";
import UserCart from "../components/user/UserCart";
import { baseUrl } from "../config";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type ProductMetadata = {
  priceHalf?: number;
  priceFull?: number;
  spiceLevel?: number;
  ingredients?: string;
  about?: string;
  images?: string[];
  favorite?: boolean;
};

type Dish = {
  id: number;
  name: string;
  description: string;
  spiceLevel: number;
  priceHalf?: number;
  price: number;
  image: string;
  favorite: boolean;
  category?: string;
  metadata?: ProductMetadata;
  isActive?: boolean;
};

interface CartItem {
  id: number;
  name: string;
  image: string;
  price: number;
  quantity: number;
  size: "half" | "full";
}

const baseURL = baseUrl;

const CategoryPage = () => {
  const location = useLocation();

  const rawCategory = location.pathname.split("/").pop();
  const pathCategory: string =
    typeof rawCategory === "string" && rawCategory.length > 0
      ? decodeURIComponent(rawCategory)
      : "All";

  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Dish | null>(null);
  const [pairedItems, setPairedItems] = useState([
    { name: "Salad", price: 30 },
    { name: "Cold Drink", price: 40 },
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSize, setSelectedSize] = useState<"half" | "full">("full");
  const [allCategories, setAllCategories] = useState<string[]>(["All"]);

  const handleAddClick = (item: Dish) => {
    if (!item.isActive) {
      toast.warn(
        "❌ This dish is currently not available. Please choose another."
      );
      return;
    }
    setSelectedItem(item);
    setSelectedSize("full");
    setQuantity(1);
    setShowModal(true);
  };

  const handleAddToCart = () => {
    if (!selectedItem) return;

    const price =
      selectedSize === "half"
        ? selectedItem.priceHalf || selectedItem.price
        : selectedItem.price;

    const newItem: CartItem = {
      id: selectedItem.id,
      name: selectedItem.name,
      image: selectedItem.image,
      price,
      quantity,
      size: selectedSize,
    };

    setCartItems((prev) => [...prev, newItem]);
    setShowModal(false);
    setQuantity(1);
    setSelectedSize("full");
    setPairedItems((prev) => prev.map((item) => ({ ...item, checked: false })));
  };

  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const handleIncrement = (id: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const handleDecrement = (id: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  useEffect(() => {
    const fetchDishes = async () => {
      try {
        const businessId = localStorage.getItem("businessId") || "1";
        const token = localStorage.getItem("authToken");

        const response = await axios.get(`${baseURL}/api/products`, {
          params: { businessId },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const mappedDishes: Dish[] = response.data.map((item: any) => ({
          id: item.id,
          name: item.name,
          description: item.description || "",
          priceHalf: item.metadata?.priceHalf,
          price: item.price,
          spiceLevel: item.metadata?.spiciness || 0,
          favorite: item.metadata?.favorite || false,
          image:
            item.metadata?.images?.[0] || "https://via.placeholder.com/300",
          category: item.category || "Uncategorized",
          metadata: item.metadata,
          isActive: item.isActive ?? true,
        }));

        setDishes(mappedDishes);

        // ✅ Fetch all categories from server
        const categoryResponse = await axios.get(`${baseURL}/api/categories`, {
          params: { businessId },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const fetchedCategories = categoryResponse.data.map((c: any) => c.name);
        setAllCategories(["All", ...fetchedCategories]);

        // ✅ Auto select matching category
        const normalize = (str: string) =>
          str.toLowerCase().replace(/\s+/g, "").replace(/-/g, "");

        const matchedCategory = fetchedCategories.find(
          (cat: string) => normalize(cat) === normalize(pathCategory)
        );

        setSelectedCategory(matchedCategory ?? "All");
      } catch (err) {
        console.error("Failed to fetch dishes or categories:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDishes();
  }, [location.pathname, pathCategory]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value.trim() !== "") {
      setSelectedCategory("All");
    }
  };

  const filteredItems = dishes
    .filter((item) =>
      selectedCategory === "All"
        ? true
        : item.category?.toLowerCase() === selectedCategory.toLowerCase()
    )
    .filter(
      (item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-10 animate-fade-in">
        <div className="relative w-full sm:w-1/2 group">
          <input
            type="text"
            placeholder="Discover tasty dishes..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full pl-14 pr-6 py-4 rounded-3xl border border-white-200 bg-white/80 backdrop-blur-sm shadow-lg focus:ring-2 focus:ring-orange-600 focus:border-orange-600 transition-all duration-300 text-gray-900 placeholder-gray-400 text-base font-medium"
          />
        </div>

        <div className="relative w-full sm:w-64 group">
          <select
            aria-label="Select food category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="appearance-none w-full px-6 py-4 rounded-3xl border border-white-200 bg-white/80 backdrop-blur-sm text-gray-900 text-base font-medium shadow-lg focus:ring-2 focus:ring-orange-600 focus:border-orange-600 transition-all duration-300 cursor-pointer hover:bg-orange-50"
          >
            {allCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute right-5 top-1/2 transform -translate-y-1/2 text-orange-600 transition-transform duration-300 group-hover:rotate-180">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      </div>
      {loading ? (
        <p>Loading dishes...</p>
      ) : filteredItems.length === 0 ? (
        <div className="text-center text-gray-600 mt-10 text-lg font-semibold">
          No dishes found in this category.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-lg p-5 flex flex-col gap-4 hover:shadow-2xl hover:scale-[1.01] transition-transform duration-300"
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900">
                    {item.name}
                  </h3>
                  <div className="flex gap-1 text-lg mt-2">
                    {Array.from({ length: item.spiceLevel }).map((_, i) => (
                      <span key={i} style={{ fontSize: "1.2rem" }}>
                        🌶️
                      </span>
                    ))}
                  </div>
                  <p className="text-md text-gray-800 leading-snug mt-3">
                    Spicy & Saucy! {item.description}
                  </p>
                </div>
                <div className="relative w-28 h-28 shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover rounded-lg border-2 border-gray-200"
                  />
                  {item.isActive ? (
                    <button
                      onClick={() => handleAddClick(item)}
                      className="absolute bottom-[-10px] left-1/2 transform -translate-x-1/2 text-md font-bold text-green-600 border border-green-500 bg-white px-3 py-0.5 rounded-full shadow"
                    >
                      ADD
                    </button>
                  ) : (
                    <span className="absolute bottom-[-10px] left-1/2 transform -translate-x-1/2 text-xs font-bold text-red-600 border border-red-400 bg-white px-3 py-0.5 rounded-full shadow">
                      Not Available
                    </span>
                  )}
                </div>
              </div>
              <div className="w-full flex justify-center mt-4">
                <div className="inline-flex items-center border border-gray-300 rounded-md shadow-sm overflow-hidden bg-white">
                  {item.priceHalf && item.priceHalf > 0 ? (
                    <>
                      <div className="flex items-center px-4 py-2 text-sm font-bold text-black border-r border-gray-300">
                        1 Half
                        <span className="ml-4 px-4 py-1 text-sm font-bold text-white bg-[#028643] rounded">
                          ₹{item.priceHalf}
                        </span>
                      </div>
                      <div className="flex items-center px-4 py-2 text-sm font-bold text-black">
                        1 Full
                        <span className="ml-4 px-4 py-1 text-sm font-bold text-white bg-[#028643] rounded">
                          ₹{item.price}
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center px-4 py-1 text-xl font-bold text-black">
                      1 Full
                      <span className="ml-4 px-4 py-1 text-xl font-bold text-white bg-[#028643] rounded">
                        ₹{item.price}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && selectedItem && (
        <AddToCartModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          itemName={selectedItem?.name || ""}
          itemPrice={selectedItem?.price}
          halfPlatePrice={selectedItem?.priceHalf}
          hasHalfPlate={!!selectedItem?.priceHalf && selectedItem.priceHalf > 0}
          selectedSize={selectedSize}
          onSizeChange={setSelectedSize}
          pairedItems={pairedItems}
          quantity={quantity}
          onQuantityChange={setQuantity}
          onAddToCart={handleAddToCart}
        />
      )}

      {cartItems.length > 0 && (
        <div className="fixed bottom-0 left-0 w-full z-50 px-4 pb-4">
          <div className="bg-white rounded-xl shadow-xl p-2">
            <p className="text-center text-sm text-black mb-2">
              Add Paired items to get{" "}
              <span className="font-bold">'DELICIOUS TASTE'</span>
            </p>
            <div className="bg-[#028643] rounded-xl px-6 py-4 flex items-center justify-between text-white">
              <span className="font-bold text-lg">
                {cartItems.length} item{cartItems.length > 1 ? "s" : ""} added
              </span>
              <button
                onClick={() => setCartOpen(true)}
                className="flex font-bold text-lg"
              >
                View Cart <HiChevronRight className="text-3xl" />
              </button>
            </div>
          </div>
        </div>
      )}

      {cartOpen && (
        <UserCart
          items={cartItems}
          onItemDelete={(id) => {
            setCartItems((prev) => prev.filter((item) => item.id !== id));
          }}
          onClose={() => setCartOpen(false)}
          onIncrement={handleIncrement}
          onDecrement={handleDecrement}
          onNextStep={() => console.log("Proceeding to checkout")}
        />
      )}
    </div>
  );
};

export default CategoryPage;
