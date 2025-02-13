import http from "@services/httpService"

class DashboardService {
  public async getDashboard(params): Promise<any> {
    const res = await http.get(
      "api/services/app/StatisticAppServices/GetDashboard",
      {
        params: { ...params, timeZone: 7 },
      }
    )
    return res.data.result
  }

  public async getDashboardRevenueStaff(params): Promise<any> {
    const res = await http.get(
      "api/services/app/StatisticAppServices/GetReportRevenueStaff",
      {
        params: { ...params, timeZone: 7 },
      }
    )
    return res.data.result
  }
  public async getDashboardDealerComm(params): Promise<any> {
    const res = await http.get(
      "api/services/app/LeaseAgreementCommission/GetListDealerCommission",
      {
        params: { ...params },
      }
    )
    return res.data.result
  }
  public async getDashboardOverview(params): Promise<any> {
    const res = await http.get(
      "api/services/app/StatisticAppServices/GetDashboardV1",
      {
        params: { ...params },
      }
    )
    return res.data.result
  }
  public async getDashboardUnitOcc(params): Promise<any> {
    const res = await http.get(
      "api/services/app/StatisticAppServices/GetDashboardUnitOcc",
      {
        params: { ...params },
      }
    )
    return res.data.result
  }

  public async getDashboardUnitOccDetails(params): Promise<any> {
    const res = await http.get(
      "/api/services/app/StatisticAppServices/GetDashboardUnitOccDetails",
      {
        params: { ...params, timeZone: 7 },
      }
    )
    return res.data.result
  }

  public async getDashboardBudget(params): Promise<any> {
    const res = await http.get(
      "api/services/app/StatisticAppServices/GetReportBudget",
      {
        params: { ...params },
      }
    )
    return res.data.result
  }

  public async getDashboardFilterProject(params): Promise<any> {
    const res = await http.get(
      "api/services/app/StatisticAppServices/GetDashboardFilterProject",
      {
        params: { ...params, timeZone: 7 },
      }
    )
    return res.data.result
  }
}

export default new DashboardService()
