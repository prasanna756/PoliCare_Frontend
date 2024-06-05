export interface Policy{
  policyId: number;
  policyName: string;
  policyDescription: string;
  company: string;
  policyType: string;
  initialDeposit: number;
  termPeriod: string; 
  termAmount: number;
  interest: number;
  eligibleUserTypes:string[];
}