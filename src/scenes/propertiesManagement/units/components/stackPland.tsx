import * as React from "react"
import { Card, Divider, Empty, Spin } from "antd"
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd"
import { ListManager } from "react-beautiful-dnd-grid"
import { reduce } from "lodash"
import ProjectStore from "@stores/projects/projectStore"
import { formatNumberFloat, renderDate } from "@lib/helper"
import projectService from "@services/projects/projectService"
import "./stacking-plan.less"
import AppDataStore from "@stores/appDataStore"
import UnitStore from "@stores/projects/unitStore"
import { inject } from "mobx-react"
import Stores from "@stores/storeIdentifier"
import { AppComponentListBase } from "@components/AppComponentBase"
import withRouter from "@components/Layout/Router/withRouter"
import ProjectUnitChart from "./ProjectUnitChart"
import AppConsts from "@lib/appconst"
import { L } from "@lib/abpUtility"
const { leaseStatus, unitStatus } = AppConsts
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)

  return result
}

export interface IProjectStackingPlanProps {
  projectId: any;
  projectStore: ProjectStore;
  unitStore: UnitStore;
  appDataStore: AppDataStore;
  loading: any;
  isLoadding: boolean;
  filter: any;
  printRef: any;
  goDetail: (id: any) => void;
}
@inject(Stores.AppDataStore, Stores.ProjectStore, Stores.UnitStore)
class StackPland extends AppComponentListBase<IProjectStackingPlanProps> {
  formRef: any = React.createRef();
  constructor(props) {
    super(props)
  }
  state = {
    floors: [],
    unitGroups: {},
    unitId: undefined,
    selectedUnit: null,
    modalVisible: false,
    statisticFilter: {},
  };

  componentDidMount = async () => {
    await this.fetchData()
  };
  componentDidUpdate = async (prevProps, prevState) => {
    if (prevProps.projectId !== this.props.projectId) {
      await this.fetchData()
    }
    if (prevProps.isLoadding !== this.props.isLoadding) {
      await this.fetchData()
    }
    if (prevProps.filter?.toDate || prevProps.filter?.fromDate) {
      if (
        prevProps.filter?.toDate !== this.props.filter?.toDate ||
        prevProps.filter?.fromDate !== this.props.filter?.fromDate ||
        prevProps.filter?.unitStatusId !== this.props.filter?.unitStatusId
      ) {
        await this.fetchData()
      } else if (prevProps.filter !== this.props.filter) {
        {
          await this.filterDataUnitwithDate()
          await this.countRowToPrint()
        }
      }
    } else if (prevProps.filter !== this.props.filter) {
      {
        await this.filterDataUnit()
        await this.countRowToPrint()
      }
    }
  };
  countRowToPrint = () => {
    let countRow = 2
    const newListFloor: any[] = [...this.state.floors]
    this.state.floors.map((item: any, index) => {
      const units: Array<any> = this.state.unitGroups[`f-${item?.id}`] || []
      countRow = countRow + Math.ceil((1 + units.length) / 13)
      if (countRow > 13) {
        let floorRes: any = this.state.floors[index - 1]
        floorRes = { ...floorRes, isRowBreak: true }
        newListFloor.splice(index - 1, 1, floorRes)
      }
    })
    this.setState({ floors: [...newListFloor] })
  };
  countByUnitStatus = (listUnit) => {
    const unitByStatus = {
      numVacant: 0,
      numLease: 0,
      numShowRoom: 0,
      numRenovation: 0,
      numPMHUse: 0,
      numInHouseUse: 0,
      numOutOfOrder: 0,
      numOutOfServices: 0,
    } as any
    for (const unit of listUnit) {
      if (unit.statusId === unitStatus.vacant) {
        unitByStatus.numVacant++
      }
      if (unit.statusId === unitStatus.leased) {
        unitByStatus.numLease++
      }
      if (unit.statusId === unitStatus.showRoom) {
        unitByStatus.numShowRoom++
      }
      if (unit.statusId === unitStatus.renovation) {
        unitByStatus.numRenovation++
      }
      if (unit.statusId === unitStatus.pmhUse) {
        unitByStatus.numPMHUse++
      }
      if (unit.statusId === unitStatus.inhouseUse) {
        unitByStatus.numInHouseUse++
      }
      if (unit.statusId === unitStatus.outOfOrder) {
        unitByStatus.numOutOfOrder++
      }
      if (unit.statusId === unitStatus.outOfService) {
        unitByStatus.numOutOfServices++
      }
    }

    this.setState({ statisticFilter: unitByStatus })
  };

  showCreateOrUpdateModalOpen = async (id?) => {
    if (!id) {
      await this.props.projectStore.createProjectUnit()
    } else {
      // await this.props.projectStore.getProjectUnit(id);
      this.setState({ unitId: id })
    }

    this.setState({ unitId: id, modalVisible: true }, () => {
      //   setTimeout(() => {
      //     this.formRef.current.setFieldsValue({
      //       ...this.props.projectStore.editProjectUnit,
      //     });
      //   }, 500);
    })
  };

  onDragEnd = async ({ source: src, destination: des }: DropResult) => {
    if (!des || src.droppableId !== des.droppableId) return

    if (src.droppableId === "floor") {
      this.setState(
        (prev: any) => ({ floors: reorder(prev.floors, src.index, des.index) }),
        async () =>
          await projectService.updateFloorOrder(
            this.state.floors
              .filter((item: any) => item.id !== null)
              .map((p: any) => p.id)
          )
      )
      console.log(reorder(this.state.floors, src.index, des.index))
    } else {
      this.setState(
        (prev: any) => ({
          unitGroups: {
            ...prev.unitGroups,
            [src.droppableId]: [
              ...reorder(
                prev.unitGroups[src.droppableId],
                src.index,
                des.index
              ),
            ],
          },
        }),
        () =>
          projectService.updateUnitOrder(
            this.state.unitGroups[src.droppableId].map((p) => p.id)
          )
      )
    }
  };

  sort = (a, b) => a.order - b.order;
  getListStyle = (isDraggingOver) => ({
    background: isDraggingOver ? "#add8e67a" : "#e8f9ff79",
    display: "flex",
    "flex-wrap": "wrap",
  });
  getItemStyle = (isDragging, draggableStyle, index) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: "none",
    margin: `1px 1px 1px 1px`,
    maxWidth: index === 0 ? window.innerWidth : window.innerWidth / 2,
    display: "inline-flex",
    width: "120px",

    // change background colour if dragging
    background: isDragging ? "lightgreen" : "grey",
    border: "1px solid grey",
    // styles we need to apply on draggables
    ...draggableStyle,
  });
  fetchData = async () => {
    await this.props.projectStore.getUnits(
      this.props.projectId,
      this.props.filter
    )
    const floors = [
      ...this.props.projectStore.floors,
      { id: null, floorName: L("NONE_FLOOR") },
    ].sort(this.sort)
    const unitGroups = reduce(
      this.props.projectStore.units,
      (result, unit) => {
        const key = `f-${unit.floorId}`
        if (!result[key]) result[key] = []
        result[key].push(unit)
        result[key].sort(this.sort)
        return result
      },
      {}
    )

    await this.setState({ floors, unitGroups })
    this.countByUnitStatus(this.props.projectStore.units)
    await this.countRowToPrint()
  };
  filterDataUnitwithDate = async () => {
    let listUnit = this.props.projectStore.units?.filter((item) => {
      if (this.props.filter?.productTypeId) {
        return item?.productTypeId === this.props.filter?.productTypeId
      } else {
        return item
      }
    })
    if (this.props.filter?.keyword) {
      listUnit = listUnit.filter((obj) =>
        obj.unitName.includes(this.props.filter?.keyword)
      )
    }
    this.countByUnitStatus(listUnit)
    const unitGroups = reduce(
      listUnit,
      (result, unit) => {
        const key = `f-${unit.floorId}`
        if (!result[key]) result[key] = []
        result[key].push(unit)
        result[key].sort(this.sort)
        return result
      },
      {}
    )
    this.setState({ unitGroups })
  };
  filterDataUnit = async () => {
    let listUnit = this.props.projectStore.units?.filter((item) => {
      if (this.props.filter?.unitStatusId && this.props.filter?.productTypeId) {
        return (
          item?.statusId === this.props.filter?.unitStatusId &&
          item?.productTypeId === this.props.filter?.productTypeId
        )
      } else if (this.props.filter?.productTypeId) {
        return item?.productTypeId === this.props.filter?.productTypeId
      } else if (this.props.filter?.unitStatusId) {
        return item?.statusId === this.props.filter?.unitStatusId
      } else {
        return item
      }
    })
    if (this.props.filter?.keyword) {
      listUnit = listUnit.filter((obj) =>
        obj.unitName.includes(this.props.filter?.keyword)
      )
    }
    this.countByUnitStatus(listUnit)

    const unitGroups = reduce(
      listUnit,
      (result, unit) => {
        const key = `f-${unit.floorId}`
        if (!result[key]) result[key] = []
        result[key].push(unit)
        result[key].sort(this.sort)
        return result
      },
      {}
    )
    this.setState({ unitGroups })
  };

  renderFloors = () =>
    this.state.floors.map((floor: any, inx) => (
      <>
        <Draggable
          key={`f-drag-${floor.id}`}
          draggableId={`f-${floor.id}`}
          index={inx}
        >
          {(dragProvided) => (
            <>
              <div
                className="floor-item mb-2 mr-1"
                ref={dragProvided.innerRef}
                {...dragProvided.draggableProps}
              >
                <div className="floor-name" {...dragProvided.dragHandleProps}>
                  <span className="mb-0">{floor.floorName}</span>
                </div>
                <div className="unit-in-floor" onDragEnd={this.onDragEnd}>
                  {this.renderUnit(floor)}
                </div>
              </div>
            </>
          )}
        </Draggable>

        {floor.isRowBreak && <div className="pagebreak" />}
      </>
    ));
  renderUnit = (floor) => {
    const key = `f-${floor.id}`
    const units: Array<any> = this.state.unitGroups[key] || []

    return (
      <ListManager
        key={`f-drop-${floor.id}`}
        items={units}
        direction="horizontal"
        maxItems={11}
        render={(unit) => (
          <this.ListElement item={unit} goDetail={this.goDetail} />
        )}
        onDragEnd={(sourceIndex, destinationIndex) => {
          if (destinationIndex === sourceIndex) {
            return
          }
          // const list = units;

          this.setState(
            (prev: any) => ({
              unitGroups: {
                ...prev.unitGroups,
                [key]: [
                  ...reorder(
                    prev.unitGroups[key],
                    sourceIndex,
                    destinationIndex
                  ),
                ],
              },
            }),
            () =>
              projectService.updateUnitOrder(
                this.state.unitGroups[key].map((p) => p.id)
              )
          )
        }}
      />
    )
  };

  goDetail = (id?) => {
    this.props.goDetail(id)
  };
  ListElement(unit) {
    return (
      <div className={`unit-item`} onClick={() => unit.goDetail(unit.item.id)}>
        <div
          className="unit-item-info"
          style={{
            zIndex: 1,
            overflowWrap: "anywhere",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <small className="mb-0 text-truncate" style={{ display: "flex" }}>
            <strong> {unit.item.unitName}</strong> ({unit.item.unitType?.name})
            {formatNumberFloat(unit.item.actualSize)}m<small>2</small>
          </small>
          <small className="mb-0 text-truncate">{unit.item.status?.name}</small>
          <br />
          {unit.item.leaseAgreement[0]?.statusId === leaseStatus.LaSigned && (
            <small className="mb-0 text-truncate hightlight-small">
              LA Signed
            </small>
          )}
          {unit.item.inquiryReservation && unit?.item?.statusId === 1 && (
            <div className="text-in-box">
              <small className="mb-0 text-truncate">
                RSVP: {unit.item.inquiryReservation?.creatorUser?.displayName}
              </small>
              <br />
              {unit.item.inquiryReservation?.expiryDate && (
                <small className="mb-0 text-truncate">
                  Expiry: {renderDate(unit.item.inquiryReservation?.expiryDate)}
                </small>
              )}
            </div>
          )}
          {/* {unit.item.statusId === 1 && (
            <small className="mb-0 text-truncate">
              {unit.item.leaseAgreement[0]?.contactName &&
                "Contact: " + unit.item.leaseAgreement[0]?.contactName}
            </small>
          )} */}
          {(unit.item.statusId === unitStatus.leased ||
            unit.item.statusId === unitStatus.pmhUse ||
            unit.item.statusId === unitStatus.inhouseUse) && (
            <>
              {unit.item.leaseAgreement[0]?.commencementDate && (
                <small
                  style={{ display: "flex" }}
                  className="mb-0 text-truncate"
                >
                  C/I:
                  {renderDate(unit.item.leaseAgreement[0]?.commencementDate)}
                </small>
              )}
              {unit.item.leaseAgreement[0]?.expiryDate && (
                <small
                  style={{ display: "flex" }}
                  className="mb-0 text-truncate"
                >
                  C/O: {renderDate(unit.item.leaseAgreement[0]?.expiryDate)}
                </small>
              )}
            </>
          )}
        </div>
        <div
          className="unit-item-bg"
          style={{ backgroundColor: unit?.item?.status?.color }}
        ></div>
      </div>
    )
  }
  render() {
    const { isLoading } = this.props.unitStore

    return (
      <>
        <div ref={this.props.printRef}>
          <Card
            style={{
              marginTop: "10px",
              // width: "fit-content",
              minWidth: "100%",
            }}
            className="stacking-plan"
          >
            <ProjectUnitChart filters={this.state.statisticFilter} />

            <Divider />
            <Spin spinning={this.props.projectStore.isLoading || isLoading}>
              <div style={{ overflow: "auto" }} className="d-flex mt-3">
                <DragDropContext onDragEnd={this.onDragEnd}>
                  <Droppable droppableId="floor" direction="vertical">
                    {(providedFloor) => (
                      <div
                        // style={{ flex: "0 0 100px" }}
                        style={{ width: "100%" }}
                        ref={providedFloor.innerRef}
                        {...providedFloor.droppableProps}
                      >
                        {this.renderFloors()}
                        {providedFloor.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              </div>
              {this.state.floors.length === 0 && <Empty />}
            </Spin>
          </Card>
        </div>
      </>
    )
  }
}

export default withRouter(StackPland)
