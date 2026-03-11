export default function ChatOptionButton({ children, selected = false, ...props }) {
  return (
    <button className={`option-chat ${selected ? "selected" : ""}`} {...props}>
      {children}
    </button>
  );
}