import React from "react"
import { Button, Col, Form, Input, Row, Select } from "antd"
import { renderOptions } from "@lib/helper"
import { DeleteOutlined } from "@ant-design/icons"
import { L } from "@lib/abpUtility"
interface FormSelectProps {
  name?: any
  filterlists?: any
}

const FormListCodition: React.FC<FormSelectProps> = ({ name, filterlists }) => {
  return (
    <Row gutter={[8, 0]}>
      <Form.List name={name}>
        {(fields, { add, remove }) => (
          <>
            {fields.map((field) => (
              <Col sm={{ span: 24 }} key={field.key}>
                <Row gutter={[8, 0]}>
                  <Col sm={{ span: 23 }}>
                    <Row gutter={[8, 0]}>
                      <Col sm={{ span: 8 }}>
                        <Form.Item name={[field.name, "field"]}>
                          <Select
                            placeholder={"Select field"}
                            showSearch
                            className="full-width"
                          >
                            {renderOptions(filterlists)}
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col sm={{ span: 8 }}>
                        <Form.Item name={[field.name, "condition"]}>
                          <Select
                            placeholder={"Select condition"}
                            showSearch
                            className="full-width"
                          >
                            {renderOptions([
                              { id: 1, label: "equals" },
                              { id: 2, label: "not equal to" },
                            ])}
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col sm={{ span: 8 }}>
                        <Form.Item name={[field.name, "value"]}>
                          <Input placeholder={L("Input value")} />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Col>
                  <Col sm={{ span: 1 }}>
                    <Button
                      color="danger"
                      variant="text"
                      icon={<DeleteOutlined />}
                      onClick={() => remove(field.name)}
                    ></Button>
                  </Col>
                </Row>
              </Col>
            ))}
            <Col sm={{ span: 24 }}>
              <Button color="default" variant="filled" onClick={() => add()}>
                <span>✚ Add condition</span>
              </Button>
            </Col>
          </>
        )}
      </Form.List>
    </Row>
  )
}

export default FormListCodition
