import { Users } from "./users.model";
import { Policy } from "./policy.model";
import { Payments} from "./payments.model";
import { Claims } from "./claims.model";

export interface UserPolicies {
    userPolicyId: number;
    user?: Users;
    policy?: Policy;
    userId:number;
    policyId:number;
    policyPayments?: Payments[];
    claims?: Claims[];
    startDate: Date;
    maturityAmount?: number;
    durationInYears: number;
    endDate?: Date;
  }