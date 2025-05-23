import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, DollarSign, Send, Share } from "lucide-react";
import type { Job } from "@shared/schema";

interface JobModalProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
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

export default function JobModal({ job, isOpen, onClose }: JobModalProps) {
  if (!job) return null;

  const handleApply = () => {
    alert("Application functionality would be implemented here!");
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: job.title,
        text: job.summary,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Job link copied to clipboard!");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b border-gray-200 pb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center">
              <div className={`w-16 h-16 rounded-lg flex items-center justify-center mr-4 text-2xl ${getDepartmentColor(job.department)}`}>
                {getDepartmentIcon(job.department)}
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold text-secondary-700">{job.title}</DialogTitle>
                <p className="text-secondary-500">
                  {formatDepartment(job.department)} • {formatType(job.type)} • {formatLocation(job.location)}
                </p>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="pt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="prose prose-sm max-w-none">
                <h3 className="text-lg font-semibold text-secondary-700 mb-3">About the Role</h3>
                <p className="text-secondary-500 mb-6 whitespace-pre-wrap">
                  {job.description}
                </p>

                <h3 className="text-lg font-semibold text-secondary-700 mb-3">Requirements</h3>
                <div className="text-secondary-500 mb-6">
                  {job.requirements.split('\n').map((req, index) => (
                    <div key={index} className="mb-1">
                      {req.startsWith('•') ? req : `• ${req}`}
                    </div>
                  ))}
                </div>

                {job.niceToHave && (
                  <>
                    <h3 className="text-lg font-semibold text-secondary-700 mb-3">Nice to Have</h3>
                    <div className="text-secondary-500">
                      {job.niceToHave.split('\n').map((item, index) => (
                        <div key={index} className="mb-1">
                          {item.startsWith('•') ? item : `• ${item}`}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            <div>
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-secondary-700 mb-4">Job Details</h3>
                <div className="space-y-4">
                  <div>
                    <span className="text-sm font-medium text-secondary-500">Department</span>
                    <p className="text-secondary-700">{formatDepartment(job.department)}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-secondary-500">Location</span>
                    <p className="text-secondary-700">{formatLocation(job.location)}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-secondary-500">Employment Type</span>
                    <p className="text-secondary-700">{formatType(job.type)}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-secondary-500">Salary Range</span>
                    <p className="text-secondary-700">{job.salary}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-secondary-500">Posted</span>
                    <p className="text-secondary-700">{job.postedDate}</p>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <Button onClick={handleApply} className="w-full bg-primary-500 text-white hover:bg-primary-600 transition-colors font-medium">
                    <Send className="mr-2" size={16} />
                    Apply for this Position
                  </Button>
                  <Button onClick={handleShare} variant="outline" className="w-full border-secondary-300 text-secondary-600 hover:bg-gray-50 transition-colors font-medium">
                    <Share className="mr-2" size={16} />
                    Share this Job
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
