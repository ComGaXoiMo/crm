import { PagedFilterAndSortedRequest } from "../../../dto/pagedFilterAndSortedRequest"

export interface PagedUserResultRequestDto extends PagedFilterAndSortedRequest {
  roleId?: number;
  keyword: string;
}
