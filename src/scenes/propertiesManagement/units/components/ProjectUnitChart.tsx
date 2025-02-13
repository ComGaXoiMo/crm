import { Card, Col, Row } from "antd"
import { L } from "@lib/abpUtility"
import { useState } from "react"
import { useEffect } from "react"
import appDataService from "@services/appDataService"
import AppConsts from "@lib/appconst"
const { unitStatus } = AppConsts

export default function ProjectUnitChart({ filters }) {
  const [dataStatus, setDataStatus] = useState([] as any)
  // const [totalStatus, setTotalStatus] = useState(0);
  useEffect(() => {
    getUnitStatus()
  }, [])
  useEffect(() => {
    refreshChart()
  }, [filters])
  const getUnitStatus = async () => {
    const unitStatuss = await appDataService.GetListUnitStatus({})
    setDataStatus(unitStatuss)
  }
  const refreshChart = async () => {
    const newDataList = [] as any
    for (const data of dataStatus) {
      if (data.id === unitStatus.vacant) {
        newDataList.push({ ...data, count: filters?.numVacant })
      }
      if (data.id === unitStatus.leased) {
        newDataList.push({ ...data, count: filters?.numLease })
      }
      if (data.id === unitStatus.showRoom) {
        newDataList.push({ ...data, count: filters?.numShowRoom })
      }
      if (data.id === unitStatus.renovation) {
        newDataList.push({ ...data, count: filters?.numRenovation })
      }
      if (data.id === unitStatus.pmhUse) {
        newDataList.push({ ...data, count: filters?.numPMHUse })
      }
      if (data.id === unitStatus.inhouseUse) {
        newDataList.push({ ...data, count: filters?.numInHouseUse })
      }
      if (data.id === unitStatus.outOfOrder) {
        newDataList.push({ ...data, count: filters?.numOutOfOrder })
      }
      if (data.id === unitStatus.outOfService) {
        newDataList.push({ ...data, count: filters?.numOutOfServices })
      }
    }
    await setDataStatus(newDataList)
  }

  return (
    <Row
      gutter={[16, 0]}
      className="full-width"
      style={{ padding: "10px 0px" }}
    >
      <Card style={{ borderRadius: 6 }} bordered={false} className="full-width">
        <h4>
          {L("PROJECT")} | <span className="text-muted">{L("STATUS")}</span>
        </h4>
        <Row gutter={[8, 8]} className="full-width ml-3">
          {dataStatus.map((item, index) => (
            <Col sm={6} key={index}>
              <Row gutter={[8, 0]}>
                <Col
                  sm={2}
                  style={{
                    backgroundColor: item.color ? item.color : "#ffffff",
                    borderRadius: 6,
                  }}
                />
                <Col sm={22}>
                  {item.name} {item?.count > 0 && `(${item?.count})`}
                </Col>
              </Row>
            </Col>
          ))}
        </Row>
      </Card>
      <br />
    </Row>
  )
}
