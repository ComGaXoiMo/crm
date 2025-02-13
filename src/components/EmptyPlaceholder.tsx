import React from 'react'
import {L} from "@lib/abpUtility"

export function TableEmptyPlaceholder() {
  return (
    <span style={{width: 300}}>
      <img src="./assets/bg/table-empty.svg" style={{width: '300px'}}/>
      <div>{L('TABLE_EMPTY_PLACEHOLDER')}</div>
    </span>
  )
}
