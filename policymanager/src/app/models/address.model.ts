import { Users } from "./users.model";


export interface Address {
    addressId: number;
    addressLine: string;
    city: string;
    cityPincode: number;
    state: string;
  }