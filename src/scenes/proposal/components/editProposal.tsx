import * as React from "react"

import { inject, observer } from "mobx-react"
import { AppComponentListBase } from "@components/AppComponentBase"

import { L } from "@lib/abpUtility"
import { Button, Col, Form, Popconfirm, Row } from "antd"
import withRouter from "@components/Layout/Router/withRouter"
import Stores from "@stores/storeIdentifier"
import ProposalStore from "@stores/activity/proposalStore"
import NotificationTemplateStore from "@stores/notificationTemplate/notificationTemplateStore"
import AppConsts from "@lib/appconst"
import SyncfutionRichText from "@components/Inputs/SyncfusionRichText"
const { proposalTemplateType } = AppConsts

export interface IeditProposalProps {
  params: any;
  notificationTemplateStore: NotificationTemplateStore;
  proposalStore: ProposalStore;
  formRef: any;
  data: any;
}

@inject(Stores.NotificationTemplateStore, Stores.ProposalStore)
@observer
class editProposal extends AppComponentListBase<IeditProposalProps> {
  formRef: any = this.props.formRef;
  state = {};
  componentDidMount(): void {
    this.formRef.current?.setFieldsValue({
      templateContent: this.props.data,
    })
  }

  getDefaultTemplate = async () => {
    if (
      this.props.proposalStore.proposalDetail?.proposalType ===
      proposalTemplateType.unit
    ) {
      await this.props.proposalStore.getUnitTemplate(
        this.props.proposalStore.proposalDetail?.id
      )
    } else if (
      this.props.proposalStore.proposalDetail?.proposalType ===
      proposalTemplateType.project
    ) {
      await this.props.proposalStore.getProjectTemplate(
        this.props.proposalStore.proposalDetail?.id
      )
    }
    this.formRef.current?.setFieldsValue({
      templateContent: this.props.proposalStore.template,
    })
  };
  onChangeCKEditer = (value) => {
    console.log(value)
  };

  public render() {
    return (
      <>
        <div className="proposal-info-element">
          <Row gutter={[16, 0]} className="mb-3">
            <Col sm={{ span: 12 }}>
              <strong>{L("EDIT_PROPOSAL")}</strong>
            </Col>
            <Col
              sm={{ span: 12 }}
              style={{ display: "flex", flexDirection: "row-reverse" }}
            >
              <Popconfirm
                title={L("ARE_YOU_SURE_TO_GET_DEFAULT_TEMPLATE")}
                onConfirm={this.getDefaultTemplate}
              >
                <Button
                  type="default"
                  className="button-get-template"
                  loading={this.props.proposalStore.getTemplateLoading}
                >
                  {L("GET_DEFAULT_TEMPLATE")}
                </Button>
              </Popconfirm>
            </Col>
          </Row>

          <Form layout={"vertical"} ref={this.formRef} size="large">
            <Row gutter={[16, 0]}>
              <Col sm={{ span: 24 }}>
                <Form.Item name={"templateContent"}>
                  <SyncfutionRichText
                    proposalUniqueId={
                      this.props.proposalStore.proposalDetail?.uniqueId
                    }
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
      </>
    )
  }
}

export default withRouter(editProposal)
