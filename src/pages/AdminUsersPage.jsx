import { useEffect, useMemo, useState } from "react";
import AppShell from "../components/AppShell";
import RoleBadge from "../components/RoleBadge";
import {
  EmptyStateCard,
  ErrorStateCard,
  LoadingStateCard,
  SuccessStateCard,
} from "../components/PageState";
import {
  fetchAllProfiles,
  updateUserAccessState,
  updateUserRole,
} from "../utils/adminQueries";
import { useAuthSession } from "../hooks/useAuthSession";

const ROLE_OPTIONS = ["customer", "staff", "admin"];

export default function AdminUsersPage() {
  const { user, reloadProfile } = useAuthSession();

  const [profiles, setProfiles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [noteMap, setNoteMap] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  async function loadProfiles() {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const data = await fetchAllProfiles();
      setProfiles(data);
    } catch (error) {
      setErrorMessage(error?.message ?? "Failed to load profiles.");
    } finally {
      setIsLoading(false);
    }
  }


  useEffect(() => {
    loadProfiles();
  }, []);

  function getNote(userId) {
    return noteMap[userId] ?? "";
  }

  function setNote(userId, value) {
    setNoteMap((prev) => ({
      ...prev,
      [userId]: value,
    }));
  }

  async function handleRoleChange(targetUserId, newRole) {
    setUpdatingId(targetUserId);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await updateUserRole({
        targetUserId,
        newRole,
        note: getNote(targetUserId),
      });

      setProfiles((prev) =>
        prev.map((profile) =>
          profile.id === targetUserId
            ? { ...profile, role: newRole }
            : profile
        )
      );

      await loadProfiles();
      setSuccessMessage("User role updated successfully.");
    } catch (error) {
      setErrorMessage(error?.message ?? "Failed to update user role.");
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleAccessToggle(targetUserId, nextState) {
    setUpdatingId(targetUserId);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await updateUserAccessState({
        targetUserId,
        isActive: nextState,
        note: getNote(targetUserId),
      });

      setProfiles((prev) =>
        prev.map((profile) =>
          profile.id === targetUserId
            ? {
                ...profile,
                is_active: nextState,
                disabled_at: nextState ? null : new Date().toISOString(),
              }
            : profile
        )
      );

      await loadProfiles();
      setSuccessMessage("User access state updated successfully.");
    } catch (error) {
      setErrorMessage(error?.message ?? "Failed to update user access state.");
    } finally {
      setUpdatingId(null);
    }
  }

  const filteredProfiles = useMemo(() => {
    const normalized = searchTerm.trim().toLowerCase();

    if (!normalized) return profiles;

    return profiles.filter((profile) => {
      const fullName = profile.full_name?.toLowerCase() ?? "";
      const email = profile.email?.toLowerCase() ?? "";
      const id = profile.id?.toLowerCase() ?? "";

      return (
        fullName.includes(normalized) ||
        email.includes(normalized) ||
        id.includes(normalized)
      );
    });
  }, [profiles, searchTerm]);

  return (
    <AppShell
      title="Admin Users"
      subtitle="Manage roles and application access for existing accounts."
    >
      <input
        type="text"
        placeholder="Search by name, email, or user id"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          padding: "12px 14px",
          borderRadius: "10px",
          border: "1px solid #D8D8D8",
          background: "#FFFFFF",
        }}
      />

      {errorMessage ? <ErrorStateCard message={errorMessage} /> : null}
      {successMessage ? <SuccessStateCard message={successMessage} /> : null}

      {isLoading ? (
        <LoadingStateCard message="Loading profiles..." />
      ) : filteredProfiles.length === 0 ? (
        <EmptyStateCard message="No users found." />
      ) : (
        <div style={{ display: "grid", gap: "12px" }}>
          {filteredProfiles.map((profile) => {
            const isSelf = profile.id === user?.id;
            const isBusy = updatingId === profile.id;

            return (
              <div
                key={profile.id}
                style={{
                  display: "grid",
                  gap: "12px",
                  padding: "18px",
                  borderRadius: "16px",
                  background: "#FFFFFF",
                  border: "1px solid #ECECEC",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "12px",
                    flexWrap: "wrap",
                    alignItems: "center",
                  }}
                >
                  <div style={{ display: "grid", gap: "4px" }}>
                    <div style={{ fontWeight: 700, color: "#333333" }}>
                      {profile.full_name || "Unnamed User"}
                    </div>
                    <div style={{ color: "#666666" }}>
                      {profile.email || "No email synced yet"}
                    </div>
                    <div style={{ color: "#888888", fontSize: "0.9rem" }}>
                      {profile.id}
                    </div>
                    <div style={{ color: "#666666", fontSize: "0.9rem" }}>
                      Access: {profile.is_active ? "Active" : "Disabled"}
                    </div>
                  </div>

                  <RoleBadge role={profile.role} />
                </div>

                <textarea
                  placeholder="Optional admin note"
                  value={getNote(profile.id)}
                  onChange={(e) => setNote(profile.id, e.target.value)}
                  disabled={isBusy}
                  rows={2}
                  style={{
                    padding: "10px 12px",
                    borderRadius: "10px",
                    border: "1px solid #D8D8D8",
                    background: "#FFFFFF",
                    resize: "vertical",
                  }}
                />

                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    flexWrap: "wrap",
                    alignItems: "center",
                  }}
                >
                  <label style={{ fontWeight: 600, color: "#444444" }}>
                    Change Role
                  </label>

                  <select
                    value={profile.role}
                    disabled={isBusy || isSelf}
                    onChange={(e) => handleRoleChange(profile.id, e.target.value)}
                    style={{
                      padding: "10px 12px",
                      borderRadius: "10px",
                      border: "1px solid #D8D8D8",
                      background: "#FFFFFF",
                    }}
                  >
                    {ROLE_OPTIONS.map((roleOption) => (
                      <option key={roleOption} value={roleOption}>
                        {roleOption}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={() => handleAccessToggle(profile.id, !profile.is_active)}
                    disabled={isBusy || isSelf}
                    style={{
                      padding: "10px 14px",
                      borderRadius: "10px",
                      border: "none",
                      background: profile.is_active ? "#D32F2F" : "#2E7D32",
                      color: "#FFFFFF",
                      fontWeight: 600,
                      cursor: isBusy || isSelf ? "not-allowed" : "pointer",
                      opacity: isBusy || isSelf ? 0.7 : 1,
                    }}
                  >
                    {profile.is_active ? "Disable Access" : "Enable Access"}
                  </button>
                </div>

                {isSelf ? (
                  <div style={{ color: "#666666", fontSize: "0.9rem" }}>
                    Self-role changes and self-disable are blocked in this interface.
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      )}
    </AppShell>
  );
}