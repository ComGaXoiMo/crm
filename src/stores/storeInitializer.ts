import RoleStore from "./administrator/roleStore"
import TenantStore from "./administrator/tenantStore"
import UserStore from "./administrator/userStore"
import SessionStore from "./sessionStore"
import AuthenticationStore from "./authenticationStore"
import AccountStore from "./accountStore"
import LanguageStore from "./administrator/languageStore"

import NewsStore from "./communication/newsStore"
import NewsCategoryStore from "./communication/newsCategoryStore"
import AnnouncementStore from "./communication/announcementStore"

import FileStore from "./common/fileStore"
import AuditLogStore from "./common/auditLogStore"
import CommentStore from "./common/commentStore"

import NotificationTemplateStore from "./notificationTemplate/notificationTemplateStore"
import TermConditionStore from "./administrator/termConditionStore"
import ReminderStore from "@stores/common/reminderStore"

import MasterDataStore from "@stores/master-data/masterDataStore"
import TransportationCostStore from "@stores/master-data/transportationCostStore"
import TruckBrandStore from "@stores/master-data/truckBrandStore"
import TruckTypeStore from "@stores/master-data/truckTypeStore"
import RatingBadgeStore from "@stores/master-data/ratingBadgeStore"
import ProductTypeStore from "@stores/master-data/productTypeStore"

import AppDataStore from "./appDataStore"

import CompanyStore from "./clientManagement/companyStore"
import ContactStore from "./clientManagement/contactStore"

import OpportunityStore from "./opportunity/opportunityStore"
import ActivityStore from "./activity/activityStore"
import TaskStore from "./activity/taskStore"
import DepositStore from "./activity/depositStore"
import ProposalStore from "./activity/proposalStore"
import CallStore from "./activity/callStore"
import MailStore from "./activity/mailStore"
import ReservationStore from "./activity/reservationStore"
import SiteVisitStore from "./activity/siteVisitStore"
import MeetingStore from "./activity/meetingStore"
import CalendarStore from "./activity/calendarStore"

import CampaignStore from "./campaign/campaignStore"
import TargetStore from "./campaign/targetStore"

// import OpportunityCommercialStore from "./opportunity/opportunityCommercialStore";
// import DealContractStore from "./dealContracts/dealContractStore";

import ProjectStore from "./projects/projectStore"
import RequirementStore from "./projects/requirementStore"
import UnitStore from "./projects/unitStore"
import ListingStore from "./projects/listingStore"

import InquiryStore from "./communication/inquiryStore"

import OpportunityCommercialStore from "./opportunity/opportunityCommercialStore"
import OrganizationUnitStore from "./organizationUnit/organizationUnitStore"
import LeaseAgreementStore from "./communication/leaseAgreementStore"
import SettingVatStore from "./settingVatStore"
import DashboardStore from "./dashboardStore"
import BudgetAppStore from "./budgetAppStore"

export default function initializeStores() {
  return {
    authenticationStore: new AuthenticationStore(),
    roleStore: new RoleStore(),
    tenantStore: new TenantStore(),
    userStore: new UserStore(),
    sessionStore: new SessionStore(),
    accountStore: new AccountStore(),
    languageStore: new LanguageStore(),
    appDataStore: new AppDataStore(),

    // News & Event
    newsStore: new NewsStore(),
    newsCategoryStore: new NewsCategoryStore(),
    announcementStore: new AnnouncementStore(),

    auditLogStore: new AuditLogStore(),
    fileStore: new FileStore(),
    commentStore: new CommentStore(),
    notificationTemplateStore: new NotificationTemplateStore(),
    termConditionStore: new TermConditionStore(),
    reminderStore: new ReminderStore(),

    truckBrandStore: new TruckBrandStore(),
    truckTypeStore: new TruckTypeStore(),
    productTypeStore: new ProductTypeStore(),
    ratingBadgeStore: new RatingBadgeStore(),
    transportationCostStore: new TransportationCostStore(),
    masterDataStore: new MasterDataStore(),

    companyStore: new CompanyStore(),
    contactStore: new ContactStore(),

    opportunityStore: new OpportunityStore(),
    // opportunityCommercialStore: new OpportunityCommercialStore(),
    // dealContractStore: new DealContractStore(),

    activityStore: new ActivityStore(),
    taskStore: new TaskStore(),
    depositStore: new DepositStore(),
    proposalStore: new ProposalStore(),
    callStore: new CallStore(),
    mailStore: new MailStore(),
    reservationStore: new ReservationStore(),
    siteVisitStore: new SiteVisitStore(),

    meetingStore: new MeetingStore(),
    calendarStore: new CalendarStore(),

    targetStore: new TargetStore(),
    campaignStore: new CampaignStore(),

    projectStore: new ProjectStore(),
    requirementStore: new RequirementStore(),
    unitStore: new UnitStore(),
    listingStore: new ListingStore(),
    inquiryStore: new InquiryStore(),
    settingVatStore: new SettingVatStore(),
    budgetAppStore: new BudgetAppStore(),

    opportunityCommercialStore: new OpportunityCommercialStore(),
    organizationUnitStore: new OrganizationUnitStore(),
    leaseAgreementStore: new LeaseAgreementStore(),

    dashboardStore: new DashboardStore(),
  }
}
