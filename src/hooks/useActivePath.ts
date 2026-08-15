"use client";

import { usePathname } from "next/navigation";

export const useActivePath = () => {
  const pathname = usePathname();

  const isActive = (path: string, exactMatch = false) => {
    if (exactMatch) {
      return pathname === path;
    }
    
    // Handle dynamic routes like /profile/username
    if (path.includes('/profile/')) {
      return pathname?.startsWith('/profile/') || false;
    }
    
    return pathname?.startsWith(path) || false;
  };

  return { isActive, pathname };
};