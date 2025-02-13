import { action, observable } from "mobx";

import type { PagedResultDto } from "../../services/dto/pagedResultDto";
import unitService from "@services/projects/unitService";
import { notifySuccess } from "@lib/helper";
import { LNotification } from "@lib/abpUtility";
import dashboardService from "@services/dashboardService";

class UnitStore {
  @observable isLoading!: boolean;
  @observable tableData!: PagedResultDto<any>;
  @observable unitHistories!: any[];
  @observable unitRequirements!: any[];
  @observable editUnit!: any;
  @observable editUnitRes!: any;
  @observable editUnitTenant!: any;
  @observable listUnitInProject!: PagedResultDto<any>;

  @observable listUnitByInquiry!: PagedResultDto<any>;

  @observable facing: any = [];
  @observable view: any = [];
  @observable facilities: any = [];
  @observable unitTypes: any = [];
  @observable publishedUnits!: any[];
  @observable projectPropertyType: any = [];
  @observable propertyTypeByListProject: any = [];
  @observable unitTypeByProject: any = [];
  @observable unitTypeByListProject: any = [];

  @observable unitStatusTableData!: PagedResultDto<any>;
  @observable editUnitStatusConfig!: any;

  constructor() {
    this.tableData = { items: [], totalCount: 0 };
    this.unitHistories = [];
  }

  @action async getUnitRes(id) {
    this.isLoading = true;
    const result = await unitService
      .getUnitRes(id)
      .finally(() => (this.isLoading = false));
    const unitAddress = result?.unitAddress?.length
      ? { ...result.unitAddress[0] }
      : {};
    this.editUnitRes = { ...result, unitAddress };
  }
  @action
  async createUnitRes() {
    this.editUnitRes = {
      id: 0,
      isActive: true,
      name: "",
    };
  }

  @action
  async create(body: any) {
    const result = await unitService.create(body);
    this.editUnit = result;
    this.tableData.items.push(result);
  }

  @action async CreateOrUpdateRes(body, id) {
    const unitAddress = body.unitAddress?.address ? [body.unitAddress] : [];
    const newBody = id
      ? { ...body, unitAddress, id }
      : { ...body, unitAddress };
    await unitService.CreateOrUpdateRes(newBody);
    notifySuccess(
      LNotification("SUCCESS"),
      LNotification("SAVING_SUCCESSFULLY")
    );
  }

  @action
  async createUnitTenant(body: any) {
    body.isActive = true;
    await unitService.createUnitTenant(body);
  }

  @action
  async createUnit() {
    this.editUnit = {
      name: "",
      isActive: true,
      id: 0,
    };
  }
  @action
  async initUnitTenant(space, monthly, per) {
    this.editUnitTenant = {
      isActive: true,
      space,
      monthly,
      per,
      id: 0,
    };
  }

  @action
  async update(updateStaffInput: any) {
    const result = await unitService.update(updateStaffInput);
    this.tableData.items = this.tableData.items.map((x) => {
      if (x.id === updateStaffInput.id) x = result;
      return x;
    });
  }

  @action
  async updateUnitTenant(body: any) {
    await unitService.updateTenantUnit(body);
  }

  @action
  async delete(id: number) {
    await unitService.delete(id);
    this.tableData.items = this.tableData.items.filter((x) => x.id !== id);
  }

  @action
  async deleteTenantUnit(id: number) {
    await unitService.deleteTenantUnit(id);
    this.unitHistories = this.unitHistories.filter((x) => x.id !== id);
  }

  @action
  async activateOrDeactivate(id: number, isActive) {
    await unitService.activateOrDeactivate(id, isActive);
  }

  @action
  async get(id: number) {
    const result = await unitService.get(id);
    this.editUnit = result;
  }

  @action
  async getUnitTenantById(id: number) {
    const result = await unitService.getUnitTenantById(id);
    this.editUnitTenant = result;
  }

  @action
  async getAll(params: any) {
    this.isLoading = true;
    const result = await unitService
      .getAll(params)
      .finally(() => (this.isLoading = false));
    this.tableData = result;
  }

  async getAllRes(params: any) {
    this.isLoading = true;
    const result = await unitService
      .getAllRes(params)
      .finally(() => (this.isLoading = false));
    this.tableData = result;
    return result.items;
  }
  async getAllUnitInProject(params: any) {
    this.isLoading = true;
    const result = await unitService
      .getAllRes(params)
      .finally(() => (this.isLoading = false));
    this.listUnitInProject = result;
    return result.items;
  }

  async getAllUnitMatchingInquiry(params: any) {
    this.isLoading = true;
    const result = await unitService
      .getAllUnitMatchingInquiry(params)
      .finally(() => (this.isLoading = false));
    this.listUnitByInquiry = result;
    return result.items;
  }
  @action
  async getAllUnitHistories(params: any) {
    this.isLoading = true;
    const result = await unitService
      .getAllUnitHistories(params)
      .finally(() => (this.isLoading = false));
    this.unitHistories = result;
  }

  @action
  async getAllUnitRequirements(params: any) {
    this.isLoading = true;
    const result = await unitService
      .getAllUnitRequirements(params)
      .finally(() => (this.isLoading = false));
    this.unitRequirements = result;
  }
  @action async getFacing() {
    this.facing = await unitService.getFacing();
  }
  @action async getProjectPropertyType(projectId) {
    this.projectPropertyType = await unitService.getProjectPropertyType(
      projectId
    );
  }
  @action async getPropertyTypeByListProject(projectIds, unitTypeIds) {
    this.propertyTypeByListProject =
      await unitService.getPropertyTypeByListProject(projectIds, unitTypeIds);
  }
  @action async getListUnitTypeByProject(projectId, propertyTypeId) {
    this.unitTypeByProject = await unitService.getListUnitTypeByProject(
      projectId,
      propertyTypeId
    );
  }
  @action async getListUnitTypeByListProject(projectIds, propertyTypeIds) {
    this.unitTypeByListProject = await unitService.getListUnitTypeByListProject(
      projectIds,
      propertyTypeIds
    );
  }
  @action async getView() {
    this.view = await unitService.getView();
  }
  @action
  async getUnitTypes() {
    const result = await unitService.getUnitTypes();
    this.unitTypes = result;
  }
  @action
  async getUnitsByProjectIds(projectIds: number[] | number, params = {}) {
    this.publishedUnits = await unitService.getUnitByProjectIds(
      projectIds,
      params
    );
  }

  // Unit status management
  async getUnitStatusConfig(params: any) {
    this.isLoading = true;
    const result = await unitService
      .getUnitStatusConfig(params)
      .finally(() => (this.isLoading = false));
    this.unitStatusTableData = result;
    return result.items;
  }

  @action async createOrUpdateUnitStautusConfig(body, id?) {
    this.isLoading = true;
    const newBody = id ? { ...body, id } : { ...body };
    await unitService
      .createOrUpdateUnitStautusConfig(newBody)
      .finally(() => (this.isLoading = false));
  }
  @action
  async getUnitStautusConfig(id: number) {
    const result = await unitService.getUnitStautusConfig(id);
    this.editUnitStatusConfig = result;
  }
  @action
  async createUnitStautusConfig() {
    this.editUnitStatusConfig = {};
  }

  @action
  async exportExcel(params: any) {
    this.isLoading = true;
    return await unitService
      .exportExcel(params)
      .finally(() => (this.isLoading = false));
  }

  @action
  async getUnitOccDetail(params: any) {
    this.isLoading = true;
    const result = await dashboardService.getDashboardUnitOccDetails({
      ...params,
      nameStore: "V1SPREPORTUNITCOUNTOCCBYDATETYPETOEXPORT",
    });
    this.tableData.items = result;
    this.tableData.totalCount = result.length;
    this.isLoading = false;
  }
}

export default UnitStore;
