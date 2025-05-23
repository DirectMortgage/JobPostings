import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Job, InsertJob } from "@shared/schema";

interface AdminJobFormProps {
  job?: Job | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminJobForm({ job, isOpen, onClose }: AdminJobFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isEditing = !!job;

  const [formData, setFormData] = useState<InsertJob>({
    title: job?.title || "",
    department: job?.department || "",
    location: job?.location || "",
    type: job?.type || "",
    salary: job?.salary || "",
    summary: job?.summary || "",
    description: job?.description || "",
    requirements: job?.requirements || "",
    niceToHave: job?.niceToHave || "",
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertJob) => {
      const response = await apiRequest("POST", "/api/jobs", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/jobs"] });
      toast({
        title: "Success",
        description: "Job posting created successfully!",
      });
      onClose();
      resetForm();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create job posting. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: InsertJob) => {
      const response = await apiRequest("PUT", `/api/jobs/${job!.id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/jobs"] });
      queryClient.invalidateQueries({ queryKey: ["/api/jobs", job!.id.toString()] });
      toast({
        title: "Success",
        description: "Job posting updated successfully!",
      });
      onClose();
      resetForm();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update job posting. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("DELETE", `/api/jobs/${job!.id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/jobs"] });
      toast({
        title: "Success",
        description: "Job posting deleted successfully!",
      });
      onClose();
      resetForm();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete job posting. Please try again.",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      title: "",
      department: "",
      location: "",
      type: "",
      salary: "",
      summary: "",
      description: "",
      requirements: "",
      niceToHave: "",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEditing) {
      updateMutation.mutate(formData);
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this job posting?")) {
      deleteMutation.mutate();
    }
  };

  const handleInputChange = (field: keyof InsertJob, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Job Posting" : "Create New Job Posting"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Job Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="e.g. Senior Software Engineer"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Select value={formData.department} onValueChange={(value) => handleInputChange("department", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="engineering">Engineering</SelectItem>
                  <SelectItem value="design">Design</SelectItem>
                  <SelectItem value="product">Product</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="sales">Sales</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Select value={formData.location} onValueChange={(value) => handleInputChange("location", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="remote">Remote</SelectItem>
                  <SelectItem value="san-francisco">San Francisco, CA</SelectItem>
                  <SelectItem value="new-york">New York, NY</SelectItem>
                  <SelectItem value="austin">Austin, TX</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Job Type</Label>
              <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select job type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full-time">Full-time</SelectItem>
                  <SelectItem value="part-time">Part-time</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="internship">Internship</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="salary">Salary Range</Label>
            <Input
              id="salary"
              value={formData.salary}
              onChange={(e) => handleInputChange("salary", e.target.value)}
              placeholder="e.g. $120,000 - $160,000"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="summary">Summary</Label>
            <Textarea
              id="summary"
              value={formData.summary}
              onChange={(e) => handleInputChange("summary", e.target.value)}
              placeholder="Brief description for job cards (150-200 characters)"
              className="min-h-[80px]"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Full Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Detailed job description"
              className="min-h-[120px]"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="requirements">Requirements</Label>
            <Textarea
              id="requirements"
              value={formData.requirements}
              onChange={(e) => handleInputChange("requirements", e.target.value)}
              placeholder="• Requirement 1&#10;• Requirement 2&#10;• Requirement 3"
              className="min-h-[120px]"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="niceToHave">Nice to Have (Optional)</Label>
            <Textarea
              id="niceToHave"
              value={formData.niceToHave}
              onChange={(e) => handleInputChange("niceToHave", e.target.value)}
              placeholder="• Nice to have 1&#10;• Nice to have 2&#10;• Nice to have 3"
              className="min-h-[100px]"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
              type="submit" 
              className="bg-primary-500 hover:bg-primary-600"
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {isEditing ? "Update Job" : "Create Job"}
            </Button>
            
            {isEditing && (
              <Button 
                type="button" 
                variant="destructive"
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
              >
                Delete Job
              </Button>
            )}
            
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
