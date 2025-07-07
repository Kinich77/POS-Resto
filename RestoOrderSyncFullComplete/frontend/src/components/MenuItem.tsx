type MenuItemProps = {
  name: string;
  description: string;
  price: number;
  image: string;
};

export function MenuItem({ name, description, price, image }: MenuItemProps) {
  return (
    <div className="border rounded-lg p-4 shadow">
      <img src={`/images/${image}`} alt={name} className="w-full h-40 object-cover mb-2 rounded" />
      <h2 className="text-xl font-semibold">{name}</h2>
      <p>{description}</p>
      <p className="font-bold mt-2">Rp {price.toLocaleString()}</p>
    </div>
  );
}
