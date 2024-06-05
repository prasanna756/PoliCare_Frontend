import { Address } from "./address.model";
import { UserPolicies } from "./userpolicies.model";


export interface Users {
    userId: number;
    emailAddress: string;
    contactNumber: string;
    password: string;
    firstName: string;
    lastName: string;
    dateOfBirth: Date;
    panNumber: string;
    employerType: string;
    employerName: string;
    salary: number;
    userType: string;
    address: Address;
    // userPolicies: UserPolicies[];
  }


