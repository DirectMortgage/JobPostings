import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Header from "@/components/header";
import Footer from "@/components/footer";
import JobCard from "@/components/job-card";
import AdminJobForm from "@/components/admin-job-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Plus, AlertCircle, LogIn } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import type { Job } from "@shared/schema";

interface AdminUser {
  id: number;
  username: string;
  isAdmin: boolean;
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: jobs = [], isLoading, error } = useQuery<Job[]>({
    queryKey: ["/api/jobs"],
    enabled: isAuthenticated,
  });

  const loginMutation = useMutation({
    mutationFn: async (creds: { username: string; password: string }) => {
      const response = await apiRequest("POST", "/api/auth/login", creds);
      return response.json();
    },
    onSuccess: (data) => {
      if (data.user.isAdmin) {
        setIsAuthenticated(true);
        setCurrentUser(data.user);
        toast({
          title: "Success",
          description: "Logged in successfully!",
        });
      } else {
        toast({
          title: "Access Denied",
          description: "You need admin privileges to access this page.",
          variant: "destructive",
        });
      }
    },
    onError: () => {
      toast({
        title: "Login Failed",
        description: "Invalid username or password.",
        variant: "destructive",
      });
    },
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(credentials);
  };

  const handleAddJob = () => {
    setEditingJob(null);
    setIsFormOpen(true);
  };

  const handleEditJob = (job: Job) => {
    setEditingJob(job);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingJob(null);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-2xl text-center text-secondary-700">Admin Login</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-500 mb-2">
                    Username
                  </label>
                  <Input
                    type="text"
                    value={credentials.username}
                    onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                    placeholder="Enter username"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-secondary-500 mb-2">
                    Password
                  </label>
                  <Input
                    type="password"
                    value={credentials.password}
                    onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="Enter password"
                    required
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-primary-500 hover:bg-primary-600"
                  disabled={loginMutation.isPending}
                >
                  <LogIn className="mr-2" size={16} />
                  {loginMutation.isPending ? "Logging in..." : "Login"}
                </Button>
              </form>
              
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700">
                  <strong>Demo credentials:</strong><br />
                  Username: admin<br />
                  Password: admin123
                </p>
              </div>
            </CardContent>
          </Card>
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
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold text-secondary-700 mb-4">Job Management</h1>
              <p className="text-lg text-secondary-400">
                Manage job postings and track applications. Welcome back, {currentUser?.username}!
              </p>
            </div>
            <Button 
              onClick={handleAddJob}
              className="bg-accent-500 text-white hover:bg-accent-600 transition-colors font-medium"
            >
              <Plus className="mr-2" size={16} />
              Add New Job
            </Button>
          </div>
        </div>

        {/* Job Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-primary-500 text-xl">📋</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-secondary-500">Total Jobs</p>
                  <p className="text-2xl font-bold text-secondary-700">
                    {isLoading ? "-" : jobs.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-green-500 text-xl">🎯</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-secondary-500">Active Listings</p>
                  <p className="text-2xl font-bold text-secondary-700">
                    {isLoading ? "-" : jobs.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-orange-500 text-xl">👥</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-secondary-500">Applications</p>
                  <p className="text-2xl font-bold text-secondary-700">Coming Soon</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Job Listings */}
        {error ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load job postings. Please try again later.
            </AlertDescription>
          </Alert>
        ) : isLoading ? (
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
        ) : jobs.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-secondary-700 mb-2">No job postings yet</h3>
            <p className="text-secondary-400 mb-6">Get started by creating your first job posting.</p>
            <Button 
              onClick={handleAddJob}
              className="bg-primary-500 hover:bg-primary-600"
            >
              <Plus className="mr-2" size={16} />
              Create Your First Job
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <JobCard 
                key={job.id} 
                job={job} 
                isAdmin={true}
                onEdit={handleEditJob}
              />
            ))}
          </div>
        )}
      </main>

      <Footer />

      {/* Admin Job Form Modal */}
      <AdminJobForm 
        job={editingJob}
        isOpen={isFormOpen}
        onClose={handleCloseForm}
      />
    </div>
  );
}
