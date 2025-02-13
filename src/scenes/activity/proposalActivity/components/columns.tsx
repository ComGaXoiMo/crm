const columns = (actionColumn?) => {
  const data = [actionColumn]
  // (abp.localization.languages || []).forEach((item) => {
  //   data.push({
  //     title: item.name,
  //     dataIndex: item.name,
  //     key: item.name,
  //     align: align.center,
  //     render: (language) => <>{language?.hasValue ? <CheckOutlined /> : ""}</>,
  //   })
  // })

  return data
}

export default columns
