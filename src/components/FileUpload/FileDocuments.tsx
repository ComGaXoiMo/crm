import {
  DeleteOutlined,
  DownloadOutlined,
  EyeOutlined,
} from "@ant-design/icons"
import Button from "antd/lib/button"
import React from "react"
import { mimeTypeToImagePath } from "@lib/appconst"
import { IconCustom } from "@components/Icon"

export const renderDocuments = (
  files,
  handlePreview,
  handleDownload,
  handleRemove
) => {
  return (
    <div className="ant-upload-list ant-upload-list-text">
      {(files || []).map((file, index) => {
        const iconPath = mimeTypeToImagePath[file.mimeType]
        return (
          <div key={index}>
            <span>
              <div className="ant-upload-list-item ant-upload-list-item-done ant-upload-list-item-list-type-text">
                <div className="ant-upload-list-item-info">
                  <span>
                    {iconPath ? (
                      <IconCustom
                        iconPath={iconPath}
                        style={{ top: "0", height: "22px" }}
                      />
                    ) : (
                      ""
                    )}
                    <a
                      className="ant-upload-list-item-name ant-upload-list-item-name-icon-count-1"
                      href={file.downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {file.name}
                    </a>
                    <span className="ant-upload-list-item-card-actions ">
                      {file.hasPreview && handlePreview && (
                        <Button
                          size="small"
                          shape="circle"
                          type="text"
                          onClick={() => handlePreview(file)}
                          style={{ color: "rgba(255,255,255,.85)" }}
                        >
                          <EyeOutlined />
                        </Button>
                      )}
                      {handleDownload && (
                        <Button
                          size="small"
                          shape="circle"
                          type="text"
                          onClick={() => handleDownload(file)}
                          style={{ color: "rgba(255,255,255,.85)" }}
                        >
                          <DownloadOutlined />
                        </Button>
                      )}
                      {handleRemove && (
                        <Button
                          size="small"
                          shape="circle"
                          type="text"
                          onClick={() => handleRemove(file, index)}
                          style={{ color: "rgba(255,255,255,.85)" }}
                        >
                          <DeleteOutlined />
                        </Button>
                      )}
                    </span>
                  </span>
                </div>
              </div>
            </span>
          </div>
        )
      })}
    </div>
  )
}
