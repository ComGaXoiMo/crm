import * as React from 'react'
import {Spin} from 'antd'

const Loading = (props) => {
  if (props.error) {
    return <div>Error! <button onClick={props.retry}>Retry</button></div>
  } else if (props.timedOut) {
    return <div>Taking a long time... <button onClick={props.retry}>Retry</button></div>
  } else if (props.pastDelay) {
    return <div style={{paddingTop: 100, textAlign: 'center'}}>
      <Spin size="large"/>
    </div>
  } else {
    return null
  }
}
export default Loading
