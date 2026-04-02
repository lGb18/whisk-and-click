import { useAuthSession } from "../hooks/useAuthSession";
import CustomerDashboardPage from "./CustomerDashboardPage";
import StaffDashboardPage from "./StaffDashboardPage";
import AdminDashboardPage from "./AdminDashboardPage";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const { role, isAuthLoading, reloadProfile } = useAuthSession();

  useEffect(() => {
    reloadProfile();
  }, [reloadProfile]);

  if (isAuthLoading) {
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