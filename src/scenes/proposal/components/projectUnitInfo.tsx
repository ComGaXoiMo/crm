import * as React from "react"

import { inject, observer } from "mobx-react"
import { AppComponentListBase } from "@components/AppComponentBase"

import { Col, Form, Radio, Row } from "antd"
// import UnitItem from "./unitItem";
import ProjectInfo from "./ProjectItem"
import { PlusCircleFilled } from "@ant-design/icons"
import SelectUnitModal from "./SelectUnitModal"
import SelectProjectModal from "./SelectProjectModal"

export interface IProjectUnitInfoProps {
  id: any;
}

export interface IProjectUnitInfoState {
  showSelectUnit: boolean;
  showSelectProject: boolean;
}

// const unitItems = [
//   {
//     id: 1,

//     moreInfor: {
//       unit: "Unit # 3415",
//       type: "3-bedrooms Apartment",
//       size: "206.08",
//       fully: true,
//       serviced: true,
//       rentalFee: "89,000,000/Month",
//       moveIn: "09/06/2015",
//       rentPeriod: "01 year",
//       desposit:
//         "A deposit amount equivalents to one (01) month’s rent VND 89,000,000 is required to pay to the Lessor after contract is signing but prior to move-in date.",
//     },
//   },
//   {
//     id: 2,

//     moreInfor: {
//       unit: "Unit # 3416",
//       type: "3-bedrooms Apartment",
//       size: "206.08",
//       fully: true,
//       serviced: true,
//       rentalFee: "89,000,000/Month",
//       moveIn: "09/06/2015",
//       rentPeriod: "01 year",
//       desposit:
//         "A deposit amount equivalents to one (01) month’s rent VND 89,000,000 is required to pay to the Lessor after contract is signing but prior to move-in date.",
//     },
//   },
//   {
//     id: 3,

//     moreInfor: {
//       unit: "Unit # 3417",
//       type: "3-bedrooms Apartment",
//       size: "206.08",
//       fully: true,
//       serviced: true,
//       rentalFee: "89,000,000/Month",
//       moveIn: "09/06/2015",
//       rentPeriod: "01 year",
//       desposit:
//         "A deposit amount equivalents to one (01) month’s rent VND 89,000,000 is required to pay to the Lessor after contract is signing but prior to move-in date.",
//     },
//   },
// ];
const projectItems = [
  {
    id: 1,
    moreInfor: {
      name: "THE WATERFRONT",
      own: "PHU MY HUNG DEVELOPMENT CORPORATION",
      manager: "SAVILLS",
      typeProject: "Serviced Apartment",
      size: 1000,
      floor: 4,
      unitCount: 5,
      unit: "Unit # 3415",
      typeUnit: "3-bedrooms Apartment",
      sizeUnit: "206.08",
      fully: true,
      serviced: true,
      rentalFee: "89,000,000/Month",
      moveIn: "09/06/2015",
      rentPeriod: "01 year",
      desposit:
        "A deposit amount equivalents to one (01) month’s rent VND 89,000,000 is required to pay to the Lessor after contract is signing but prior to move-in date.",
    },
  },
  {
    id: 2,
    moreInfor: {
      name: "THE CRESCENT RESIDENCE 5",
      own: "PHU MY HUNG DEVELOPMENT CORPORATION",
      manager: "SAVILLS",
      typeProject: "Serviced Apartment",
      size: 1000,
      floor: 4,
      unitCount: 5,
      unit: "Unit # 3415",
      typeUnit: "3-bedrooms Apartment",
      sizeUnit: "206.08",
      fully: true,
      serviced: true,
      rentalFee: "89,000,000/Month",
      moveIn: "09/06/2015",
      rentPeriod: "01 year",
      desposit:
        "A deposit amount equivalents to one (01) month’s rent VND 89,000,000 is required to pay to the Lessor after contract is signing but prior to move-in date.",
    },
  },
  {
    id: 3,
    moreInfor: {
      name: "THE CRESCENT RESIDENCE 3",
      own: "PHU MY HUNG DEVELOPMENT CORPORATION",
      manager: "SAVILLS",
      typeProject: "Serviced Apartment",
      size: 1000,
      floor: 4,
      unitCount: 5,
      unit: "Unit # 3415",
      typeUnit: "3-bedrooms Apartment",
      sizeUnit: "206.08",
      fully: true,
      serviced: true,
      rentalFee: "89,000,000/Month",
      moveIn: "09/06/2015",
      rentPeriod: "01 year",
      desposit:
        "A deposit amount equivalents to one (01) month’s rent VND 89,000,000 is required to pay to the Lessor after contract is signing but prior to move-in date.",
    },
  },
]
const options = [
  { label: "Project", value: "Project" },
  { label: "Unit", value: "Unit" },
]
@inject()
@observer
class ProjectUnitInfo extends AppComponentListBase<
  IProjectUnitInfoProps,
  IProjectUnitInfoState
> {
  formRef: any = React.createRef();
  state = { showSelectUnit: false, showSelectProject: false };

  public render() {
    return (
      <>
        <div className="proposal-info-element">
          <Form
            layout={"vertical"}
            //  onFinish={this.onSave}
            // validateMessages={validateMessages}
            size="large"
          >
            <Col sm={{ span: 4 }}>
              <Radio.Group
                options={options}
                optionType="button"
                style={{ display: "flex" }}
                size="middle"
              />
            </Col>
            <Row gutter={[16, 0]}>
              {/* <Col span={1}>
                <div>
                  <Row gutter={[0, 8]}>
                    <Col sm={{ span: 24 }}>
                      <Checkbox style={{ opacity: 0 }} />
                    </Col>
                    <Col sm={{ span: 24 }}>
                      <Checkbox style={{ opacity: 0 }} />
                    </Col>
                    <Col sm={{ span: 24 }}>
                      <Checkbox style={{ opacity: 0 }} />
                    </Col>
                    <Col sm={{ span: 24 }}>
                      <Checkbox style={{ opacity: 0 }} />
                    </Col>
                    <Col sm={{ span: 24 }}>
                      <Checkbox style={{ opacity: 0 }} />
                    </Col>
                    <Col sm={{ span: 24 }}>
                      <Checkbox />
                    </Col>
                    <Col sm={{ span: 24 }}>
                      <Checkbox />
                    </Col>
                    <Col sm={{ span: 24 }}>
                      <Checkbox />
                    </Col>
                    <Col sm={{ span: 24 }}>
                      <Checkbox />
                    </Col>
                    <Col sm={{ span: 24 }}>
                      <Checkbox />
                    </Col>
                    <Col sm={{ span: 24 }}>
                      <Checkbox />
                    </Col>
                    <Col sm={{ span: 24 }}>
                      <Checkbox />
                    </Col>
                  </Row>
                </div>
              </Col> */}
              {/* //TODO:Check lai cho nay */}
              {projectItems.map((item, index) => (
                <Col sm={{ span: 6 }} key={index}>
                  <ProjectInfo value={item} />
                </Col>
              ))}
              <Col sm={{ span: 5 }}>
                <div
                  onClick={() => this.setState({ showSelectProject: true })}
                  style={{
                    backgroundColor: "#F2F4F8",
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <div style={{ marginLeft: 30 }}>
                    <div>
                      <PlusCircleFilled
                        style={{ fontSize: "200%", marginLeft: 20 }}
                      />
                    </div>
                    <div>
                      <strong style={{ marginRight: 50 }}> Add More</strong>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </Form>
          <Form
            layout={"vertical"}
            //  onFinish={this.onSave}
            // validateMessages={validateMessages}
            size="large"
          >
            <Row gutter={[16, 0]}>
              <Col span={1}>
                {/* <div>
                  <Row gutter={[0, 8]}>
                    <Col sm={{ span: 24 }}>
                      <Checkbox style={{ opacity: 0 }} />
                    </Col>
                    <Col sm={{ span: 24 }}>
                      <Checkbox style={{ opacity: 0 }} />
                    </Col>
                    <Col sm={{ span: 24 }}>
                      <Checkbox style={{ opacity: 0 }} />
                    </Col>
                    <Col sm={{ span: 24 }}>
                      <Checkbox style={{ opacity: 0 }} />
                    </Col>
                    <Col sm={{ span: 24 }}>
                      <Checkbox />
                    </Col>
                    <Col sm={{ span: 24 }}>
                      <Checkbox />
                    </Col>
                    <Col sm={{ span: 24 }}>
                      <Checkbox />
                    </Col>
                    <Col sm={{ span: 24 }}>
                      <Checkbox />
                    </Col>
                    <Col sm={{ span: 24 }}>
                      <Checkbox />
                    </Col>
                    <Col sm={{ span: 24 }}>
                      <Checkbox />
                    </Col>
                    <Col sm={{ span: 24 }}>
                      <Checkbox />
                    </Col>
                    <Col sm={{ span: 24 }}>
                      <Checkbox />
                    </Col>
                    <Col sm={{ span: 24 }}>
                      <Checkbox />
                    </Col>
                  </Row>
                </div> */}
              </Col>
              {/* {unitItems.map((item, index) => (
                <Col sm={{ span: 6 }} key={index}>
                  <UnitItem value={item} />
                </Col>
              ))}
              <Col sm={{ span: 5 }}>
                <div
                  onClick={() => this.setState({ showSelectUnit: true })}
                  style={{
                    backgroundColor: "#F2F4F8",
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <div style={{ marginLeft: 30 }}>
                    <div>
                      <PlusCircleFilled
                        style={{ fontSize: "200%", marginLeft: 20 }}
                      />
                    </div>
                    <div>
                      <strong style={{ marginRight: 50 }}> Add More</strong>
                    </div>
                  </div>
                </div>
              </Col> */}
            </Row>
          </Form>
        </div>

        <SelectUnitModal
          dataSend={null}
          visible={this.state.showSelectUnit}
          onClose={() => this.setState({ showSelectUnit: false })}
          onOk={() => this.setState({ showSelectUnit: false })}
        />
        <SelectProjectModal
          dataSend={null}
          visible={this.state.showSelectProject}
          onClose={() => this.setState({ showSelectProject: false })}
          onOk={() => this.setState({ showSelectProject: false })}
        />
      </>
    )
  }
}

export default ProjectUnitInfo
