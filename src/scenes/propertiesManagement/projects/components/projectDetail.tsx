import * as React from "react"

import { inject, observer } from "mobx-react"
import { AppComponentListBase } from "@components/AppComponentBase"

import { Tabs } from "antd"
import { L } from "@lib/abpUtility"
import withRouter from "@components/Layout/Router/withRouter"
import Stores from "@stores/storeIdentifier"
import Summary from "./tabSummary"
import ProjectStore from "@stores/projects/projectStore"
import UnitStore from "@stores/projects/unitStore"
import { RouteComponentProps } from "react-router-dom"

import FileStore from "@stores/common/fileStore"
import ProjectFloors from "./ProjectFloors"
import AppDataStore from "@stores/appDataStore"
import UnitInProject from "./tabUnit/index"

import CustomDrawerProject from "@components/Drawer/CustomDrawerProject"
import TabInquire from "@scenes/clientsManagement/contactsAndLead/components/tabInquire"
import { appPermissions, moduleNames } from "@lib/appconst"
import _ from "lodash"
import TabDocument from "@scenes/inquiriesManagement/inquiriesList/components/detailInquiry/tabDocument"
import TabProjectUserPermission from "./tabProjectUserPermission"
import TabContract from "@scenes/propertiesManagement/units/components/tabContract"
interface IProjectsDetailProps extends RouteComponentProps {
  projectStore: ProjectStore;
  unitStore: UnitStore;
  fileStore: FileStore;
  appDataStore: AppDataStore;
  visible: boolean;
  id: any;
  onCancel: () => void;
  onOk: () => void;
}
const tabKeys = {
  tabSummaries: "TAB_SUMMARY",
  tabUnits: "TAB_UNITS",
  tabInquiries: "TAB_INQUIRIES",
  tabTenant: "TAB_TENANT",
  tabContracts: "TAB_CONTRACTS",
  tabDocuments: "TAB_DOCUMENTS",
  tabFloors: "TAB_FLOORS",
  tabUserPermission: "TAB_PROJECT_USER_PERMISSION",
}
type State = {
  tabActiveKey: any;
  projectId: any;
  isEdit: boolean;
};
@inject(Stores.ProjectStore, Stores.UnitStore)
@observer
class ProjectsDetail extends AppComponentListBase<IProjectsDetailProps, State> {
  formRef = React.createRef<any>();
  constructor(props: IProjectsDetailProps) {
    super(props)
    this.state = {
      tabActiveKey: tabKeys.tabSummaries,
      projectId: null,
      isEdit: false,
    }
  }

  async componentDidUpdate(prevProps) {
    if (prevProps.visible !== this.props.visible) {
      if (this.props.visible === true) {
        this.setState({ projectId: this.props.id })
        if (this.props.id) {
          Promise.all([this.getDetail(this.props.id)])
          this.setState({ isEdit: false })
        } else {
          this.formRef.current?.resetFields()
          this.setState({ isEdit: true })
        }
      }
    }
  }

  getDetail = async (id?) => {
    // Init properties & custom field for workflow first
    await this.formRef.current?.resetFields()
    if (!id) {
      await this.props.projectStore.createProject()
    }

    const formValue = {
      ...this.props.projectStore.editProject,
      projectTypeMap: _(this.props.projectStore?.editProject?.projectTypeMap)
        .groupBy("propertyTypeId")
        .map((items, key) => {
          return {
            propertyTypeId: parseInt(key),
            unitTypeId: _.map(items, "unitTypeId"),
          }
        })
        .value(),
      projectFacilityIds:
        this.props.projectStore.editProject?.projectFacilityMap.map(
          (item) => item.projectFacilityId
        ),
    }
    await this.formRef?.current?.setFieldsValue(formValue)

    // this.formRef.current.setFieldsValue({
    //   projectAddress: this.props.projectStore.editProject?.projectAddress,
    // });
  };
  changeTab = (tabKey) => {
    this.setState({ tabActiveKey: tabKey })
  };
  handleSave = async (id?) => {
    let formValues = await this.formRef.current?.validateFields()
    if (id) {
      formValues = { ...formValues, id: id }
    }
    const dd = await formValues?.projectTypeMap.map((item) => {
      return item?.unitTypeId?.map((value) => {
        return {
          propertyTypeId: item.propertyTypeId,
          unitTypeId: value,
        }
      })
    })

    const va = dd.flat(1) // merge array
    const unitProductTypeId = await _.unionWith(va, _.isEqual) // remove data duplicate
    formValues = {
      ...formValues,
      id: id,
      projectTypeMap: unitProductTypeId,
    }
    this.setState({
      tabActiveKey: tabKeys.tabSummaries,
    })
    await this.props.projectStore.CreateOrUpdate(formValues)
    await this.handleChangeInfo()
    await this.setState({ isEdit: false })
    if (!id) {
      this.handleCancel()
    }
  };
  handleEdit = () => {
    this.setState({ isEdit: true })
  };
  handleCancel = async () => {
    // await this.formRef.current?.resetFields();
    this.setState({ tabActiveKey: tabKeys.tabSummaries })
    await this.props.onCancel()
  };
  handleChangeInfo = async () => {
    // await this.formRef.current?.resetFields();

    await this.props.onOk()
  };
  public render() {
    const {
      visible,
      projectStore: { editProject, isLoading },
    } = this.props
    return (
      <CustomDrawerProject
        useBottomAction
        visible={visible}
        onClose={this.handleCancel}
        title={this.props.id ? `${editProject?.projectName}` : L("")}
        onCreate={this.props.id ? undefined : () => this.handleSave()}
        onEdit={this.props.id ? this.handleEdit : undefined}
        isLoading={isLoading}
        onSave={() => this.handleSave(this.props.id)}
        isEdit={this.state.isEdit}
        updatePermission={this.isGranted(appPermissions.project.update)}
      >
        <Tabs
          activeKey={this.state.tabActiveKey}
          onTabClick={this.changeTab}
          type="card"
        >
          <Tabs.TabPane
            tab={L(tabKeys.tabSummaries)}
            key={tabKeys.tabSummaries}
          >
            <Summary
              formRef={this.formRef}
              isEdit={this.state.isEdit}
              id={this.state.projectId}
              visible={visible}
            />
          </Tabs.TabPane>
          {this.props.id && (
            <Tabs.TabPane tab={L(tabKeys.tabFloors)} key={tabKeys.tabFloors}>
              <ProjectFloors
                projectId={this.state.projectId}
                activeKey={this.state.tabActiveKey}
                tabKey={tabKeys.tabFloors}
              />
            </Tabs.TabPane>
          )}
          {this.isGranted(appPermissions.unit.read) && this.props.id && (
            <Tabs.TabPane tab={L(tabKeys.tabUnits)} key={tabKeys.tabUnits}>
              <UnitInProject projectId={this.state.projectId} />
            </Tabs.TabPane>
          )}
          {this.isGranted(appPermissions.inquiry.read) && this.props.id && (
            <Tabs.TabPane
              tab={L(tabKeys.tabInquiries)}
              key={tabKeys.tabInquiries}
            >
              <TabInquire projectId={this.props.id} />
            </Tabs.TabPane>
          )}
          {this.isGranted(appPermissions.leaseAgreement.read) &&
            this.props.id && (
              <Tabs.TabPane
                tab={L(tabKeys.tabContracts)}
                key={tabKeys.tabContracts}
              >
                <TabContract projectId={this.props.id} />
              </Tabs.TabPane>
            )}
          {this.isGranted(appPermissions.project.detail) && this.props.id && (
            <Tabs.TabPane
              tab={L(tabKeys.tabDocuments)}
              key={tabKeys.tabDocuments}
            >
              <TabDocument
                moduleId={moduleNames.project}
                inputId={this.props.projectStore.editProject?.uniqueId}
                createPermission={this.isGranted(appPermissions.project.create)}
                updatePermission={this.isGranted(appPermissions.project.update)}
                deletePermission={this.isGranted(appPermissions.project.delete)}
              />
            </Tabs.TabPane>
          )}
          {this.isGranted(appPermissions.project.userPermission) &&
            this.props.id && (
              <Tabs.TabPane
                tab={L(tabKeys.tabUserPermission)}
                key={tabKeys.tabUserPermission}
              >
                <TabProjectUserPermission
                  visible={this.props.visible}
                  projectId={this.props.id}
                />
              </Tabs.TabPane>
            )}
        </Tabs>
      </CustomDrawerProject>
    )
  }
}

export default withRouter(ProjectsDetail)
