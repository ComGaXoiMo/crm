import { L } from "@lib/abpUtility"
import { Button, Drawer, Row } from "antd"
import React from "react"
import type { PortalProps } from "@rc-component/portal"
import {
  CloseCircleFilled,
  EditOutlined,
  PlusCircleFilled,
  SaveOutlined,
} from "@ant-design/icons"
import "./drawerStyle.less"

type Props = {
  title?: string
  visible: boolean
  onClose?: any
  onEdit?: any
  onSave?: any
  onCreate?: () => void
  onShare?: () => void
  useBottomAction?: boolean
  loading?: boolean
  getContainer?: PortalProps["getContainer"]
  isEdit?: boolean
  updatePermission: boolean
  isLoading?: boolean
}

const CustomDrawerProject = (props: React.PropsWithChildren<Props>) => {
  return (
    <div className="custom-drawer">
      <Drawer
        title={
          <span style={{ fontWeight: 800, justifyItems: "start" }}>
            {props.title}
          </span>
        }
        placement="right"
        rootClassName="custom-drawer"
        closable={false}
        onClose={() => {
          props.onClose()
        }}
        open={props.visible}
        width={window.innerWidth < 600 ? "100%" : "80%"}
        extra={
          <>
            <Row>
              {props.onShare && (
                <Button
                  className="custom-buttom-drawe"
                  onClick={props.onShare}
                  size="middle"
                >
                  {L("BTN_SHARE")}
                </Button>
              )}
              &ensp;
              {props.onCreate && (
                <Button
                  className="custom-buttom-drawe"
                  onClick={props.onCreate}
                  loading={props.isLoading}
                  size="middle"
                >
                  <PlusCircleFilled /> {L("DRAWER_SAVE")}
                </Button>
              )}
              &ensp;
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
   
      `}</style>
      </Drawer>
    </div>
  )
}

export default CustomDrawerProject
