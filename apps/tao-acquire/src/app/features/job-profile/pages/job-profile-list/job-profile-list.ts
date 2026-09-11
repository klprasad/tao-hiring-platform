import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

import { TaoSelectComponent } from '@tao/ui';
import { JobProfileEditComponent } from '../job-profile-edit/job-profile-edit';
import { JobProfileTableComponent } from '../../components/job-profile-table/job-profile-table';
import { JOB_PROFILE_STATUS_LABELS } from '../../models/job-profile.dto';
import { JobProfileVm } from '../../models/job-profile.vm';

@Component({
  selector: 'tao-job-profile-list',
  imports: [
    FormsModule,
    MatIconModule,
    TaoSelectComponent,
    JobProfileTableComponent,
    JobProfileEditComponent,
  ],
  templateUrl: './job-profile-list.html',
  styleUrl: './job-profile-list.scss',
})
export class JobProfileListComponent {
  private readonly router = inject(Router);

  readonly searchTerm = signal('');
  readonly selectedStatus = signal('all');
  readonly isLoading = signal(false);
  readonly errorMessage = signal('');

  /** Profile currently opened in the inline editor, if any. */
  readonly editingProfile = signal<JobProfileVm | undefined>(undefined);

  readonly statusOptions = ['all', 'Generated', 'Approved'];

  /**
   * Local cache of profiles generated through the campaign workflow.
   *
   * The campaign API does not expose a "list job profiles" endpoint, so this
   * screen is backed by locally cached data instead of an HTTP request.
   */
  readonly profiles = signal<JobProfileVm[]>([
    {
      id: '01A05E1B-5D37-7287-BDFD-46CB05B25C81',
      campaignId: '01A05E11-5971-755E-A5E9-DFC4BF6DBE46',
      originalJobDescription:
        '{"jobTitle":"Junior .NET Developer - Fresher","experienceLevel":"Fresher / Entry Level","jobProfile":"We are looking for a motivated Junior .NET Developer / Software Engineer - Fresher to join our development team. The candidate should have a basic understanding of C# and .NET and be willing to learn enterprise application development.","responsibilities":["Develop and maintain applications using C# and .NET / ASP.NET Core.","Build and consume basic REST APIs.","Write simple and maintainable code following OOP principles.","Work with SQL Server and write basic SQL queries.","Use Entity Framework Core for basic database operations.","Fix bugs and troubleshoot application issues with guidance from senior developers.","Write basic unit tests and participate in code reviews.","Use Git for source control.","Collaborate with developers, testers, and business teams to understand requirements.","Follow established coding standards and development practices."],"requiredSkills":["Basic knowledge of C#.","Understanding of OOP concepts such as classes, interfaces, inheritance, polymorphism, and encapsulation.","Basic understanding of .NET / ASP.NET Core.","Familiarity with REST APIs and HTTP methods.","Basic knowledge of SQL and SQL Server.","Understanding of collections, exception handling, and asynchronous programming using async/await.","Basic knowledge of Git.","Good problem-solving and communication skills.","Willingness to learn new technologies and development practices."],"goodToHave":["Basic knowledge of Entity Framework Core.","Understanding of Dependency Injection.","Basic knowledge of LINQ.","Familiarity with xUnit or NUnit and mocking.","Basic understanding of HTML, CSS, JavaScript, or Angular.","Exposure to Azure or any cloud platform through academic projects."],"education":["Bachelor\'s degree in Computer Science, Information Technology, Engineering, or a related field.","Fresh graduates and candidates with 0-1 year of experience can apply."],"experience":"Professional experience in .NET is not required. Candidates with academic projects, internships, or personal projects using C#/.NET are encouraged to apply.","candidateProfile":"We are primarily looking for someone with strong fundamentals, good logical thinking, willingness to learn, and the ability to write clean and understandable code. The candidate does not need to know every .NET technology from day one; they should be comfortable learning and growing with the team."}',
      generatedContent:
        "# Job Title\nJunior .NET Developer - Fresher\n\n## Role Summary\nA Junior .NET Developer / Software Engineer - Fresher is sought to join the development team and contribute to enterprise application development. The role is suited for candidates with basic C# and .NET knowledge, strong fundamentals, and a willingness to learn and grow with the team.\n\n## Key Responsibilities\n- Develop and maintain applications using C# and .NET / ASP.NET Core.\n- Build and consume basic REST APIs.\n- Write simple and maintainable code following OOP principles.\n- Work with SQL Server and write basic SQL queries.\n- Use Entity Framework Core for basic database operations.\n- Fix bugs and troubleshoot application issues with guidance from senior developers.\n- Write basic unit tests and participate in code reviews.\n- Use Git for source control.\n- Collaborate with developers, testers, and business teams to understand requirements.\n- Follow established coding standards and development practices.\n\n## Required Skills\n- Basic knowledge of C#.\n- Understanding of OOP concepts such as classes, interfaces, inheritance, polymorphism, and encapsulation.\n- Basic understanding of .NET / ASP.NET Core.\n- Familiarity with REST APIs and HTTP methods.\n- Basic knowledge of SQL and SQL Server.\n- Understanding of collections, exception handling, and asynchronous programming using async/await.\n- Basic knowledge of Git.\n- Good problem-solving and communication skills.\n- Willingness to learn new technologies and development practices.\n\n## Preferred Skills\n- Basic knowledge of Entity Framework Core.\n- Understanding of Dependency Injection.\n- Basic knowledge of LINQ.\n- Familiarity with xUnit or NUnit and mocking.\n- Basic understanding of HTML, CSS, JavaScript, or Angular.\n- Exposure to Azure or any cloud platform through academic projects.\n\n## Technologies\n- C#\n- .NET\n- ASP.NET Core\n- REST APIs\n- HTTP methods\n- SQL Server\n- Entity Framework Core\n- Git\n- async/await\n- Dependency Injection\n- LINQ\n- xUnit\n- NUnit\n- HTML\n- CSS\n- JavaScript\n- Angular\n- Azure\n\n## Minimum Experience\nFresh graduates and candidates with 0-1 year of experience can apply.\n\n## Education\n- Bachelor's degree in Computer Science, Information Technology, Engineering, or a related field.\n- Fresh graduates and candidates with 0-1 year of experience can apply.",
      structuredProfile:
        '{"roleTitle":"Junior .NET Developer - Fresher","roleSummary":"A Junior .NET Developer / Software Engineer - Fresher is sought to join the development team and contribute to enterprise application development. The role is suited for candidates with basic C# and .NET knowledge, strong fundamentals, and a willingness to learn and grow with the team.","responsibilities":["Develop and maintain applications using C# and .NET / ASP.NET Core.","Build and consume basic REST APIs.","Write simple and maintainable code following OOP principles.","Work with SQL Server and write basic SQL queries.","Use Entity Framework Core for basic database operations.","Fix bugs and troubleshoot application issues with guidance from senior developers.","Write basic unit tests and participate in code reviews.","Use Git for source control.","Collaborate with developers, testers, and business teams to understand requirements.","Follow established coding standards and development practices."],"requiredSkills":["Basic knowledge of C#.","Understanding of OOP concepts such as classes, interfaces, inheritance, polymorphism, and encapsulation.","Basic understanding of .NET / ASP.NET Core.","Familiarity with REST APIs and HTTP methods.","Basic knowledge of SQL and SQL Server.","Understanding of collections, exception handling, and asynchronous programming using async/await.","Basic knowledge of Git.","Good problem-solving and communication skills.","Willingness to learn new technologies and development practices."],"preferredSkills":["Basic knowledge of Entity Framework Core.","Understanding of Dependency Injection.","Basic knowledge of LINQ.","Familiarity with xUnit or NUnit and mocking.","Basic understanding of HTML, CSS, JavaScript, or Angular.","Exposure to Azure or any cloud platform through academic projects."],"technologies":["C#",".NET","ASP.NET Core","REST APIs","HTTP methods","SQL Server","Entity Framework Core","Git","async/await","Dependency Injection","LINQ","xUnit","NUnit","HTML","CSS","JavaScript","Angular","Azure"],"minimumExperienceYears":0,"education":["Bachelor\'s degree in Computer Science, Information Technology, Engineering, or a related field.","Fresh graduates and candidates with 0-1 year of experience can apply."]}',
      status: 2,
      generatedOn: '2026-09-01T17:54:06.7766121',
    },

    {
      id: '019FA995-A84E-781F-97A8-E4BD136C4FFE',
      campaignId: '019FA8F7-E8FA-76C1-9E2E-0EFCFFD29F8C',
      originalJobDescription:
        'Senior .NET Developer  About the Role\n\nWe are looking for a Senior .NET Developer to join our engineering team and build scalable, high-performance enterprise applications. You will work closely with architects, product managers, QA engineers, and frontend developers to deliver cloud-ready solutions using modern Microsoft technologies.\n\nThe ideal candidate is passionate about software engineering, enjoys solving complex technical problems, and has experience designing and building distributed enterprise applications.\n\nKey Responsibilities\nDesign, develop and maintain enterprise web applications using ASP.NET Core and C#. Develop RESTful APIs and integrate with internal and external services. Build responsive user interfaces using Angular. Design and optimize SQL Server databases. Participate in application architecture and technical design discussions. Write clean, maintainable and testable code following SOLID principles. Perform code reviews and mentor junior developers. Troubleshoot production issues and improve application performance. Collaborate with DevOps teams to support CI/CD pipelines and cloud deployments. Work in Agile Scrum teams and actively participate in sprint planning, estimation and retrospectives.\n\nRequired Skills\nC#\n.NET\nASP.NET Core\nAngular\nSQL Server\nREST API Development\nEntity Framework Core\nGit\nObject-Oriented Programming\nSOLID Principles\n\nPreferred Skills\nMicrosoft Azure\nDocker\nKubernetes\nAzure DevOps\nRedis\nMicroservices Architecture\nMessaging systems (Azure Service Bus or RabbitMQ)\nUnit Testing using xUnit or NUnit\n\nQualifications\nBachelor degree in Computer Science, Information Technology or related field.\nStrong understanding of software design principles and design patterns.\nExcellent analytical and problem-solving skills.\nStrong communication and collaboration skills.\n\nExperience\n5+ years of professional software development experience.\nAt least 3 years of experience developing enterprise applications using ASP.NET Core.\nExperience building production-grade REST APIs.\nExperience working with Angular in enterprise applications.\nExperience working in Agile development teams.\n\nNice to Have\nExperience working in SaaS products.\nExperience building cloud-native applications.\nExperience with monitoring and observability tools.\nExperience with performance tuning and scalability.\nExperience mentoring junior engineers.\n\nEmployment Type\nFull Time\n\nLocation\nHyderabad, India (Hybrid)',
      generatedContent:
        '# Job Title\n## Role Summary\nAs a Senior .NET Developer, you will be responsible for designing, developing, and maintaining enterprise web applications using ASP.NET Core and C#.\n## Key Responsibilities\n* Design, develop, and maintain enterprise web applications using ASP.NET Core and C#\n* Develop RESTful APIs and integrate with internal and external services\n* Build responsive user interfaces using Angular\n* Design and optimize SQL Server databases\n* Participate in application architecture and technical design discussions\n* Write clean, maintainable, and testable code following SOLID principles\n* Perform code reviews and mentor junior developers\n* Troubleshoot production issues and improve application performance\n* Collaborate with DevOps teams to support CI/CD pipelines and cloud deployments\n## Required Skills\n* C#\n* .NET\n* ASP.NET Core\n* Angular\n* SQL Server\n* REST API Development\n* Entity Framework Core\n* Git\n* Object-Oriented Programming\n* SOLID Principles\n## Preferred Skills\n* Microsoft Azure\n* Docker\n* Kubernetes\n* Azure DevOps\n* Redis\n* Microservices Architecture\n* Messaging systems (Azure Service Bus or RabbitMQ)\n* Unit Testing using xUnit or NUnit\n## Education\nNot specified.\n## Minimum Experience Years\n5+\n',
      structuredProfile:
        '{"roleTitle":"","roleSummary":"As a Senior .NET Developer, you will be responsible for designing, developing, and maintaining enterprise web applications using ASP.NET Core and C#.","responsibilities":["Design, develop, and maintain enterprise web applications using ASP.NET Core and C#","Develop RESTful APIs and integrate with internal and external services","Build responsive user interfaces using Angular","Design and optimize SQL Server databases","Participate in application architecture and technical design discussions","Write clean, maintainable, and testable code following SOLID principles","Perform code reviews and mentor junior developers","Troubleshoot production issues and improve application performance","Collaborate with DevOps teams to support CI/CD pipelines and cloud deployments"],"requiredSkills":["C#",".NET","ASP.NET Core","Angular","SQL Server","REST API Development","Entity Framework Core","Git","Object-Oriented Programming","SOLID Principles"],"preferredSkills":["Microsoft Azure","Docker","Kubernetes","Azure DevOps","Redis","Microservices Architecture","Messaging systems (Azure Service Bus or RabbitMQ)","Unit Testing using xUnit or NUnit"],"technologies":[],"minimumExperienceYears":5,"education":[]}',
      status: 2,
      generatedOn: '2026-07-28T16:36:25.2947212',
    },
  ]);

  readonly filteredProfiles = computed(() => {
    const search = this.searchTerm().trim().toLowerCase();
    const status = this.selectedStatus();

    return this.profiles().filter((profile) => {
      const matchesSearch =
        !search ||
        profile.campaignId.toLowerCase().includes(search) ||
        profile.originalJobDescription.toLowerCase().includes(search);
      const matchesStatus =
        status === 'all' || JOB_PROFILE_STATUS_LABELS[profile.status] === status;

      return matchesSearch && matchesStatus;
    });
  });

  onSearchInput(event: Event): void {
    this.searchTerm.set((event.target as HTMLInputElement).value);
  }

  /**
   * Opens the job profile editor inline instead of navigating away, so the
   * reviewer keeps the list context.
   */
  editProfile(profile: JobProfileVm): void {
    this.editingProfile.set(profile);
  }

  /** Returns to the list from the inline editor. */
  closeEditor(): void {
    this.editingProfile.set(undefined);
  }

  /** Keeps the list in sync when a profile is approved from the inline editor. */
  onProfileApproved(profile: JobProfileVm): void {
    this.profiles.update((profiles) =>
      profiles.map((current) => (current.id === profile.id ? profile : current)),
    );
    this.editingProfile.set(profile);
  }
}
