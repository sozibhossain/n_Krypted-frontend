"use client";
import { Button } from "@/components/ui/button";
import { ArticleCard } from "@/components/article-card";
import { MoveRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Blog } from "@/app/blog/_components/type";
import Link from "next/link";

export function ArticlesSection() {
  const [articles, setArticles] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/admin/blogs/all`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const res = await response.json();
        // Assuming the API returns an array of articles
        // Slice to get first 3 articles
        setArticles(res.data); // Get first 3 articles
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);
  // console.log(articles);

  if (loading) {
    return <div className="container mt-24">Loading articles...</div>;
  }

  if (error) {
    return <div className="container mt-24">Error: {error}</div>;
  }

  return (
    <section className="container mt-24">
      <div className="">
        <div className="grid grid-cols-5 gap-5 mb-8">
          <div className="col-span-4 lg:col-span-4">
            <div className="grid grid-cols-2">
              <div className="col-span-1 lg:col-span-1">
                <h1 className="text-2xl font-bold tracking-tight md:text-5xl">
                  Exploring Our Articles
                </h1>
              </div>
              <div className="col-span-2 lg:col-span-1">
                <p className="">
                  Dive into expert insights, auction tips, and inspiring stories
                  from the world of rare collectibles. Our articles are designed
                  to keep you informed, engaged, and ready to make confident
                  bidding decisions.
                </p>
              </div>
            </div>
          </div>

          <div className="col-span-1 lg:col-span-1 lg:text-end">
            <Link href="/blog" className="ml-[-80px] lg:ml-0">
              <Button className="bg-[#645949]">
                Explore All <MoveRight />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        {articles.slice(0, 3).map((article, index) => (
          <ArticleCard key={article._id} article={article} index={index} />
        ))}
      </div>
    </section>
  );
}
