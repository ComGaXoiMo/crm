import { BellOutlined } from "@ant-design/icons"
import { Badge, Tabs } from "antd"
import useMergeValue from "use-merge-value"
import React from "react"
import classNames from "classnames"
import NoticeList, { NoticeIconTabProps } from "./NoticeList"

import HeaderDropdown from "../HeaderDropdown"
import styles from "./index.less"
import { BadgeProps } from "antd/lib/badge"

const { TabPane } = Tabs

export interface NoticeIconData {
  avatar?: string | React.ReactNode
  title?: React.ReactNode
  description?: React.ReactNode
  datetime?: React.ReactNode
  extra?: React.ReactNode
  style?: React.CSSProperties
  key?: string | number
  read?: boolean
  icon?: any
}

export interface NoticeIconProps {
  count: number
  bell?: React.ReactNode
  className?: string
  loading?: boolean
  onClear?: (tabName: string, tabKey: string) => void
  onItemClick?: (item: NoticeIconData, tabProps: NoticeIconTabProps) => void
  onViewMore?: (tabProps: NoticeIconTabProps, e: MouseEvent) => void
  onTabChange?: (tabTile: string) => void
  style?: React.CSSProperties
  onPopupVisibleChange?: (visible: boolean) => void
  popupVisible?: boolean
  clearText?: string
  viewMoreText?: string
  clearClose?: boolean
  emptyImage?: string
  children?: React.ReactNode
}

const NoticeIcon: React.FC<NoticeIconProps> & {
  Tab: typeof NoticeList
} = ({
  emptyImage = "https://gw.alipayobjects.com/zos/rmsportal/wAhyIChODzsoKIOBHcBk.svg",
  ...props
}) => {
  const getNotificationBox = (): React.ReactNode => {
    const {
      children,
      onClear,
      onTabChange,
      onItemClick,
      onViewMore,
      clearText,
      viewMoreText,
    } = props
    if (!children) {
      return null
    }

    return (
      <>
        <Tabs
          onChange={onTabChange}
          centered
          className={"antd-tab-cusstom"}
          type="card"
        >
          {React.Children.toArray(children).map((child: any) => {
            if (!child) {
              return ""
            }
            const {
              data,
              title,
              // count,
              tabKey,
              showClear,
              showViewMore,
              emptyText,
              icon,
            } = child.props

            return (
              <TabPane className={"color-tab"} tab={tabKey} key={tabKey}>
                <NoticeList
                  clearText={clearText}
                  viewMoreText={viewMoreText}
                  data={data}
                  onClear={(): void => onClear && onClear(title, tabKey)}
                  onClick={(item): void =>
                    onItemClick && onItemClick(item, child.props)
                  }
                  onViewMore={(event): void =>
                    onViewMore && onViewMore(child.props, event)
                  }
                  showClear={showClear}
                  showViewMore={showViewMore}
                  title={title}
                  emptyText={emptyText}
                  tabKey={tabKey}
                  icon={icon}
                />
              </TabPane>
            )
          })}
        </Tabs>
      </>
    )
  }

  const { count, bell } = props

  const [visible, setVisible] = useMergeValue<boolean>(false, {
    value: props.popupVisible,
    onChange: props.onPopupVisibleChange,
  })

  const noticeButtonClass = classNames("notice-button", { opened: visible })
  const notificationBox = getNotificationBox()
  const NoticeBellIcon = bell || <BellOutlined className={styles.icon} />
  const haveUnreadMessage = count > 0
  const badgeProps = haveUnreadMessage
    ? { color: "cyan" as const, count }
    : ({ dot: false } as BadgeProps)
  const trigger = (
    <span className={noticeButtonClass}>
      <Badge offset={[10, 10]} {...badgeProps}>
        {NoticeBellIcon}
      </Badge>
    </span>
  )
  if (!notificationBox) {
    return trigger
  }

  return (
    <HeaderDropdown
      placement="bottomRight"
      overlay={notificationBox}
      overlayClassName={"notify-popup"}
      trigger={["click"]}
      open={visible}
      onOpenChange={setVisible}
    >
      {trigger}
    </HeaderDropdown>
  )
}

NoticeIcon.Tab = NoticeList as unknown as React.FC<NoticeIconTabProps>

export default NoticeIcon
