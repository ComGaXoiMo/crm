import React, { useState } from "react"
import { DeleteOutlined } from "@ant-design/icons"
import { Button, Modal, Popconfirm } from "antd"
import { L } from "@lib/abpUtility"

interface ImageProps {
  files?: any[]
  wrapClass: string
  handleRemoveFile?: (value: any, index) => void
}

const FileImages: React.FC<ImageProps> = ({
  files,
  handleRemoveFile,
  wrapClass = "mt-3",
}) => {
  const [previewVisible, setPreviewVisible] = useState(false)
  const [previewImage, setPreviewImage] = useState("")

  return (
    <div className={"ant-upload-picture-card-wrapper ant-row " + wrapClass}>
      {(files || []).map((file, index) => {
        return (
          <div
            key={index}
            className="ant-upload-list ant-upload-list-picture-card ant-col"
          >
            <div className="ant-upload-list-picture-card-container">
              <div
                className="ant-upload-list-item ant-upload-list-item-done ant-upload-list-item-list-type-picture-card pointer"
                onClick={() => {
                  setPreviewImage(file.url)
                  setPreviewVisible(true)
                }}
              >
                <div className="ant-upload-list-item-info">
                  <span className="ant-upload-list-item-thumbnail">
                    <img
                      className="ant-upload-list-item-image"
                      src={file.url}
                    />
                  </span>
                  <span className="ant-upload-list-item-name ant-upload-list-item-name-icon-count-1">
                    {file.name}
                  </span>
                </div>
                {handleRemoveFile && (
                  <span className="ant-upload-list-item-actions">
                    <Popconfirm
                      title={L("ARE_YOU_SURE_YOU_WANT_TO_DELETE")}
                      onConfirm={() => handleRemoveFile(file, index)}
                    >
                      <Button
                        size="small"
                        shape="circle"
                        type="text"
                        style={{ color: "rgba(255,255,255,.85)" }}
                      >
                        <DeleteOutlined />
                      </Button>
                    </Popconfirm>
                  </span>
                )}
              </div>
            </div>
          </div>
        )
      })}

      <Modal
        visible={previewVisible}
        footer={null}
        maskClosable={false}
        onCancel={() => setPreviewVisible(false)}
      >
        <img alt="example" style={{ width: "100%" }} src={previewImage} />
      </Modal>
    </div>
  )
}

export default FileImages
