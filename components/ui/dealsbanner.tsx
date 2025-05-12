import Image from 'next/image';
import React from 'react';

const Dealsbanner = () => {
    return (
        <div className="container py-[20px]">
            <Image
                src="/assets/dealsbanner.png"
                alt="Deals banner"
                width={1000}
                height={500}
                className="w-full h-[500px]"
                quality={100} 
                priority
            />
        </div>
    );
};

export default Dealsbanner;