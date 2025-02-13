
export class DepositDashboardModel  {
  
  
    public static assign(obj) {
      if (!obj) return undefined
  
      const newObj = Object.assign(new DepositDashboardModel(), obj)
      newObj.UserIncharge = obj.UserIncharge ?JSON.parse(
        obj.UserIncharge
      ) : undefined
     
      return newObj
    }
  
    public static assigns<T>(objs) {
      const results: any[] = []
      objs.forEach((item) => results.push(this.assign(item)))
      return results
    }
  }