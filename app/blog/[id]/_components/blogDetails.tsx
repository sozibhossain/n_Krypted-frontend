"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Blog } from "../../_components/type";
import { useParams } from "next/navigation";
import BlogComments from "./blogComments";
import { Calendar } from "lucide-react";

interface BlogDetailsProps {
  id?: string;
}

const BlogDetails: React.FC<BlogDetailsProps> = ({ id }) => {
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();
  const blogId = id || (params?.id as string);

  useEffect(() => {
    if (!blogId) {
      setError("No blog ID provided");
      setLoading(false);
      return;
    }

    const fetchBlog = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/admin/blogs/${blogId}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setBlog(data.data);
      } catch (err) {
        console.error("Failed to fetch blog:", err);
        setError(err instanceof Error ? err.message : "Failed to load blog");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [blogId]);

  // const sanitizeContent = (html: string) => {
  //   // Only sanitize in browser environment
  //   if (typeof window !== "undefined") {
  //     return DOMPurify.sanitize(html);
  //   }
  //   return html;
  // };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Loading blog post...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 p-4">
        <p>Error: {error}</p>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="p-4">
        <p>Blog not found</p>
      </div>
    );
  }

  return (
    <div className="py-10">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-black pb-4">
            {blog.title}
          </h1>
          <div className="mt-2 text-[#645949] text-[18px] flex items-center gap-2">
            <div>
              <Calendar />
            </div>
            {new Date(blog.updatedAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </div>
        </div>

        <div className="relative aspect-video rounded-xl overflow-hidden">
          <Image
            src={blog.image || "/default-image.jpg"}
            alt={blog.title || "Blog image"}
            width={800}
            height={450}
            className="object-cover w-full h-full"
            priority
          />
        </div>

        <div className="text-[#444444] font-[16px] leading-[19.2px]">
          <div
            className="list-item list-none"
            dangerouslySetInnerHTML={{
              __html: blog?.content ?? "Blog Description",
            }}
          />
        </div>

        <div className="mt-12">
          {blogId && <BlogComments blogId={blogId} />}
        </div>
      </div>
    </div>
  );
};

export default BlogDetails;
