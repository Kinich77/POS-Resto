import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrencySimple, formatTime } from "@/lib/utils";
import { type Order, type OrderItem } from "@shared/schema";
import { CreditCard, Banknote, Clock } from "lucide-react";

interface OrderCardProps {
  order: Order;
  onConfirm: (orderId: number) => void;
  onReject: (orderId: number) => void;
}

export default function OrderCard({ order, onConfirm, onReject }: OrderCardProps) {
  const orderItems: OrderItem[] = JSON.parse(order.items);
  const statusColors = {
    pending: "bg-accent text-accent-foreground",
    confirmed: "bg-secondary text-secondary-foreground",
    completed: "bg-secondary text-secondary-foreground",
    rejected: "bg-destructive text-destructive-foreground",
  };

  const statusLabels = {
    pending: "Menunggu Konfirmasi",
    confirmed: "Dikonfirmasi",
    completed: "Selesai", 
    rejected: "Ditolak",
  };

  return (
    <Card className={`border-l-4 ${
      order.status === 'pending' ? 'border-accent' : 
      order.status === 'confirmed' ? 'border-secondary' : 
      order.status === 'rejected' ? 'border-destructive' : 'border-gray-300'
    }`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">#{order.id.toString().padStart(3, '0')}</h3>
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="h-4 w-4 mr-1" />
              {formatTime(order.createdAt || new Date())}
              {order.tableNumber && ` - ${order.tableNumber}`}
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Badge className={statusColors[order.status as keyof typeof statusColors]}>
              {statusLabels[order.status as keyof typeof statusLabels]}
            </Badge>
            <span className="text-lg font-bold text-primary">
              {formatCurrencySimple(order.totalAmount)}
            </span>
          </div>
        </div>
        
        <div className="space-y-2 mb-4">
          {orderItems.map((item, index) => (
            <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
              <span className="font-medium">{item.name}</span>
              <span className="text-gray-600">
                {item.quantity}x {formatCurrencySimple(item.price)}
              </span>
            </div>
          ))}
        </div>
        
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-4">
          <div className="flex items-center">
            {order.paymentMethod === 'qris' ? (
              <CreditCard className="h-5 w-5 text-accent mr-2" />
            ) : (
              <Banknote className="h-5 w-5 text-secondary mr-2" />
            )}
            <span className="font-medium">
              {order.paymentMethod === 'qris' ? 'QRIS' : 'Bayar Langsung'}
            </span>
          </div>
          <span className="text-sm text-gray-600">{order.customerInfo}</span>
        </div>
        
        {order.status === 'pending' && (
          <div className="flex space-x-3">
            <Button 
              variant="destructive"
              className="flex-1"
              onClick={() => onReject(order.id)}
            >
              Tolak
            </Button>
            <Button 
              className="flex-1 bg-secondary hover:bg-secondary/90"
              onClick={() => onConfirm(order.id)}
            >
              {order.paymentMethod === 'qris' ? 'Konfirmasi Pembayaran' : 'Konfirmasi Pesanan'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
