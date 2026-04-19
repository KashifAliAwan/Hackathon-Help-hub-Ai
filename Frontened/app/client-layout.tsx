"use client";

import "react-toastify/dist/ReactToastify.css";

import React, { ReactNode } from "react";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { ToastContainer } from "react-toastify";
import NetworkLoader from "./components/network-loader";

interface ClientLayoutProps {
  children: ReactNode;
}

const ClientLayout = ({ children }: ClientLayoutProps) => {
  const pathname = usePathname();

  if (!pathname) {
    return <>{children}</>;
  }

  return (
    <main className="min-h-screen flex flex-col">
      <NetworkLoader />
      <motion.div
        key={pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35 }}
        className="flex-1 flex flex-col"
      >
        {children}
      </motion.div>
      <ToastContainer
        position="bottom-right"
        autoClose={2200}
        hideProgressBar
        newestOnTop
        closeButton={false}
        pauseOnHover
        theme="light"
      />
    </main>
  );
};

export default ClientLayout;

