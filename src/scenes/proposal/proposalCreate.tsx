import * as React from "react"

import { inject, observer } from "mobx-react"
import { AppComponentListBase } from "@components/AppComponentBase"

import { L, LNotification } from "@lib/abpUtility"
import { Button, Col, Modal, Row } from "antd"
import withRouter from "@components/Layout/Router/withRouter"
import CustomSteps from "@components/Steps/CustomSteps"
import EditProposal from "./components/editProposal"
import { portalLayouts } from "@components/Layout/Router/router.config"
import ProposalStore from "@stores/activity/proposalStore"
import Stores from "@stores/storeIdentifier"
const confirm = Modal.confirm
export interface IProposalCreateProps {
  history: any;
  params: any;
  proposalStore: ProposalStore;
}

export interface IProposalCreateState {
  current: number;
  data: any;
}
const items = [
  {
    title: L("PROPOSAL_DETAIL"),
  },
  {
    title: L("PROPOSAL_REVIEW"),
  },
]
@inject(Stores.ProposalStore)
@observer
class ProposalCreate extends AppComponentListBase<
  IProposalCreateProps,
  IProposalCreateState
> {
  formRef: any = React.createRef();
  state = {
    current: 0,
    data: "",
  };
  async componentDidMount() {
    this.getDetail(this.props.params?.id)
  }
  next = () => {
    this.setState({ current: this.state.current + 1 })
    const datacontent = this.formRef.current.getFieldsValue()
    this.setState({ data: datacontent.templateContent })
    console.log(datacontent)
  };
  prev = () => {
    this.setState({ current: this.state.current - 1 })
  };
  getDetail = async (id?) => {
    if (!id) {
      this.props.proposalStore.createProposal()
      console.log("error")
    } else {
      await this.props.proposalStore.get(id)
      await this.formRef.current?.setFieldsValue({
        templateContent:
          this.props.proposalStore.proposalDetail?.contentAfter ??
          this.props.proposalStore.proposalDetail?.contentBefore,
      })
    }
  };
  onSave = () => {
    confirm({
      title: LNotification("DO_YOU_WANT_TO_SAVE_PROPOSAL"),
      okText: L("BTN_YES"),
      cancelText: L("BTN_NO"),
      onOk: async () => {
        this.saveProposal()
      },
    })
  };
  saveProposal = () => {
    this.props.proposalStore
      .updateTemplate({
        id: this.props.params?.id,
        content: this.state.data,
      })
      .finally(() =>
        this.props.history.push({
          pathname: portalLayouts.proposals.path.replace(
            ":id",
            this.props.params?.id
          ),
        })
      )
  };
  onChange = (value: number) => {
    this.setState({ current: value })
  };
  public render() {
    return (
      <>
        {/* <div className="proposal-header modul-lable-name">
          <strong>{L("PROPOSAL_CREATE")}</strong>
        </div> */}

        <div className="proposal-create-body">
          <Row className="h-100" gutter={[0, 0]}>
            <Col
              style={{ overflowY: "scroll" }}
              className="h-100"
              sm={{ span: 20 }}
            >
              {this.state.current === 0 && (
                <EditProposal formRef={this.formRef} data={this.state.data} />
              )}
              {this.state.current === 1 && (
                <>
                  <div
                    className="pd-3"
                    // contentEditable="true"
                    dangerouslySetInnerHTML={{ __html: this.state.data }}
                  ></div>
                </>
              )}
            </Col>
            <Col
              style={{
                backgroundColor: "#EAB001",
                padding: "20px",
                borderRadius: "0px 24px 24px 0px",
                display: "block",
              }}
              sm={{ span: 4 }}
            >
              <CustomSteps
                current={this.state.current}
                onChange={this.onChange}
                direction="vertical"
                items={items}
              />

              <div style={{ position: "absolute", right: 20, bottom: 20 }}>
                {this.state.current < 1 && (
                  <Button
                    className="button-secondary"
                    onClick={() => this.next()}
                  >
                    {L("NEXT")}
                  </Button>
                )}
                {this.state.current >= 1 && (
                  <Button
                    className="button-secondary"
                    onClick={() => this.prev()}
                  >
                    {L("BACK")}
                  </Button>
                )}
                {this.state.current >= 1 && (
                  <Button
                    className="button-secondary"
                    onClick={() => this.onSave()}
                  >
                    {L("SAVE")}
                  </Button>
                )}
              </div>
            </Col>
          </Row>
        </div>
      </>
    )
  }
}

export default withRouter(ProposalCreate)
