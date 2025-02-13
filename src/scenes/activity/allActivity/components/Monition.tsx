import * as React from "react"
import { inject, observer } from "mobx-react"
import { AppComponentListBase } from "@components/AppComponentBase"
import Stores from "@stores/storeIdentifier"
import AppConsts from "@lib/appconst"
import CallBoardItem from "@scenes/activity/callActivity/components/callBoardItem"
import MailBoardItem from "@scenes/activity/mailActivity/components/mailBoardItem"
import ProposalBoardItem from "@scenes/activity/proposalActivity/components/proposalBoardItem"
import SiteVisitBoardItem from "@scenes/activity/sitevisitActivity/components/siteVisitBoardItem"
import BookingBoardItem from "@scenes/activity/reservationActivity/components/bookingBoardItem"
const { activityType } = AppConsts

export interface IMonitionProps {
  data: any
}
@inject(Stores.ProjectStore)
@observer
class Monition extends AppComponentListBase<IMonitionProps, any> {
  formRef: any = React.createRef()
  state = {}

  public render() {
    return (
      <>
        {this.props.data?.type === activityType.call && (
          <CallBoardItem data={this.props.data.inquiryCall} />
        )}
        {this.props.data?.type === activityType.mail && (
          <MailBoardItem data={this.props.data.inquiryMail} />
        )}
        {this.props.data?.type === activityType.proposal && (
          <ProposalBoardItem data={this.props.data.inquiryProposal} />
        )}
        {this.props.data?.type === activityType.sitevisit && (
          <SiteVisitBoardItem data={this.props.data.inquirySiteVisit} />
        )}
        {this.props.data?.type === activityType.reservation && (
          <BookingBoardItem data={this.props.data.inquiryReservation} />
        )}
      </>
    )
  }
}

export default Monition
