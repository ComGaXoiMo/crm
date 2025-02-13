import { L } from "@lib/abpUtility";
import { Button, Col, Modal, Table } from "antd";
import React from "react";
import withRouter from "@components/Layout/Router/withRouter";
import { AppComponentListBase } from "@components/AppComponentBase";
import Stores from "@stores/storeIdentifier";
import { inject, observer } from "mobx-react";
import UserStore from "@stores/administrator/userStore";
import _ from "lodash";
import { handleDownloadPdf, tableToExcel } from "@lib/helper";
import AppConsts from "@lib/appconst";
const { align } = AppConsts;
interface Props {
  visible: boolean;
  userStore: UserStore;
  dataTable: any;
  onClose: () => void;
  isDropped: boolean;
}

interface State {
  skipCount: number;
}

@inject(Stores.UserStore)
@observer
class TableOccDetail extends AppComponentListBase<Props, State> {
  formRef: any = React.createRef();
  printRef: any = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      skipCount: 0,
    };
  }
  async componentDidUpdate(prevProps) {
    if (prevProps.visible !== this.props.visible) {
      if (this.props.visible) {
        console.log();
      }
    }
  }
  handleDownloadPdfs = async (type) => {
    const element = this.printRef.current;
    await handleDownloadPdf(element, type, "CommissionDashboard.pdf");
  };
  render(): React.ReactNode {
    const { visible, dataTable, onClose } = this.props;

    const columns = [
      {
        title: L("PROJECT_NAME"),
        dataIndex: "ProjectName",
        key: "ProjectName",
        width: 250,
        ellipsis: false,
        render: (ProjectName: any) => ProjectName,
      },
      {
        title: L("STATUS_NAME"),
        dataIndex: "StatusName",
        key: "StatusName",
        width: 150,
        ellipsis: false,
        render: (StatusName: any) => StatusName,
      },
      {
        title: L("DATE_RANGE"),
        dataIndex: "DateRange",
        key: "DateRange",
        width: 170,
        ellipsis: false,
        align: align.center,
        render: this.renderDate,
      },
      {
        title: L("UNIT_NAME"),
        dataIndex: "UnitName",
        key: "UnitName",
        width: 170,
        ellipsis: false,
        align: align.center,
        render: (UnitName: any) => UnitName,
      },
    ];

    return (
      this.props.visible && (
        <Modal
          title={L("DATA_REVIEW")}
          visible={visible}
          maskClosable={false}
          width={"66%"}
          // onOk={() => tableToExcel("tblDepositReport")}
          // onCancel={onClose}
          closable={false}
          footer={
            <div className="flex justify-content-center">
              <div>
                <Button onClick={onClose}>{L("BTN_CANCEL")}</Button>
                <Button
                  className="button-primary"
                  onClick={() => tableToExcel("excel")}
                >
                  {L("BTN_EXPORT_EXCEL")}
                </Button>
              </div>
            </div>
          }
        >
          <Col sm={{ span: 24 }} id="excel">
            <Table
              size="middle"
              className="custom-ant-row"
              rowKey={(record, index) => `${record?.id}${index}`}
              columns={columns}
              pagination={false}
              dataSource={dataTable ?? []}
              scroll={{ x: 100, y: 500, scrollToFirstRowOnChange: true }}
            />
          </Col>
        </Modal>
      )
    );
  }
}
export default withRouter(TableOccDetail);
