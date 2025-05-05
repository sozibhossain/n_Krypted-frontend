"use client";
import React, { useEffect, useState } from "react";
import BlogsCard from "@/components/card/blogsCard";
import PathTracker from "@/Shared/PathTracker";
import { Blog } from "./type";

function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/admin/blogs/all`
        );
        const data = await res.json();
        setBlogs(data?.data || []);
      } catch (error) {
        console.error("Failed to fetch blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <section className="container mt-24">
      <div className="border-b border-black pb-5">
        <PathTracker />
      </div>
      <div className="flex items-center justify-center py-8">
        <h1 className="text-4xl font-bold">Blogs</h1>
      </div>

      {loading ? (
        <p className="text-center">Loading blogs...</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {blogs.map((blog: Blog) => (
            <BlogsCard key={blog._id} blog={blog} />
          ))}
        </div>
      )}
    </section>
  );
}

export default Blogs;
