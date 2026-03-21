

export default function CakeCard({ cake}) {
  console.log(cake)
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
    </div>
  );
}