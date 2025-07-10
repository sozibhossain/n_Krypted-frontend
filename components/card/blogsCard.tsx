import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import { Calendar, UserRound, ArrowUpRight } from "lucide-react"
import Link from "next/link"

interface Blog {
  _id: string
  image?: string
  title: string
  createdAt: string
}

function BlogsCard({ blog }: { blog: Blog }) {
  return (
    <Link href={`/blog/${blog?._id}`} className="group block">
      <Card className="overflow-hidden border-none bg-white dark:bg-gray-900 shadow-sm hover:shadow-xl transition-all duration-500 ease-out transform hover:-translate-y-2 max-w-[370px] group-hover:scale-[1.02]">
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <Image
            src={blog?.image || "/placeholder.svg?height=222&width=370"}
            alt="Blog Image"
            width={1000}
            height={1000}
            className="h-[205px] lg:h-[222px] w-full object-cover transition-all duration-700 ease-out group-hover:scale-110"
          />
          <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
            <div className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg">
              <ArrowUpRight className="w-4 h-4 text-gray-800" />
            </div>
          </div>
        </div>

        <div className="p-6">
          <CardContent className="p-0">
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-1.5 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors duration-300">
                  <UserRound className="w-3 h-3" />
                </div>
                <span className="text-xs font-medium">Admin</span>
              </div>

              <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-1.5 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors duration-300">
                  <Calendar className="w-3 h-3" />
                </div>
                <span className="text-xs font-medium">
                  {new Date(blog?.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>

            <h3 className="font-semibold text-lg leading-tight text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 line-clamp-2">
              {blog?.title}
            </h3>

            <div className="mt-4 flex items-center text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
              <span className="text-sm font-medium">Read more</span>
              <ArrowUpRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
            </div>
          </CardContent>
        </div>

        {/* Animated border */}
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl" />
      </Card>
    </Link>
  )
}

export default BlogsCard
