import { Upload, message, Button } from "antd"
import { CameraOutlined } from "@ant-design/icons"
import * as React from "react"
import { inject, observer } from "mobx-react"
import Stores from "../../stores/storeIdentifier"
import SessionStore from "../../stores/sessionStore"
import { getBase64 } from "../../lib/helper"
import { LError } from "../../lib/abpUtility"
import { defaultAvatar, moduleAvatar } from "../../lib/appconst"
import UserStore from "../../stores/administrator/userStore"
import Avatar from "antd/lib/avatar/avatar"

export interface IAvatarUploadProps {
  sessionStore?: SessionStore
  userStore?: UserStore
  parentId?: any
  profilePictureId?: string
  initImageUrl?: string
  module: string
  cbGetProfilePicture?: () => void
}

export interface IAvatarUploadState {
  loading: boolean
  imageUrl?: string
}

@inject(Stores.SessionStore)
@observer
class AvatarUpload2 extends React.Component<
  IAvatarUploadProps,
  IAvatarUploadState
> {
  state = {
    loading: false,
    imageUrl: "",
  }

  async componentDidMount() {
    this.initAvatar()
  }

  async componentDidUpdate(prevProps) {
    if (
      (this.props.module === moduleAvatar.resident ||
        this.props.module === moduleAvatar.staff ||
        this.props.module === moduleAvatar.shopOwner) &&
      this.props.userStore
    ) {
      if (
        prevProps.profilePictureId !== this.props.profilePictureId &&
        this.props.profilePictureId &&
        this.props.profilePictureId.length
      ) {
        await this.props.userStore.getProfilePicture(
          this.props.profilePictureId
        )
        this.setState({
          imageUrl: this.props.userStore.editUserProfilePicture,
          loading: false,
        })
      } else if (
        prevProps.profilePictureId !== this.props.profilePictureId &&
        !this.props.profilePictureId
      ) {
        this.props.userStore.editUserProfilePicture = defaultAvatar
        this.setState({
          imageUrl: "",
          loading: false,
        })
      }
    } else if (
      this.props.module === moduleAvatar.project &&
      this.props.parentId &&
      prevProps.initImageUrl !== this.props.initImageUrl
    ) {
      // Only init again if edit case
      this.setState({
        imageUrl: this.props.initImageUrl,
        loading: false,
      })
    }
  }

  initAvatar = async () => {
    this.setState({ loading: true })
    if (
      this.props.module === moduleAvatar.myProfile &&
      this.props.sessionStore
    ) {
      await this.props.sessionStore.getMyProfilePicture()
      this.setState({
        imageUrl: this.props.sessionStore.profilePicture,
        loading: false,
      })
      return
    } else if (
      this.props.parentId &&
      this.props.profilePictureId &&
      this.props.profilePictureId.length &&
      this.props.userStore &&
      (this.props.module === moduleAvatar.staff ||
        this.props.module === moduleAvatar.resident ||
        this.props.module === moduleAvatar.shopOwner)
    ) {
      await this.props.userStore.getProfilePicture(this.props.profilePictureId)
      this.setState({
        imageUrl: this.props.userStore.editUserProfilePicture,
        loading: false,
      })
      return
    }

    this.setState({ loading: false })
  }

  handleChange = (info) => {
    if (this.props.module === moduleAvatar.project) {
      getBase64(info.file, (imageUrl) => this.setState({ imageUrl }))
    }
  }

  beforeUpload = (file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png"
    if (!isJpgOrPng) {
      message.error(LError("ACCEPTED_FILE_TYPES_{0}", "Image"))
      return false
    }
    const isLt2M = file.size / 1024 / 1024 < 2
    if (!isLt2M) {
      message.error(LError("MAX_FILE_SIZE_{0}", "2Mb"))
      return false
    }

    this.handleUpload(file)
    return false
  }

  handleUpload = async (file) => {
    this.setState({ loading: true })
    if (
      this.props.module === moduleAvatar.myProfile &&
      this.props.sessionStore
    ) {
      const fileInfo = await this.props.sessionStore.uploadMyProfilePicture(
        file
      )
      await this.props.sessionStore.updateMyProfilePicture({
        ...fileInfo,
        x: 0,
        y: 0,
      })
      this.setState({
        loading: false,
        imageUrl: this.props.sessionStore.profilePicture,
      })
      return
    } else if (
      this.props.parentId &&
      this.props.userStore &&
      (this.props.module === moduleAvatar.resident ||
        this.props.module === moduleAvatar.staff ||
        this.props.module === moduleAvatar.shopOwner)
    ) {
      const fileInfo = await this.props.userStore.uploadProfilePicture(file)
      await this.props.userStore.updateProfilePicture({
        ...fileInfo,
        x: 0,
        y: 0,
        userId: this.props.parentId,
      })
      this.setState({
        imageUrl: this.props.userStore.editUserProfilePicture,
        loading: false,
      })
    }

    if (this.props.cbGetProfilePicture) {
      this.props.cbGetProfilePicture()
    }
  }

  render() {
    const { imageUrl } = this.state
    const disableUpload =
      (this.props.module === moduleAvatar.resident ||
        this.props.module === moduleAvatar.staff ||
        this.props.module === moduleAvatar.shopOwner) &&
      !this.props.parentId
    return (
      <>
        <span className="relative-avatar">
          <Avatar src={imageUrl || defaultAvatar || ""} size={120} />
          <span className="absolute-upload">
            <Upload
              disabled={disableUpload}
              name="avatar"
              listType="text"
              showUploadList={false}
              beforeUpload={(file) => this.beforeUpload(file)}
              onChange={this.handleChange}
              style={{ width: "20px", height: "20px" }}
            >
              <Button
                type="primary"
                shape="circle"
                icon={<CameraOutlined />}
              ></Button>
            </Upload>
          </span>
        </span>

        {/* {imageUrl && imageUrl.length > 0 ? L('CHANGE') : ''} */}
        <style>{`
        .relative-avatar{
          position: relative;
        }
        .absolute-upload {
          position: absolute;
          bottom: -10px;
          right: -10px;
        }
        .ant-upload.ant-upload-select-picture-card {
          border-radius: 50% !important;
          border: none !important;
          display: relative
        }
        `}</style>
      </>
    )
  }
}

export default AvatarUpload2
