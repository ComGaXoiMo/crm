import { L } from "@lib/abpUtility"
import { Button, Col, Modal, Row } from "antd"
import React from "react"
import { FormInstance } from "antd/lib/form"
import { portalLayouts } from "@components/Layout/Router/router.config"
import { AppComponentListBase } from "@components/AppComponentBase"
import withRouter from "@components/Layout/Router/withRouter"

interface Props {
  id: any;
  history: any;
  visible: boolean;
  onClose: () => void;
  onOk: (file, packageId) => Promise<any>;
}

interface State {
  file?: any;
  uploading?: boolean;
}

class GoDetailModal extends AppComponentListBase<Props, State> {
  form = React.createRef<FormInstance>();

  constructor(props) {
    super(props)
    this.state = {}
  }

  gotoEdit = async (id?) => {
    await this.props.history.push(
      portalLayouts.proposalEditTemplate.path.replace(":id", id)
    )
  };
  gotoView = async (id?) => {
    this.props.history.push({
      pathname: portalLayouts.proposals.path.replace(":id", id),
    })
  };
  render(): React.ReactNode {
    const { visible, onClose } = this.props

    return (
      <Modal
        open={visible}
        destroyOnClose
        okButtonProps={{ style: { display: "none" } }}
        cancelButtonProps={{ style: { display: "none" } }}
        title={L("GO_TO_DETAIL_PORPOSAL")}
        onCancel={() => {
          onClose()
        }}
        confirmLoading={this.state.uploading}
      >
        <Row gutter={[16, 8]}>
          <Col sm={{ span: 12 }}>
            <Button
              onClick={() => this.gotoEdit(this.props.id)}
              className="w-100"
              style={{ height: 120, borderRadius: "12px" }}
            >
              <strong>{L("EDIT_PROPOSAL")}</strong>
            </Button>
          </Col>
          <Col sm={{ span: 12 }}>
            <Button
              className="w-100"
              onClick={() => this.gotoView(this.props.id)}
              style={{ height: 120, borderRadius: "12px" }}
            >
              <strong>{L("VIEW_PROPOSAL")}</strong>
            </Button>
          </Col>
        </Row>
      </Modal>
    )
  }
}
export default withRouter(GoDetailModal)
