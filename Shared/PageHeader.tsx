"use client";

import { cn } from "@/lib/utils";
import * as React from "react";

interface PageHeaderProps {
  title: string;
  imge?: string;

}

export function PageHeader({ title, imge }: PageHeaderProps) {
  const [height, setHeight] = React.useState('400px');

  React.useEffect(() => {
    function handleResize() {
      if (window.innerWidth <= 480) {
        setHeight('200px');
      } else if (window.innerWidth <= 768) {
        setHeight('300px');
      } else {
        setHeight('400px'); 
      }
    }

    window.addEventListener('resize', handleResize);
    handleResize(); // Set initial size
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div
      className={cn("relative w-full flex flex-col items-center justify-center bg-black pt-10")}
      style={{
        backgroundImage: `url(${imge})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "top",
        top: 0,
        left: 0,
        height: height
      }}
    >
      <div className={cn("relative z-10 flex flex-col items-center")}>
     <h1 className="text-[40px] font-benedict text-white text-center mb-5">
  {title}
</h1>

      
        <div className="flex items-center justify-center py-2">
          <div className="flex gap-1 justify-center">
            <div className="w-3 h-1 bg-[#E6EEF6] opacity-30 dark:bg-[#C8B9DF]" />
            <div className="w-10 h-1 bg-[#E6EEF6] dark:bg-[#6A41A3]" />
            <div className="w-3 h-1 bg-[#E6EEF6] opacity-30 dark:bg-[#C8B9DF]" />
          </div>
        </div>
      </div>
    </div>
  );
}