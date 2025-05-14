"use client";

import { useEffect, useState } from "react";
import { Blog } from "@/app/blog/_components/type";
import BlogsCard from "./card/blogsCard";

export function BlogsSection() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/blog`
        );
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

  return (
    <section className="container lg:mt-24">
      <div>
        <div className="flex items-center gap-4">
          <div className="w-5 h-9 bg-white rounded" />
          <div>
            <h1 className="font-benedict text-[40px] font-normal mb-2 text-white">Blog</h1>
          </div>
        </div>
        <p className="text-[40px] font-bold text-white">Our Latest Blogs</p>
      </div>

      <div className="py-8">
        {loading ? (
          <p className="text-center">Loading blogs...</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-2">
            {blogs.slice(0, 4).map((blog: Blog) => (
              <BlogsCard key={blog._id} blog={blog} />
            ))}
          </div>
        )}
      </div>


    </section>
  );
}
