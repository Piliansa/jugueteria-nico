type ProductAttributeProps = {
  label: string;
  value: React.ReactNode;
};

export default function ProductAttribute({
  label,
  value,
}: ProductAttributeProps) {
  return (
    <div>
      <p className="text-sm text-gray-500">{label}</p>

      <p className="mt-1 font-medium text-gray-900">{value}</p>
    </div>
  );
}

