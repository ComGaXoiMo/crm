/* Emails Input */
export interface IOccupierModel {
    id?: number;
    userTenant?:any
    userTenantId?:number;
  name?:any;
    isPrimary?: boolean;
    
  }
  
  export class OccupierModel implements IOccupierModel {
    id?: number;
    userTenantId?:number;
    userTenant?:any
    name?:any;
    isPrimary?: boolean;
  
    constructor(userTenantId?, isPrimary?) {
      this.userTenantId = userTenantId
      this.isPrimary = isPrimary
    }
  }
  