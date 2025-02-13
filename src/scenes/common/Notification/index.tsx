import * as React from "react"

import { Col, Row, Table, Select, Button, DatePicker } from "antd"

import { AppComponentListBase } from "@components/AppComponentBase"
// import Filter from "../../../components/Filter";
import DataTable from "../../../components/DataTable"
import { L, LNotification } from "@lib/abpUtility"
import AppConst, {
  dateFormat,
  moduleIds,
  notificationTypes,
} from "@lib/appconst"
import notificationService from "../../../services/common/notificationService"
import moment from "moment-timezone/moment-timezone"
// import Icon from "@ant-design/icons";
import {
  CheckOutlined,
  DownloadOutlined,
  EyeOutlined,
} from "@ant-design/icons"
import fileService from "@services/common/fileService"
import { portalLayouts } from "@components/Layout/Router/router.config"
const { align } = AppConst
const notificationStates = [
  {
    name: "All",
    value: " ",
    get label() {
      return L("ALL")
    },
  },
  {
    name: "NOTIFICATION_READ",
    value: "1",
    get label() {
      return L("NOTIFICATION_READ")
    },
  },
  {
    name: "NOTIFICATION_UNREAD",
    value: "0",
    get label() {
      return L("NOTIFICATION_UNREAD")
    },
  },
]
const { RangePicker } = DatePicker

export interface INotificationsProps {
  history: any;
}

export interface INotificationsState {
  maxResultCount: number;
  skipCount: number;
  filters: any;
  totalCount: number;
  loading: boolean;
  notifications: any;
}

class Notifications extends AppComponentListBase<
  INotificationsProps,
  INotificationsState
> {
  state = {
    maxResultCount: 10,
    skipCount: 0,
    totalCount: 0,
    notifications: [],
    loading: false,
    filters: { projectId: undefined, buildingId: undefined, state: "0" },
  };

  get currentPage() {
    return Math.floor(this.state.skipCount / this.state.maxResultCount) + 1
  }

  async componentDidMount() {
    await this.getAll()
  }
  getAll = async () => {
    this.setState({ loading: true })
    const result = await notificationService.getUserNotifications({
      maxResultCount: this.state.maxResultCount,
      skipCount: this.state.skipCount,
      ...this.state.filters,
    })
    console.log(result)
    this.setState({
      loading: false,
      notifications: result.items,
      totalCount: result.totalCount,
    })
  };

  handleTableChange = (pagination: any) => {
    this.setState(
      {
        skipCount: (pagination.current - 1) * this.state.maxResultCount!,
        maxResultCount: pagination.pageSize,
      },
      async () => await this.getAll()
    )
  };

  changeReadState = async (item: any) => {
    if (!item.read) {
      await notificationService.setNotificationAsRead({ id: item.id })
      const notifications = this.state.notifications
      notifications.forEach((notification: any) => {
        if (notification.id === item.id) {
          notification.read = true
        }
      })

      this.setState({ notifications })
    }

    abp.event.trigger("abp.notifications.refresh")
  };

  handleDownloadFile = async (item: any) => {
    if (!item.read) {
      await notificationService.setNotificationAsRead({ id: item.id })
      const notifications = this.state.notifications
      notifications.forEach((notification: any) => {
        if (notification.id === item.id) {
          notification.read = true
        }
      })

      this.setState({ notifications })
    }
    if (
      item.type === notificationTypes.download &&
      item.notification &&
      item.notification.data
    ) {
      let { fileExpiredAt } = item.notification.data.properties
      fileExpiredAt = moment(fileExpiredAt)
      if (fileExpiredAt.isAfter(moment())) {
        await fileService.downloadTempFile(item.notification.data.properties)
      } else {
        abp.notify.info(
          LNotification(
            "DOWNLOAD_TIME_EXPIRED_AT_{0}_MESSAGE",
            fileExpiredAt.format("DD/MM/YYY HH:mm")
          )
        )
      }
    }

    abp.event.trigger("abp.notifications.refresh")
  };

  handleGoToDetail = async (item: any) => {
    if (!item.read) {
      await notificationService.setNotificationAsRead({ id: item.id })
      const notifications = this.state.notifications
      notifications.forEach((notification: any) => {
        if (notification.id === item.id) {
          notification.read = true
        }
      })

      this.setState({ notifications })
    }

    if (
      item.type === notificationTypes.gotoDetail &&
      item.moduleId &&
      item.parentId
    ) {
      let routePath = undefined
      switch (item.moduleId) {
        case moduleIds.jobRequest: {
          routePath = portalLayouts.communicationWorkOrderDetail.path.replace(
            ":id",
            item.parentId
          )
        }
      }

      if (routePath) {
        this.props.history.push(routePath)
      }
    }

    abp.event.trigger("abp.notifications.refresh")
  };

  handleNoticeClear = async (title: string, key: string) => {
    await notificationService.setAllNotificationAsRead()
    const notifications = this.state.notifications
    notifications.forEach((notification: any) => {
      notification.read = true
    })

    this.setState({ notifications })
  };

  handleSearch = (name, value) => {
    const { filters } = this.state
    this.setState(
      { filters: { ...filters, [name]: value }, skipCount: 0 },
      async () => {
        await this.getAll()
      }
    )
  };

  handleDateChange = (value) => {
    const startDate =
      value && value.length ? moment(value[0]).startOf("day").toJSON() : null
    const endDate =
      value && value.length ? moment(value[1]).endOf("day").toJSON() : null
    const { filters } = this.state
    this.setState({ filters: { ...filters, startDate, endDate } }, async () => {
      await this.getAll()
    })
  };

  public render() {
    const { filters, notifications, totalCount, loading } = this.state
    const columns = [
      // {
      //   title: L("NOTIFICATION_TYPE"),
      //   dataIndex: "icon",
      //   key: "icon",
      //   width: 100,
      //   render: (icon) => (
      //     <div>
      //       {icon ? (
      //         <Icon
      //           component={icon}
      //           className="notification-icon"
      //           style={{ opacity: 0.5 }}
      //         />
      //       ) : null}
      //     </div>
      //   ),
      // },
      {
        title: L("NOTIFICATION_NAME"),
        dataIndex: "notificationName",
        key: "notificationName",
        width: 100,
        render: (text, item) => (
          <div>{L(item?.notification?.notificationName)}</div>
        ),
      },
      {
        title: L("NOTIFICATION_MESSAGE"),
        dataIndex: "description",
        key: "description",
        width: 400,
        render: (text, item) => (
          <div className={item.read ? "text-muted" : ""}>{text}</div>
        ),
      },
      {
        title: L("NOTIFICATION_DATE"),
        dataIndex: "datetime",
        key: "datetime",
        width: 200,
        align: align.center,
        render: (text) => <div>{text}</div>,
      },
      {
        title: L("ACTIONS"),
        dataIndex: "operation",
        key: "operation",
        fixed: align.right,
        align: align.right,
        width: 90,
        render: (text: string, item: any) => {
          return (
            <>
              {item.type !== notificationTypes.download && (
                <Button
                  size="small"
                  className="ml-1"
                  shape="circle"
                  disabled={item.read}
                  icon={<CheckOutlined />}
                  onClick={() => this.changeReadState(item)}
                />
              )}
              {item.type === notificationTypes.gotoDetail && (
                <Button
                  size="small"
                  className="ml-1"
                  shape="circle"
                  icon={<EyeOutlined />}
                  onClick={() => this.handleGoToDetail(item)}
                />
              )}
              {item.type === notificationTypes.download && (
                <Button
                  size="large"
                  className="ml-1"
                  shape="circle"
                  icon={<DownloadOutlined />}
                  onClick={() => this.handleDownloadFile(item)}
                />
              )}
            </>
          )
        },
      },
    ]

    return (
      <div className="noti-page">
        <Row gutter={[8, 8]}>
          <Col sm={{ span: 6, offset: 0 }}>
            <RangePicker
              className="full-width"
              onChange={this.handleDateChange}
              format={dateFormat}
            />
          </Col>
          <Col sm={{ span: 4, offset: 0 }}>
            <Select
              getPopupContainer={(trigger) => trigger.parentNode}
              value={filters.state}
              onChange={(value) => this.handleSearch("state", value)}
              style={{ width: "100%" }}
            >
              {this.renderOptions(notificationStates)}
            </Select>
          </Col>
        </Row>
        <DataTable
          title={this.L("NOTIFICATION_LIST")}
          pagination={{
            pageSize: this.state.maxResultCount,
            current: this.currentPage,
            total: totalCount,
            onChange: this.handleTableChange,
          }}
        >
          <Table
            size="middle"
            className="custom-ant-row"
            rowKey={(record) => record.id}
            columns={columns}
            pagination={false}
            loading={loading}
            dataSource={notifications || []}
          />
        </DataTable>
      </div>
    )
  }
}

export default Notifications
