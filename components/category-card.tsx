import Image from "next/image";
import Link from "next/link";

interface CategoryCardProps {
  icon: string;
  title: string;
  auctions: object[]
}

export function CategoryCard({  title}: CategoryCardProps) {
  return (
    <Link href={`/auctions?category=${title}`}>
      <div className="flex flex-col items-center justify-center border-2 border-white rounded-md gap-4">
        <div className="flex justify-center">
          <Image
            src="/assets/category.png"
            alt={title}
            width={100}
            height={100}
            className="object-cove py-2 w-full h-full"
          />
        </div>

        <div className="border-t-2 border-white w-full text-center py-2">
          <h1 className="text-[20px] font-bold text-white">Fashion</h1>
          {/* Dynamic auction count (when ready) */}
          {/* <h1 className="text-[16px] font-medium text-white">{auctions.length} Items</h1> */}
        </div>
      </div>
    </Link>
  );
}
