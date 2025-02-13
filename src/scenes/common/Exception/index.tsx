import "./index.less"

import * as React from "react"

import { Button, Image, Row } from "antd"
// import { Avatar, Col, Row } from 'antd'

import { withRouter } from "react-router-dom"
import error401 from "../../../assets/images/401.png"
import error404 from "../../../assets/images/404.png"
import error500 from "../../../assets/images/500.png"
import underMaintenance from "../../../assets/images/under-maintenance.png"
import { L } from "@lib/abpUtility"
// import { L, LError } from '@lib/abpUtility'
const exceptions = {
  undefined: {
    errorCode: "UNHANDLED_ERROR",
    errorImg: error404,
    errorTitle: "UNHANDLED_ERROR_TITLE",
  },
  "404": {
    errorCode: "404",
    errorImg: error404,
    errorTitle: "404_ERROR_TITLE",
  },
  "401": {
    errorCode: "401",
    errorImg: error401,
    errorTitle: "401_ERROR_TITLE",
  },
  "500": {
    errorCode: "500",
    errorImg: error500,
    errorTitle: "500_ERROR_TITLE",
  },
}

class Exception extends React.Component<any, any> {
  state = { exception: {} as any }

  componentDidMount(): void {
    const params = new URLSearchParams(this.props.location?.search)
    const type = params.get("type") || "undefined"
    this.setState({ exception: exceptions[type] || {} })
  }

  handleBack = () => {
    if (this.props.fromErrorBoundary) {
      window.location.reload()
    } else {
      this.props.history.push("/")
    }
  }

  public render() {
    // const { exception } = this.state
    // const { errorDetail } = this.props

    return (
      <Row style={{ marginTop: 120 }} gutter={[16, 16]}>
        <div className="w-100 d-flex flex-column align-items-center">
          <div className="ml-3">
            <Image preview={false} width="328px" src={underMaintenance} />
          </div>
          <div style={{ fontWeight: 700, fontSize: 36 }}>Under Maintenance</div>
          <div>
            The page you are looking for is currently under maintenance and will
            be come back soon
          </div>
          <Button type="primary" onClick={this.handleBack}>
            {L("BACK")}
          </Button>
        </div>
        {/* <Col
        //   xs={{ span: 24 }}
        //   sm={{ span: 24 }}
        //   md={{ span: 10 }}
        //   lg={{ span: 10 }}
        //   xl={{ span: 10 }}
        //   xxl={{ span: 10 }}
        // >
        //   <div className="ml-3 full-width">
        //     <Avatar shape="square" className={'error-avatar'} src={exception.errorImg} />
        //   </div>
        // </Col>
        // <Col flex="1" className="align-self-center justify-content-center">
        //   <Col
        //     xs={{ span: 24, offset: 0 }}
        //     sm={{ span: 24, offset: 0 }}
        //     md={{ span: 24, offset: 0 }}
        //     lg={{ span: 24, offset: 0 }}
        //     xl={{ span: 24, offset: 0 }}
        //     xxl={{ span: 24, offset: 0 }}
        //   >
        //     <h1 className={'error-code'}>{LError(exception.errorCode)}</h1>
        //   </Col>
        //   <Col
        //     xs={{ span: 24, offset: 0 }}
        //     sm={{ span: 24, offset: 0 }}
        //     md={{ span: 24, offset: 0 }}
        //     lg={{ span: 24, offset: 0 }}
        //     xl={{ span: 24, offset: 0 }}
        //     xxl={{ span: 24, offset: 0 }}
        //   >
        //     {exception.errorTitle && <h5 className={'error-title'}> {LError(exception.errorTitle)}</h5>}
        //     {exception.errorDescription && <h5 className={'error-description'}> {LError(exception.errorDescription)}</h5>}
        //     {errorDetail && errorDetail.length > 0 && <details style={{ whiteSpace: 'pre-wrap' }}>
        //       {this.props.error && this.props.error.toString()}
        //       <br/>
        //       {errorDetail}
        //     </details>
        //     }
        //   </Col>
        //   <Col sm={{ span: 24, offset: 0 }}>
        //     <p className="mt-3">
        //       {L('ERROR_PAGE_GO_BACK_MESSAGE') }
        //       <b className="ml-1 pointer" onClick={this.handleBack}>{L('PREVIOUS_PAGE')}</b>
        //     </p>
        //   </Col>
        // </Col> */}
      </Row>
    )
  }
}

export default withRouter(Exception)
