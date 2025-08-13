

"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function PageTracker() {
  const pathname = usePathname();

  useEffect(() => {
    const previous = sessionStorage.getItem("currentPath");
    sessionStorage.setItem("previousPath", previous || "/");
    sessionStorage.setItem("currentPath", pathname);
  }, [pathname]);

  return null;
}
