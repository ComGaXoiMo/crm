import { Card } from 'antd'
import React from 'react'

const WrapPageFixed = ({ renderActions, ...props }) => {
  return (
    <>
      <div style={{ paddingBottom: '60px', height: '100%', overflowY: 'scroll' }}>{props.children}</div>
      <div
        className="wrap-page-footer-fixed text-right"
        // style={{ width: props.closeCollapse ? 'calc(100vw - 100px)' : undefined }}
      >
        <Card bordered={false}>{renderActions()}</Card>
      </div>
    </>
  )
}

export default WrapPageFixed
