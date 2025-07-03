import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrencySimple } from "@/lib/utils";
import { type MenuItem, type CartItem } from "@shared/schema";
import { useState } from "react";

interface MenuItemCardProps {
  item: MenuItem;
  onAddToCart: (item: CartItem) => void;
}

export default function MenuItemCard({ item, onAddToCart }: MenuItemCardProps) {
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = () => {
    setIsAdding(true);
    onAddToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      image: item.image,
    });
    
    setTimeout(() => setIsAdding(false), 1000);
  };

  // Get image URL from Unsplash based on category
  const getImageUrl = (category: string, itemName: string) => {
    const imageMap: { [key: string]: string } = {
      "makanan-utama": "https://images.unsplash.com/photo-1512058564366-18510be2db19?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      "minuman": "https://images.unsplash.com/photo-1613478223719-2ab802602423?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      "snack": "https://images.unsplash.com/photo-1599490659213-e2b9527bd087?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      "dessert": "https://assets-a1.kompasiana.com/items/album/2024/08/01/o1aj9qdyyjnspzwhuggyc3mngfqoamf99nl5y8q344ksrevdl-66aaf17d34777c3c8f4cd413.jpeg",
    };
    
    if (itemName.toLowerCase().includes("gudeg")) {
      return "https://img.inews.co.id/media/822/files/inews_new/2022/03/07/Resep_Gudeg_Jogja.jpg";
    }
    if (itemName.toLowerCase().includes("nasi goreng")) {
      return "https://asset.kompas.com/crops/VMupLYa-zBYTf5h5GnEjMW6-Nxg=/0x0:1000x667/1200x800/data/photo/2020/11/22/5fba747cef43d.jpg";
    }
    if (itemName.toLowerCase().includes("ayam bakar")) {
      return "https://awsimages.detik.net.id/community/media/visual/2022/06/09/resep-ayam-bakar-bumbu-rujak-1.jpeg?w=1200";
    }
    if (itemName.toLowerCase().includes("jeruk")) {
      return "https://images.unsplash.com/photo-1613478223719-2ab802602423?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600";
    }
    if (itemName.toLowerCase().includes("teh")) {
      return "https://images.unsplash.com/photo-1556679343-c7306c1976bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600";
    }
    
    return imageMap[category] || imageMap["makanan-utama"];
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <img 
        src={getImageUrl(item.category, item.name)} 
        alt={item.name}
        className="w-full h-48 object-cover"
      />
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
        <p className="text-gray-600 text-sm mt-1">{item.description}</p>
        <div className="flex items-center justify-between mt-4">
          <span className="text-xl font-bold text-primary">
            {formatCurrencySimple(item.price)}
          </span>
          <Button
            onClick={handleAddToCart}
            disabled={!item.available || isAdding}
            className={`${
              isAdding ? 'bg-secondary hover:bg-secondary' : 'bg-accent hover:bg-accent/90'
            } text-white transition-colors`}
          >
            {isAdding ? 'Ditambahkan!' : 'Tambah'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
