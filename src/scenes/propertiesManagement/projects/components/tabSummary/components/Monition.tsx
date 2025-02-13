import * as React from "react"

import { inject, observer } from "mobx-react"
import { AppComponentListBase } from "@components/AppComponentBase"
import Stores from "@stores/storeIdentifier"
import ProjectStore from "@stores/projects/projectStore"
// import FileUploadWrap from "@components/FileUpload/FileUploadCRM";
import FileStore from "@stores/common/fileStore"
import {
  ClockCircleFilled,
  MailOutlined,
  // EllipsisOutlined,
} from "@ant-design/icons/lib/icons"

export interface IMonitionProps {
  projectStore?: ProjectStore;
  fileStore?: FileStore;
  data: any;
}

@inject(Stores.ProjectStore)
@observer
class Monition extends AppComponentListBase<IMonitionProps> {
  formRef: any = React.createRef();
  state = {};

  public render() {
    return (
      <>
        <div className="monition-container">
          <div
            className="line-color"
            style={{ backgroundColor: this.props.data?.color }}
          />
          <div className="monition-detail">
            <div
              className="icon-monition-detail"
              style={{ backgroundColor: this.props.data?.color }}
            >
              {this.props.data?.type === 1 && <ClockCircleFilled />}
              {this.props.data?.type === 2 && <MailOutlined />}
            </div>
            {/* <div style={{position:'relative' ,top: 0, right: 0 }}>
              <MoreOutlined />
            </div> */}
            <div className="monition-content">
              <strong>{this.props.data?.title}</strong>
              {this.props.data?.link && (
                <label>
                  Atack Link: <strong>{this.props.data?.link}</strong>
                </label>
              )}
              {this.props.data?.file && (
                <label>
                  Atack file: <strong>{this.props.data?.file}</strong>
                </label>
              )}
            </div>
          </div>
        </div>
      </>
    )
  }
}

export default Monition
