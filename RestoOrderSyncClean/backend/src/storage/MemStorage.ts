export class MemStorage {
  users = new Map();
  menuItems = new Map();
  orders = new Map();
  transactions = new Map();
  currentUserId = 1;
  currentMenuItemId = 1;
  currentOrderId = 1;
  currentTransactionId = 1;

  constructor() {
    this.initializeMenuItems();
  }

  initializeMenuItems() {
    const sampleMenuItems = [
      {
        name: "Nasi Gudeg Special",
        description: "Gudeg ayam dengan nasi, sambal, dan kerupuk",
        price: 25000,
        category: "makanan-utama",
        image: "gudeg.jpg",
        available: true,
      },
      {
        name: "Nasi Goreng Kampung",
        description: "Nasi goreng dengan telur, sayuran, dan kerupuk",
        price: 22000,
        category: "makanan-utama",
        image: "nasgor.jpg",
        available: true,
      },
    ];
    sampleMenuItems.forEach((item) => {
      this.menuItems.set(this.currentMenuItemId++, item);
    });
  }
}
