import { L } from "@lib/abpUtility"
import { Button, Drawer, Row } from "antd"
import React, { ReactNode } from "react"
import type { PortalProps } from "@rc-component/portal"
import {
  CloseCircleFilled,
  EditOutlined,
  LockFilled,
  PlusCircleFilled,
  SaveOutlined,
  UnlockFilled,
} from "@ant-design/icons"
import withRouter from "@components/Layout/Router/withRouter"
import _ from "lodash"

type Props = {
  title?: any
  visible: boolean
  onClose?: any
  onEdit?: any
  onSave?: any
  onGenerate?: any
  onRenewLa?: any
  onAmendment?: any
  markConfirm?: any
  markDropped?: any
  onTerminate?: any
  onCreate?: () => void
  onShare?: () => void
  useBottomAction?: boolean
  extraBottomContent?: ReactNode
  loading?: boolean
  getContainer?: PortalProps["getContainer"]
  isEdit?: boolean
  updatePermission: boolean
  isLoading?: boolean
  widthDrawer?: string
  lock?: boolean
  lockPermission?: boolean
  onLockAction?: () => void
}

const CustomDrawer = (props: React.PropsWithChildren<Props>) => {
  // const [isEdit, setIsEdit] = React.useState<any>(false);

  return (
    <Drawer
      title={
        <span style={{ fontWeight: 800, justifyItems: "start" }}>
          {props.title}
        </span>
      }
      push={false}
      placement="right"
      maskClosable={!props.isEdit}
      closable={false}
      className={props.isEdit ? "drawer-box-shadow" : ""}
      onClose={() => {
        // setIsEdit(false),
        props.onClose()
      }}
      open={props.visible}
      width={window.innerWidth < 600 ? "100%" : props.widthDrawer ?? "70%"}
      extra={
        <>
          <Row>
            {props.lockPermission && props.onLockAction && (
              <>
                <Button
                  className="custom-buttom-drawe"
                  onClick={props.onLockAction}
                  size="middle"
                >
                  {props.lock ? (
                    <LockFilled style={{ color: "#c01a15" }} />
                  ) : (
                    <UnlockFilled />
                  )}
                </Button>
                &ensp;
              </>
            )}
            {props.updatePermission && props.onShare && (
              <>
                <Button
                  className="custom-buttom-drawe"
                  onClick={props.onShare}
                  size="middle"
                >
                  {L("BTN_TRANFER")}
                </Button>
                &ensp;
              </>
            )}
            {props.updatePermission && props.markDropped && (
              <>
                <Button
                  className="custom-buttom-drawe"
                  onClick={props.markDropped}
                  size="middle"
                >
                  {L("BTN_MARK_DROPPED_LA")}
                </Button>
                &ensp;
              </>
            )}
            {props.updatePermission && props.markConfirm && (
              <>
                <Button
                  className="custom-buttom-drawe"
                  onClick={props.markConfirm}
                  size="middle"
                >
                  {L("BTN_MARK_CONFIRM_LA")}
                </Button>
                &ensp;
              </>
            )}
            {props.updatePermission && props.onTerminate && (
              <>
                <Button
                  className="custom-buttom-drawe"
                  onClick={props.onTerminate}
                  size="middle"
                >
                  {L("BTN_TERMINATE_LA")}
                </Button>
                &ensp;
              </>
            )}
            {props.updatePermission && props.onRenewLa && (
              <>
                <Button
                  className="custom-buttom-drawe"
                  onClick={props.onRenewLa}
                  size="middle"
                >
                  {L("BTN_RE_NEW_LA")}
                </Button>
                &ensp;
              </>
            )}
            {props.updatePermission && props.onAmendment && (
              <>
                <Button
                  className="custom-buttom-drawe"
                  onClick={props.onAmendment}
                  size="middle"
                >
                  {L("BTN_AMENDMENT_LA")}
                </Button>
                &ensp;
              </>
            )}
            {props.updatePermission && props.onGenerate && (
              <>
                <Button
                  className="custom-buttom-drawe"
                  onClick={props.onGenerate}
                  size="middle"
                >
                  {L("BTN_GENERATE")}
                </Button>
                &ensp;
              </>
            )}
            {props.onCreate && (
              <Button
                className="custom-buttom-drawe"
                onClick={props.onCreate}
                size="middle"
                loading={props.isLoading}
              >
                <PlusCircleFilled /> {L("DRAWER_SAVE")}
              </Button>
            )}
            {props.onEdit && (
              <>
                {props.updatePermission && (
                  <Button
                    className="custom-buttom-drawe"
                    loading={props.isLoading}
                    onClick={() => {
                      props.isEdit ? props.onSave() : props.onEdit()
                    }}
                    size="middle"
                  >
                    {props.isEdit ? (
                      <>
                        <SaveOutlined /> {L("SAVE")}
                      </>
                    ) : (
                      <>
                        <EditOutlined />
                        {L("EDIT")}
                      </>
                    )}
                  </Button>
                )}
              </>
            )}
            &ensp;
            <Button
              className="custom-buttom-drawe"
              onClick={() => props.onClose()}
              size="middle"
            >
              <CloseCircleFilled />
              {L("BTN_CLOSE")}
            </Button>
          </Row>
        </>
      }
      getContainer={props.getContainer}
    >
      {props.children}

      <style>{`
      .ant-drawer-content {
        position: relative !important;
      }
      .ant-drawer-content {
        background: #f2f4f8;
      }
      .ant-drawer-header {
        background-color: white;
        border-bottom-width: 0px;
      }
      .ant-drawer-body {
        padding: 0px 0px 0px 0px !important;
    
      }
      .ant-tabs{
        height: 100%;
        overflow: hidden;
      }
      .ant-tabs-nav{
        margin: 0 !important;
        border-bottom: 2px solid #f2f4f8;
      }
      .ant-tabs-content-holder{
        padding-top: 15px;
        overflow: auto;    margin-bottom: 10px;
      }
      .bottom-action-style {
        position: absolute  !important;
        width: 100%;
        bottom: 4px;
        right: 0;
        height: 60px;
        background-color: #FAF8EE
      }
      .ant-drawer-right > .ant-drawer-content-wrapper {
      //   min-height: calc(100vh - 180px);
      // max-height: calc(100vh - 180px);
      // transform: translateX(0) !important;
  
      position:fixed;
       top:46px
      }
      
      `}</style>
    </Drawer>
  )
}

export default withRouter(CustomDrawer)
