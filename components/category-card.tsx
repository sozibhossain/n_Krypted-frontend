import Image from "next/image";
import Link from "next/link";

interface CategoryCardProps {
  icon: string;
  title: string;
  auctions : object[]
}

export function CategoryCard({ icon, title, auctions }: CategoryCardProps) {
  return (
    <Link
      href={`/auctions?category=${title}`}
      className="flex flex-col items-center justify-center gap-3 bg-[#645949] p-4 text-center transition-all hover:bg-[#645949]/90 h-[100px] w-[150px] relative mt-10"
    >
      {icon && (
        <div className="absolute w-[110px] h-[80px] -top-10 rounded-md overflow-hidden">
          <Image
            src={icon}
            alt={title}
            fill
            className="object-cover"
          />
        </div>
      )}

      <div className="mt-10">
        <h1 className="text-[16px] font-medium text-white">{title}</h1>
        {/* Later you can show dynamic auction count */}
        <h1 className="text-[16px] font-medium text-white">{auctions.length} Items</h1>
      </div>
    </Link>
  );
}
