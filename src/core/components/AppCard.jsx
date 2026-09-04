// Shared card container component
export default function AppCard({ children, className = '' }) {
  return <div className={`card ${className}`}>{children}</div>;
}
