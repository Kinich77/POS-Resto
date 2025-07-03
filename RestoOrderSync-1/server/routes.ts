import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertOrderSchema, insertMenuItemSchema, insertTransactionSchema, type OrderItem } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Menu routes
  app.get("/api/menu", async (req, res) => {
    try {
      const category = req.query.category as string;
      if (category) {
        const items = await storage.getMenuItemsByCategory(category);
        res.json(items);
      } else {
        const items = await storage.getAllMenuItems();
        res.json(items);
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch menu items" });
    }
  });

  app.get("/api/menu/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const item = await storage.getMenuItem(id);
      if (!item) {
        return res.status(404).json({ error: "Menu item not found" });
      }
      res.json(item);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch menu item" });
    }
  });

  app.post("/api/menu", async (req, res) => {
    try {
      const validatedData = insertMenuItemSchema.parse(req.body);
      const item = await storage.createMenuItem(validatedData);
      res.status(201).json(item);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid menu item data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create menu item" });
    }
  });

  app.put("/api/menu/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const item = await storage.updateMenuItem(id, updates);
      if (!item) {
        return res.status(404).json({ error: "Menu item not found" });
      }
      res.json(item);
    } catch (error) {
      res.status(500).json({ error: "Failed to update menu item" });
    }
  });

  app.delete("/api/menu/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteMenuItem(id);
      if (!deleted) {
        return res.status(404).json({ error: "Menu item not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete menu item" });
    }
  });

  // Order routes
  app.get("/api/orders", async (req, res) => {
    try {
      const status = req.query.status as string;
      if (status) {
        const orders = await storage.getOrdersByStatus(status);
        res.json(orders);
      } else {
        const orders = await storage.getAllOrders();
        res.json(orders);
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  });

  app.get("/api/orders/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const order = await storage.getOrder(id);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch order" });
    }
  });

  app.post("/api/orders", async (req, res) => {
    try {
      const validatedData = insertOrderSchema.parse(req.body);
      const order = await storage.createOrder(validatedData);
      
      // Create transaction record
      await storage.createTransaction({
        orderId: order.id,
        amount: order.totalAmount,
        paymentMethod: order.paymentMethod,
        status: "completed",
      });
      
      res.status(201).json(order);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid order data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create order" });
    }
  });

  app.put("/api/orders/:id/status", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      
      if (!status || !["pending", "confirmed", "completed", "rejected"].includes(status)) {
        return res.status(400).json({ error: "Invalid status" });
      }
      
      const order = await storage.updateOrderStatus(id, status, new Date());
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      
      res.json(order);
    } catch (error) {
      res.status(500).json({ error: "Failed to update order status" });
    }
  });

  // Transaction routes
  app.get("/api/transactions", async (req, res) => {
    try {
      const startDate = req.query.startDate as string;
      const endDate = req.query.endDate as string;
      
      if (startDate && endDate) {
        const transactions = await storage.getTransactionsByDateRange(
          new Date(startDate),
          new Date(endDate)
        );
        res.json(transactions);
      } else {
        const transactions = await storage.getAllTransactions();
        res.json(transactions);
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch transactions" });
    }
  });

  // Reports routes
  app.get("/api/reports/summary", async (req, res) => {
    try {
      const startDate = req.query.startDate as string;
      const endDate = req.query.endDate as string;
      
      let transactions;
      if (startDate && endDate) {
        transactions = await storage.getTransactionsByDateRange(
          new Date(startDate),
          new Date(endDate)
        );
      } else {
        transactions = await storage.getAllTransactions();
      }
      
      const orders = await storage.getAllOrders();
      const completedOrders = orders.filter(order => order.status === 'completed');
      
      const summary = {
        totalOrders: completedOrders.length,
        totalRevenue: transactions.reduce((sum, t) => sum + t.amount, 0),
        avgOrderValue: completedOrders.length > 0 
          ? Math.round(transactions.reduce((sum, t) => sum + t.amount, 0) / completedOrders.length)
          : 0,
        topMenuItem: await getTopMenuItem(orders),
        recentTransactions: transactions.slice(0, 10),
      };
      
      res.json(summary);
    } catch (error) {
      res.status(500).json({ error: "Failed to generate report summary" });
    }
  });

  async function getTopMenuItem(orders: any[]) {
    const itemCounts: { [key: string]: number } = {};
    
    orders.forEach(order => {
      try {
        const items: OrderItem[] = JSON.parse(order.items);
        items.forEach(item => {
          itemCounts[item.name] = (itemCounts[item.name] || 0) + item.quantity;
        });
      } catch (e) {
        // Skip invalid JSON
      }
    });
    
    const topItem = Object.entries(itemCounts)
      .sort(([,a], [,b]) => b - a)[0];
    
    return topItem ? topItem[0] : "No data";
  }

  const httpServer = createServer(app);
  return httpServer;
}
