import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "./menu-sidebar";
import MenuHeader from "./menu-header";
import DishCard from "./dish-card";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "../config";

interface Dish {
  id: number;
  name: string;
  spiciness?: number;
  description: string;
  price: number;
  image: string;
  favorite: boolean;
  category?: string;
  isActive?: boolean;
  metadata?: {
    priceFull?: number;
    spiciness?: number;
    ingredients?: string;
    about?: string;
    images?: string[];
    favorite?: boolean;
  };
}

interface ProductMetadata {
  priceFull?: number;
  spiciness?: number;
  ingredients?: string;
  about?: string;
  images?: string[];
  favorite?: boolean;
  isActive?: boolean;
}

interface ProductDish {
  id: number;
  name: string;
  description: string;
  price: number;
  metadata?: ProductMetadata;
  category?: string;
  isActive?: boolean;
}

const baseURL = baseUrl;

const MainMenuPage = () => {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const navigate = useNavigate();

  const handleStatusChange = (id: number, newStatus: boolean) => {
    setDishes((prev) =>
      prev.map((dish) =>
        dish.id === id ? { ...dish, isActive: newStatus } : dish
      )
    );
  };

  useEffect(() => {
    const fetchDishes = async () => {
      const token = localStorage.getItem("authToken");
      const businessId = localStorage.getItem("businessId");

      if (!businessId) {
        console.error("Missing businessId in localStorage");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${baseURL}/api/products`, {
          params: { businessId },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const mappedDishes = (response.data as ProductDish[]).map(
          (item: ProductDish) => ({
            id: item.id,
            name: item.name,
            description: item.description,
            price: item.price,
            spiciness: item.metadata?.spiciness ?? 2,
            favorite: item.metadata?.favorite ?? false,
            image: item.metadata?.images?.[0] ?? "",
            category: item.category ?? "",
            isActive: item.isActive ?? true,
            metadata: {
              ...item.metadata,
              priceFull: item.price,
            },
          })
        );

        setDishes(mappedDishes);
      } catch (err) {
        console.error("Failed to fetch dishes:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDishes();
  }, []);

  const handleEdit = (dish: Dish) => {
    navigate("/add-edit-dish", {
      state: {
        dishToEdit: {
          ...dish,
          metadata: {
            ...dish.metadata,
            priceFull: dish.price,
          },
        },
      },
    });
  };

  const filteredDishes = dishes.filter((dish) =>
    selectedCategory
      ? dish.category?.toLowerCase() === selectedCategory.toLowerCase()
      : true
  );

  return (
    <div className="flex flex-col md:flex-row bg-white px-4 sm:px-6 md:px-10 lg:px-12 xl:px-16 2xl:px-20 overflow-hidden">
      <Sidebar onCategorySelect={(category) => setSelectedCategory(category)} />
      <div className="flex-1 flex flex-col px-4 md:px-8 py-6 overflow-hidden">
        <MenuHeader selectedCategory={selectedCategory} />
        <div className="flex-1 mt-6 pr-2">
          {loading ? (
            <div>Loading menu...</div>
          ) : filteredDishes.length === 0 ? (
            <div className="text-center text-gray-500 text-lg mt-10">
              No dishes available for the selected category.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredDishes.map((dish) => (
                <div
                  key={dish.id}
                  className="w-full sm:w-[48%] md:w-[31%] lg:w-[23%] min-w-[220px]"
                >
                  <DishCard
                    dish={dish}
                    onEdit={() => handleEdit(dish)}
                    onDelete={(id) =>
                      setDishes(dishes.filter((d) => d.id !== id))
                    }
                    onStatusChange={handleStatusChange} // ✅ Add this line
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MainMenuPage;
