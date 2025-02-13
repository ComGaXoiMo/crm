import { formatCurrency } from "@lib/helper"
import { Card, Col, Row } from "antd"

type Props = {
  data: any[];
};

const OverviewBar = (props: Props) => {
  return (
    <div style={{ padding: 5 }}>
      <Row gutter={[8, 8]}>
        {props.data.map((item, index) => {
          return (
            <Col key={index} span={8}>
              <Card
                style={{ backgroundColor: "red" }}
                className="custom-card-overview"
                bordered={false}
                key={index}
              >
                {/* <div className="fs-6 text-wrap fw-bold">{item.name}</div> */}
                <div style={{ fontSize: 14, fontWeight: 600 }}>{item.name}</div>
                <div className="d-flex flex-wrap justify-content-between align-items-center w-100 px-3">
                  {(item.datas || []).map((item, index) => (
                    <div key={index}>
                      <div style={{ fontSize: 12 }}>
                        {formatCurrency(item.count)}
                      </div>
                      <div style={{ fontSize: 12 }}>{item.name}</div>
                    </div>
                  ))}
                </div>
              </Card>
            </Col>
          )
        })}
      </Row>
    </div>
  )
}

export default OverviewBar
