import { pgTable, text, serial, integer, boolean, timestamp, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const menuItems = pgTable("menu_items", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(), // price in rupiah
  category: text("category").notNull(),
  image: text("image"),
  available: boolean("available").default(true),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  customerInfo: text("customer_info").notNull(),
  tableNumber: text("table_number"),
  items: text("items").notNull(), // JSON string of order items
  totalAmount: integer("total_amount").notNull(),
  paymentMethod: text("payment_method").notNull(), // 'cash' or 'qris'
  status: text("status").notNull().default("pending"), // pending, confirmed, completed, rejected
  createdAt: timestamp("created_at").defaultNow(),
  confirmedAt: timestamp("confirmed_at"),
});

export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").references(() => orders.id),
  amount: integer("amount").notNull(),
  paymentMethod: text("payment_method").notNull(),
  status: text("status").notNull(), // completed, failed
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertMenuItemSchema = createInsertSchema(menuItems).omit({
  id: true,
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
  confirmedAt: true,
});

export const insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true,
  createdAt: true,
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type MenuItem = typeof menuItems.$inferSelect;
export type InsertMenuItem = z.infer<typeof insertMenuItemSchema>;

export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;

export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;

// Additional types for frontend
export type CartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
};

export type OrderItem = {
  menuItemId: number;
  name: string;
  price: number;
  quantity: number;
};
