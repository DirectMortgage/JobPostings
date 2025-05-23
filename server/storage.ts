import { Job, InsertJob, User, InsertUser, UpdateJob } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Job management
  getAllJobs(): Promise<Job[]>;
  getJobById(id: number): Promise<Job | undefined>;
  createJob(job: InsertJob): Promise<Job>;
  updateJob(id: number, job: Partial<UpdateJob>): Promise<Job | undefined>;
  deleteJob(id: number): Promise<boolean>;
  getJobsByFilter(filters: { department?: string; location?: string; type?: string }): Promise<Job[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private jobs: Map<number, Job>;
  private currentUserId: number;
  private currentJobId: number;

  constructor() {
    this.users = new Map();
    this.jobs = new Map();
    this.currentUserId = 1;
    this.currentJobId = 1;

    // Create default admin user
    this.createUser({ username: "admin", password: "admin123", isAdmin: "true" });
    
    // Create some initial job postings
    this.seedJobs();
  }

  private async seedJobs() {
    const sampleJobs = [
      {
        title: "Processor",
        department: "operations",
        location: "san-francisco",
        type: "full-time",
        salary: "$45,000 - $65,000",
        summary: "The Loan Processor is responsible for processing loan applications in compliance with mortgage lending and applicable investor guidelines. Manage pipeline, submit files to underwriting, and support loan officer teams.",
        description: "The Loan Processor is responsible for processing loan applications in compliance with mortgage lending and applicable investor guidelines. Performs duties such as analyzing the loan application, assessing creditworthiness and the likelihood that a loan applicant will be able to repay the debt, analyzing the AUS/Guidelines as they pertain to the loan product and sales structure, reviewing title commitments and fees, ordering subordinations and allocating fees properly in the system. Responsible for monitoring the loan process and managing the proper expectations with the client and the sales staff through closing.",
        requirements: "• High school diploma or equivalent\n• Must be able to work 40 hours per week and overtime as required\n• Must be proficient in Word, Excel and Outlook applications\n• Proficient in DU/DO, LP, & major Origination systems\n• Must have excellent verbal and written communication skills\n• Must have a positive attitude\n• Must be dependable, self-motivated and require minimal supervision\n• Proficient with major correspondent and wholesale channels and their guidelines",
        niceToHave: "• Previous mortgage industry experience\n• Knowledge of underwriting standards\n• Experience with loan processing software\n• Familiarity with compliance requirements",
        postedDate: "1 day ago"
      },
      {
        title: "Mortgage Loan Originator",
        department: "sales",
        location: "remote",
        type: "full-time",
        salary: "Commission-only",
        summary: "As a Mortgage Loan Originator (MLO) with Direct Mortgage, you will be responsible for sourcing and originating mortgage loan applications. Your role will focus on developing strong relationships with clients, referral partners, and industry professionals to generate new business.",
        description: "Conduct outside sales activities including client meetings, cold calls, and networking with referral sources such as real estate agents, builders, and financial professionals. Develop and maintain a pipeline of new business through ongoing relationship management and community engagement. Assess client financial profiles and recommend appropriate mortgage products. Guide clients through the loan application process from start to finish, ensuring a smooth and positive experience.",
        requirements: "• High school diploma or equivalent required\n• Minimum 1 year of experience as a Mortgage Loan Originator at a mortgage lender, bank, or financial institution\n• Proven success in generating both refinance and purchase loans\n• Solid understanding of mortgage lending guidelines including FHA, VA, USDA, FNMA, and FHLMC\n• Strong sales and relationship-building skills with a proactive, client-first approach\n• Working knowledge of federal real estate lending regulations and Fair Lending practices\n• Must possess an active NMLS license",
        niceToHave: "• Experience with real estate agent relationships\n• Knowledge of local market conditions\n• Experience with community networking and events\n• Background in financial services or banking",
        postedDate: "5 days ago"
      },
      {
        title: "Branch Manager",
        department: "management",
        location: "san-francisco",
        type: "full-time",
        salary: "$80,000 - $110,000",
        summary: "Lead and manage all aspects of branch operations including sales, operations, and staff development. Drive branch performance and ensure exceptional customer service delivery.",
        description: "The Branch Manager is responsible for the overall management and performance of the branch, including sales production, operational efficiency, and team development. This role requires strong leadership skills and the ability to drive results while maintaining high standards of customer service and regulatory compliance.",
        requirements: "• Minimum of 4 years College\n• At least 10 years of experience in Sales or Sales Management\n• Strong written and verbal skills required\n• Licensed to originate loans\n• Must be able to work in a normal office environment\n• Ability to lift up to 20 pounds occasionally",
        niceToHave: "• Previous mortgage industry management experience\n• Experience with loan officer training and development\n• Knowledge of mortgage finance products\n• Experience with marketing material development",
        postedDate: "3 days ago"
      },
      {
        title: "Branch Operations Manager",
        department: "operations",
        location: "remote",
        type: "full-time",
        salary: "$75,000 - $95,000",
        summary: "The Branch Operations Manager is responsible for regional oversight of operations and workflow management. Manage multiple branch locations and ensure efficient loan processing operations across the region.",
        description: "Oversee daily operations of multiple branch locations and ensure efficient workflow management across the region. Coordinate with underwriting, processing, and closing departments to maintain optimal loan processing timelines. Develop and implement operational procedures to improve efficiency and customer satisfaction. Monitor branch performance metrics and provide guidance to branch staff. Ensure compliance with company policies and regulatory requirements.",
        requirements: "• 5+ years of experience in mortgage operations or branch management\n• Strong understanding of mortgage loan processing and underwriting\n• Experience with LOS platforms (Encompass preferred)\n• Excellent leadership and communication skills\n• Knowledge of regulatory compliance requirements\n• Bachelor's degree preferred\n• Ability to manage multiple locations and teams",
        niceToHave: "• Previous mortgage operations management experience\n• Experience with process improvement initiatives\n• Knowledge of mortgage finance products\n• Experience with performance metrics and reporting",
        postedDate: "2 weeks ago"
      },
      {
        title: "National Recruiter",
        department: "management",
        location: "dallas",
        type: "full-time",
        salary: "$36,000 - $80,000 + Bonus & Override",
        summary: "The National Recruiter will be responsible for working with the Head of National Retail Lending to strategically manage corporate growth by adding Loan Officers and Branches Nationally. Work with the Head of Training and corporate management team to maximize workflow efficiencies.",
        description: "Solicit and interview retail branches who meet Direct Mortgage standards for hire with minimum annualized branch production $36M or 160 units. Solicit and interview individual loan officer candidates who meet Direct Mortgage standards for hire with minimum annualized loan officer production $8M or 36 units. Recruiting expectations are $200M in annualized production total. Adhere to documented Direct Mortgage policies and procedures including hiring and transition process, budgeting and forecasting abilities.",
        requirements: "• At least 5 years mortgage banking experience with a built book of business/candidates\n• Effective communication skills for expressing ideas to individuals and groups\n• Must be proficient in Word, Excel, and Outlook applications\n• Must have a positive attitude and be dependable, self-motivated\n• Working knowledge of industry related trade associations (Realtor, Homebuilder, Mortgage Banking groups)\n• Successful background in business planning, budgeting and industry specific software\n• Well groomed and business professional at all times\n• Willing to travel as needed",
        niceToHave: "• Experience with loan officer recruitment and retention\n• Knowledge of mortgage production metrics and standards\n• Background in corporate growth strategy\n• Experience with branch management relationships",
        postedDate: "3 days ago"
      },
      {
        title: "Regional Sales Manager",
        department: "sales",
        location: "san-francisco",
        type: "full-time",
        salary: "$65,000 - $85,000 + Commission",
        summary: "We are seeking an experienced, licensed Sales Manager to lead and support the sales efforts of our high-performing mortgage branch. This individual will play a dual role as both a producing loan officer and a team leader.",
        description: "Lead all sales training efforts within the branch, including onboarding, ongoing education, and performance coaching. Serve as a daily resource of knowledge, encouragement, and accountability for all licensed sales staff. Ensure all incoming leads are promptly assigned to a qualified team member and followed up with in a timely manner. Maintain active mortgage licensing and originate residential mortgage loans under your own name, contributing directly to branch production.",
        requirements: "• Active NMLS license with the ability to originate loans\n• Proven experience in mortgage sales, including client-facing origination\n• Strong understanding of residential mortgage products and regulations\n• Exceptional communication, coaching, and interpersonal skills\n• Highly organized with strong time management abilities and attention to detail\n• Passionate about delivering a high-touch, high-value client experience",
        niceToHave: "• Prior leadership or training experience\n• Experience with lead management systems\n• Knowledge of current market conditions and lending guidelines\n• Background in team development and mentoring",
        postedDate: "4 days ago"
      },
      {
        title: "Licensed Loan Partner (Qualification Specialist)",
        department: "operations",
        location: "remote",
        type: "full-time",
        salary: "$55,000 - $75,000",
        summary: "The Loan Partner II (LP2) plays a critical role in the mortgage loan process, ensuring a smooth and timely experience from initial application through funding. This position is responsible for accurately prequalifying borrowers, managing pre-approval processes, and overseeing the progress of all loans within the committed pipeline.",
        description: "Contact all new borrower applicants within 24 hours of assignment and review complete 1003 applications. Accurately issue pre-approvals and pre-approval addenda while handling loan scenario inquiries. Expedite onboarding of new contracts with timely Rate Lock Consultations and lead Tuesday update calls with borrowers. Perform daily pipeline reviews to identify and resolve choke points, coordinate communications around key deadlines, and ensure 95%+ of loans close on or before contract date.",
        requirements: "• Active and current NMLS license required\n• Minimum 5 years of mortgage experience (processing, underwriting, or origination)\n• Proficient with DU/DO, LP, and major investor guidelines\n• Experience with loan origination systems (e.g., Encompass, Calyx Point)\n• Skilled in Microsoft Office Suite (Word, Excel, PowerPoint, Outlook, OneNote)\n• Strong written and verbal communication skills\n• Exceptional time management, organizational skills, and attention to detail\n• Ability to perform under pressure and meet deadlines",
        niceToHave: "• Experience with real estate agent relationships\n• Knowledge of investor guidelines and program updates\n• Background in client relationship management\n• Experience with pipeline management systems",
        postedDate: "6 days ago"
      },
      {
        title: "Director of Employee Experience",
        department: "management",
        location: "dallas",
        type: "full-time",
        salary: "$95,000 - $125,000",
        summary: "As the Director of Employee Experience, you will play a foundational role in shaping our company's long-term success. This position is critical for building and refining the company's onboarding, brand identity, employee retention, and culture strategy.",
        description: "Build and execute a high-level onboarding and transition workflow for new employees. Establish the company's branding and social media strategy, hiring the right team to scale and execute. Implement and oversee employee retention initiatives, tracking engagement and gathering feedback. Lead and oversee Onboarding, Marketing, Retention, and Branding departments. Create an internal feedback loop to continually optimize the employee experience and engagement. Collaborate with leadership on benefits, events, and company-wide growth strategies.",
        requirements: "• Bachelor's degree in Human Resources, Business Administration, or related field\n• 7+ years of experience in employee experience, HR leadership, or organizational development\n• Proven track record in building and scaling onboarding programs\n• Experience with branding and marketing strategy development\n• Strong leadership and team management skills\n• Excellent communication and interpersonal abilities\n• Experience with employee retention and engagement initiatives",
        niceToHave: "• Experience in the mortgage or financial services industry\n• Background in startup or high-growth company environments\n• Knowledge of HR technology and employee engagement platforms\n• Experience with social media strategy and brand development",
        postedDate: "2 days ago"
      }
    ];

    for (const job of sampleJobs) {
      const { postedDate, ...jobData } = job;
      await this.createJob(jobData as InsertJob);
    }
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    for (const user of this.users.values()) {
      if (user.username === username) {
        return user;
      }
    }
    return undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id, isAdmin: "false" };
    this.users.set(id, user);
    return user;
  }

  async getAllJobs(): Promise<Job[]> {
    return Array.from(this.jobs.values()); // Return in order
  }

  async getJobById(id: number): Promise<Job | undefined> {
    return this.jobs.get(id);
  }

  async createJob(job: InsertJob): Promise<Job> {
    const id = this.currentJobId++;
    const newJob: Job = {
      id,
      ...job,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.jobs.set(id, newJob);
    return newJob;
  }

  async updateJob(id: number, jobUpdate: Partial<UpdateJob>): Promise<Job | undefined> {
    const existingJob = this.jobs.get(id);
    if (!existingJob) return undefined;

    const updatedJob: Job = {
      ...existingJob,
      ...jobUpdate,
      updatedAt: new Date(),
    };
    this.jobs.set(id, updatedJob);
    return updatedJob;
  }

  async deleteJob(id: number): Promise<boolean> {
    return this.jobs.delete(id);
  }

  async getJobsByFilter(filters: { department?: string; location?: string; type?: string }): Promise<Job[]> {
    const jobs = Array.from(this.jobs.values());
    return jobs.filter(job => {
      if (filters.department && job.department !== filters.department) return false;
      if (filters.location && job.location !== filters.location) return false;
      if (filters.type && job.type !== filters.type) return false;
      return true;
    }); // Return in order
  }
}

export const storage = new MemStorage();