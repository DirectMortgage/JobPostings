import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertJobSchema, updateJobSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Get all jobs
  app.get("/api/jobs", async (req, res) => {
    try {
      const jobs = await storage.getAllJobs();
      res.json(jobs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch jobs" });
    }
  });

  // Get jobs with filters
  app.get("/api/jobs/filter", async (req, res) => {
    try {
      const { department, location, type } = req.query;
      const jobs = await storage.getJobsByFilter({
        department: department as string,
        location: location as string,
        type: type as string
      });
      res.json(jobs);
    } catch (error) {
      res.status(500).json({ message: "Failed to filter jobs" });
    }
  });

  // Get job by ID
  app.get("/api/jobs/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid job ID" });
      }

      const job = await storage.getJobById(id);
      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }

      res.json(job);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch job" });
    }
  });

  // Create new job (admin only)
  app.post("/api/jobs", async (req, res) => {
    try {
      const validatedData = insertJobSchema.parse(req.body);
      const job = await storage.createJob(validatedData);
      res.status(201).json(job);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid job data", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Failed to create job" });
    }
  });

  // Update job (admin only)
  app.put("/api/jobs/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid job ID" });
      }

      const validatedData = updateJobSchema.partial().parse(req.body);
      const job = await storage.updateJob(id, validatedData);
      
      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }

      res.json(job);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid job data", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Failed to update job" });
    }
  });

  // Delete job (admin only)
  app.delete("/api/jobs/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid job ID" });
      }

      const deleted = await storage.deleteJob(id);
      if (!deleted) {
        return res.status(404).json({ message: "Job not found" });
      }

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete job" });
    }
  });

  // Simple auth endpoints for admin functionality
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await storage.getUserByUsername(username);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      res.json({ 
        user: { 
          id: user.id, 
          username: user.username, 
          isAdmin: user.isAdmin === "true" 
        } 
      });
    } catch (error) {
      res.status(500).json({ message: "Login failed" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
