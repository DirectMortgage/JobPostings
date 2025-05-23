import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/header";
import Footer from "@/components/footer";
import JobFilters from "@/components/job-filters";
import JobCard from "@/components/job-card";
import JobModal from "@/components/job-modal";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import type { Job } from "@shared/schema";

export default function JobsPage() {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    department: "all",
    location: "all",
    type: "all"
  });

  const { data: jobs = [], isLoading, error } = useQuery<Job[]>({
    queryKey: ["/api/jobs"],
  });

  const filteredJobs = jobs.filter(job => {
    if (filters.department !== "all" && job.department !== filters.department) return false;
    if (filters.location !== "all" && job.location !== filters.location) return false;
    if (filters.type !== "all" && job.type !== filters.type) return false;
    return true;
  });

  const handleJobClick = (job: Job) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedJob(null);
  };

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load job postings. Please try again later.
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
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-secondary-700 mb-4">Join Our Team</h1>
          <p className="text-lg text-secondary-400 max-w-3xl">
            Discover exciting career opportunities at Direct Mortgage. We're looking for talented individuals to help us provide exceptional mortgage lending services to our clients.
          </p>
        </div>

        {/* Filters */}
        <JobFilters onFilterChange={setFilters} />

        {/* Job Count */}
        <div className="mb-6">
          {isLoading ? (
            <Skeleton className="h-6 w-32" />
          ) : (
            <>
              <span className="text-secondary-500">{filteredJobs.length}</span>
              <span className="text-secondary-400"> positions available</span>
            </>
          )}
        </div>

        {/* Job Listings */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-material p-6">
                <div className="flex items-center mb-4">
                  <Skeleton className="w-12 h-12 rounded-lg mr-3" />
                  <div>
                    <Skeleton className="h-5 w-32 mb-2" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-28" />
                </div>
                <Skeleton className="h-16 w-full mb-4" />
                <div className="flex justify-between items-center">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-8 w-20" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-secondary-700 mb-2">No jobs found</h3>
            <p className="text-secondary-400">Try adjusting your filters to see more opportunities.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => (
              <div key={job.id} onClick={() => handleJobClick(job)}>
                <JobCard job={job} />
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />

      {/* Job Detail Modal */}
      <JobModal 
        job={selectedJob} 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
      />
    </div>
  );
}
