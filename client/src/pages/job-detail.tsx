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
    queryKey: [`/api/jobs/${jobId}`],
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
                    {job.title === "Branch Manager" ? (
                      <div>
                        <p className="mb-4">Under the direction of Senior Management, the Branch Manager is responsible for planning, directing and controlling the operation of the loan production to establish marketing functions of the branch.</p>
                      </div>
                    ) : job.title === "National Recruiter" ? (
                      <p>The National Recruiter will be Responsible for working with the Head of National Retail Lending to strategically manage corporate growth by adding Loan Officers and Branches Nationally. They will work with the Head of Training and corporate management team to maximize workflow efficiencies between the corporate operations and branch employees. Recruiter will assist with the facilitation of branch growth by working in conjunction with Branch Managers to understand their candidate requirements.</p>
                    ) : (
                      <p className="whitespace-pre-wrap">{job.description || "No description available"}</p>
                    )}
                  </div>

                  <h2 className="text-xl font-semibold text-secondary-700 mb-4">Responsibilities</h2>
                  <div className="text-secondary-500 mb-8">
                    {job.title === "Branch Manager" ? (
                      <ul className="list-disc list-inside space-y-2">
                        <li className="text-base">
                          Develop and implement strategies to generate loans from the following sources:
                          <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                            <li className="text-base">Real Estate Companies</li>
                            <li className="text-base">Builders</li>
                            <li className="text-base">Relocation Companies</li>
                            <li className="text-base">The Public</li>
                          </ul>
                        </li>
                        <li className="text-base">Recruit, hire & train and supervise Loan Officers and individuals involved in the loan production functions. Develop compensation and incentive programs for production staff.</li>
                        <li className="text-base">Develop and conduct mortgage finance training programs.</li>
                        <li className="text-base">Work in conjunction with the Director of Marketing to establish marketing materials to be used by loan officers</li>
                        <li className="text-base">Participate with Senior Management in the development of financial products to be marketed.</li>
                        <li className="text-base">Submit management and financial reports as required.</li>
                        <li className="text-base">Perform other tasks as assigned by supervisor</li>
                      </ul>
                    ) : (
                      job.requirements ? (
                        <ul className="list-disc list-inside space-y-2">
                          {job.requirements.split('\n').map((req, index) => (
                            <li key={index} className="text-base">
                              {req.replace(/^[•\-*]\s*/, '')}
                            </li>
                          ))}
                        </ul>
                      ) : null
                    )}
                  </div>

                  {job.title === "Branch Manager" && (
                    <>
                      <h2 className="text-xl font-semibold text-secondary-700 mb-4">Job Requirements</h2>
                      <div className="text-secondary-500 mb-8">
                        <ul className="list-disc list-inside space-y-2">
                          <li className="text-base">Minimum of 4 years College</li>
                          <li className="text-base">At least 10 years of experience in Sales or Sales Management</li>
                          <li className="text-base">Strong written and verbal skills required</li>
                          <li className="text-base">Licensed to originate loans</li>
                        </ul>
                      </div>

                      <h2 className="text-xl font-semibold text-secondary-700 mb-4">Physical Demands</h2>
                      <div className="text-secondary-500 mb-8">
                        <ul className="list-disc list-inside space-y-2">
                          <li className="text-base">Must be able to work in a normal office environment</li>
                          <li className="text-base">May occasionally need to lift up to 20 pounds</li>
                        </ul>
                      </div>
                    </>
                  )}

                  {job.title !== "Branch Manager" && (
                    <>
                      <h2 className="text-xl font-semibold text-secondary-700 mb-4">Job Requirements</h2>
                      <div className="text-secondary-500 mb-8">
                        <ul className="list-disc list-inside space-y-2">
                          {job.title === "Processor" && (
                            <>
                              <li className="text-base">High School diploma or equivalent required</li>
                              <li className="text-base">1-2 years of mortgage processing experience preferred</li>
                              <li className="text-base">Strong attention to detail and organizational skills</li>
                              <li className="text-base">Proficiency in mortgage software and Microsoft Office</li>
                              <li className="text-base">Excellent communication and customer service skills</li>
                            </>
                          )}
                          {job.title === "Mortgage Loan Originator" && (
                            <>
                              <li className="text-base">Bachelor's degree preferred or equivalent experience</li>
                              <li className="text-base">Active NMLS license required</li>
                              <li className="text-base">2+ years of mortgage origination experience</li>
                              <li className="text-base">Strong sales and relationship building skills</li>
                              <li className="text-base">Knowledge of loan products and underwriting guidelines</li>
                            </>
                          )}
                          {job.title === "Director of Employee Experience" && (
                            <>
                              <li className="text-base">Bachelor's degree in Human Resources, Business Administration, or related field</li>
                              <li className="text-base">5+ years of HR leadership experience</li>
                              <li className="text-base">Strong knowledge of employment law and HR best practices</li>
                              <li className="text-base">Experience with HRIS systems and analytics</li>
                              <li className="text-base">Excellent leadership and communication skills</li>
                            </>
                          )}
                          {job.title === "National Recruiter" && (
                            <>
                              <li className="text-base">At least (5) years mortgage banking, with a built book of Business/Candidates</li>
                              <li className="text-base">Effectively expressing ideas and information to individuals and groups</li>
                              <li className="text-base">Adjusting presentation, language, terminology, and style to meet the needs of the audience</li>
                              <li className="text-base">Utilizing the best communication methods for the given situation and message</li>
                              <li className="text-base">Effective communication; whether verbal, email or memorandum</li>
                              <li className="text-base">Must be proficient in Word, Excel, and Outlook applications</li>
                              <li className="text-base">Must have a positive attitude</li>
                              <li className="text-base">Must be dependable, self-motivated and require minimal supervision</li>
                              <li className="text-base">Ensure appropriate documentation for all processes and procedures</li>
                              <li className="text-base">Well groomed and business professional at all times</li>
                              <li className="text-base">Willing to travel as needed</li>
                              <li className="text-base">A working knowledge of industry related trade associations (i.e. Realtor, Homebuilder, Mortgage Banking groups)</li>
                              <li className="text-base">Successful background in business planning as well as budgeting and working knowledge of industry specific software's</li>
                              <li className="text-base">Be well spoken, outgoing, and posses ability to converse with all types of people</li>
                            </>
                          )}
                          {job.title === "Regional Sales Manager" && (
                            <>
                              <li className="text-base">Bachelor's degree in Business, Sales, or related field</li>
                              <li className="text-base">5+ years of sales management experience in mortgage industry</li>
                              <li className="text-base">Proven track record of achieving sales targets</li>
                              <li className="text-base">Strong leadership and team development skills</li>
                              <li className="text-base">NMLS license preferred</li>
                            </>
                          )}
                          {job.title === "Licensed Loan Partner (Qualification Specialist)" && (
                            <>
                              <li className="text-base">Active NMLS license required</li>
                              <li className="text-base">2+ years of mortgage industry experience</li>
                              <li className="text-base">Strong analytical and problem-solving skills</li>
                              <li className="text-base">Knowledge of loan qualification criteria</li>
                              <li className="text-base">Excellent verbal and written communication skills</li>
                            </>
                          )}
                          {job.title === "Branch Operations Manager" && (
                            <>
                              <li className="text-base">Bachelor's degree in Business Administration or related field</li>
                              <li className="text-base">3+ years of operations management experience</li>
                              <li className="text-base">Knowledge of mortgage operations and compliance</li>
                              <li className="text-base">Strong analytical and process improvement skills</li>
                              <li className="text-base">Leadership and team management experience</li>
                            </>
                          )}
                        </ul>
                      </div>

                      <h2 className="text-xl font-semibold text-secondary-700 mb-4">Physical Demands</h2>
                      <div className="text-secondary-500 mb-8">
                        {job.title === "National Recruiter" ? (
                          <p className="text-base">While performing the duties of this job, a person is regularly sitting in a normal office environment at a desk using a computer, phone, fax and copy machine. This person may occasionally need to lift up to 20 pounds.</p>
                        ) : (
                          <ul className="list-disc list-inside space-y-2">
                            <li className="text-base">Must be able to work in a normal office environment</li>
                            <li className="text-base">Extended periods of computer work and data entry</li>
                            <li className="text-base">May occasionally need to lift up to 20 pounds</li>
                            {job.title === "Regional Sales Manager" && (
                              <li className="text-base">Ability to travel as required for client meetings and events</li>
                            )}
                          </ul>
                        )}
                      </div>

                      {job.title === "National Recruiter" && (
                        <>
                          <h2 className="text-xl font-semibold text-secondary-700 mb-4">Work Environment</h2>
                          <div className="text-secondary-500 mb-8">
                            <p className="text-base mb-4">Standard office environment. This role may require travel therefore a reliable vehicle is needed.</p>
                            <p className="text-base">This job description reflects management's definition of the essential functions for this job but does not restrict the tasks that may be assigned. Management may assign or reassign duties and responsibilities to this job at any time due to reasonable accommodation or other reasons. In addition, the above statements are intended to describe the general nature and level of work being performed by the person assigned to this job.</p>
                          </div>
                        </>
                      )}


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
