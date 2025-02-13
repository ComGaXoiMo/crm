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

type Props = {
  title?: string;
  visible: boolean;
  onClose?: any;
  onEdit?: any;
  onSave?: any;
  onCreate?: () => void;
  onShare?: () => void;
  useBottomAction?: boolean;
  loading?: boolean;
  getContainer?: PortalProps["getContainer"];
  isEdit?: boolean;
  updatePermission: boolean;
  isLoading?: boolean;
};

const CustomDrawerProject = (props: React.PropsWithChildren<Props>) => {
  return (
    <Drawer
      title={
        <span style={{ fontWeight: 800, justifyItems: "start" }}>
          {props.title}
        </span>
      }
      placement="right"
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
        overflow: auto;
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
      position:fixed;
       top:46px
      }
      `}</style>
    </Drawer>
  )
}

export default CustomDrawerProject
