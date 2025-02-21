import { useState } from "react"
import { Select, Input, Button, Dropdown, Space, MenuProps } from "antd"
import {
  MoreOutlined,
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  CopyOutlined,
  ShareAltOutlined,
  DeleteOutlined,
  FilterOutlined,
} from "@ant-design/icons"
import "./tableFilterSelect.less"
import ConfigFilterModal from "./configFilterModal"
const { Option, OptGroup } = Select

const TableFilterSelect = ({ lists, recentLists }) => {
  const [selected, setSelected] = useState(lists[0]?.title || "")
  const [modalVisble, setModalVisble] = useState(false)
  const openModal = () => {
    setModalVisble(true)
  }

  // Menu tùy chọn
  const items: MenuProps["items"] = [
    {
      key: "edit",
      icon: <EditOutlined />,
      label: "Edit",
      onClick: () => openModal(),
    },
    {
      key: "duplicate",
      icon: <CopyOutlined />,
      label: "Duplicate",
    },
    {
      key: "share",
      icon: <ShareAltOutlined />,
      label: "Share",
    },
    {
      key: "delete",
      icon: <DeleteOutlined />,
      label: "Delete",
      danger: true,
    },
  ]

  return (
    <>
      <Select
        value={selected}
        popupClassName="table-popup-select"
        className="table-filer-select"
        listHeight={400}
        prefix={<FilterOutlined />}
        onChange={(value) => {
          const selectedItem = [...lists, ...recentLists].find(
            (item) => item.id === value
          )
          setSelected(selectedItem ? selectedItem.title : "")
        }}
        dropdownRender={(menu) => (
          <div>
            {/* Header */}
            <div className="flex space-between pd-1">
              <strong>Select filter</strong>
              <Button
                type="primary"
                size="small"
                shape="circle"
                onClick={() => openModal()}
                icon={<PlusOutlined />}
              />
            </div>

            {/* Search */}
            <div className="ft-search">
              <Input
                placeholder="Search for lists"
                prefix={<SearchOutlined />}
              />
            </div>

            {/* Danh sách */}
            <div className="menu-dropdown">{menu}</div>
          </div>
        )}
      >
        {/* Recent Lists */}
        <OptGroup label="Recent Lists">
          {recentLists.map((item, index) => (
            <Option key={`recent-${item.title}`} value={item.id}>
              <Space className="flex space-between w-100">
                <span>
                  <span style={{ marginRight: 8 }}>🕘</span>
                  {item.title}
                </span>
                <Dropdown menu={{ items }} trigger={["click"]}>
                  <MoreOutlined onClick={(e) => e.stopPropagation()} />
                </Dropdown>
              </Space>
            </Option>
          ))}
        </OptGroup>

        {/* My Lists */}
        <OptGroup label="List all">
          {lists.map((item) => (
            <Option key={`default-${item.title}`} value={item.id}>
              <Space className="flex space-between w-100">
                <span>
                  <span style={{ marginRight: 8 }}>👥</span>
                  {item.title}
                </span>
                <Dropdown menu={{ items }} trigger={["click"]}>
                  <MoreOutlined onClick={(e) => e.stopPropagation()} />
                </Dropdown>
              </Space>
            </Option>
          ))}
        </OptGroup>
      </Select>
      <ConfigFilterModal
        visible={modalVisble}
        onClose={() => setModalVisble(false)}
      />
    </>
  )
}

export default TableFilterSelect
