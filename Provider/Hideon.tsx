"use client";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

interface Props {
  routes: string[];
  children: ReactNode;
  exact?: boolean; // Add option for exact matching
}

const Hideon = ({ children, routes, exact = false }: Props) => {
  const currentPath = usePathname();
  
  const shouldHide = exact 
    ? routes.includes(currentPath)
    : routes.some(route => currentPath.startsWith(route));

  return shouldHide ? null : <>{children}</>;
};

export default Hideon;