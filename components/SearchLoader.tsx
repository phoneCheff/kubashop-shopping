"use client";

import { AnimatePresence, motion } from "framer-motion";

interface SearchLoaderProps {
  isSearching: boolean;
}

export function SearchLoader({ isSearching }: SearchLoaderProps) {
  return (
    <AnimatePresence mode="wait">
      {isSearching && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/90 backdrop-blur-sm"
          style={{ transform: "translateZ(0)", willChange: "opacity" }}
        >
          <div className="text-center">
            <motion.div
              className="w-12 h-12 mx-auto mb-4 border-3 border-solid rounded-full"
              style={{
                borderColor: "#002A8F #002A8F transparent transparent",
              }}
              animate={{ rotate: 360 }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "linear",
              }}
            />
            <p className="text-sm font-medium text-gray-600">
              Buscando productos...
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
