import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MenuItemCard from "@/components/menu-item-card";
import CartBottomSheet from "@/components/cart-bottom-sheet";
import PaymentModal from "@/components/payment-modal";
import QrisModal from "@/components/qris-modal";
import { type MenuItem, type CartItem, type OrderItem } from "@shared/schema";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { generateCustomerId } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Settings } from "lucide-react";

const categories = [
  { id: 'makanan-utama', label: 'Makanan Utama' },
  { id: 'minuman', label: 'Minuman' },
  { id: 'snack', label: 'Snack' },
  { id: 'dessert', label: 'Dessert' },
];

export default function CustomerOrder() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('makanan-utama');
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [qrisModalOpen, setQrisModalOpen] = useState(false);
  const [tableModalOpen, setTableModalOpen] = useState(false);
  const [tableNumber, setTableNumber] = useState('');
  const [customerName, setCustomerName] = useState('');
  const { toast } = useToast();

  const { data: menuItems = [], isLoading } = useQuery<MenuItem[]>({
    queryKey: ['/api/menu'],
  });

  const createOrderMutation = useMutation({
    mutationFn: async (orderData: {
      customerInfo: string;
      tableNumber?: string;
      items: string;
      totalAmount: number;
      paymentMethod: string;
    }) => {
      const response = await apiRequest('POST', '/api/orders', orderData);
      return response.json();
    },
    onSuccess: () => {
      setCart([]);
      toast({
        title: "Pesanan Berhasil!",
        description: "Pesanan Anda telah dikirim. Silakan tunggu konfirmasi dari kasir.",
      });
    },
    onError: () => {
      toast({
        title: "Gagal Mengirim Pesanan",
        description: "Terjadi kesalahan saat mengirim pesanan. Silakan coba lagi.",
        variant: "destructive",
      });
    },
  });

  const filteredMenuItems = menuItems.filter(item => item.category === selectedCategory);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleAddToCart = (item: CartItem) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.id === item.id 
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prevCart, item];
    });
  };

  const handleUpdateQuantity = (id: number, quantity: number) => {
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveItem = (id: number) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id));
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast({
        title: "Keranjang Kosong",
        description: "Silakan pilih menu terlebih dahulu.",
        variant: "destructive",
      });
      return;
    }
    setTableModalOpen(true);
  };

  const handleTableInfoSubmit = () => {
    if (!tableNumber.trim() || !customerName.trim()) {
      toast({
        title: "Data Tidak Lengkap",
        description: "Silakan isi nomor meja dan nama pelanggan.",
        variant: "destructive",
      });
      return;
    }
    setTableModalOpen(false);
    setPaymentModalOpen(true);
  };

  const handleSelectPayment = (method: 'cash' | 'qris') => {
    setPaymentModalOpen(false);
    if (method === 'qris') {
      setQrisModalOpen(true);
    } else {
      processOrder(method);
    }
  };

  const handleQrisConfirm = () => {
    setQrisModalOpen(false);
    processOrder('qris');
  };

  const processOrder = (paymentMethod: string) => {
    const orderItems: OrderItem[] = cart.map(item => ({
      menuItemId: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
    }));

    const orderData = {
      customerInfo: customerName,
      tableNumber: tableNumber,
      items: JSON.stringify(orderItems),
      totalAmount,
      paymentMethod,
      status: "pending",
    };

    createOrderMutation.mutate(orderData);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Memuat menu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-primary text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Resto STP</h1>
              <p className="text-blue-100 text-sm">Pesan Menu Favorit Anda</p>
            </div>
            <div className="flex items-center space-x-2">
              {/* Admin access removed from customer interface */}
            </div>
          </div>
        </div>
      </header>

      {/* Category Tabs */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-30">
        <div className="container mx-auto px-4">
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-transparent h-auto p-0">
              {categories.map((category) => (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className="py-4 px-2 text-sm font-medium border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary rounded-none bg-transparent"
                >
                  {category.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Menu Items */}
      <main className="container mx-auto px-4 py-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMenuItems.map((item) => (
            <MenuItemCard
              key={item.id}
              item={item}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>

        {filteredMenuItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">Tidak ada menu dalam kategori ini.</p>
          </div>
        )}
      </main>

      {/* Cart Bottom Sheet */}
      <CartBottomSheet
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleCheckout}
      />

      {/* Payment Modal */}
      <PaymentModal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        onSelectPayment={handleSelectPayment}
      />

      {/* Table Info Modal */}
      <Dialog open={tableModalOpen} onOpenChange={setTableModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Informasi Pelanggan</DialogTitle>
            <DialogDescription>
              Silakan isi nama dan nomor meja Anda untuk melanjutkan pesanan.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mb-6">
            <div>
              <Label htmlFor="customerName">Nama Pelanggan</Label>
              <Input
                id="customerName"
                type="text"
                placeholder="Masukkan nama Anda"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="tableNumber">Nomor Meja</Label>
              <Input
                id="tableNumber"
                type="text"
                placeholder="Contoh: Meja 5"
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
          <div className="flex space-x-3">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => setTableModalOpen(false)}
            >
              Batal
            </Button>
            <Button 
              className="flex-1 bg-primary hover:bg-primary/90"
              onClick={handleTableInfoSubmit}
            >
              Lanjutkan
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        onSelectPayment={handleSelectPayment}
      />

      {/* QRIS Modal */}
      <QrisModal
        isOpen={qrisModalOpen}
        totalAmount={totalAmount}
        onConfirm={handleQrisConfirm}
        onClose={() => setQrisModalOpen(false)}
      />
    </div>
  );
}
