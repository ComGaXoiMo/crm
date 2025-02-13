import * as React from "react"
import Row from "antd/lib/grid/row"
import Col from "antd/lib/grid/col"
import "./ActionFooter.less"

export interface IActionFooterProps {
  show?: boolean
  title?: string
  showHeader?: boolean
  handleRefresh?: () => void
  actionGroups?: () => void
  children?: any
}

const ActionFooter: React.FunctionComponent<IActionFooterProps> = ({
  show,
  title,
  showHeader = true,
  handleRefresh,
  actionGroups,
  ...props
}) => {
  const wrapClass = `action-footer animate__animated ${
    show ? "animate__fadeInUp" : "animate__fadeOutDown"
  }`
  return (
    <div className={wrapClass}>
      <Row>
        <Col className="wrap-action-footer">{props.children}</Col>
      </Row>
    </div>
  )
}

export default ActionFooter
