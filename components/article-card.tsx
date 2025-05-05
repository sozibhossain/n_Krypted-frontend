import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { MoveRight } from "lucide-react";
import { Blog } from "@/app/blog/_components/type";
import Link from "next/link";


interface ArticleCardProps {
  article: Blog;  // Assuming Blog is the type for your article
  index?: number; // Optional index prop for ordering
}

export function ArticleCard({ article }: ArticleCardProps) {
  const { image, title, _id, content } = article;
  return (
    <Card className="overflow-hidden border-none text-white p-0 bg-[#645949] lg:w-[370px] lg:h-[371px]">
      <div className="relative aspect-video overflow-hidden">
        <div className=" absolute left-2 top-2 bg-[#645949] px-4 rounded-md">
          {new Date(article?.updatedAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </div>

        <Image
          src={image || "/assets/manCard.png"}
          alt="Article Image"
          width={400}
          height={225}
          className="h-full w-full object-cover transition-transform"
        />
      </div>

      <CardContent className="p-4">
        <h3 className="mb-2 font-medium text-xl line-clamp-1">{title}</h3>
        <p className="line-clamp-1 sm:text-sm" dangerouslySetInnerHTML={{ __html: content ?? "Blog Description" }} />
      </CardContent>

      <Link href={`/blog/${_id}`} className="flex items-center p-4 gap-2">
        Read more <MoveRight className="mt-[3px]" />
      </Link>
    </Card>
  );
}
