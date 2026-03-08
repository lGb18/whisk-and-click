export default function SecondaryButton({ children, ...props }) {
  return (
    <button className="secondary-button" {...props}>
      {children}
    </button>
  );
}