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
import ActivityFilter from "./components/matchingFilter"
import MatchingBoardItem from "./components/matchingItem"
import CreateMatchingModal from "./components/createModal"

export interface IMatchingProps {
  projectStore: ProjectStore
  unitStore: UnitStore
  params: any
  appDataStore: AppDataStore
  fileStore: FileStore
}
export interface IMatchingState {
  modalVisible: boolean
}
const fakedata = [
  {
    data: {
      name: "CĂN HỘ MASTERI THẢO ĐIỀN, QUẬN 2",
      area: "40m2",
      price: "10,000,000đ ",
      note: "3 phòng ngủ 3 phòng tắm Ban công hướng: Nam Tình trạng nội thất: Đầy đủ nội thất",
      link: "https://123.com",
      type: 2,
    },
  },

  {
    data: {
      name: "CĂN HỘ T&T DINH CONG",
      area: "58m2",
      price: "17,000,000đ ",
      note: "Hướng căn hộ: Đông Bắc, Ban công hướng: Tây Nam Tình trạng nội thất: Đầy đủ nội thất Pháp lý: Sổ hồng",
      link: "https://123.com",
      type: 2,
    },
  },
]

@inject(Stores.ProjectStore, Stores.UnitStore, Stores.AppDataStore)
@observer
class Matching extends AppComponentListBase<IMatchingProps, IMatchingState> {
  formRef: any = React.createRef()
  formRefProjectAddress: any = React.createRef()

  constructor(props: IMatchingProps) {
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
                    <MatchingBoardItem data={item.data} />
                  </Col>
                ))}
              </Row>
            </Card>
          </Col>
        </Row>
        <CreateMatchingModal
          visible={this.state.modalVisible}
          onClose={this.toggleModal}
          onOk={this.handleOk}
        />
      </>
    )
  }
}

export default withRouter(Matching)
