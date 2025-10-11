import Link from "next/link";

export default function HomePanels() {
  const panels = [
    {
      key: 'top-offers',
      title: 'Top offers',
      items: [
        { title: 'Fire TV Stick', img: 'https://via.placeholder.com/300x180?text=Offer+1' },
        { title: 'Tablet', img: 'https://via.placeholder.com/300x180?text=Offer+2' },
      ],
    },
    {
      key: 'popular-cats',
      title: 'Popular categories',
      items: [
        { title: 'Grocery', img: 'https://via.placeholder.com/300x180?text=Grocery' },
        { title: 'Home Storage', img: 'https://via.placeholder.com/300x180?text=Storage' },
      ],
    },
    {
      key: 'vapes',
      title: 'Vapes',
      items: [
        { title: 'Starter Kits', img: 'https://via.placeholder.com/300x180?text=Vape+1' },
        { title: 'E-Liquids', img: 'https://via.placeholder.com/300x180?text=Vape+2' },
      ],
    },
    {
      key: 'more',
      title: 'Garden essentials',
      items: [
        { title: 'Furniture', img: 'https://via.placeholder.com/300x180?text=Garden' },
        { title: 'Decor', img: 'https://via.placeholder.com/300x180?text=Decor' },
      ],
    },
  ];

  return (
    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {panels.map((p) => (
        <div key={p.key} className="bg-card rounded-lg shadow p-4">
          <h3 className="text-xl font-semibold mb-4">{p.title}</h3>
          <div className="grid grid-cols-1 gap-3">
            {p.items.map((it, idx) => (
              <Link key={idx} href={`/products?cat=${encodeURIComponent(it.title)}`} className="flex items-center gap-3">
                <img src={it.img} alt={it.title} className="w-20 h-14 object-cover rounded" />
                <div>
                  <div className="font-medium">{it.title}</div>
                  <div className="text-sm text-muted-foreground">Shop now</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
