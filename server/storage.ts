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
        title: "UX/UI Designer",
        department: "design",
        location: "remote",
        type: "full-time",
        salary: "$90,000 - $120,000",
        summary: "Create intuitive and beautiful user experiences for our web and mobile applications. Collaborate with product and engineering teams to deliver exceptional designs.",
        description: "We're seeking a talented UX/UI Designer to join our design team and help create exceptional user experiences across our product suite.",
        requirements: "• 3+ years of UX/UI design experience\n• Proficiency in Figma, Sketch, or similar design tools\n• Strong portfolio demonstrating user-centered design\n• Experience with design systems and component libraries\n• Understanding of web and mobile design principles",
        niceToHave: "• Experience with prototyping tools\n• Knowledge of HTML/CSS\n• Background in user research\n• Animation and micro-interaction experience",
        postedDate: "1 week ago"
      },
      {
        title: "Product Manager",
        department: "product",
        location: "new-york",
        type: "full-time",
        salary: "$130,000 - $170,000",
        summary: "Lead product strategy and execution for our core platform. Work cross-functionally to define roadmaps and deliver features that delight customers.",
        description: "We're looking for an experienced Product Manager to drive the vision and execution of our core product offerings.",
        requirements: "• 4+ years of product management experience\n• Experience with agile development methodologies\n• Strong analytical and problem-solving skills\n• Excellent communication and leadership abilities\n• Experience working with engineering and design teams",
        niceToHave: "• Technical background or CS degree\n• Experience with B2B SaaS products\n• Data analysis and SQL skills\n• Previous startup experience",
        postedDate: "3 days ago"
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
