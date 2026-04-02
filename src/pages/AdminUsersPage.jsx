import { useEffect, useMemo, useState } from "react";
import AdminNav from "../components/AdminNav";
import RoleBadge from "../components/RoleBadge";
import { fetchAllProfiles, updateUserAccessState, updateUserRole } from "../utils/adminQueries";
import { useAuthSession } from "../hooks/useAuthSession";

const ROLE_OPTIONS = ["customer", "staff", "admin"];

export default function AdminUsersPage() {
  const { user } = useAuthSession();

  const [profiles, setProfiles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [noteMap, setNoteMap] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
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

    try {
      await updateUserRole({
        targetUserId,
        newRole,
        note: getNote(targetUserId),
      });
      await loadProfiles();
    } catch (error) {
      setErrorMessage(error?.message ?? "Failed to update user role.");
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleAccessToggle(targetUserId, nextState) {
    setUpdatingId(targetUserId);
    setErrorMessage("");

    try {
      await updateUserAccessState({
        targetUserId,
        isActive: nextState,
        note: getNote(targetUserId),
      });
      await loadProfiles();
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
    <div
      style={{
        minHeight: "100vh",
        background: "#F9F7F4",
        padding: "24px",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "grid",
          gap: "20px",
        }}
      >
        <AdminNav />

        <div style={{ display: "grid", gap: "6px" }}>
          <h1 style={{ margin: 0, color: "#333333" }}>Admin Users</h1>
          <div style={{ color: "#666666" }}>
            Manage roles and application access for existing accounts.
          </div>
        </div>

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

        {errorMessage ? (
          <div
            style={{
              padding: "14px 16px",
              borderRadius: "12px",
              background: "#FDEDED",
              color: "#B3261E",
              border: "1px solid #F5C2C0",
            }}
          >
            {errorMessage}
          </div>
        ) : null}

        {isLoading ? (
          <div style={{ color: "#333333" }}>Loading profiles...</div>
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
                    <div
                      style={{
                        color: "#666666",
                        fontSize: "0.9rem",
                      }}
                    >
                      Self-role changes and self-disable are blocked in this interface.
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}