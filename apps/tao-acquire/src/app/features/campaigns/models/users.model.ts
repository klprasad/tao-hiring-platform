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
  Administrator = 1,
  Recruiter = 2,
  HiringManager = 3,
}

export enum UserStatus {
  Active = 1,
  Inactive = 2,
}
