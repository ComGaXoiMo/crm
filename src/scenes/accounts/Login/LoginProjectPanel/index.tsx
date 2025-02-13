import "./index.less"

import * as React from "react"

import { Col, Input, Row, Card } from "antd"
import { inject, observer } from "mobx-react"
import AccountStore from "../../../../stores/accountStore"
import AuthenticationStore from "../../../../stores/authenticationStore"
import { L } from "../../../../lib/abpUtility"
import SessionStore from "../../../../stores/sessionStore"
import Stores from "../../../../stores/storeIdentifier"
import debounce from "lodash/debounce"
const { Search } = Input

export interface ILoginProps {
  authenticationStore?: AuthenticationStore;
  sessionStore?: SessionStore;
  accountStore?: AccountStore;
  history: any;
  location: any;
}

@inject(Stores.AuthenticationStore, Stores.SessionStore, Stores.AccountStore)
@observer
class LoginProjectPanel extends React.Component<ILoginProps, any> {
  state = {
    projects: [] as any[],
  };
  componentDidMount = async () => {
    if (this.props.sessionStore) {
      await this.props.sessionStore.getOwnProjects({})
      const projects = this.props.sessionStore.ownProjects
      this.setState({ projects })
    }
  };

  filterProject = debounce(async (keyword) => {
    const { projects } = this.state;
    (projects || []).map((project) => {
      project.show =
        !keyword ||
        keyword.length === 0 ||
        (project.normalizedName || "").includes(keyword.toLowerCase())
    })
    this.setState({ projects })
  }, 100);

  handleSelectProject = async (project: any) => {
    if (project) {
      await this.props.sessionStore!.changeProject(project)
      sessionStorage.setItem("rememberMe", "1")
      const { state } = this.props.location

      window.location =
        state && state.from.pathname !== "/" ? state.from.pathname : "/"
    }
  };

  public render() {
    const { projects } = this.state || []

    return (
      <Row className={"panel-project-login"}>
        <Col span={24}>
          <Card bordered={false}>
            <Row>
              <Col span={24}>
                <h3>{L("PROJECT_NAME")}</h3>
              </Col>
              <Col span={24}>
                <Search
                  placeholder={L("SEARCH_PROJECT_BY_NAME")}
                  onChange={(value) => this.filterProject(value.target?.value)}
                  onSearch={(value) => this.filterProject(value)}
                />
              </Col>
            </Row>
          </Card>
        </Col>
        <Col span={24}>
          <Row className={"project-list mt-3"} gutter={16}>
            {(projects || [])
              .filter((item) => item.show)
              .map((project) => {
                return (
                  <Col
                    span={12}
                    className={"project-item pointer"}
                    key={project.id}
                    onClick={() => this.handleSelectProject(project)}
                  >
                    <Card
                      className={"mb-3 text-center"}
                      bordered={false}
                      cover={
                        <img className={"project-logo"} src={project.logoUrl} />
                      }
                    >
                      {project.name}
                    </Card>
                  </Col>
                )
              })}
          </Row>
        </Col>
      </Row>
    )
  }
}

export default LoginProjectPanel
