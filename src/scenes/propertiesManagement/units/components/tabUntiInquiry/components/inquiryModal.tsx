import { L } from "@lib/abpUtility"
import { Modal } from "antd"
import React from "react"
import { FormInstance } from "antd/lib/form"
import InquiryStore from "@stores/communication/inquiryStore"
import ListingStore from "@stores/projects/listingStore"
import AppDataStore from "@stores/appDataStore"
import UnitStore from "@stores/projects/unitStore"
import { AppComponentListBase } from "@components/AppComponentBase"
import withRouter from "@components/Layout/Router/withRouter"
import { inject, observer } from "mobx-react"
import Stores from "@stores/storeIdentifier"
import General from "./general"

interface Props {
  visible: boolean
  onClose: () => void
  onOk: () => void
  // onOk: (file, packageId) => Promise<any>;
  inquiryStore: InquiryStore
  listingStore: ListingStore
  unitStore: UnitStore
  appDataStore: AppDataStore
}

interface State {
  file?: any
  uploading?: boolean
  subStage: any[]
  isExistsPhone: boolean
  idUser: any
  disabledForm: boolean
  visible: boolean
  listProject: any[]
}
@inject(
  Stores.AppDataStore,
  Stores.InquiryStore,
  Stores.UnitStore,
  Stores.ListingStore
)
@observer
class InquiryModal extends AppComponentListBase<Props, State> {
  formref = React.createRef<FormInstance>()

  constructor(props) {
    super(props)
    this.state = {
      subStage: [],
      isExistsPhone: false,
      idUser: undefined,
      visible: false,
      disabledForm: true,
      listProject: [],
    }
  }
  async componentDidMount() {
    await Promise.all([
      this.props.unitStore.getFacing(),
      this.props.unitStore.getView(),
    ])
  }

  onCreate = async () => {
    const values = await this.formref.current?.validateFields()
    const body = {
      ...values,
    }
    await this.props.inquiryStore.createOrUpdate(body)
    await this.props.onOk
  }
  render(): React.ReactNode {
    const { visible, onClose } = this.props

    return (
      <Modal
        width={"60%"}
        open={visible}
        destroyOnClose
        style={{ top: 20 }}
        title={L("EDIT_INQUIRY")}
        cancelText={L("BTN_CANCEL")}
        onOk={this.onCreate}
        // bodyStyle={{ height: "80vh", overflowY: "scroll" }}
        onCancel={() => {
          onClose()
        }}
        confirmLoading={this.state.uploading}
      >
        <General id={3} />
      </Modal>
    )
  }
}
export default withRouter(InquiryModal)
