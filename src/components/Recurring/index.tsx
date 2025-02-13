import { L } from "@lib/abpUtility"
import AppConsts, { dateFormat } from "@lib/appconst"
import {
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Select,
  Switch,
  TimePicker,
} from "antd"
import { inject, observer } from "mobx-react"
import React, { useState } from "react"

const { formVerticalLayout } = AppConsts
interface Props {
  recrurringStatus: boolean;
  resetFrequencyRepeat: () => void;
}

const Recurring = inject()(
  observer((props: Props) => {
    const [onRecurring, setOnRecurring] = useState(props.recrurringStatus)
    const [repeatOption, setRepeatOption] = useState("WEEKLY")
    const changeRecurring = (keyword, checked) => {
      setOnRecurring(checked)
    }
    return (
      <>
        <Row gutter={16}>
          <Col md={{ span: 12 }} sm={{ span: 24 }}>
            <Form.Item
              label={L("RECURRING")}
              {...formVerticalLayout}
              valuePropName="checked"
              name="recurringChecked"
            >
              <Switch
                onChange={(checked) => changeRecurring("isActive", checked)}
              />
            </Form.Item>
          </Col>
        </Row>
        {onRecurring && (
          <>
            <Row gutter={[16, 8]} className="reminder-box">
              <Col sm={{ span: 12 }}>
                <Form.Item
                  label={L("RECURRING_NAME")}
                  {...formVerticalLayout}
                  className="w-100"
                  name="recurringName"
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col sm={{ span: 12 }}>
                <Form.Item
                  label={L("RECURRING_FREQUENCY")}
                  {...formVerticalLayout}
                  className="w-100"
                  name="recurringFrequency"
                >
                  <Select
                    getPopupContainer={(trigger) => trigger.parentNode}
                    className="full-width"
                    filterOption={false}
                    onChange={(value) => {
                      props.resetFrequencyRepeat()
                      setRepeatOption((value || "").toString())
                    }}
                  >
                    <Select.Option key={"WEEK"} value="WEEKLY">
                      {L("WEEKLY")}
                    </Select.Option>
                    <Select.Option key={"MONTH"} value="MONTHLY">
                      {L("MONTHLY")}
                    </Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col sm={{ span: 24 }}>
                <Form.Item
                  label={L("RECURRING_FREQUENCY_REPEAT")}
                  {...formVerticalLayout}
                  className="w-100"
                  name="recurringFrequencyRepeat"
                >
                  <Select
                    showArrow
                    showSearch
                    allowClear
                    className="full-width"
                    filterOption={false}
                    mode="multiple"
                  >
                    {repeatOption === "WEEKLY" &&
                      [...Array(7).keys()].map((item, index) => (
                        <Select.Option key={item} value={item.toString()}>
                          {item === 0 && L("SUNDAY")}
                          {item === 1 && L("MONDAY")}
                          {item === 2 && L("TUESDAY")}
                          {item === 3 && L("WEDNESDAY")}
                          {item === 4 && L("THURSDAY")}
                          {item === 5 && L("FRIDAY")}
                          {item === 6 && L("SATURDAY")}
                        </Select.Option>
                      ))}
                    {repeatOption === "MONTHLY" &&
                      [...Array(31).keys()].map((item, index) => (
                        <Select.Option key={item} value={(item + 1).toString()}>
                          {item + 1}
                        </Select.Option>
                      ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col sm={{ span: 12 }}>
                <Form.Item
                  label={L("RECURRING_TIME_FROM")}
                  {...formVerticalLayout}
                  className="w-100"
                  name="recurringStartTime"
                >
                  <TimePicker format="HH:mm" className="w-100" />
                </Form.Item>
              </Col>
              <Col sm={{ span: 12 }}>
                <Form.Item
                  label={L("RECURRING_TIME_TO")}
                  {...formVerticalLayout}
                  className="w-100"
                  name="recurringEndTime"
                >
                  <TimePicker format="HH:mm" className="w-100" />
                </Form.Item>
              </Col>
              <Col sm={{ span: 24 }}>
                <Form.Item
                  label={L("RECURRING_FROM_DAY")}
                  {...formVerticalLayout}
                  className="w-100"
                  name="recurringDate"
                >
                  <DatePicker.RangePicker
                    className="w-100"
                    format={dateFormat}
                  />
                </Form.Item>
              </Col>
            </Row>
          </>
        )}
      </>
    )
  })
)

export default Recurring
