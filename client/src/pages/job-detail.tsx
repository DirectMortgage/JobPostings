import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, MapPin, Clock, DollarSign, Send, Share, AlertCircle } from "lucide-react";
import type { Job } from "@shared/schema";

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
  if (!type) return '';
  return type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('-');
};

const formatDepartment = (department: string) => {
  if (!department) return '';
  return department.charAt(0).toUpperCase() + department.slice(1);
};

export default function JobDetailPage() {
  const params = useParams();
  const jobId = params.id;

  const { data: job, isLoading, error } = useQuery<Job>({
    queryKey: ["/api/jobs", jobId],
    enabled: !!jobId,
  });

  const handleApply = () => {
    alert("Application functionality would be implemented here!");
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: job?.title,
        text: job?.summary,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Job link copied to clipboard!");
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load job details. Please try again later.
            </AlertDescription>
          </Alert>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Navigation */}
        <div className="mb-6">
          <Link href="/jobs">
            <Button variant="ghost" className="text-primary-500 hover:text-primary-600">
              <ArrowLeft className="mr-2" size={16} />
              Back to Jobs
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="space-y-6">
            {/* Header Skeleton */}
            <div className="border-b border-gray-200 pb-6">
              <div className="flex items-center">
                <Skeleton className="w-16 h-16 rounded-lg mr-4" />
                <div>
                  <Skeleton className="h-8 w-64 mb-2" />
                  <Skeleton className="h-5 w-48" />
                </div>
              </div>
            </div>
            
            {/* Content Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-6 w-28" />
                <Skeleton className="h-32 w-full" />
              </div>
              <div>
                <Skeleton className="h-64 w-full" />
              </div>
            </div>
          </div>
        ) : job ? (
          <>
            {/* Job Header */}
            <div className="border-b border-gray-200 pb-6 mb-8">
              <div className="flex items-center">
                <div className={`w-16 h-16 rounded-lg flex items-center justify-center mr-4 text-2xl ${getDepartmentColor(job.department)}`}>
                  {getDepartmentIcon(job.department)}
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-secondary-700">{job.title}</h1>
                  <p className="text-lg text-secondary-500">
                    {job.department ? formatDepartment(job.department) : ''} • {job.type ? formatType(job.type) : ''} • {job.location ? formatLocation(job.location) : ''}
                  </p>
                </div>
              </div>
            </div>

            {/* Job Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="prose prose-sm max-w-none">
                  <h2 className="text-xl font-semibold text-secondary-700 mb-4">About the Role</h2>
                  <div className="text-secondary-500 mb-8 text-base leading-relaxed">
                    {job.description ? (
                      <p className="whitespace-pre-wrap">{job.description}</p>
                    ) : (
                      <p>No description available</p>
                    )}
                  </div>

                  <h2 className="text-xl font-semibold text-secondary-700 mb-4">Requirements</h2>
                  <div className="text-secondary-500 mb-8">
                    {job.requirements ? job.requirements.split('\n').map((req, index) => (
                      <div key={index} className="mb-2 text-base">
                        {req.startsWith('•') ? req : `• ${req}`}
                      </div>
                    )) : null}
                  </div>

                  {job.niceToHave && (
                    <>
                      <h2 className="text-xl font-semibold text-secondary-700 mb-4">Nice to Have</h2>
                      <div className="text-secondary-500">
                        {job.niceToHave.split('\n').map((item, index) => (
                          <div key={index} className="mb-2 text-base">
                            {item.startsWith('•') ? item : `• ${item}`}
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Job Details Sidebar */}
              <div>
                <div className="bg-gray-50 rounded-lg p-6 sticky top-24">
                  <h3 className="text-lg font-semibold text-secondary-700 mb-6">Job Details</h3>
                  <div className="space-y-6">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center mr-3">
                        <span className="text-primary-500 text-lg">{getDepartmentIcon(job.department)}</span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-secondary-500">Department</span>
                        <p className="text-secondary-700">{formatDepartment(job.department)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center mr-3">
                        <MapPin className="text-primary-500" size={16} />
                      </div>
                      <div>
                        <span className="text-sm font-medium text-secondary-500">Location</span>
                        <p className="text-secondary-700">{formatLocation(job.location)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center mr-3">
                        <Clock className="text-primary-500" size={16} />
                      </div>
                      <div>
                        <span className="text-sm font-medium text-secondary-500">Employment Type</span>
                        <p className="text-secondary-700">{formatType(job.type)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center mr-3">
                        <DollarSign className="text-primary-500" size={16} />
                      </div>
                      <div>
                        <span className="text-sm font-medium text-secondary-500">Salary Range</span>
                        <p className="text-secondary-700">{job.salary}</p>
                      </div>
                    </div>
                    
                    <div className="border-t border-gray-200 pt-4">
                      <span className="text-sm font-medium text-secondary-500">Posted</span>
                      <p className="text-secondary-700">{job.postedDate}</p>
                    </div>
                  </div>

                  <div className="mt-8 space-y-3">
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
          </>
        ) : (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Job not found. The position may have been removed or the ID is invalid.
            </AlertDescription>
          </Alert>
        )}
      </main>

      <Footer />
    </div>
  );
}
