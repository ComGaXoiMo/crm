import { Steps } from "antd"
import type { ProgressDotRender } from "rc-steps/lib/Steps"
import * as React from "react"
export interface StepProps {
  className?: string
  description?: React.ReactNode
  icon?: React.ReactNode
  onClick?: React.MouseEventHandler<HTMLElement>
  status?: "wait" | "process" | "finish" | "error"
  disabled?: boolean
  title?: React.ReactNode
  subTitle?: React.ReactNode
  style?: React.CSSProperties
}
export interface StepsProps {
  type?: "default" | "navigation"
  className?: string
  current?: number
  direction?: "horizontal" | "vertical"
  iconPrefix?: string
  initial?: number
  labelPlacement?: "horizontal" | "vertical"
  prefixCls?: string
  progressDot?: boolean | ProgressDotRender
  responsive?: boolean
  size?: "default" | "small"
  status?: "wait" | "process" | "finish" | "error"
  style?: React.CSSProperties
  percent?: number
  onChange?: (current: number) => void
  children?: React.ReactNode
  items?: StepProps[]
}
const CustomSteps = (props: React.PropsWithChildren<StepsProps>) => {
  return (
    <>
      <style>{`
    .ant-steps-item-container{
    margin-bottom:41px
    }
    .ant-steps-item-icon {
      display: flex;
    justify-content: space-around;
    align-items: center;
      position: relative;
      z-index: 3;
    width: 48px;
    height:48px;
      }
    .ant-steps-item-tail::after{
      width: 3px !important;
      height: 150% !important;
      background-color: #ffffff !important;
    }
    .ant-steps-vertical > .ant-steps-item > .ant-steps-item-container > .ant-steps-item-tail {
      left: 23px;
    }
    .ant-steps-item-title{
      font-weight: bold;
    }
    .ant-steps-item-finish .ant-steps-item-icon > .ant-steps-icon {
      color: #fff;
      width: 25px;
      border-radius: 32px;
      height: 25px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #FEC20C;
      color: #ffffff;
  }
    `}</style>
      <Steps
        current={props.current}
        direction={props.direction}
        // onChange={props.onChange}
        items={props.items}
        size="default"
      ></Steps>
    </>
  )
}
export default CustomSteps
