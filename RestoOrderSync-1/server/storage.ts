import { users, menuItems, orders, transactions, type User, type InsertUser, type MenuItem, type InsertMenuItem, type Order, type InsertOrder, type Transaction, type InsertTransaction } from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Menu operations
  getAllMenuItems(): Promise<MenuItem[]>;
  getMenuItemsByCategory(category: string): Promise<MenuItem[]>;
  getMenuItem(id: number): Promise<MenuItem | undefined>;
  createMenuItem(item: InsertMenuItem): Promise<MenuItem>;
  updateMenuItem(id: number, updates: Partial<InsertMenuItem>): Promise<MenuItem | undefined>;
  deleteMenuItem(id: number): Promise<boolean>;

  // Order operations
  getAllOrders(): Promise<Order[]>;
  getOrdersByStatus(status: string): Promise<Order[]>;
  getOrder(id: number): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrderStatus(id: number, status: string, confirmedAt?: Date): Promise<Order | undefined>;

  // Transaction operations
  getAllTransactions(): Promise<Transaction[]>;
  getTransactionsByDateRange(startDate: Date, endDate: Date): Promise<Transaction[]>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private menuItems: Map<number, MenuItem>;
  private orders: Map<number, Order>;
  private transactions: Map<number, Transaction>;
  private currentUserId: number;
  private currentMenuItemId: number;
  private currentOrderId: number;
  private currentTransactionId: number;

  constructor() {
    this.users = new Map();
    this.menuItems = new Map();
    this.orders = new Map();
    this.transactions = new Map();
    this.currentUserId = 1;
    this.currentMenuItemId = 1;
    this.currentOrderId = 1;
    this.currentTransactionId = 1;

    // Initialize with sample menu items
    this.initializeMenuItems();
  }

  private initializeMenuItems() {
    const sampleMenuItems: InsertMenuItem[] = [
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
      {
        name: "Ayam Bakar Bumbu Rujak",
        description: "Ayam bakar dengan bumbu rujak, nasi, dan lalapan",
        price: 28000,
        category: "makanan-utama",
        image: "ayam-bakar.jpg",
        available: true,
      },
      {
        name: "Es Jeruk Peras",
        description: "Jeruk peras segar dengan es batu",
        price: 8000,
        category: "minuman",
        image: "es-jeruk.jpg",
        available: true,
      },
      {
        name: "Es Teh Manis",
        description: "Teh manis dingin yang menyegarkan",
        price: 5000,
        category: "minuman",
        image: "es-teh.jpg",
        available: true,
      },
      {
        name: "Keripik Singkong",
        description: "Keripik singkong renyah dengan bumbu pedas",
        price: 12000,
        category: "snack",
        image: "keripik.jpg",
        available: true,
      },
      {
        name: "Es Krim Kelapa",
        description: "Es krim rasa kelapa dengan topping kelapa parut",
        price: 15000,
        category: "dessert",
        image: "es-krim.jpg",
        available: true,
      },
    ];

    sampleMenuItems.forEach(item => {
      const menuItem: MenuItem = { ...item, id: this.currentMenuItemId++ };
      this.menuItems.set(menuItem.id, menuItem);
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Menu operations
  async getAllMenuItems(): Promise<MenuItem[]> {
    return Array.from(this.menuItems.values());
  }

  async getMenuItemsByCategory(category: string): Promise<MenuItem[]> {
    return Array.from(this.menuItems.values()).filter(item => item.category === category);
  }

  async getMenuItem(id: number): Promise<MenuItem | undefined> {
    return this.menuItems.get(id);
  }

  async createMenuItem(insertItem: InsertMenuItem): Promise<MenuItem> {
    const id = this.currentMenuItemId++;
    const item: MenuItem = { ...insertItem, id };
    this.menuItems.set(id, item);
    return item;
  }

  async updateMenuItem(id: number, updates: Partial<InsertMenuItem>): Promise<MenuItem | undefined> {
    const item = this.menuItems.get(id);
    if (!item) return undefined;
    
    const updatedItem = { ...item, ...updates };
    this.menuItems.set(id, updatedItem);
    return updatedItem;
  }

  async deleteMenuItem(id: number): Promise<boolean> {
    return this.menuItems.delete(id);
  }

  // Order operations
  async getAllOrders(): Promise<Order[]> {
    return Array.from(this.orders.values()).sort((a, b) => 
      new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );
  }

  async getOrdersByStatus(status: string): Promise<Order[]> {
    return Array.from(this.orders.values())
      .filter(order => order.status === status)
      .sort((a, b) => 
        new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
      );
  }

  async getOrder(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = this.currentOrderId++;
    const order: Order = { 
      ...insertOrder, 
      id, 
      status: insertOrder.status || "pending", // Ensure status is set
      createdAt: new Date(),
      confirmedAt: null,
      tableNumber: insertOrder.tableNumber || null
    };
    this.orders.set(id, order);
    return order;
  }

  async updateOrderStatus(id: number, status: string, confirmedAt?: Date): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;
    
    const updatedOrder = { 
      ...order, 
      status, 
      confirmedAt: confirmedAt || (status === 'confirmed' ? new Date() : order.confirmedAt)
    };
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }

  // Transaction operations
  async getAllTransactions(): Promise<Transaction[]> {
    return Array.from(this.transactions.values()).sort((a, b) => 
      new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );
  }

  async getTransactionsByDateRange(startDate: Date, endDate: Date): Promise<Transaction[]> {
    return Array.from(this.transactions.values())
      .filter(transaction => {
        const transactionDate = new Date(transaction.createdAt || 0);
        return transactionDate >= startDate && transactionDate <= endDate;
      })
      .sort((a, b) => 
        new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
      );
  }

  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const id = this.currentTransactionId++;
    const transaction: Transaction = { 
      ...insertTransaction, 
      id, 
      createdAt: new Date() 
    };
    this.transactions.set(id, transaction);
    return transaction;
  }
}

export const storage = new MemStorage();
