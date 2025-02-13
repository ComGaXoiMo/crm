import AppConsts from "@lib/appconst"
import { DepositDashboardModel } from "@models/dashboard/depositModal"
import {
  LARevenueLastYearModel,
  LARevenueModel,
} from "@models/dashboard/overview"
import dashboardService from "@services/dashboardService"
import { action, observable } from "mobx"
import dayjs from "dayjs"
const { leaseStage, dashboardOccType } = AppConsts
class DashboardStore {
  @observable isLoading!: boolean
  @observable dashboardClientData: any[] = []
  @observable dashboardInquiryData: any[] = []
  @observable dashboardTaskData: any[] = []
  @observable dashboardCommissionByProjectData: any[] = []
  @observable dashboardCommissionByPhase: any[] = []
  @observable dashboardCommissionDetails: any[] = []
  @observable dashboardCommissionForDealer: any[] = []
  @observable listDealerComm: any[] = []
  @observable dashboardActivityData: any[] = []
  @observable dashboardReportRevenueStaff: any[] = []
  @observable dashboardReportRevenueStaffMoveIn: any[] = []
  @observable dashboardReportRevenueStaffMoveOut: any[] = []
  @observable dashboardReportIntensiveStaff: any[] = []
  @observable dashboardReportLAExpired: any[] = []
  @observable dashboardReportLAStatus: any[] = []
  @observable dasboardReportRevenueProject: any[] = []
  @observable dashobardReportProjectLastage: any[] = []
  @observable dashboardUnitSQMOccData: any[] = []
  @observable dashboardUnitCountOccData: any[] = []
  @observable dashboardUnitTypeCountOccData: any[] = []
  @observable avgByProjectData: any[] = []
  @observable avgByTypeData: any[] = []
  @observable dataChartUnitCountOccData: any[] = []
  @observable dataChartUnitTypeCountOccData: any[] = []
  @observable dashboardOveriewOfLa: any[] = []
  @observable dashboardOveriewTotalOfLa: any[] = []
  @observable dashboardOveriewOfLaRequest: any[] = []
  @observable dashboardPopularLeaseUnit: any[] = []
  @observable dashboardLeaseUnitStatus: any[] = []
  @observable dashboardLAdropStage: any[] = []
  @observable dashboardDepositData: any[] = []

  @observable dashboardOverviewLAModule: any[] = []

  @observable dashboardOccUnitCountLast: any[] = []
  @observable dashboardOccUnitCountThis: any[] = []
  @observable dashboardSqmOccUnitLast: any[] = []
  @observable dashboardSqmOccUnitThis: any[] = []
  @observable dashboardUnitTypeOccLast: any[] = []
  @observable dashboardUnitTypeOccThis: any[] = []
  @observable dashboardUnitTypeOccByMonth: any[] = []
  @observable dataLARevenueDetailsChart: any[] = []
  @observable dataLARevenueDetailsChartLastYear: any[] = []
  @observable dashboardUnitOccDetailsDateData: any[] = []
  @observable dashboardUnitOccDetailsWeekData: any[] = []
  @observable dashboardUnitOccDetailsMonthData: any[] = []

  @observable dashboardUnitOccSQMDetailsDateData: any[] = []
  @observable dashboardUnitOccSQMDetailsWeekData: any[] = []
  @observable dashboardUnitOccSQMDetailsMonthData: any[] = []

  @observable dashboardUnitTypeOccDetailsDateData: any[] = []
  @observable dashboardUnitTypeOccDetailsWeekData: any[] = []
  @observable dashboardUnitTypeOccDetailsMonthData: any[] = []

  @observable dashboardOccSummaryUnitTypeData: any[] = []
  @observable dashboardOccSummarySqmData: any[] = []
  @observable dashboardConsolidateOccUnitData: any[] = []
  @observable dashboardConsolidateOccsSQMData: any[] = []

  @observable dashboardAppUsageActivity: any[] = []
  @observable dashboardActivityByWeek: any[] = []

  @observable dashboardBudgetUnitData: any[] = []
  @observable dashboardBudgetRevenueData: any[] = []

  @action public async getDashboardClient(params) {
    this.isLoading = true
    const res = await dashboardService
      .getDashboard({ ...params, nameStore: "SpReportClient" })
      .finally(() => (this.isLoading = false))
    this.dashboardClientData = res
    return res
  }
  @action public async getDashboardInquiry(params) {
    this.isLoading = true
    const res = await dashboardService
      .getDashboard({ ...params, nameStore: "SpReportInquiry" })
      .finally(() => (this.isLoading = false))
    this.dashboardInquiryData = res
    return res
  }

  @action public async getDashboardUnitSQMOcc(params) {
    this.isLoading = true
    const res = await dashboardService
      .getDashboardUnitOccDetails({
        ...params,
        type: dashboardOccType.month,
        nameStore: "V1SpReportCountOccSQMByDateType",
      })
      .finally(() => (this.isLoading = false))
    this.dashboardUnitSQMOccData = res
    return res
  }
  @action public async getDashboardUnitCountOcc(params) {
    this.isLoading = true
    const res = await dashboardService
      .getDashboardUnitOccDetails({
        ...params,
        type: dashboardOccType.month,
        nameStore: "V1SpReportUnitCountOccByDateType",
      })
      .finally(() => (this.isLoading = false))
    this.dashboardUnitCountOccData = res
    return res
  }

  @action public async getDataChartUnitCountOcc(params) {
    this.isLoading = true
    const res = await dashboardService
      .getDashboard({
        ...params,
        nameStore: "ReportUnitCurrentStatus",
        // ReportUnitCurrentStatus
      })
      .finally(() => (this.isLoading = false))
    this.dataChartUnitCountOccData = res
    return res
  }

  @action public async getDashboardUnitTypeCountOcc(params) {
    this.isLoading = true
    const res = await dashboardService
      .getDashboardUnitOccDetails({
        ...params,
        type: dashboardOccType.month,
        nameStore: "V1SpReportUnitTypeCountOccByDateType",
      })
      .finally(() => (this.isLoading = false))
    this.dashboardUnitTypeCountOccData = res
    return res
  }

  @action public async getDataChartUnitTypeCountOcc() {
    this.isLoading = true
    const res = await dashboardService
      .getDashboard({
        fromDate: dayjs().startOf("month").endOf("day").toJSON(),
        toDate: dayjs().endOf("day").toJSON(),
        nameStore: "ReportUnitCurrentStatusByType",
        // ReportUnitCurrentStatusByType
      })
      .finally(() => (this.isLoading = false))
    this.dataChartUnitTypeCountOccData = res
    return res
  }
  @action public async getDataTableAvgByProject() {
    this.isLoading = true
    const res = await dashboardService
      .getDashboard({
        fromDate: dayjs().startOf("month").toJSON(),
        toDate: dayjs().toJSON(),
        nameStore: "SpReportAVGByProject",
      })
      .finally(() => (this.isLoading = false))
    this.avgByProjectData = res
    return res
  }

  @action public async getDataTableAvgByType(params) {
    this.isLoading = true
    const res = await dashboardService
      .getDashboardFilterProject({
        ...params,
        nameStore: "V1SpReportAVGByProject",
      })
      .finally(() => (this.isLoading = false))
    this.avgByTypeData = res
    return res
  }
  @action public async getDashboardTask(params) {
    this.isLoading = true
    const res = await dashboardService
      .getDashboard({ ...params, nameStore: "SpReportTask" })
      .finally(() => (this.isLoading = false))
    this.dashboardTaskData = res
    return res
  }
  @action public async getDashboardCommissionByProject(params) {
    this.isLoading = true
    const res = await dashboardService
      .getDashboard({ ...params, nameStore: "SPREPORTCOMMISSIONBYPROJECT" })
      .finally(() => (this.isLoading = false))
    this.dashboardCommissionByProjectData = res
    return res
  }
  @action public async getDashboardCommissionDealerDetail(params) {
    this.isLoading = true
    const res = await dashboardService
      .getDashboard({ ...params, nameStore: "SpReportCommissionDetails" })
      .finally(() => (this.isLoading = false))
    this.dashboardCommissionDetails = res
    return res
  }
  @action public async getDashboardCommissionPhase(params) {
    this.isLoading = true
    const res = await dashboardService
      .getDashboard({ ...params, nameStore: "SPREPORTCOMMISSIONPHASE" })
      .finally(() => (this.isLoading = false))
    this.dashboardCommissionByPhase = res
    return res
  }
  @action public async getDashboardCommissionForDealer(params) {
    this.isLoading = true
    const res = await dashboardService
      .getDashboard({ ...params, nameStore: "SpReportCommissionDetailByUser" })
      .finally(() => (this.isLoading = false))
    this.dashboardCommissionForDealer = res
    return res
  }

  @action public async getListDealerComm(params) {
    this.isLoading = true
    const res = await dashboardService
      .getDashboardDealerComm({ ...params })
      .finally(() => (this.isLoading = false))
    this.listDealerComm = res
    return res
  }

  @action public async getDashboardActivity(params) {
    this.isLoading = true
    const res = await dashboardService
      .getDashboard({ ...params, nameStore: "SpReportActivity" })
      .finally(() => (this.isLoading = false))
    this.dashboardActivityData = res
    return res
  }
  @action public async getDashboardRevenueStaffMoveIn(params) {
    this.isLoading = true
    const res = await dashboardService
      .getDashboardRevenueStaff({
        ...params,
        typeId: 1,
        nameStore: "SpReportRevenueStaff",
      })
      .finally(() => (this.isLoading = false))
    this.dashboardReportRevenueStaffMoveIn = res
    return res
  }
  @action public async getDashboardRevenueStaffMoveOut(params) {
    this.isLoading = true
    const res = await dashboardService
      .getDashboardRevenueStaff({
        ...params,
        typeId: 2,
        nameStore: "SpReportRevenueStaff",
      })
      .finally(() => (this.isLoading = false))
    this.dashboardReportRevenueStaffMoveOut = res
    return res
  }
  @action public async getDashboarRevenueStaff(params) {
    this.isLoading = true
    const res = await dashboardService
      .getDashboardRevenueStaff({
        ...params,
        nameStore: "SpReportRevenueStaff",
      })
      .finally(() => (this.isLoading = false))
    this.dashboardReportRevenueStaff = res
    return res
  }

  @action public async getDashboarReportIntensiveStaff(params) {
    this.isLoading = true
    const res = await dashboardService
      .getDashboard({ ...params, nameStore: "SpReportIntensiveStaff" })
      .finally(() => (this.isLoading = false))
    this.dashboardReportIntensiveStaff = res
    return res
  }

  @action public async getDashboarReportLAStatus(params) {
    this.isLoading = true
    const res = await dashboardService
      .getDashboard({ ...params, nameStore: "SpReportLAStatus" })
      .finally(() => (this.isLoading = false))
    this.dashboardReportLAStatus = res
    return res
  }
  @action public async getDashboarReportRevenueProject() {
    this.isLoading = true
    const res = await dashboardService
      .getDashboard({
        fromDate: dayjs().startOf("year").toJSON(),
        toDate: dayjs().endOf("year").toJSON(),
        nameStore: "SpReportRevenueProject",
      })
      .finally(() => (this.isLoading = false))
    this.dasboardReportRevenueProject = res
    return res
  }
  @action public async getDashboardDeposit(params) {
    this.isLoading = true
    const res = await dashboardService
      .getDashboard({ ...params, nameStore: "SpReportDeposit" })
      .finally(() => (this.isLoading = false))
    this.dashboardDepositData = DepositDashboardModel.assigns(res)
    return res
  }
  @action public async getDashboarReportProjectLastage(params) {
    this.isLoading = true
    const res = await dashboardService
      .getDashboard({ ...params, nameStore: "SPREPORTPROJECTLASTAGE" })
      .finally(() => (this.isLoading = false))
    this.dashobardReportProjectLastage = res
    return res
  }

  @action public async getOverviewOfLA(params) {
    const res = await dashboardService.getDashboardOverview({
      ...params,
      nameStore: "V1SpReportOverviewOfLA",
      statusIds: `${leaseStage.confirm},${leaseStage.terminate},${leaseStage.earlyTerminate}`,
      timeZone: 7,
    })
    this.dashboardOveriewOfLa = res
    return res
  }
  @action public async getOverviewTotalOfLA(params) {
    this.isLoading = true
    const res = await dashboardService
      .getDashboardOverview({
        ...params,
        nameStore: "V2SpReportOverviewOfLA",
        statusIds: `${leaseStage.confirm},${leaseStage.terminate},${leaseStage.earlyTerminate}`,
        timeZone: 7,
      })
      .finally(() => (this.isLoading = false))
    this.dashboardOveriewTotalOfLa = res
    return res
  }
  @action public async getOverviewOfLARequest(params) {
    const res = await dashboardService.getDashboardOverview({
      ...params,
      nameStore: "V1SPREPORTOVERVIEWOFLA",
      statusIds: `${leaseStage.new}`,
      timeZone: 7,
    })
    this.dashboardOveriewOfLaRequest = res
    return res
  }
  @action public async getDashboarOverviewLAExpired(params) {
    this.isLoading = true
    const res = await dashboardService
      .getDashboardOverview({
        ...params,
        nameStore: "V1SPREPORTLAEXPIRED",
        statusIds: `${leaseStage.confirm},${leaseStage.terminate},${leaseStage.earlyTerminate}`,
        timeZone: 7,
      })
      .finally(() => (this.isLoading = false))
    this.dashboardReportLAExpired = res
    return res
  }
  @action public async getDashboarPopularLeaseUnit(params) {
    this.isLoading = true
    const res = await dashboardService
      .getDashboardOverview({
        ...params,
        nameStore: "V1SPREPORTPOPULARLEASEUNIT",
        statusIds: `${leaseStage.confirm},${leaseStage.terminate},${leaseStage.earlyTerminate}`,
        timeZone: 7,
      })
      .finally(() => (this.isLoading = false))
    this.dashboardPopularLeaseUnit = res
    return res
  }
  @action public async getDashboarLeaseUnitStatus(params) {
    this.isLoading = true
    const res = await dashboardService
      .getDashboardOverview({
        ...params,
        nameStore: "V1SPREPORTLEASEUNITSTATUS",
        statusIds: `${leaseStage.confirm},${leaseStage.terminate},${leaseStage.earlyTerminate}`,
        timeZone: 7,
      })
      .finally(() => (this.isLoading = false))
    this.dashboardLeaseUnitStatus = res

    return res
  }
  @action public async getDashboarLADropStage(params) {
    this.isLoading = true
    const res = await dashboardService
      .getDashboardOverview({
        ...params,
        nameStore: "V1SPREPORTLADROPSTAGE",
        statusIds: `${leaseStage.confirm},${leaseStage.terminate},${leaseStage.earlyTerminate}`,
        timeZone: 7,
      })
      .finally(() => (this.isLoading = false))
    this.dashboardLAdropStage = res

    return res
  }

  @action public async exportLARevenue(params) {
    this.isLoading = true
    const res = await dashboardService
      .getDashboardOverview({
        ...params,
        nameStore: "V1SpExportLARevenue",
        statusIds: `${leaseStage.confirm},${leaseStage.terminate},${leaseStage.earlyTerminate}`,
        timeZone: 7,
      })
      .finally(() => (this.isLoading = false))
    return res
  }
  @action public async exportOverviewLA(params) {
    this.isLoading = true
    const res = await dashboardService
      .getDashboardOverview({
        ...params,
        nameStore: "V2SpExportOverviewLA",
        statusIds: `${leaseStage.confirm},${leaseStage.terminate},${leaseStage.earlyTerminate}`,
        timeZone: 7,
      })
      .finally(() => (this.isLoading = false))
    return res
  }
  @action public async exportLARevenueRequest(params) {
    this.isLoading = true
    const res = await dashboardService
      .getDashboardOverview({
        ...params,
        nameStore: "V1SpExportLARevenue",
        statusIds: `${leaseStage.new}`,
        timeZone: 7,
      })
      .finally(() => (this.isLoading = false))
    return res
  }

  @action public async exportOverviewLAInfo(params) {
    this.isLoading = true
    const res = await dashboardService
      .getDashboardOverview({
        ...params,
        statusIds: `${leaseStage.confirm},${leaseStage.terminate},${leaseStage.earlyTerminate}`,
        timeZone: 7,
      })
      .finally(() => (this.isLoading = false))
    return res
  }

  @action public async exportLADropStage(params) {
    this.isLoading = true
    const res = await dashboardService
      .getDashboardOverview({
        ...params,
        nameStore: "V1SpExportLADropStage",
        timeZone: 7,
      })
      .finally(() => (this.isLoading = false))
    return res
  }
  @action public async getDashboardV1UnitCountOcc(params) {
    this.isLoading = true
    const thisParams = {
      fromDate: params.thisFromDate,
      toDate: params.thisToDate,
      timeZone: 7,
    }
    const lastParams = {
      fromDate: params.lastFromDate,
      toDate: params.lastToDate,
      timeZone: 7,
    }
    const resThis = await dashboardService
      .getDashboardUnitOcc({
        ...thisParams,
        nameStore: "V1SpReportUnitCountOcc",
      })
      .finally(() => (this.isLoading = false))

    const resLast = await dashboardService
      .getDashboardUnitOcc({
        ...lastParams,
        nameStore: "V1SpReportUnitCountOcc",
      })
      .finally(() => (this.isLoading = false))
    this.dashboardOccUnitCountThis = resThis
    this.dashboardOccUnitCountLast = resLast
  }
  @action public async getDashboardV1SqmOccUnit(params) {
    this.isLoading = true
    const thisParams = {
      fromDate: params.thisFromDate,
      toDate: params.thisToDate,
      timeZone: 7,
    }
    const lastParams = {
      fromDate: params.lastFromDate,
      toDate: params.lastToDate,
      timeZone: 7,
    }
    const resThis = await dashboardService
      .getDashboardUnitOcc({ ...thisParams, nameStore: "V1SpReportUnitSQMOcc" })
      .finally(() => (this.isLoading = false))

    const resLast = await dashboardService
      .getDashboardUnitOcc({ ...lastParams, nameStore: "V1SpReportUnitSQMOcc" })
      .finally(() => (this.isLoading = false))
    this.dashboardSqmOccUnitThis = resThis
    this.dashboardSqmOccUnitLast = resLast
  }
  @action public async getDashboardV1UnitTypeOcc(params) {
    this.isLoading = true
    const thisParams = {
      fromDate: params.thisFromDate,
      toDate: params.thisToDate,
      timeZone: 7,
    }
    const lastParams = {
      fromDate: params.lastFromDate,
      toDate: params.lastToDate,
      timeZone: 7,
    }
    const resThis = await dashboardService
      .getDashboardUnitOcc({
        ...thisParams,
        nameStore: "V1SpReportUnitTypeOcc",
      })
      .finally(() => (this.isLoading = false))

    const resLast = await dashboardService
      .getDashboardUnitOcc({
        ...lastParams,
        nameStore: "V1SpReportUnitTypeOcc",
      })
      .finally(() => (this.isLoading = false))
    this.dashboardUnitTypeOccThis = resThis
    this.dashboardUnitTypeOccLast = resLast
  }
  @action public async getDashboardUnitCountOccByMonth(params?) {
    const thisParams = {
      fromDate: dayjs()
        .subtract(11, "months")
        .startOf("months")
        .endOf("days")
        .toJSON(),
      toDate: dayjs().endOf("months").endOf("days").toJSON(),
    }
    this.isLoading = true
    const res = await dashboardService
      .getDashboard({
        ...thisParams,
        nameStore: "V1SpReportUnitCountOccByMonth",
      })
      .finally(() => (this.isLoading = false))
    this.dashboardUnitTypeOccByMonth = res

    return res
  }

  @action public async getDashboardLARevenueDetails(params?) {
    const thisParams = {
      fromDate: dayjs()
        .subtract(11, "months")
        .startOf("months")
        .endOf("days")
        .toJSON(),
      toDate: dayjs().endOf("days").toJSON(),
    }
    const lastParams = {
      fromDate: dayjs()
        .subtract(1, "years")
        .subtract(11, "months")
        .startOf("months")
        .endOf("days")
        .toJSON(),
      toDate: dayjs().subtract(1, "years").endOf("days").toJSON(),
    }
    this.isLoading = true
    const res = await dashboardService
      .getDashboard({ ...thisParams, nameStore: "V1SpReportLARevenueDetails" })
      .finally(() => (this.isLoading = false))
    this.dataLARevenueDetailsChart = LARevenueModel.assigns(res)

    const resLastYear = await dashboardService
      .getDashboard({ ...lastParams, nameStore: "V1SpReportLARevenueDetails" })
      .finally(() => (this.isLoading = false))

    this.dataLARevenueDetailsChartLastYear =
      LARevenueLastYearModel.assigns(resLastYear)

    return res
  }
  @action public async getDashboarOverviewModule(params) {
    this.isLoading = true
    const res = await dashboardService
      .getDashboardOverview({
        ...params,
        nameStore: "V1SPREPORTOVERVIEWMODULE",
        statusIds: `${leaseStage.confirm},${leaseStage.terminate},${leaseStage.earlyTerminate}`,
        timeZone: 7,
      })
      .finally(() => (this.isLoading = false))
    this.dashboardOverviewLAModule = res

    return res
  }

  //OCC
  @action public async getDashboardUnitOcc(params) {
    this.isLoading = true
    const res = await dashboardService
      .getDashboardUnitOccDetails({
        ...params,
        nameStore: "V1SpReportUnitCountOccByDateType",
      })
      .finally(() => (this.isLoading = false))
    switch (params?.type) {
      case dashboardOccType.date: {
        this.dashboardUnitOccDetailsDateData = res
        break
      }
      case dashboardOccType.week: {
        this.dashboardUnitOccDetailsWeekData = res
        break
      }
      case dashboardOccType.month: {
        this.dashboardUnitOccDetailsMonthData = res
        break
      }
      default:
        break
    }

    return res
  }

  @action public async getDashboardUnitOccSQM(params) {
    this.isLoading = true
    const res = await dashboardService
      .getDashboardUnitOccDetails({
        ...params,
        nameStore: "V1SpReportCountOccSQMByDateType",
      })
      .finally(() => (this.isLoading = false))
    switch (params?.type) {
      case dashboardOccType.date: {
        this.dashboardUnitOccSQMDetailsDateData = res
        break
      }
      case dashboardOccType.week: {
        this.dashboardUnitOccSQMDetailsWeekData = res
        break
      }
      case dashboardOccType.month: {
        this.dashboardUnitOccSQMDetailsMonthData = res
        break
      }
      default:
        break
    }

    return res
  }

  @action public async getDashboardUnitTypeOcc(params) {
    this.isLoading = true
    const res = await dashboardService
      .getDashboardUnitOccDetails({
        ...params,
        nameStore: "V1SpReportUnitTypeCountOccByDateType",
      })
      .finally(() => (this.isLoading = false))
    switch (params?.type) {
      case dashboardOccType.date: {
        this.dashboardUnitTypeOccDetailsDateData = res
        break
      }
      case dashboardOccType.week: {
        this.dashboardUnitTypeOccDetailsWeekData = res
        break
      }
      case dashboardOccType.month: {
        this.dashboardUnitTypeOccDetailsMonthData = res
        break
      }
      default:
        break
    }

    return res
  }
  @action public async getDashboardSummaryOccUnitType(params) {
    this.isLoading = true
    const res = await dashboardService
      .getDashboardUnitOcc({
        ...params,
        nameStore: "V1SpReportSummaryUnitTypeOcc",
      })
      .finally(() => (this.isLoading = false))
    this.dashboardOccSummaryUnitTypeData = res
    return res
  }

  @action public async getDashboardSummaryOccSQM(params) {
    this.isLoading = true
    const res = await dashboardService
      .getDashboardUnitOcc({
        ...params,
        nameStore: "V1SpReportSummaryUnitTypeSQMOcc",
      })
      .finally(() => (this.isLoading = false))
    this.dashboardOccSummarySqmData = res
    return res
  }
  @action public async getDashboardSummaryConsolidateOcc(params) {
    const resUnit = await dashboardService.getDashboardUnitOcc({
      ...params,
      nameStore: "V1SpReportSummaryUnitTypeOcc",
    })
    const resSQM = await dashboardService.getDashboardUnitOcc({
      ...params,
      nameStore: "V1SpReportSummaryUnitTypeSQMOcc",
    })
    this.dashboardConsolidateOccUnitData = resUnit
    this.dashboardConsolidateOccsSQMData = resSQM
  }

  @action public async getReportAppUsageActivity(params) {
    this.isLoading = true
    const res = await dashboardService
      .getDashboardOverview({
        ...params,
        nameStore: "V1SpReportActivity",
        // statusIds: `${leaseStage.confirm},${leaseStage.terminate},${leaseStage.earlyTerminate}`,
        timeZone: 7,
      })
      .finally(() => (this.isLoading = false))
    this.dashboardAppUsageActivity = res
    return res
  }
  @action public async getDashboardActivityByWeek(params) {
    this.isLoading = true
    const res = await dashboardService
      .getDashboardOverview({
        ...params,
        nameStore: "V1SpReportActivityByWeek",
        // statusIds: `${leaseStage.confirm},${leaseStage.terminate},${leaseStage.earlyTerminate}`,
        timeZone: 7,
      })
      .finally(() => (this.isLoading = false))
    this.dashboardActivityByWeek = res
    return res
  }
  // Budget
  @action public async getDashboardBudget(params) {
    this.isLoading = true
    const resUnit = await dashboardService.getDashboardBudget({
      ...params,
      nameStore: "V1SpReportBudget",
      timeZone: 7,
    })
    const resRevenue = await dashboardService.getDashboardBudget({
      ...params,
      nameStore: "V1SpReportBudgetRevenue",
      timeZone: 7,
    })
    this.dashboardBudgetUnitData = resUnit
    this.dashboardBudgetRevenueData = resRevenue
    this.isLoading = await false
  }
}
export default DashboardStore
