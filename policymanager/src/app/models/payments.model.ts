import { UserPolicies } from "./userpolicies.model";
import { Users } from "./users.model";


export interface Payments {
    paymentId: number;
    paymentDate: Date;
    paymentStatus: 'Completed';
    totalAmount: number;
    fine: number;
    paymentMethod: string;
    cardNumber: string;
    expiryDate:Date;
    cvv:string;
    cardHolder:string;
    bankName:string;
    accountNumber:string;
    userPolicies?: UserPolicies;
    userPolicyId?:number;
    users?:Users;
    userId?:any;
}