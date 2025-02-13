import * as React from "react"

import { inject, observer } from "mobx-react"
import { AppComponentListBase } from "@components/AppComponentBase"
import { Card, Col, Row } from "antd"
import Stores from "@stores/storeIdentifier"
import ProjectStore from "@stores/projects/projectStore"
// import FileUploadWrap from "@components/FileUpload/FileUploadCRM";
import FileStore from "@stores/common/fileStore"
import UnitStore from "@stores/projects/unitStore"
import withRouter from "@components/Layout/Router/withRouter"
import AppDataStore from "@stores/appDataStore"
import ActivityFilter from "./components/offerFilter"
import OfferBoardItem from "./components/offerBoardItem"
import CreateOfferModal from "./components/createOfferModal"

export interface IOfferProps {
  projectStore: ProjectStore
  unitStore: UnitStore
  params: any
  appDataStore: AppDataStore
  fileStore: FileStore
}
export interface IOfferState {
  modalVisible: boolean
}
const fakedata = [
  {
    data: {
      title: "Update",
      link: "https://mail.google.com/mail/u/0/#inbox/FMfcgzGrbvJjGgpnmqmxSFx",
      file: "",
      color: "#F2994A",
      type: 1,
    },
  },
]

@inject(Stores.ProjectStore, Stores.UnitStore, Stores.AppDataStore)
@observer
class Offer extends AppComponentListBase<IOfferProps, IOfferState> {
  formRef: any = React.createRef()
  formRefProjectAddress: any = React.createRef()

  constructor(props: IOfferProps) {
    super(props)
    this.state = {
      modalVisible: false,
    }
  }

  async componentDidMount() {
    await Promise.all([])
  }

  toggleModal = () =>
    this.setState((prevState) => ({ modalVisible: !prevState.modalVisible }))

  handleOk = async () => {
    this.toggleModal()
  }
  public render() {
    return (
      <>
        <ActivityFilter
          onCreate={() => {
            this.toggleModal()
          }}
        />

        <Row gutter={[8, 0]}>
          <Col sm={{ span: 24 }}>
            <Card className="card-detail-modal">
              <Row>
                {fakedata.map((item, index) => (
                  <Col key={index} sm={{ span: 24 }}>
                    <OfferBoardItem />
                  </Col>
                ))}
              </Row>
            </Card>
          </Col>
        </Row>
        <CreateOfferModal
          visible={this.state.modalVisible}
          onClose={this.toggleModal}
          onOk={this.handleOk}
        />
      </>
    )
  }
}

export default withRouter(Offer)
