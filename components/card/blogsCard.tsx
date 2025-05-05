import React from 'react'
import { Card, CardContent } from '../ui/card'
import Image from 'next/image'
import { MoveRight } from 'lucide-react'
import { Blog } from '@/app/blog/_components/type'
import Link from 'next/link'

function BlogsCard({ blog }: { blog: Blog }) {
    return (
        <Card className="overflow-hidden border-none text-white bg-[#645949]">
            <div className="relative aspect-video overflow-hidden">
                <div className="text-[12px] absolute left-2 top-2 bg-[#645949] py-1 px-3 rounded-md">
                    {new Date(blog?.updatedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                    })}
                </div>

                <Image
                    src={blog?.image || '/assets/manCard.png'}
                    alt="Blog Image"
                    width={400}
                    height={225}
                    className="h-full w-full object-cover transition-transform"
                />
            </div>

            <div className='p-3 space-y-2'>
                <CardContent className="">
                    <h3 className="mb-2 font-medium text-2xl text-white line-clamp-1">{blog?.title}</h3>
                    <p
                        className="text-base text-[#BFBFBF] line-clamp-2"
                        dangerouslySetInnerHTML={{ __html: blog.content }}
                    />
                </CardContent>

                <Link href={`/blog/${blog?._id}`} className="px-5 py-[10px] text-[14px] font-medium items-center flex gap-2">
                    Read more <MoveRight />
                </Link>
            </div>
        </Card>
    )
}

export default BlogsCard