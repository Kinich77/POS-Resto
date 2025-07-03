import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { formatCurrencySimple } from "@/lib/utils";

interface QrisModalProps {
  isOpen: boolean;
  totalAmount: number;
  onConfirm: () => void;
  onClose: () => void;
}

export default function QrisModal({ isOpen, totalAmount, onConfirm, onClose }: QrisModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-center">Scan QR Code</DialogTitle>
          <DialogDescription className="text-center">
            Gunakan aplikasi mobile banking atau e-wallet untuk scan QR code.
          </DialogDescription>
        </DialogHeader>
        
        <div className="text-center">
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=Bayar%20Rp%20${totalAmount}`}
            alt="QRIS QR Code"
            className="mx-auto w-40 h-40 object-contain"
          />
          <p className="text-gray-600 mb-4">
            Total: <span className="font-bold text-primary">{formatCurrencySimple(totalAmount)}</span>
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Scan dengan aplikasi mobile banking atau e-wallet Anda
          </p>
          <Button 
            onClick={onConfirm}
            className="w-full bg-secondary hover:bg-secondary/90 text-white"
            size="lg"
          >
            Konfirmasi Pembayaran
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
