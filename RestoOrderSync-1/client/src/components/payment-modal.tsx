import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { CreditCard, Banknote } from "lucide-react";
import { useState } from "react";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPayment: (method: "cash" | "qris" | "dana", amount?: number) => void;
}

export default function PaymentModal({
  isOpen,
  onClose,
  onSelectPayment,
}: PaymentModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<"cash" | "qris" | "dana" | null>(null);
  const [inputAmount, setInputAmount] = useState<string>("");
  const [senderName, setSenderName] = useState<string>("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isPaymentSuccess, setIsPaymentSuccess] = useState(false);

  const handleConfirm = () => {
    if (selectedMethod === "dana") {
      if (!senderName || !inputAmount) return;

      if (!showConfirmation) {
        setShowConfirmation(true);
      } else {
        setIsPaymentSuccess(true);
        onSelectPayment("dana", amountNumber);
        // Tidak menutup modal secara otomatis, biarkan pengguna menutup manual
      }
    } else {
      setIsPaymentSuccess(true);
      onSelectPayment(selectedMethod!);
      // Tidak menutup modal secara otomatis, biarkan pengguna menutup manual
    }
  };

  const handleClose = () => {
    // Reset semua state saat modal ditutup
    setSelectedMethod(null);
    setInputAmount("");
    setSenderName("");
    setShowConfirmation(false);
    setIsPaymentSuccess(false);
    onClose();
  };

  const amountNumber = parseInt(inputAmount.replace(/\D/g, "")) || 0;
  const fee = amountNumber >= 50000 ? 0 : 1000;
  const total = amountNumber + fee;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        {!isPaymentSuccess && (
          <DialogHeader>
            <DialogTitle>Pilih Metode Pembayaran</DialogTitle>
            <DialogDescription>
              Silakan pilih cara pembayaran yang Anda inginkan.
            </DialogDescription>
          </DialogHeader>
        )}

        {isPaymentSuccess && (
          <div className="text-center space-y-4 p-4 bg-green-100 rounded-md">
            <div className="text-2xl font-bold text-green-800">✅ Pembayaran Berhasil!</div>
            <div className="text-sm text-green-700">Pesanan Anda akan dikonfirmasi oleh kasir.</div>
            <Button className="mt-4" onClick={handleClose}>
              Tutup
            </Button>
          </div>
        )}

        {!isPaymentSuccess && (
          <>
            {/* Pilihan Metode Pembayaran */}
            <div className="space-y-3 mb-4">
              <Button
                variant={selectedMethod === "cash" ? "default" : "outline"}
                className={`w-full p-4 h-auto justify-start ${
                  selectedMethod === "cash" ? "border-primary bg-blue-50" : ""
                }`}
                onClick={() => setSelectedMethod("cash")}
              >
                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-secondary/10 mr-3">
                    <Banknote className="h-5 w-5 text-secondary" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">Bayar Langsung</div>
                    <div className="text-sm text-gray-600">Bayar di kasir</div>
                  </div>
                </div>
              </Button>

              <Button
                variant={selectedMethod === "dana" ? "default" : "outline"}
                className={`w-full p-4 h-auto justify-start ${
                  selectedMethod === "dana" ? "border-primary bg-blue-50" : ""
                }`}
                onClick={() => setSelectedMethod("dana")}
              >
                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-blue-100 mr-3">
                    <CreditCard className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">Dana</div>
                    <div className="text-sm text-gray-600">
                      Transfer ke <span className="font-semibold">08988231075</span>
                    </div>
                  </div>
                </div>
              </Button>

              <Button
                variant={selectedMethod === "qris" ? "default" : "outline"}
                className={`w-full p-4 h-auto justify-start ${
                  selectedMethod === "qris" ? "border-primary bg-blue-50" : ""
                }`}
                onClick={() => setSelectedMethod("qris")}
              >
                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-accent/10 mr-3">
                    <CreditCard className="h-5 w-5 text-accent" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">QRIS</div>
                    <div className="text-sm text-gray-600">Scan QR untuk bayar</div>
                  </div>
                </div>
              </Button>
            </div>

            {/* Input Dana */}
            {selectedMethod === "dana" && !showConfirmation && (
              <div className="space-y-4 bg-blue-50 p-4 rounded-md">
                <div>
                  <label className="block text-sm font-medium">Nama Pengirim</label>
                  <input
                    type="text"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    className="w-full mt-1 px-3 py-2 border rounded-md"
                    placeholder="Contoh: (nama orang)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Jumlah yang ditransfer</label>
                  <input
                    type="number"
                    value={inputAmount}
                    onChange={(e) => setInputAmount(e.target.value)}
                    className="w-full mt-1 px-3 py-2 border rounded-md"
                    placeholder="Contoh: 50000"
                  />
                </div>
              </div>
            )}

            {/* Konfirmasi Dana */}
            {selectedMethod === "dana" && showConfirmation && (
              <div className="bg-green-50 border border-green-200 rounded-md p-4 space-y-3 text-sm">
                <p><strong>Kirim uang</strong> atas nama <strong>{senderName}</strong></p>
                <div className="grid grid-cols-2 gap-2">
                  <span>Total harga:</span>
                  <span className="text-right">Rp {amountNumber.toLocaleString("id-ID")}</span>
                  <span>Subtotal:</span>
                  <span className="text-right">Rp {amountNumber.toLocaleString("id-ID")}</span>
                  <span>Biaya transaksi:</span>
                  <span className="text-right">
                    {fee === 0 ? "Gratis" : `Rp ${fee.toLocaleString("id-ID")}`}
                  </span>
                </div>
                <hr />
                <div className="flex justify-between items-center">
                  <span>Saldo Dana</span>
                  <button className="text-sm text-blue-600 hover:underline">Ganti</button>
                </div>
                <div className="text-right text-lg font-semibold mt-2">
                  Bayar Rp {total.toLocaleString("id-ID")}
                </div>
              </div>
            )}

            {/* Tombol Aksi */}
            <div className="flex space-x-3 mt-4">
              <Button variant="outline" className="flex-1" onClick={handleClose}>
                Batal
              </Button>
              <Button
                className="flex-1 bg-primary hover:bg-primary/90"
                disabled={
                  !selectedMethod ||
                  (selectedMethod === "dana" && (!inputAmount || !senderName))
                }
                onClick={handleConfirm}
              >
                {showConfirmation ? "Bayar" : "Lanjutkan ke Pembayaran"}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}