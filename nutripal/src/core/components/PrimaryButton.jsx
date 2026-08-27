// Shared primary action button
// TODO: Implement per spec design system — 44×44px min tap target, bold, high-contrast
export default function PrimaryButton({ children, onClick, disabled }) {
  return (
    <button onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}
