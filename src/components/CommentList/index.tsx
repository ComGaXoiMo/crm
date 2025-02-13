import * as React from "react"
import { Col, Row, Button, Input, List, Comment, Avatar, Card } from "antd"
import { inject, observer } from "mobx-react"
import Stores from "../../stores/storeIdentifier"
import AppComponentBase from "../AppComponentBase"
import CommentStore from "../../stores/common/commentStore"
import { L } from "@lib/abpUtility"
import { PaperClipOutlined, SendOutlined } from "@ant-design/icons"
import { moduleIds } from "@lib/appconst"
import SessionStore from "../../stores/sessionStore"
import "./comments.less"
import {
  isNullOrEmpty,
  getFirstLetterAndUpperCase,
  renderDateTime,
} from "@lib/helper"
import UploadButton from "@components/FileUpload/UploadButton"
import { renderDocuments } from "@components/FileUpload/FileDocuments"
import FileImages from "@components/FileUpload/FileImages"
import withRouter from "@components/Layout/Router/withRouter"

const { TextArea } = Input

const Editor = ({
  onChange,
  onSubmit,
  onSelectFile,
  onRemoveFile,
  loading,
  comment,
  files,
}) => (
  <Row gutter={[8, 8]}>
    <Col flex="auto">
      <TextArea rows={1} onChange={onChange} value={comment} size="large" />
      {files &&
        files.length > 0 &&
        renderDocuments(files, null, null, onRemoveFile)}
    </Col>
    <Col flex="100px">
      <UploadButton
        moduleId={moduleIds.comment}
        label={L("ATTACH")}
        acceptedFileTypes={[".jpg", ".jpeg", ".png"]}
        onSelectFile={onSelectFile}
        multiple={true}
        wrapClass="btn-attachment"
        icon={<PaperClipOutlined />}
        maxNumberFile={3}
        maxSize={5}
      />
    </Col>
    <Col flex="100px">
      <Button
        htmlType="submit"
        loading={loading}
        onClick={onSubmit}
        size="middle"
        shape="round"
        type="primary"
        icon={<SendOutlined />}
      >
        {L("BTN_ADD_COMMENT")}
      </Button>
    </Col>
  </Row>
)

export interface ICommentProps {
  moduleId: number;
  parentId: string;
  commentStore: CommentStore;
  sessionStore: SessionStore;
  isPrivate: boolean;
  location?: any;
}

@inject(Stores.CommentStore)
@observer
class CommentList extends AppComponentBase<ICommentProps> {
  state = {
    filters: { maxResultCount: 10, skipCount: 0, isIncludeFile: true },
    loading: false,
    comment: "",
    files: [],
  };

  async componentDidMount() {
    const getAllData = () => {
      const params = {
        conversationUniqueId: this.props.parentId,
        moduleId: this.props.moduleId,
        isIncludeFile: true,
        skipCount: 0,
        maxResultCount: 10,
      }
      this.props.commentStore.getAll(params)
    }
    await getAllData()
  }

  async componentDidUpdate(prevProps) {
    if (prevProps.parentId !== this.props.parentId) {
      await this.handleSearch()
    }
  }

  handleTableChange = (pagination: any) => {
    const { filters } = this.state
    filters.skipCount = (pagination.current - 1) * filters.maxResultCount!
    this.setState({ filters }, async () => {
      await this.handleSearch()
    })
  };

  handleSearch = async () => {
    const { moduleId, parentId } = this.props
    const { filters } = this.state
    let params = {}
    switch (moduleId) {
      case moduleIds.jobRequest: {
        params = {
          ...filters,
          moduleId,
          conversationUniqueId: parentId,
        }
        break
      }

      default: {
        params = {
          ...filters,
          moduleId,
          conversationUniqueId: parentId,
        }
      }
    }

    await this.props.commentStore.getAll(params)
  };

  handleSubmit = () => {
    if (isNullOrEmpty(this.state.comment)) {
      return
    }
    const { moduleId, parentId, isPrivate } = this.props
    const { comment, files } = this.state
    this.setState({ loading: true }, async () => {
      const body = {
        content: comment,
        moduleId,
        conversationUniqueId: parentId,
        isPrivate,
      }
      await this.props.commentStore.create(body, files)
      await this.handleSearch()
      this.setState({ loading: false, comment: "", files: [] })
    })
  };

  handleChange = (e) => {
    this.setState({
      comment: e.target.value,
    })
  };

  onSelectFile = (files) => {
    this.setState({ files: [...this.state.files, ...files] })
  };
  onRemoveFile = (file, index) => {
    const files = this.state.files.filter((item, i) => index !== i)
    this.setState({ files })
  };

  render() {
    const { loading, comment } = this.state
    const {
      commentStore: { comments },
    } = this.props

    return (
      <Row className="wrap-comments">
        <Col sm={{ span: 24, offset: 0 }}>
          <Comment
            className="wrap-comment-editor"
            style={{ padding: 0 }}
            avatar={
              <Avatar
                src={this.props.sessionStore?.profilePicture}
                alt={this.props.sessionStore?.currentLogin.user.name}
                size="large"
              >
                {getFirstLetterAndUpperCase(
                  this.props.sessionStore?.currentLogin.user.name
                )}
              </Avatar>
            }
            content={
              <Editor
                onChange={this.handleChange}
                onSubmit={this.handleSubmit}
                onSelectFile={this.onSelectFile}
                onRemoveFile={this.onRemoveFile}
                loading={loading}
                comment={comment}
                files={this.state.files}
              />
            }
          />
          {comments.items?.length > 0 && (
            <Card className="mt-2 comment-list">
              <List
                dataSource={comments.items}
                itemLayout="horizontal"
                renderItem={(props: any) => (
                  <Row gutter={[8, 8]}>
                    <Col
                      sm={{ span: 24, offset: 0 }}
                      className={
                        this.props.sessionStore.currentLogin.user?.id ===
                        props.user?.id
                          ? "comment-right"
                          : ""
                      }
                    >
                      <Comment
                        author={props.author}
                        avatar={
                          <Avatar
                            src={props.avatar}
                            alt={props.author}
                            size="large"
                          >
                            {getFirstLetterAndUpperCase(props.author)}
                          </Avatar>
                        }
                        content={props.content}
                        datetime={renderDateTime(props.creationTime)}
                      />
                      {props.files && props.files.length > 0 && (
                        <FileImages files={props.files} wrapClass="" />
                      )}
                    </Col>
                  </Row>
                )}
              />
            </Card>
          )}
        </Col>
      </Row>
    )
  }
}

export default withRouter(CommentList)
