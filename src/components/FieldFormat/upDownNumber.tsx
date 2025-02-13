import * as React from 'react'
import {UpOutlined, DownOutlined} from '@ant-design/icons'

const UpDownNumber = ({ params: [budget, actual, type] }: { params: any[] }) => {
  if (budget === actual) {
    return null
  }

  let wrapClass = 'mr-2 ' + (budget > actual ? 'text-success' : (budget < actual ? 'text-danger' : ''))
  if (type === 'Expense') {
    if (budget <= actual) {
      return <UpOutlined className={wrapClass}/>
    } else {
      return <DownOutlined className={wrapClass}/>
    }
  }

  wrapClass = 'mr-2 ' + (budget < actual ? 'text-success' : (budget > actual ? 'text-danger' : ''))
  if (budget <= actual) {
    return <UpOutlined className={wrapClass}/>
  } else {
    return <DownOutlined className={wrapClass}/>
  }
}

export default UpDownNumber
