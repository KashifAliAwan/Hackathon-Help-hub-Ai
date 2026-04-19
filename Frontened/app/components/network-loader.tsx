"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

import { subscribePendingRequests } from "../utils/network-pending";

export default function NetworkLoader() {
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    return subscribePendingRequests(setPendingCount);
  }, []);

  const isVisible = pendingCount > 0;

  return (
    <AnimatePresence>
      {isVisible ? (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="fixed top-4 left-1/2 z-[120] -translate-x-1/2"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-xs font-semibold text-text-muted shadow-lg">
            <Loader2 size={14} className="animate-spin text-primary" />
            Syncing updates...
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
