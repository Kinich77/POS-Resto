import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCurrencySimple, formatDate } from "@/lib/utils";
import { type Transaction, type Order } from "@shared/schema";
import { ArrowLeft, Receipt, TrendingUp, DollarSign, FileText } from "lucide-react";

export default function Reports() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Fetch report summary
  const { data: summary, isLoading: loadingSummary } = useQuery({
    queryKey: ['/api/reports/summary', startDate, endDate],
    queryFn: async () => {
      let url = '/api/reports/summary';
      if (startDate && endDate) {
        url += `?startDate=${startDate}&endDate=${endDate}`;
      }
      const response = await fetch(url);
      return response.json();
    },
  });

  // Fetch transactions for detailed report
  const { data: transactions = [], isLoading: loadingTransactions } = useQuery<Transaction[]>({
    queryKey: ['/api/transactions', startDate, endDate],
    queryFn: async () => {
      let url = '/api/transactions';
      if (startDate && endDate) {
        url += `?startDate=${startDate}&endDate=${endDate}`;
      }
      const response = await fetch(url);
      return response.json();
    },
  });

  const handleGenerateReport = () => {
    // This would trigger a refetch with the new date range
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/admin">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Kembali
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Laporan Penjualan</h1>
                <p className="text-gray-600">Analisis penjualan dan pendapatan</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* Date Filter */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-end space-x-4">
              <div>
                <Label htmlFor="startDate">Dari Tanggal</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="endDate">Sampai Tanggal</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="mt-1"
                />
              </div>
              <Button 
                onClick={handleGenerateReport}
                className="bg-primary hover:bg-primary/90"
              >
                Generate Laporan
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100">
                  <Receipt className="h-6 w-6 text-primary" />
                </div>
                <div className="ml-4">
                  <p className="text-gray-600 text-sm">Total Pesanan</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {loadingSummary ? '-' : summary?.totalOrders || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100">
                  <TrendingUp className="h-6 w-6 text-secondary" />
                </div>
                <div className="ml-4">
                  <p className="text-gray-600 text-sm">Total Pendapatan</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {loadingSummary ? '-' : formatCurrencySimple(summary?.totalRevenue || 0)}
                  </p>
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
                  <p className="text-gray-600 text-sm">Rata-rata Order</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {loadingSummary ? '-' : formatCurrencySimple(summary?.avgOrderValue || 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-purple-100">
                  <FileText className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-gray-600 text-sm">Menu Terlaris</p>
                  <p className="text-lg font-bold text-gray-900">
                    {loadingSummary ? '-' : summary?.topMenuItem || 'N/A'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sales Chart Placeholder */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Tren Penjualan Harian</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <span className="text-gray-500">Chart penjualan akan ditampilkan di sini</span>
                <p className="text-sm text-gray-400 mt-2">Integrasi chart dapat ditambahkan dengan library seperti Chart.js</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Report Table */}
        <Card>
          <CardHeader>
            <CardTitle>Detail Transaksi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>ID Transaksi</TableHead>
                    <TableHead>ID Pesanan</TableHead>
                    <TableHead>Jumlah</TableHead>
                    <TableHead>Pembayaran</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loadingTransactions ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        Memuat transaksi...
                      </TableCell>
                    </TableRow>
                  ) : transactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                        Tidak ada transaksi dalam rentang tanggal ini
                      </TableCell>
                    </TableRow>
                  ) : (
                    transactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>
                          {formatDate(transaction.createdAt || new Date())}
                        </TableCell>
                        <TableCell className="font-medium">
                          #{transaction.id.toString().padStart(4, '0')}
                        </TableCell>
                        <TableCell>
                          #{transaction.orderId?.toString().padStart(3, '0') || 'N/A'}
                        </TableCell>
                        <TableCell className="font-semibold">
                          {formatCurrencySimple(transaction.amount)}
                        </TableCell>
                        <TableCell>
                          {transaction.paymentMethod === 'qris' ? 'QRIS' : 'Cash'}
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            transaction.status === 'completed' 
                              ? 'bg-secondary text-white' 
                              : 'bg-destructive text-white'
                          }`}>
                            {transaction.status === 'completed' ? 'Selesai' : 'Gagal'}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
