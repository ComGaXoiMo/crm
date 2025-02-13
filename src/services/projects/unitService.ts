import type { PagedResultDto } from "../../services/dto/pagedResultDto"
import http from "../httpService"
import { L, LNotification } from "../../lib/abpUtility"
import { notifyError, notifySuccess } from "../../lib/helper"
import dayjs from "dayjs"
import { RowUnitModel, RowUnitStatusModel } from "@models/project/unitModel"
import { downloadFile } from "@lib/helperFile"

class UnitService {
  public async create(body: any) {
    const result = await http.post("api/Unit/Create", body)
    notifySuccess(
      LNotification("SUCCESS"),
      LNotification("SAVING_SUCCESSFULLY")
    )
    return result.data.result
  }

  public async createUnitTenant(body: any) {
    const result = await http.post("api/UnitHistory/Create", body)
    notifySuccess(
      LNotification("SUCCESS"),
      LNotification("SAVING_SUCCESSFULLY")
    )
    return result.data.result
  }

  public async update(body: any) {
    const result = await http.post(`api/Unit/Update/${body.id}`, body)
    notifySuccess(
      LNotification("SUCCESS"),
      LNotification("SAVING_SUCCESSFULLY")
    )
    return result.data.result
  }

  public async updateTenantUnit(body: any) {
    const result = await http.post(`api/UnitHistory/Update/${body.id}`, body)
    notifySuccess(
      LNotification("SUCCESS"),
      LNotification("SAVING_SUCCESSFULLY")
    )
    return result.data.result
  }

  public async delete(id: number) {
    const result = await http.delete("api/services/app/Residents/Delete", {
      params: { id },
    })
    return result.data
  }

  public async deleteTenantUnit(id: number) {
    const result = await http.delete("api/UnitHistory/Delete", {
      params: { id },
    })
    return result.data
  }

  public async activateOrDeactivate(id: number, isActive) {
    const result = await http.post(
      "api/services/app/Unit/Active",
      { id },
      { params: { isActive } }
    )
    return result.data
  }

  public async get(id: number): Promise<any> {
    if (!id) {
      notifyError(L("Error"), L("EntityNotFound"))
    }

    const result = await http.get(`api/services/app/Unit/Get`, {
      params: { id },
    })
    if (result.data.result && result.data.result.birthDate) {
      result.data.result.birthDate = dayjs(result.data.result.birthDate)
    }
    return result.data.result
  }

  public async getUnitTenantById(id: number): Promise<any> {
    if (!id) {
      notifyError(L("Error"), L("EntityNotFound"))
    }

    const result = await http.get(`api/UnitHistory/Details/${id}`)
    if (result.data.result && result.data.result.startDate) {
      result.data.result.startDate = dayjs(result.data.result.startDate)
    }
    if (result.data.result && result.data.result.expiredDate) {
      result.data.result.expiredDate = dayjs(result.data.result.expiredDate)
    }
    return result.data.result
  }

  public async getAll(params: any): Promise<PagedResultDto<any>> {
    const res = await http.post("api/Unit/Filters", params)
    const { result } = res.data
    result.items = RowUnitModel.assigns(result.items)

    return result
  }

  public async getAllRes(params: any): Promise<PagedResultDto<any>> {
    const res = await http.get("api/services/app/Unit/GetAll", {
      params,
    })
    const { result } = res.data
    result.items = RowUnitModel.assigns(result.items)

    return result
  }
  public async getAllUnitMatchingInquiry(
    params: any
  ): Promise<PagedResultDto<any>> {
    const res = await http.get("api/services/app/Unit/GetMatchingUnit", {
      params,
    })
    const { result } = res.data
    result.items = RowUnitModel.assigns(result.items)

    return result
  }
  public async getAllUnitHistories(params: any): Promise<any> {
    const res = await http.get(
      `api/UnitHistory/GetListHistoryUnit/${params.unitId}`,
      { params }
    )
    const { result } = res.data

    return result
  }

  public async getAllUnitRequirements(params: any): Promise<any> {
    const res = await http.get(`api/Request/MatchingUnits/${params.unitId}`, {
      params,
    })
    const { result } = res.data

    return result
  }

  public async getProjectProvinces(params: any): Promise<any> {
    const res = await http.get(
      `api/services/app/Category/GetListProjectProvince`,
      { params }
    )
    const { result } = res.data

    return (result || []).map((item) => {
      item.name = item.provinceName
      return item
    })
  }

  public async getProjectDistricts(params: any): Promise<any> {
    const res = await http.get(
      "api/services/app/Category/GetListProjectDistrict",
      { params }
    )
    const { result } = res.data

    return (result || []).map((item) => {
      item.name = item.districtName
      return item
    })
  }
  public async getFacing() {
    const res = (await http.get("/api/services/app/Category/GetListFacing"))
      .data.result
    return res
  }

  public async getView() {
    const res = (await http.get("/api/services/app/Category/GetListView")).data
      .result
    return res
  }
  public async CreateOrUpdateRes(body) {
    const res = await http.post("api/services/app/Unit/CreateOrUpdate", body)
    return res.data.result
  }

  public async getUnitRes(id) {
    return (
      await http.get("api/services/app/Unit/Get", {
        params: { id },
      })
    ).data.result
  }
  public async getUnitTypes() {
    const response = await http.get(
      "api/services/app/ProjectCategory/GetByTargets",
      {
        params: { target: "UNITTYPE" },
      }
    )
    return (response.data.result || []).map((item) => {
      return { ...item, value: item.id, label: item.name }
    })
  }
  public async getUnits(params) {
    if (!params.skipCount) {
      params.skipCount = 0
    }
    if (!params.maxResultCount) {
      params.maxResultCount = 20
    }
    const response = await http.get("api/services/app/Units/GetUnits", {
      params,
    })
    return response.data.result.items
  }
  public async getUnitByProjectIds(projectIds: number[] | number, params = {}) {
    if (projectIds instanceof Array && !projectIds.length) {
      return []
    }

    if (projectIds === -1) {
      return this.getUnits(params)
    }

    return this.getUnits({ ...params, projectIds })
  }
  public async filterAllOptions(params: any): Promise<any> {
    if (!params.maxResultCount) {
      params.maxResultCount = 20
    }
    if (!params.skipCount) {
      params.skipCount = 0
    }

    const result = await http.get("api/services/app/Units/GetLists", { params })
    return (result.data?.result || []).map((item) => ({
      id: item.id,
      fullUnitCode: item.fullUnitCode,
      value: item.id,
      label: item.fullUnitCode,
      projectName: item.project?.name,
    }))
  }
  public async getProjectPropertyType(projectId) {
    const res = (
      await http.get("api/services/app/Category/GetPropertyTypeByProject", {
        params: { projectId },
      })
    ).data.result
    return res
  }
  public async getPropertyTypeByListProject(projectIds, unitTypeIds) {
    const res = (
      await http.get("api/services/app/Category/GetPropertyTypeByListProject", {
        params: { projectIds, unitTypeIds },
      })
    ).data.result
    return res
  }
  public async getListUnitTypeByProject(projectId, propertyTypeId) {
    const res = (
      await http.get("api/services/app/Category/GetListUnitTypeByProject", {
        params: { projectId, propertyTypeId },
      })
    ).data.result
    return res
  }

  public async getListUnitTypeByListProject(projectIds, propertyTypeIds) {
    const res = (
      await http.get("api/services/app/Category/GetUnitTypeByListProject", {
        params: { projectIds, propertyTypeIds },
      })
    ).data.result
    return res
  }
  //Unit status management

  public async getUnitStatusConfig(params: any): Promise<PagedResultDto<any>> {
    const res = await http.get("api/services/app/UnitStatusManagement/GetAll", {
      params,
    })
    const { result } = res.data
    result.items = RowUnitStatusModel.assigns(result.items)

    return result
  }
  public async createOrUpdateUnitStautusConfig(body) {
    const res = await http.post(
      "api/services/app/UnitStatusManagement/CreateOrUpdate",
      body
    )
    return res.data.result
  }
  public async getUnitStautusConfig(id: number): Promise<any> {
    if (!id) {
      notifyError(L("Error"), L("EntityNotFound"))
    }

    const result = await http.get(`api/services/app/UnitStatusManagement/Get`, {
      params: { id },
    })
    if (result.data.result && result.data.result.birthDate) {
      result.data.result.birthDate = dayjs(result.data.result.birthDate)
    }
    const res = RowUnitStatusModel.assign(result.data.result)
    return res
  }

  public async exportExcel(params: any): Promise<any> {
    const res = await http.get("api/Export/ExportUnit", {
      params,
      responseType: "blob",
    })
    downloadFile(res.data, "unit.xlsx")
  }
}

export default new UnitService()
