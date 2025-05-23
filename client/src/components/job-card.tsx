import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, DollarSign, Edit } from "lucide-react";
import { Link } from "wouter";
import type { Job } from "@shared/schema";

interface JobCardProps {
  job: Job;
  isAdmin?: boolean;
  onEdit?: (job: Job) => void;
}

const getDepartmentIcon = (department: string) => {
  switch (department) {
    case "engineering": return "💻";
    case "design": return "🎨";
    case "product": return "📈";
    case "marketing": return "📢";
    case "sales": return "🤝";
    default: return "🏢";
  }
};

const getDepartmentColor = (department: string) => {
  switch (department) {
    case "engineering": return "bg-blue-100 text-blue-500";
    case "design": return "bg-purple-100 text-purple-500";
    case "product": return "bg-green-100 text-green-500";
    case "marketing": return "bg-yellow-100 text-yellow-600";
    case "sales": return "bg-orange-100 text-orange-500";
    default: return "bg-gray-100 text-gray-500";
  }
};

const formatLocation = (location: string) => {
  switch (location) {
    case "san-francisco": return "San Francisco, CA";
    case "new-york": return "New York, NY";
    case "austin": return "Austin, TX";
    case "remote": return "Remote";
    default: return location;
  }
};

const formatType = (type: string) => {
  return type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('-');
};

const formatDepartment = (department: string) => {
  return department.charAt(0).toUpperCase() + department.slice(1);
};

export default function JobCard({ job, isAdmin = false, onEdit }: JobCardProps) {
  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onEdit) {
      onEdit(job);
    }
  };

  return (
    <Link href={`/jobs/${job.id}`}>
      <Card className="shadow-material hover:shadow-material-lg transition-shadow cursor-pointer">
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center mr-3 text-xl ${getDepartmentColor(job.department)}`}>
                {getDepartmentIcon(job.department)}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-secondary-700">{job.title}</h3>
                <p className="text-sm text-secondary-400">{formatDepartment(job.department)}</p>
              </div>
            </div>
            {isAdmin && (
              <Button variant="ghost" size="sm" onClick={handleEditClick} className="text-secondary-400 hover:text-secondary-600">
                <Edit size={16} />
              </Button>
            )}
          </div>
          
          <div className="space-y-2 mb-4">
            <div className="flex items-center text-sm text-secondary-500">
              <MapPin className="w-4 h-4 mr-2" />
              <span>{formatLocation(job.location)}</span>
            </div>
            <div className="flex items-center text-sm text-secondary-500">
              <Clock className="w-4 h-4 mr-2" />
              <span>{formatType(job.type)}</span>
            </div>
            <div className="flex items-center text-sm text-secondary-500">
              <DollarSign className="w-4 h-4 mr-2" />
              <span>{job.salary}</span>
            </div>
          </div>
          
          <p className="text-sm text-secondary-500 mb-4 line-clamp-3">
            {job.summary}
          </p>
          
          <div className="flex justify-between items-center">
            <span className="text-xs text-secondary-400">Posted {job.postedDate}</span>
            <Button className="bg-primary-500 text-white hover:bg-primary-600 transition-colors text-sm font-medium">
              Apply Now
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
