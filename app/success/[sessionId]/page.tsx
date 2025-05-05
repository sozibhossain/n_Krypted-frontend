"use client"
import React from 'react'
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from 'next/image';
import { X } from 'lucide-react';
import Link from 'next/link';

const page = async ({ params }: { params: { sessionId: string } }) => {

    const sessionId = params.sessionId

    try {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payment/status-check?stripeSessionId=${sessionId}`);
    } catch (error) {
        console.error("Error fetching payment status:", error);
    }


    return (
        <div className='pb-32 pt-44'>
            <Card className="max-w-[800px] mx-auto bg-[#645949] py-10 rounded-3xl relative">
                <CardContent>
                    <div className="flex justify-center items-center pb-6">
                        <div className="flex justify-center items-center w-44 h-44 rounded-full bg-[#55E25E] pb-6">
                            <Image
                                src={"/assets/success.png"}
                                alt="success"
                                height={1000}
                                width={500}
                                className='object-contain w-[80px] h-[80px]'
                            />
                        </div>
                    </div>
                    <div className="text-center">
                        <h2 className='text-2xl font-semibold text-white pb-6'>Your payment was successful!</h2>
                        <Button variant="outline" className='w-[248px] h-12 bg-[#55E25E] text-base font-medium text-black border-black'>
                            Thanks!
                        </Button>
                    </div>
                </CardContent>
                <Link href="/">
                    <Button variant="outline" className='absolute top-4 right-4 w-10 h-10 rounded-full bg-[#FFF] font-medium text-black'>
                        <X />
                    </Button>
                </Link>
            </Card>
        </div>
    )
}


export default page;