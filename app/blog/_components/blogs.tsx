"use client";
import React, { useEffect, useState } from "react";
import BlogsCard from "@/components/card/blogsCard";
import { Blog } from "./type";
import { PageHeader } from "@/Shared/PageHeader";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blog`);
        const data = await res.json();
        setBlogs(data.blogs);
      } catch (error) {
        console.error("Failed to fetch blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  // Skeleton Loader Component
  const SkeletonBlogCard = () => (
    <div className="max-w-[370px]">
      <Skeleton height={222} width="100%" className="rounded-t-xl" />
      <div className="p-2">
        <div className="flex items-center justify-between mb-4">
          <Skeleton width={100} height={16} />
          <Skeleton width={80} height={16} />
        </div>
        <Skeleton width="80%" height={20} count={2} />
      </div>
    </div>
  );

  return (
    <section>
      <PageHeader title="Our Latest Blogs" imge="/assets/Blogbanner.jpg" />

      <div className="container my-24">
        <h1 className="text-[28px] lg:text-[36px] font-bold mb-8 text-center text-white">
          Stadtgedanken & Durchblicke
        </h1>
        <div className="text-center text-gray-300 mb-12">
          Unser Blog ist für alle, die Städte lieben, mit all ihren Ecken, Ideen
          und Begegnungen.
          <div>
            Bei uns geht’s um Themen, die das urbane Leben bewegen: Wie
            entwickeln sich Städte? Wie entdeckt man neue Lieblingsorte?
          </div>
          <div>
            Und was macht einen richtig guten Tag in der Stadt aus? Lies rein,
            lass dich treiben und finde neue Perspektiven für dein eigenes
            Stadterlebnis.
          </div>
        </div>
      </div>
      <div className="container my-24">
        {loading ? (
          <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
            {/* Display 3 skeleton cards while loading */}
            {[...Array(3)].map((_, index) => (
              <SkeletonBlogCard key={index} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
            {blogs.map((blog: Blog) => (
              <BlogsCard key={blog._id} blog={blog} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default Blogs;
