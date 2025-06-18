"use client";

import { cn } from "@/lib/utils";
import * as React from "react";

interface PageHeaderProps {
  title: string;
  imge?: string;
  items: {
    label: string;
    href: string;
  }[];
}

export function PageHeader({ title, items, imge }: PageHeaderProps) {
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
        backgroundRepeat: "repeat",
        backgroundPosition: "top",
        top: 0,
        left: 0,
        height: height
      }}
    >
      <div className={cn("relative z-10 flex flex-col items-center")}>
        <h1 className="text-[25px] lg:text-[48px] font-semibold text-white text-center mb-5 tracking-wide">
          {title}
        </h1>
        <nav className="flex items-center" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-2 text-white">
            {items.map((item, index) => (
              <React.Fragment key={`fragment-${item.label}-${index}`}>
                {index > 0 && (
                  <li className="inline-flex items-center">
                    <span className="mx-1 text-white">{">"}</span>
                  </li>
                )}
                <li key={`item-${item.label}-${index}`}>
                  {index === items.length - 1 ? (
                    <span className="text-base md:text-lg lg:text-xl leading-[24px] font-normal md:font-medium lg:font-semibold text-white hover:text-gray-200">
                      {item.label}
                    </span>
                  ) : (
                    <a
                      href={item.href}
                      className="text-base md:text-lg lg:text-xl leading-[24px] font-normal md:font-medium lg:font-semibold text-white hover:text-gray-200"
                    >
                      {item.label}
                    </a>
                  )}
                </li>
              </React.Fragment>
            ))}
          </ol>
        </nav>
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