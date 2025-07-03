import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { formatCurrencySimple } from "@/lib/utils";
import { type CartItem } from "@shared/schema";
import { ShoppingCart, Minus, Plus, Trash2 } from "lucide-react";

interface CartBottomSheetProps {
  cart: CartItem[];
  onUpdateQuantity: (id: number, quantity: number) => void;
  onRemoveItem: (id: number) => void;
  onCheckout: () => void;
}

export default function CartBottomSheet({ 
  cart, 
  onUpdateQuantity, 
  onRemoveItem, 
  onCheckout 
}: CartBottomSheetProps) {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button 
          size="lg"
          className="fixed bottom-4 right-4 rounded-full h-14 w-14 shadow-lg bg-primary hover:bg-primary/90 z-40"
        >
          <div className="relative">
            <ShoppingCart className="h-6 w-6" />
            {totalItems > 0 && (
              <Badge 
                variant="secondary" 
                className="absolute -top-2 -right-2 h-6 w-6 flex items-center justify-center p-0 bg-accent text-white"
              >
                {totalItems}
              </Badge>
            )}
          </div>
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[80vh]">
        <SheetHeader>
          <SheetTitle>Keranjang Pesanan</SheetTitle>
        </SheetHeader>
        
        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto py-4">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <ShoppingCart className="h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-600">Keranjang masih kosong</p>
                <p className="text-sm text-gray-500">Silakan pilih menu yang ingin dipesan</p>
              </div>
            ) : (
              <div className="space-y-3">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">{item.name}</h4>
                      <p className="text-gray-600 text-xs">{formatCurrencySimple(item.price)}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() => {
                          if (item.quantity === 1) {
                            onRemoveItem(item.id);
                          } else {
                            onUpdateQuantity(item.id, item.quantity - 1);
                          }
                        }}
                      >
                        {item.quantity === 1 ? <Trash2 className="h-4 w-4" /> : <Minus className="h-4 w-4" />}
                      </Button>
                      <span className="font-semibold w-8 text-center">{item.quantity}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {cart.length > 0 && (
            <div className="border-t pt-4 bg-white">
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-semibold">Total:</span>
                <span className="text-xl font-bold text-primary">
                  {formatCurrencySimple(totalAmount)}
                </span>
              </div>
              <Button 
                onClick={onCheckout}
                className="w-full bg-primary hover:bg-primary/90 text-white py-3"
                size="lg"
              >
                Lanjut ke Pembayaran
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
