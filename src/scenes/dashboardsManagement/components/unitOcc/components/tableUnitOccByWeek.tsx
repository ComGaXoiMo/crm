import * as React from "react";

import { inject, observer } from "mobx-react";
import { AppComponentListBase } from "@components/AppComponentBase";
import { Row, Col, Button, Spin, DatePicker, Select } from "antd";

import { L } from "@lib/abpUtility";
import {
  filterOptions,
  formatNumberFloat,
  handleDownloadPdf,
  tableToExcel,
} from "@lib/helper";
import AppConsts, { dateSortFormat, weekFormat } from "@lib/appconst";
import withRouter from "@components/Layout/Router/withRouter";
import DashboardStore from "@stores/dashboardStore";
import Stores from "@stores/storeIdentifier";
import moment from "moment";
import { ExcelIcon } from "@components/Icon";
import "../occTableStyle.less";
import projectService from "@services/projects/projectService";
import { debounce } from "lodash";
import UnitStore from "@stores/projects/unitStore";
const { itemDashboard, dashboardOccType } = AppConsts;
const { RangePicker } = DatePicker;

export interface IProps {
  selectItem: any;
  dashboardStore: DashboardStore;
  unitStore: UnitStore;
  projects: any[];
  handleOpenModal: (params) => void
}

@inject(Stores.DashboardStore, Stores.UnitStore)
@observer
class TableUnitOccByWeek extends AppComponentListBase<IProps> {
  printRef: any = React.createRef();
  state = {
    filters: {
      type: dashboardOccType.week,
      fromDate: moment()
        .startOf("months")
        .startOf("weeks")
        .add(1, "days")
        .endOf("days")
        .toJSON(),
      toDate: moment().endOf("months").endOf("weeks").endOf("days").toJSON(),
    },

    isConvertting: false,
    listProject: [] as any,
    dataTable: [] as any,
  };

  componentDidMount() {
    this.getDashBoard();
    if (this.props.projects && this.props?.projects?.length > 0) {
      this.setState({ listProject: this.props.projects });
    } else {
      this.getProject("");
    }
  }
  componentDidUpdate(prevProps) {
    if (prevProps.selectItem !== this.props.selectItem) {
      if (this.props.selectItem === itemDashboard.unitOcc) {
        this.getDashBoard();
        if (this.props.projects && this.props?.projects?.length > 0) {
          this.setState({ listProject: this.props.projects });
        } else {
          this.getProject("");
        }
      }
    }
  }
  getProject = async (keyword) => {
    const res = await projectService.getAll({
      maxResultCount: 10,
      skipCount: 0,
      keyword,
      isActive: true,
    });
    const newProjects = res.items.map((i) => {
      return { id: i.id, name: i.projectName };
    });
    this.setState({ listProject: newProjects });
  };
  getDashBoard = async () => {
    this.props.dashboardStore
      .getDashboardUnitOcc({
        ...this.state.filters,
      })
      .finally(() => {
        this.dataAnalysis(
          this.props.dashboardStore.dashboardUnitOccDetailsWeekData
        );
        this.setState({
          dataTable: this.props.dashboardStore.dashboardUnitOccDetailsWeekData,
        });
      });
  };

  dataAnalysis = (dataInput) => {
    const colArr = [] as any;
    const projectArr = [] as any;
    dataInput.forEach((item) => {
      const colObj = colArr.find(
        (dataCol) => dataCol?.colName === item?.FormattedDateName
      );
      const projectObj = projectArr.find(
        (project) => project?.projectId === item?.ProjectId
      );
      if (!colObj) {
        colArr.push({
          colName: item?.FormattedDateName,
        });
      }
      if (!projectObj) {
        projectArr.push({
          projectId: item?.ProjectId,
          projectName: item?.ProjectName,
        });
      }
    });

    const dataProject = projectArr.map((project) => {
      const dataFilter = dataInput.filter(
        (item) => item.ProjectId === project?.projectId
      );

      return {
        projectId: project?.projectId,
        projectName: project?.projectName,
        dataProject: dataFilter,
      };
    });

    return (
      <table className="table-occ">
        <thead>
          <tr>
            <th></th>
            {colArr.map((colData, index) => {
              return <th>{colData?.colName}</th>;
            })}
            <th>{L("AVG_OCC")}</th>
          </tr>
        </thead>
        <tbody>
          {dataProject.map((project, index) => {
            const avgOcc =
              project?.dataProject?.reduce(
                (accumulator, currentValue) =>
                  accumulator + currentValue?.Percent,
                0
              ) / project?.dataProject?.length;
            const maxOcc = Math.max(
              ...project?.dataProject.map((item) => item.Percent)
            );
            const minOcc = Math.min(
              ...project?.dataProject.map((item) => item.Percent)
            );
            const rageOccPercent = maxOcc - minOcc;
            return (
              <>
                <tr>
                  <td className="project-row">{L("PROJECT_NAME")}</td>
                  <td
                    colSpan={project?.dataProject?.length}
                    className="project-row"
                  >
                    <div>{project?.projectName}</div>
                  </td>
                  <td></td>
                </tr>
                <tr>
                  <td>{L("TOTAL_AVAILABLE")}</td>
                  {project?.dataProject.map((item) => {
                    return (
                      <td className="text-right">
                        {formatNumberFloat(item?.TotalAvailable)}
                      </td>
                    );
                  })}
                  <td></td>
                </tr>
                <tr>
                  <td className="lease-cell">{L("LEASED")}</td>
                  {project?.dataProject.map((item) => {
                    return (
                      <td className="text-right lease-cell">
                        {formatNumberFloat(item?.Leased)}
                      </td>
                    );
                  })}
                  <td className="lease-cell"></td>
                </tr>
                <tr>
                  <td className="occ-cell">({L("OCC_%")})</td>
                  {project?.dataProject.map((item) => {
                    const colorRank =
                      ((item?.Percent - minOcc) /
                        (rageOccPercent > 0 ? rageOccPercent : 1)) *
                      1000;
                    const colorCell = `rgba(7, 143, 233, ${
                      Math.round(colorRank) / 1000
                    })`;
                    return (
                      <td
                        style={{ backgroundColor: colorCell }}
                        className="text-right occ-cell"
                      >
                        {formatNumberFloat(item?.Percent)}%
                      </td>
                    );
                  })}
                  <td className="text-right occ-cell">
                    {formatNumberFloat(avgOcc)}%
                  </td>
                </tr>
                <tr>
                  <td>{L("VACANT")}</td>
                  {project?.dataProject.map((item) => {
                    return (
                      <td className="text-right">
                        {formatNumberFloat(item?.TotalVacant)}
                      </td>
                    );
                  })}
                  <td></td>
                </tr>
                <tr>
                  <td>{L("SHOWROOM")}</td>
                  {project?.dataProject.map((item) => {
                    return (
                      <td className="text-right">
                        {formatNumberFloat(item?.Showroom)}
                      </td>
                    );
                  })}
                  <td></td>
                </tr>
                <tr>
                  <td>{L("RENOVATION")}</td>
                  {project?.dataProject.map((item) => {
                    return (
                      <td className="text-right">
                        {formatNumberFloat(item?.Renovation)}
                      </td>
                    );
                  })}
                  <td></td>
                </tr>
                <tr>
                  <td>{L("OOO")}</td>
                  {project?.dataProject.map((item) => {
                    return (
                      <td className="text-right">
                        {formatNumberFloat(item?.Outoforder)}
                      </td>
                    );
                  })}
                  <td></td>
                </tr>
                <tr>
                  <td>{L("OOS")}</td>
                  {project?.dataProject.map((item) => {
                    return (
                      <td className="text-right">
                        {formatNumberFloat(item?.Outofservices)}
                      </td>
                    );
                  })}
                  <td></td>
                </tr>
                <tr>
                  <td>{L("PMH_USE")}</td>
                  {project?.dataProject.map((item) => {
                    return (
                      <td className="text-right">
                        {formatNumberFloat(item?.PMHuse)}
                      </td>
                    );
                  })}
                  <td></td>
                </tr>
                <tr>
                  <td>{L("INHOUSE_USE")}</td>
                  {project?.dataProject.map((item) => {
                    return (
                      <td className="text-right">
                        {formatNumberFloat(item?.Inhouseuse)}
                      </td>
                    );
                  })}
                  <td></td>
                </tr>
                <tr>
                  <td>{L("TOTAL_UNIT")}</td>
                  {project?.dataProject.map((item) => {
                    return (
                      <td className="text-right">
                        {formatNumberFloat(item?.TotalUnit)}
                      </td>
                    );
                  })}
                  <td></td>
                </tr>
              </>
            );
          })}
        </tbody>
      </table>
    );
  };

  handleSearch = () => {
    this.getDashBoard();
  };

  fillterChange = async (name, value) => {
    const { filters } = this.state;

    if (name === "dateFromTo") {
      this.setState({
        filters: {
          ...filters,
          fromDate: moment(value[0])
            .startOf("weeks")
            .add(1, "days")
            .endOf("days")
            .toJSON(),
          toDate: moment(value[1]).endOf("weeks").endOf("days").toJSON(),
        },
      });
    } else if (name === "projectId") {
      this.setState({
        filters: {
          ...filters,
          projectId: value,
        },
      });
    }
  };

  changeTab = (tabKey) => {
    this.setState({ tabActiveKey: tabKey });
  };
  handleDownloadPdfs = async (type) => {
    await this.setState({ isConvertting: true });
    const element = this.printRef.current;
    await handleDownloadPdf(element, type, "CommissionDashboard.pdf").finally(
      () => {
        this.setState({ isConvertting: false });
      }
    );
  };
  public render() {
    const { filters } = this.state;

    return (
      <>
        <Spin spinning={this.props.dashboardStore.isLoading}>
          <div ref={this.printRef} className="dashboard-style">
            <Row gutter={[8, 8]}>
              <Col sm={{ span: 24, offset: 0 }}>
                <div className="header-report">
                  <div>
                    <span>{L("BY_WEEK")}</span> &ensp;
                    <RangePicker
                      clearIcon={false}
                      onChange={(value) =>
                        this.fillterChange("dateFromTo", value)
                      }
                      // disabledDate={disabledDate}
                      // onOpenChange={onOpenChange}
                      // onCalendarChange={(val) => {
                      //   this.setState({ datesDisable: val })
                      // }}
                      format={weekFormat}
                      picker="week"
                      value={[
                        moment(this.state.filters.fromDate),
                        moment(this.state.filters.toDate),
                      ]}
                      placeholder={["From", "To"]}
                    />
                    &ensp;
                    <Select
                      getPopupContainer={(trigger) => trigger.parentNode}
                      filterOption={filterOptions}
                      placeholder={this.L("Project")}
                      allowClear
                      onChange={(value) =>
                        this.fillterChange("projectId", value)
                      }
                      onSearch={debounce((e) => this.getProject(e), 600)}
                      showSearch
                    >
                      {this.renderOptions(this.state.listProject)}
                    </Select>
                    &ensp;
                    <Button
                      className="button-primary"
                      onClick={this.handleSearch}
                    >
                      {this.L("SEARCH")}
                    </Button>
                  </div>
                  <div className="content-right d-flex align-items-center">
                    <Button
                      onClick={() =>
                        tableToExcel(
                          "tblOccUnitByWeek",
                          "_" +
                            moment(filters?.fromDate).format(dateSortFormat) +
                            "_to_" +
                            moment(filters?.toDate).format(dateSortFormat)
                        )
                      }
                      className="button-primary"
                      icon={<ExcelIcon />}
                    ></Button>
                    <Button
                      className="button-primary rounded"
                      disabled={this.props.unitStore.isLoading}
                      onClick={() =>
                        this.props.handleOpenModal(this.state.filters)
                      }
                    >
                      Export Detail
                    </Button>
                  </div>
                </div>
              </Col>
              <Col sm={{ span: 24, offset: 0 }}>
                <div className="table-contr" id="tblOccUnitByWeek">
                  {this.dataAnalysis(
                    this.props.dashboardStore.dashboardUnitOccDetailsWeekData
                  )}
                </div>
              </Col>
            </Row>
          </div>
        </Spin>
      </>
    );
  }
}

export default withRouter(TableUnitOccByWeek);
