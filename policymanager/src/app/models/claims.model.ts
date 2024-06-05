import { UserPolicies } from "./userpolicies.model";
import { Users } from "./users.model";


export interface Claims {
    claimId: number;
    claimDate: Date;
    claimAmount: number;
    claimStatus: string;
    userPolicy?: UserPolicies;
    userPolicyId?:number;
    users?:Users;
    userId?:any;

}