import { L } from "@lib/abpUtility"
import { Button, Drawer, Row } from "antd"
import React, { ReactNode, useEffect, useState } from "react"
import type { PortalProps } from "@rc-component/portal"
import {
  EditOutlined,
  LeftCircleFilled,
  LockFilled,
  PlusCircleFilled,
  SaveOutlined,
  UnlockFilled,
} from "@ant-design/icons"
import withRouter from "@components/Layout/Router/withRouter"
import _ from "lodash"
import "./drawerStyle.less"
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
  const [drawerWidth, setDrawerWidth] = useState(0)
  useEffect(() => {
    const updateWidth = () => {
      setDrawerWidth(window.innerWidth - 200)
    }

    updateWidth() // Cập nhật lần đầu
    window.addEventListener("resize", updateWidth) // Lắng nghe sự kiện resize

    return () => window.removeEventListener("resize", updateWidth) // Cleanup
  }, [])

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
      rootClassName="custom-drawer"
      className={props.isEdit ? "drawer-box-shadow" : ""}
      onClose={() => {
        // setIsEdit(false),
        props.onClose()
      }}
      open={props.visible}
      // getContainer={false}
      width={drawerWidth < 600 ? "100%" : props.widthDrawer ?? drawerWidth}
      extra={
        <>
          <Row>
            <Button
              className="custom-buttom-drawe"
              onClick={() => props.onClose()}
              size="middle"
              icon={<LeftCircleFilled />}
            ></Button>
            &ensp;
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
                    className={"custom-buttom-save"}
                    loading={props.isLoading}
                    onClick={() => {
                      props.isEdit ? props.onSave() : props.onEdit()
                    }}
                    size="middle"
                    icon={props.isEdit ? <SaveOutlined /> : <EditOutlined />}
                  ></Button>
                )}
              </>
            )}
          </Row>
        </>
      }
      getContainer={props.getContainer}
    >
      {props.children}

      <style>{`
     
      `}</style>
    </Drawer>
  )
}

export default withRouter(CustomDrawer)
