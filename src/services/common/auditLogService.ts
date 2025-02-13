import type { PagedResultDto } from "../dto/pagedResultDto"
import http from "../httpService"
import { L } from "../../lib/abpUtility"
import { notifyError } from "../../lib/helper"
import { moduleIds, modulePrefix } from "../../lib/appconst"

class AuditLogService {
  public async get(id: number): Promise<any> {
    if (!id) {
      notifyError(L("ERROR"), L("ENTITY_NOT_FOUND"))
    }

    const result = await http.get("api/services/app/Residents/Get", {
      params: { id },
    })
    return result.data.result
  }

  public async getAll(params: any): Promise<PagedResultDto<any>> {
    let url = ""
    switch (params.moduleId) {
      case moduleIds.jobRequest: {
        url = "api/services/app/WorkOrder/GetAuditLogs"
        break
      }
      case moduleIds.dismantlingRequest: {
        url = "api/services/app/DismantlingRequests/GetAuditLogs"
        break
      }
      default: {
        url = "api/services/app/Workflow/GetAuditLogs"
      }
    }
    const res = await http.get(url, { params })
    const result = (res.data.result || []).map((row) => {
      ;(row.items || []).forEach((item) => {
        item.propertyName = L(
          `${modulePrefix[params.moduleId]}${item.propertyName}`
        )
        return item
      })
      return row
    })
    return { items: result, totalCount: result.length }
  }
}

export default new AuditLogService()
