export function Heading({ level = 1, children, className = "" }) {
  const Tag = `h${level}`;
  return <Tag className={`font-bold text-gray-900 ${className}`}>{children}</Tag>;
}
