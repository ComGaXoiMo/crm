import type { PagedResultDto } from "../../services/dto/pagedResultDto"
import http from "../httpService"
import { L, LNotification } from "../../lib/abpUtility"
import { notifyError, notifySuccess } from "../../lib/helper"
import {
  RowProjectModel,
  ProjectDetailModel,
  RowFloorModel,
} from "@models/project/projectModel"

class ProjectService {
  public async CreateOrUpdate(body: any) {
    const result = await http.post(
      "api/services/app/Project/CreateOrUpdate",
      body
    )
    notifySuccess(
      LNotification("SUCCESS"),
      LNotification("SAVING_SUCCESSFULLY")
    )
    return result.data.result
  }

  public async createFloor(body: any) {
    const result = await http.post(
      "/api/services/app/Floor/CreateOrUpdate",
      body
    )
    notifySuccess(
      LNotification("SUCCESS"),
      LNotification("SAVING_SUCCESSFULLY")
    )
    return result.data.result
  }

  // public async update(body: any) {
  //   let result = await http.post(
  //     `api/services/app/Project/CreateOrUpdate`,
  //     body
  //   );
  //   notifySuccess(
  //     LNotification("SUCCESS"),
  //     LNotification("SAVING_SUCCESSFULLY")
  //   );
  //   return result.data.result;
  // }

  public async updateFloor(body: any) {
    // let result = await http.post(`api/Floor/update/${body.id}`, body);
    const result = await http.post(`api/services/app/Floor/CreateOrUpdate`, body)

    notifySuccess(
      LNotification("SUCCESS"),
      LNotification("SAVING_SUCCESSFULLY")
    )
    return result.data.result
  }

  public async updateUnitOrder(body: any) {
    const result = await http.post(`api/services/app/Unit/OrderList`, body)
    // notifySuccess(
    //   LNotification("SUCCESS"),
    //   LNotification("SAVING_SUCCESSFULLY")
    // );
    return result.data.result
  }

  public async updateProjectAddress(projectId, body: any) {
    const result = await http.post(
      "api/services/app/Project/CreateOrUpdateProjectAddress",
      [body]
    )
    notifySuccess(
      LNotification("SUCCESS"),
      LNotification("SAVING_SUCCESSFULLY")
    )
    return result.data.result
  }

  public async updateFloorOrder(body: any) {
    const result = await http.post(`api/services/app/Floor/OrderList`, body)
    // notifySuccess(
    //   LNotification("SUCCESS"),
    //   LNotification("SAVING_SUCCESSFULLY")
    // );
    return result.data.result
  }

  public async delete(id: number) {
    const result = await http.delete("api/services/app/Residents/Delete", {
      params: { id },
    })
    return result.data
  }

  public async activateOrDeactivate(id: number, isActive) {
    const result = await http.post(
      "api/services/app/Project/Active",
      { id },
      { params: { isActive } }
    )
    return result.data
  }

  public async get(id: number): Promise<any> {
    if (!id) {
      notifyError(L("Error"), L("EntityNotFound"))
    }

    const result = await http.get("api/services/app/Project/Get", {
      params: { id },
    })

    return ProjectDetailModel.assign(result.data.result)
  }

  public async getAll(params: any): Promise<PagedResultDto<any>> {
    const res = await http.get("api/services/app/Project/GetAll", { params })
    const { result } = res.data
    return RowProjectModel.assign(result)
  }

  public async getSimpleProject() {
    const result = await http.get("api/services/app/Project/GetSimpleProject")
    return result.data?.result
  }
  public async getFloors(projectId, params: any): Promise<any> {
    const res = await http.get("api/services/app/Floor/GetFloorByProject", {
      params: { ...params, projectId },
    })
    const { result } = res.data

    return RowFloorModel.assigns(result)
  }

  public async activateOrDeactivateFloor(id: number, isActive) {
    const result = await http.post(
      "api/services/app/Floor/Active",
      { id },
      { params: { isActive } }
    )
    return result.data
  }
  public async getUnits(projectId, params: any): Promise<any> {
    const res = await http.get("api/services/app/Unit/GetListUnitsByProject", {
      params: { ...params, projectId },
    })
    const { result } = res.data

    return RowFloorModel.assigns(result)
  }
  public async filterOptions(params: any): Promise<PagedResultDto<any>> {
    params.pageNumber = 1
    params.pageSize = 20
    const res = await http.get("api/services/app/Project/GetAll", { params })
    const { result } = res.data
    result.items = RowProjectModel.assigns(result.items)

    return result.items
  }

  public async countUnitByStatus(params) {
    const res = await http.get("api/services/app/Unit/GetUnitStatus", { params })
    const { result } = res.data

    return result.map((item) => ({
      name: item.name,
      value: item.count,
    }))
  }
  public async countUnitByType(params) {
    const res = await http.get("api/services/app/Unit/GetUnitType", { params })
    const { result } = res.data

    return result.map((item) => ({
      name: item.name,
      value: item.count,
    }))
  }

  //permission
  public async createOrUpdateProjectUser(body: any) {
    const result = await http.post(
      "api/services/app/Project/CreateOrUpdateProjectUser",
      body
    )
    notifySuccess(
      LNotification("SUCCESS"),
      LNotification("SAVING_SUCCESSFULLY")
    )
    return result.data.result
  }

  public async getListProjectUserPermission(
    params: any
  ): Promise<PagedResultDto<any>> {
    const res = await http.get(
      "api/services/app/Project/GetListProjectUserPermission",
      { params }
    )
    const { result } = res.data
    return result
  }
  public async deleteUserPermission(id: number) {
    const result = await http.delete(
      "api/services/app/Project/DeletePermission",
      {
        params: { id },
      }
    )
    return result.data
  }

  public async updatePermission(params) {
    const result = await http.put(
      "api/services/app/Project/UpdatePermission",
      params
    )
    return result.data
  }
}

export default new ProjectService()
