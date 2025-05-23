import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

interface JobFiltersProps {
  onFilterChange: (filters: { department: string; location: string; type: string }) => void;
}

export default function JobFilters({ onFilterChange }: JobFiltersProps) {
  const [filters, setFilters] = useState({
    department: "all",
    location: "all",
    type: "all"
  });

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
  };

  const handleApplyFilters = () => {
    onFilterChange(filters);
  };

  return (
    <Card className="shadow-material mb-8">
      <CardContent className="p-6">
        <h2 className="text-lg font-semibold text-secondary-700 mb-4">Filter Opportunities</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-secondary-500 mb-2">Department</label>
            <Select value={filters.department} onValueChange={(value) => handleFilterChange("department", value)}>
              <SelectTrigger className="w-full focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                <SelectValue placeholder="All Departments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="engineering">Engineering</SelectItem>
                <SelectItem value="design">Design</SelectItem>
                <SelectItem value="product">Product</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
                <SelectItem value="sales">Sales</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-500 mb-2">Location</label>
            <Select value={filters.location} onValueChange={(value) => handleFilterChange("location", value)}>
              <SelectTrigger className="w-full focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                <SelectValue placeholder="All Locations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="remote">Remote</SelectItem>
                <SelectItem value="san-francisco">San Francisco, CA</SelectItem>
                <SelectItem value="new-york">New York, NY</SelectItem>
                <SelectItem value="austin">Austin, TX</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-500 mb-2">Job Type</label>
            <Select value={filters.type} onValueChange={(value) => handleFilterChange("type", value)}>
              <SelectTrigger className="w-full focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="full-time">Full-time</SelectItem>
                <SelectItem value="part-time">Part-time</SelectItem>
                <SelectItem value="contract">Contract</SelectItem>
                <SelectItem value="internship">Internship</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end">
            <Button 
              onClick={handleApplyFilters}
              className="w-full bg-primary-500 text-white hover:bg-primary-600 transition-colors font-medium"
            >
              <Search className="mr-2" size={16} />
              Search Jobs
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
