import React from "react"
import "./statistic-item.less"
import { Card } from "antd"
import { hexToRGB, inputCurrencyFormatter } from "@lib/helper"
import Row from "antd/lib/grid/row"
import Col from "antd/lib/grid/col"

type StatisticItemProps = {
  description?: string;
  value: string | number;
  iconUrl?: string;
  color: string;
  statisticDetailItems?: any[];
};

export function StatisticItem({
  description,
  value,
  iconUrl,
  color,
  statisticDetailItems,
}: StatisticItemProps) {
  const backgroundColor = `rgba(${hexToRGB(color)}, .2)`
  const descriptionColor = `rgba(${hexToRGB(color)}, .7)`
  return (
    <Card
      bordered={false}
      bodyStyle={{ backgroundColor, color }}
      className="statistic-item"
    >
      <Row gutter={16}>
        <Col flex="auto" style={{ display: "flex" }}>
          {iconUrl && iconUrl.length > 0 && (
            <span className="btn-icon">
              <img src={iconUrl} />
            </span>
          )}
          <span>
            <h2 className="mb-0" style={{ color }}>
              {inputCurrencyFormatter(value) || 0}
            </h2>
            <div
              className="statistic-item-description"
              style={{ color: descriptionColor }}
            >
              {description}
            </div>
          </span>
        </Col>
        {statisticDetailItems && (
          <Col flex="auto" className="align-self-center small">
            {statisticDetailItems.map((item, index) => (
              <div className="d-flex justify-content-between" key={index}>
                <div className="mr-3">{item.label}</div>
                <div>{inputCurrencyFormatter(item.value) || 0}</div>
              </div>
            ))}
          </Col>
        )}
      </Row>
    </Card>
  )
}
