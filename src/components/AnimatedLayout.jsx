import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Outlet, useLocation } from "react-router-dom";

export default function AnimatedLayout() {
  const location = useLocation();
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      key={location.pathname}
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -15 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      <Outlet />
    </motion.div>
  );
}