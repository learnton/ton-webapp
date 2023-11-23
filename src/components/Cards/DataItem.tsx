export default function Item({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="text-sm">
      <div>{label}</div>
      <span className="font-medium">{value}</span>
    </div>
  );
}
