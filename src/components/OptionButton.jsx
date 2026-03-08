export default function OptionButton({ children, selected = false, ...props }) {
  return (
    <button className={`option-button ${selected ? "selected" : ""}`} {...props}>
      {children}
    </button>
  );
}