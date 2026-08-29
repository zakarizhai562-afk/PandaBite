// Shared primary action button
export default function PrimaryButton({ children, onClick, disabled, className = '' }) {
  return (
    <button
      className={`btn-primary ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
