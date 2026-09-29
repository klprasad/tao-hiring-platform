export interface Users {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdOn: string;
}

export enum UserRole {
  Administrator = 'Administrator',
  Recruiter = 'Recruiter',
  HiringManager = 'HiringManager',
}

export enum UserStatus {
  Active = 'Active',
  Inactive = 'InActive',
}
