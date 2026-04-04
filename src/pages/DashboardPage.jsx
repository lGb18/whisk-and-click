import { useAuthSession } from "../hooks/useAuthSession";
import CustomerDashboardPage from "./CustomerDashboardPage";
import StaffDashboardPage from "./StaffDashboardPage";
import AdminDashboardPage from "./AdminDashboardPage";
import { useEffect, useState } from "react";
import { useAppFlow } from "../state/AppFlow";

export default function DashboardPage() {
  const {
      resetFlow
    } = useAppFlow();
  
  const { role, isAuthLoading, reloadProfile } = useAuthSession();
  if (isAuthLoading) {
    resetFlow();
    return <div style={{ padding: "24px" }}>Loading dashboard...</div>;
  }

  if (role === "admin") {
    return <AdminDashboardPage />;
  }

  if (role === "staff") {
    return <StaffDashboardPage />;
  }

  return <CustomerDashboardPage />;
}