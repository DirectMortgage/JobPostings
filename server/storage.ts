import { users, jobs, type User, type InsertUser, type Job, type InsertJob, type UpdateJob } from "@shared/schema";

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
    this.createUser({
      username: "admin",
      password: "admin123"
    }).then(user => {
      this.users.set(user.id, { ...user, isAdmin: "true" });
    });

    // Create some initial job postings
    this.seedJobs();
  }

  private async seedJobs() {
    const sampleJobs = [
      {
        title: "Senior Software Engineer",
        department: "engineering",
        location: "san-francisco",
        type: "full-time",
        salary: "$120,000 - $160,000",
        summary: "Join our engineering team to build scalable web applications using React, Node.js, and cloud technologies. You'll work on cutting-edge projects that impact millions of users.",
        description: "We're looking for a Senior Software Engineer to join our growing engineering team. You'll be responsible for designing and implementing scalable web applications that serve millions of users worldwide.",
        requirements: "• 5+ years of experience in software development\n• Strong proficiency in React, Node.js, and modern JavaScript\n• Experience with cloud platforms (AWS, Azure, or GCP)\n• Understanding of database design and optimization\n• Bachelor's degree in Computer Science or related field",
        niceToHave: "• Experience with TypeScript and GraphQL\n• Knowledge of containerization (Docker, Kubernetes)\n• Previous experience in a startup environment\n• Contributions to open-source projects",
        postedDate: "2 days ago"
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
        title: "Branch Operations Manager",
        department: "operations",
        location: "remote",
        type: "full-time",
        salary: "$75,000 - $95,000",
        summary: "We are seeking a dynamic and detail-oriented Branch Operations Manager to oversee and streamline mortgage operations within a designated region. This role is pivotal in ensuring a seamless loan process from setup through closing.",
        description: "Lead and manage all operational aspects of mortgage loan processing, including loan setup, processing, underwriting support, closing, and funding, across the assigned region. Provide day-to-day guidance, mentorship, and performance management to regional operations staff including processors, closers, and support roles. Champion a borrower-first mindset by removing bottlenecks, solving operational issues quickly, and driving efficiency to support a smooth and professional client journey.",
        requirements: "• 5+ years of mortgage operations experience with a strong understanding of the full loan lifecycle\n• 2+ years in a leadership or management role within mortgage operations\n• Proven ability to lead and develop teams in a fast-paced, deadline-driven environment\n• Excellent organizational and problem-solving skills\n• Strong interpersonal and communication skills (written and verbal)\n• Tech-savvy with familiarity in LOS platforms (e.g., Encompass) and other mortgage software\n• High attention to detail and commitment to delivering exceptional service",
        niceToHave: "• Experience with appraisal coordination and escalations\n• Knowledge of compliance standards and regulatory requirements\n• Previous experience in training and development\n• Background in workflow management and process optimization",
        postedDate: "2 days ago"
      },
      {
        title: "Branch Manager",
        department: "management",
        location: "san-francisco",
        type: "full-time",
        salary: "$80,000 - $120,000",
        summary: "Under the direction of Senior Management, the Branch Manager is responsible for planning, directing and controlling the operation of the loan production and working in conjunction with the Director of Marketing to establish marketing functions of the branch.",
        description: "The Branch Manager is responsible for planning, directing and controlling the operation of the loan production and working in conjunction with the Director of Marketing to establish marketing functions of the branch. Develop and implement strategies to generate loans from Real Estate Companies, Builders, Relocation Companies and the Public. Recruit, hire & train and supervise Loan Officers and individuals involved in the loan production functions.",
        requirements: "• Minimum of 4 years College\n• At least 10 years of experience in Sales or Sales Management\n• Strong written and verbal skills required\n• Licensed to originate loans\n• Must be able to work in a normal office environment\n• Ability to lift up to 20 pounds occasionally",
        niceToHave: "• Previous mortgage industry management experience\n• Experience with loan officer training and development\n• Knowledge of mortgage finance products\n• Experience with marketing material development",
        postedDate: "3 days ago"
      },
      {
        title: "Sales Representative",
        department: "sales",
        location: "remote",
        type: "full-time",
        salary: "$60,000 + Commission",
        summary: "Build relationships with prospective customers and drive revenue growth. Strong communication skills and sales experience preferred.",
        description: "We're seeking a motivated Sales Representative to join our growing sales team and help drive revenue growth.",
        requirements: "• 2+ years of B2B sales experience\n• Excellent communication and interpersonal skills\n• CRM experience (Salesforce, HubSpot, etc.)\n• Goal-oriented with a track record of meeting targets\n• Bachelor's degree preferred",
        niceToHave: "• SaaS or technology sales experience\n• Previous experience in a startup environment\n• Knowledge of consultative selling techniques\n• Multilingual capabilities",
        postedDate: "1 week ago"
      },
      {
        title: "Processor",
        department: "operations",
        location: "san-francisco",
        type: "full-time",
        salary: "$45,000 - $55,000",
        summary: "The Loan Processor is responsible for processing loan applications in compliance with mortgage lending and applicable investor guidelines. Manage pipeline, submit files to underwriting, and support loan officer teams.",
        description: "The Loan Processor is responsible for processing loan applications in compliance with mortgage lending and applicable investor guidelines. Performs duties such as analyzing the loan application, assessing creditworthiness and the likelihood that a loan applicant will be able to repay the debt, analyzing the AUS/Guidelines as they pertain to the loan product and sales structure, reviewing title commitments and fees, ordering subordinations and allocating fees properly in the system. Responsible for monitoring the loan process and managing the proper expectations with the client and the sales staff through closing.",
        requirements: "• High school diploma or equivalent\n• Must be able to work 40 hours per week and overtime as required\n• Must be proficient in Word, Excel and Outlook applications\n• Proficient in DU/DO, LP, & major Origination systems\n• Must have excellent verbal and written communication skills\n• Must have a positive attitude\n• Must be dependable, self-motivated and require minimal supervision\n• Proficient with major correspondent and wholesale channels and their guidelines",
        niceToHave: "• Previous mortgage industry experience\n• Knowledge of underwriting standards\n• Experience with loan processing software\n• Familiarity with compliance requirements",
        postedDate: "1 day ago"
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
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id, isAdmin: "false" };
    this.users.set(id, user);
    return user;
  }

  async getAllJobs(): Promise<Job[]> {
    return Array.from(this.jobs.values()).sort((a, b) => b.id - a.id);
  }

  async getJobById(id: number): Promise<Job | undefined> {
    return this.jobs.get(id);
  }

  async createJob(job: InsertJob): Promise<Job> {
    const id = this.currentJobId++;
    const newJob: Job = {
      ...job,
      id,
      niceToHave: job.niceToHave || null,
      postedDate: new Date().toLocaleDateString()
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
      id
    };
    this.jobs.set(id, updatedJob);
    return updatedJob;
  }

  async deleteJob(id: number): Promise<boolean> {
    return this.jobs.delete(id);
  }

  async getJobsByFilter(filters: { department?: string; location?: string; type?: string }): Promise<Job[]> {
    let jobs = Array.from(this.jobs.values());

    if (filters.department && filters.department !== 'all') {
      jobs = jobs.filter(job => job.department === filters.department);
    }

    if (filters.location && filters.location !== 'all') {
      jobs = jobs.filter(job => job.location === filters.location);
    }

    if (filters.type && filters.type !== 'all') {
      jobs = jobs.filter(job => job.type === filters.type);
    }

    return jobs.sort((a, b) => b.id - a.id);
  }
}

export const storage = new MemStorage();
