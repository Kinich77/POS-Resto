import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import OrderCard from "@/components/order-card";
import { type Order, type MenuItem } from "@shared/schema";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { formatCurrencySimple, formatTime } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Receipt, TrendingUp, DollarSign, Clock } from "lucide-react";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("orders");
  const { toast } = useToast();

  // Fetch pending orders
  const { data: pendingOrders = [], isLoading: loadingPending } = useQuery<Order[]>({
    queryKey: ['/api/orders', 'pending'],
    queryFn: async () => {
      const response = await fetch('/api/orders?status=pending');
      return response.json();
    },
    refetchInterval: 3000, // Refresh every 3 seconds
  });

  // Fetch all orders for history
  const { data: allOrders = [], isLoading: loadingAll } = useQuery<Order[]>({
    queryKey: ['/api/orders'],
    refetchInterval: 5000, // Refresh every 5 seconds
  });

  // Fetch menu items
  const { data: menuItems = [] } = useQuery<MenuItem[]>({
    queryKey: ['/api/menu'],
  });

  // Confirm order mutation
  const confirmOrderMutation = useMutation({
    mutationFn: async (orderId: number) => {
      const response = await apiRequest('PUT', `/api/orders/${orderId}/status`, {
        status: 'confirmed'
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/orders'] });
      toast({
        title: "Pesanan Dikonfirmasi",
        description: "Pesanan telah berhasil dikonfirmasi.",
      });
    },
    onError: () => {
      toast({
        title: "Gagal Konfirmasi",
        description: "Terjadi kesalahan saat mengkonfirmasi pesanan.",
        variant: "destructive",
      });
    },
  });

  // Reject order mutation
  const rejectOrderMutation = useMutation({
    mutationFn: async (orderId: number) => {
      const response = await apiRequest('PUT', `/api/orders/${orderId}/status`, {
        status: 'rejected'
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/orders'] });
      toast({
        title: "Pesanan Ditolak",
        description: "Pesanan telah ditolak.",
      });
    },
    onError: () => {
      toast({
        title: "Gagal Menolak",
        description: "Terjadi kesalahan saat menolak pesanan.",
        variant: "destructive",
      });
    },
  });

  const handleConfirmOrder = (orderId: number) => {
    confirmOrderMutation.mutate(orderId);
  };

  const handleRejectOrder = (orderId: number) => {
    if (confirm("Yakin ingin menolak pesanan ini?")) {
      rejectOrderMutation.mutate(orderId);
    }
  };

  const completedOrders = allOrders.filter(order => order.status === 'completed');
  const totalRevenue = completedOrders.reduce((sum, order) => sum + order.totalAmount, 0);
  const avgOrderValue = completedOrders.length > 0 ? Math.round(totalRevenue / completedOrders.length) : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Kembali
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-gray-600">Kelola pesanan dan konfirmasi pembayaran</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-secondary text-white">
                {pendingOrders.length} Pesanan Baru
              </Badge>
              <Link href="/reports">
                <Button variant="outline" size="sm">
                  Lihat Laporan
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" size="sm">
                  Halaman Pelanggan
                </Button>
              </Link>
              <span className="text-sm text-gray-500">
                {new Date().toLocaleTimeString('id-ID', { 
                  hour: '2-digit', 
                  minute: '2-digit',
                  timeZone: 'Asia/Jakarta'
                })} WIB
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Quick Stats */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <div className="ml-4">
                  <p className="text-gray-600 text-sm">Pesanan Pending</p>
                  <p className="text-2xl font-bold text-gray-900">{pendingOrders.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100">
                  <Receipt className="h-6 w-6 text-secondary" />
                </div>
                <div className="ml-4">
                  <p className="text-gray-600 text-sm">Total Pesanan</p>
                  <p className="text-2xl font-bold text-gray-900">{allOrders.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-orange-100">
                  <DollarSign className="h-6 w-6 text-accent" />
                </div>
                <div className="ml-4">
                  <p className="text-gray-600 text-sm">Pendapatan</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrencySimple(totalRevenue)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-purple-100">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-gray-600 text-sm">Rata-rata Order</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrencySimple(avgOrderValue)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="orders">Pesanan Masuk</TabsTrigger>
            <TabsTrigger value="history">Riwayat Pesanan</TabsTrigger>
            <TabsTrigger value="menu">Kelola Menu</TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="mt-6">
            <div className="space-y-4">
              {loadingPending ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <p>Memuat pesanan...</p>
                </div>
              ) : pendingOrders.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Receipt className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Tidak ada pesanan yang menunggu konfirmasi</p>
                  </CardContent>
                </Card>
              ) : (
                pendingOrders.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    onConfirm={handleConfirmOrder}
                    onReject={handleRejectOrder}
                  />
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Riwayat Pesanan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID Pesanan</TableHead>
                        <TableHead>Waktu</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Pembayaran</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loadingAll ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8">
                            Memuat riwayat...
                          </TableCell>
                        </TableRow>
                      ) : allOrders.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                            Belum ada riwayat pesanan
                          </TableCell>
                        </TableRow>
                      ) : (
                        allOrders.map((order) => (
                          <TableRow key={order.id}>
                            <TableCell className="font-medium">
                              #{order.id.toString().padStart(3, '0')}
                            </TableCell>
                            <TableCell>{formatTime(order.createdAt || new Date())}</TableCell>
                            <TableCell className="font-semibold">
                              {formatCurrencySimple(order.totalAmount)}
                            </TableCell>
                            <TableCell>
                              {order.paymentMethod === 'qris' ? 'QRIS' : 'Cash'}
                            </TableCell>
                            <TableCell>
                              <Badge
                                className={
                                  order.status === 'completed' || order.status === 'confirmed'
                                    ? 'bg-secondary text-white'
                                    : order.status === 'rejected'
                                    ? 'bg-destructive text-white'
                                    : 'bg-accent text-white'
                                }
                              >
                                {order.status === 'completed' || order.status === 'confirmed' ? 'Selesai' :
                                 order.status === 'rejected' ? 'Ditolak' : 'Pending'}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="menu" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Kelola Menu
                  <Button className="bg-primary hover:bg-primary/90">
                    Tambah Menu Baru
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {menuItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                          <span className="text-2xl">🍽️</span>
                        </div>
                        <div>
                          <h4 className="font-semibold">{item.name}</h4>
                          <p className="text-sm text-gray-600 capitalize">{item.category.replace('-', ' ')}</p>
                          <p className="text-primary font-semibold">{formatCurrencySimple(item.price)}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="outline">
                          Edit
                        </Button>
                        <Button size="sm" variant="destructive">
                          Hapus
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
