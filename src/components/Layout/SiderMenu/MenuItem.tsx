import "./index.less"
import { MenuProps } from "antd"
import { isGranted, LMainMenu } from "@lib/abpUtility"
import { useHistory } from "react-router-dom"
type MenuItem = Required<MenuProps>["items"][number];

const getMenuItem = (
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: "group"
): MenuItem => {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem
}

const GetMenuItems = ({
  name,
  path,
  icon: Icon,
  isGroup,
  children,
  permission,
}) => {
  const history = useHistory()
  if (!isGranted(permission)) return null
  // Keep component is cause of error message from development mode
  let label = name
  if (path) {
    label = (
      <a
        onClick={(e) => {
          e.preventDefault()
          history.push(path)
        }}
        href={path}
      >
        {Icon ? <Icon className="menu-icon" /> : ""}
        <span className="selected-title">{LMainMenu(name)}</span>
      </a>
    )
  } else {
    label = (
      <>
        {/* {Icon ? <Icon className="menu-icon" /> : ''} */}
        <span style={{ fontWeight: 600 }}>{LMainMenu(name)}</span>
      </>
    )
  }

  if (isGroup) {
    const childItems = children
      ? children.map((child: any) => GetMenuItems(child))
      : undefined
    return getMenuItem(
      label,
      path || name,
      Icon ? <Icon className="menu-icon" /> : undefined,
      childItems
      // "group"
    )
  }

  if (children && children.length) {
    const childItems = children
      ? children.map((child: any) => GetMenuItems(child))
      : undefined
    return getMenuItem(
      label,
      path || name,
      Icon ? <Icon className="menu-icon" /> : undefined,
      childItems
    )
  }

  return getMenuItem(label, path || name)
}

export default GetMenuItems
