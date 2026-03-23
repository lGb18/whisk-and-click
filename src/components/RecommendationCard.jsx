import PrimaryButton from "./PrimaryButton";

export default function RecommendationCard({ cake, onSelect }) {
  // console.log(cake)
  return (
    <div
      className="card"
      style={{
        width: "380px",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "16px"
      }}
    >
      <img
        src={cake.image}
        alt={cake.image_filename}
        style={{
          width: "100%",
          height: "230px",
          objectFit: "cover",
          borderRadius: "12px"
        }}
      />

      <h3
        style={{
          margin: 0,
          fontFamily: "var(--font-heading)",
          fontSize: "18px",
          fontWeight: 500
        }}
      >
        {cake.image_filename}
      </h3>

      <div
        style={{
          display: "inline-block",
          background: "var(--secondary)",
          padding: "6px 10px",
          borderRadius: "8px",
          fontSize: "13px",
          fontWeight: 600,
          width: "fit-content"
        }}
      >
        {(cake.normalizedScore * 100).toFixed(0)}% Match
      </div>

      <div style={{ color: "var(--text-secondary)", lineHeight: 1.6 }}>
        <div>Budget: {cake.budget}</div>
        <div>Size: {cake.size_category}</div>
        <div>Style: {cake.style}</div>
      </div>

      <PrimaryButton onClick={() => onSelect(cake)}>Select</PrimaryButton>
    </div>
  );
}