export function LoadingStateCard({ message = "Loading..." }) {
  return (
    <div
      style={{
        padding: "18px",
        borderRadius: "14px",
        border: "1px solid #EAEAEA",
        background: "#FFFFFF",
        color: "#333333",
      }}
    >
      {message}
    </div>
  );
}

export function EmptyStateCard({ message = "No data available." }) {
  return (
    <div
      style={{
        padding: "18px",
        borderRadius: "14px",
        border: "1px solid #EAEAEA",
        background: "#FFFFFF",
        color: "#666666",
      }}
    >
      {message}
    </div>
  );
}

export function ErrorStateCard({ message = "Something went wrong." }) {
  return (
    <div
      style={{
        padding: "14px 16px",
        borderRadius: "12px",
        background: "#FDEDED",
        color: "#B3261E",
        border: "1px solid #F5C2C0",
      }}
    >
      {message}
    </div>
  );
}

export function InfoStateCard({ message = "" }) {
  return (
    <div
      style={{
        padding: "14px 16px",
        borderRadius: "12px",
        background: "#EEF8FF",
        color: "#156A8A",
        border: "1px solid #B9E1F2",
      }}
    >
      {message}
    </div>
  );
}

export function SuccessStateCard({ message = "" }) {
  return (
    <div
      style={{
        padding: "14px 16px",
        borderRadius: "12px",
        background: "#EAF8EA",
        color: "#2E7D32",
        border: "1px solid #B9DCBC",
      }}
    >
      {message}
    </div>
  );
}