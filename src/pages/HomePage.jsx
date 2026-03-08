import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import PrimaryButton from "../components/PrimaryButton";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="page-shell">
      <div
        className="container-narrow"
        style={{
          maxWidth: "720px",
          display: "flex",
          flexDirection: "column",
          gap: "32px",
          alignItems: "center",
          textAlign: "center",
          paddingTop: "180px"
        }}
      >
        <PageHeader
          title="Cake Design Recommendation System"
          subtitle="Find personalized cake designs based on your preferences and bakery-supported options."
        />
        <PrimaryButton onClick={() => navigate("/wizard")}>
          Start Designing
        </PrimaryButton>
      </div>
    </div>
  );
}