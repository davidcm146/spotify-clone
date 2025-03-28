"use client";

import { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";

const ToastProvider = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Toaster
      toastOptions={{
        duration: 2000,
        style: {
          background: "#333",
          color: "#fff",
        },
      }}
    />
  );
};

export default ToastProvider;
