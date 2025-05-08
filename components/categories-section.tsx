"use client"
import useAxios from "@/hooks/useAxios";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { CategoryCard } from "./category-card";
import { Button } from "./ui/button";
import { MoveLeft, MoveRight } from "lucide-react";



export function CategoriesSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsToShow, setItemsToShow] = useState(6);
  const axiosPublic = useAxios();

  // Responsive items to show
  useEffect(() => {
    const updateItemsToShow = () => {
      if (window.innerWidth < 640) {
        setItemsToShow(2);
      } else if (window.innerWidth < 768) {
        setItemsToShow(3);
      } else if (window.innerWidth < 1024) {
        setItemsToShow(4);
      } else {
        setItemsToShow(6);
      }
    };

    updateItemsToShow();
    window.addEventListener('resize', updateItemsToShow);
    return () => window.removeEventListener('resize', updateItemsToShow);
  }, []);

  const { data: allCategory = [] } = useQuery({
    queryKey: ["category-with-auctions"],
    queryFn: async () => {
      const { data } = await axiosPublic('/admin/categories/with-auctions');
      return data.data;
    }
  });

  const nextSlide = () => {
    if (currentIndex + itemsToShow < allCategory.length) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const visibleCategories = allCategory.slice(
    currentIndex,
    currentIndex + itemsToShow
  );

  useEffect(() => {
    if (allCategory.length > 0 && currentIndex + itemsToShow > allCategory.length) {
      setCurrentIndex(Math.max(0, allCategory.length - itemsToShow));
    }
  }, [itemsToShow, allCategory.length, currentIndex]);

  return (
    <section className="py-12 md:py-16 mt-24">
      <div className="container">
        <div className="flex justify-between items-center mb-8">
          <div className="">
            <div className="flex items-center gap-4">
              <div className="w-5 h-9 bg-white rounded" />
              <div>
                <h1 className="font-benedict text-[40px] font-normal mb-2 text-white">Categories</h1>
              </div>
            </div>
            <p className="text-[40px] font-bold text-white">Explore Our Category</p>
          </div>

          {allCategory.length > itemsToShow && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-[48px] w-[80px] rounded-sm border-[#645949]"
                onClick={prevSlide}
                disabled={currentIndex === 0}
              >
                <MoveLeft className="h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                size="icon"
                className="h-[48px] w-[80px] rounded-sm border-[#645949]"
                onClick={nextSlide}
                disabled={currentIndex + itemsToShow >= allCategory.length}
              >
                <MoveRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <CategoryCard />.
          {/* {visibleCategories.map((category: CategoryType) => (
            <CategoryCard
              key={category._id}
              icon={category.image}
              title={category.name}
              auctions={category.auctions}
            />
          ))} */}
        </div>
      </div>
    </section>
  );
}