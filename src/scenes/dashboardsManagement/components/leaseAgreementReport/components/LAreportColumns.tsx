import { L } from "@lib/abpUtility"
import AppConsts from "@lib/appconst"
import { formatNumber, renderDate } from "@lib/helper"
const { align } = AppConsts
const LAreportColumns = () => {
  const data = [
    {
      title: L("REFERENCE_NUMBER"),
      dataIndex: "ReferenceNumber",
      key: "ReferenceNumber",
      width: 170,
      ellipsis: false,
      render: (ReferenceNumber, row) => <> {ReferenceNumber}</>,
    },

    {
      title: L("UNIT_NO"),
      dataIndex: "UnitName",
      key: "UnitName",
      width: 130,
      ellipsis: false,
      render: (UnitName, row) => (
        <>
          {row?.ProjectCode}-{UnitName}
        </>
      ),
    },
    {
      title: L("UNIT_TYPE"),
      dataIndex: "UnitType",
      key: "UnitType",
      width: 80,
      align: align.center,
      ellipsis: false,
      render: (UnitType) => <>{UnitType}</>,
    },

    {
      title: L("TOTAL_AREA_M2"),
      dataIndex: "TotalSize",
      key: "TotalSize",
      align: align.right,
      width: 95,
      ellipsis: false,
      render: (TotalSize) => <>{TotalSize}</>,
    },
    // {
    //   title: L("BALCONY_M2"),
    //   dataIndex: "Balcony",
    //   align: align.right,
    //   key: "Balcony",
    //   width: 80,
    //   ellipsis: false,
    //   render: (Balcony) => <>{Balcony}</>,
    // },
    // {
    //   title: L("ACUTAL_SIZE_M2"),
    //   dataIndex: "ActualSize",
    //   key: "ActualSize",
    //   align: align.right,
    //   width: 100,
    //   ellipsis: false,
    //   render: (ActualSize) => <>{ActualSize}</>,
    // },
    {
      title: L("STATUS"),
      dataIndex: "Status",
      key: "Status",
      width: 150,
      ellipsis: false,
      render: (Status, row) => <> {Status}</>,
    },
    {
      title: L("LEASE_TERM"),
      children: [
        {
          title: L("COMMENCEMENT_DATE"),
          dataIndex: "CommencementDate",
          ellipsis: false,
          key: "CommencementDate",
          align: align.center,
          width: 100,
          render: renderDate,
        },
        {
          title: L("EXPIRY_DATE"),
          dataIndex: "ExpiryDate",
          ellipsis: false,
          key: "ExpiryDate",
          align: align.center,
          width: 100,
          render: renderDate,
        },
      ],
    },
    {
      title: L("EXTENSION"),
      dataIndex: "ExtensionDate",
      ellipsis: false,
      key: "ExtensionDate",
      align: align.center,
      width: 100,
      render: renderDate,
    },
    {
      title: L("TERMINATION"),
      dataIndex: "TerminationDate",
      ellipsis: false,
      key: "TerminationDate",
      align: align.center,
      width: 120,
      render: renderDate,
    },

    {
      title: L("CONTRACT_RENT_INCL_VAT_AND_SC"),
      dataIndex: "RentIncVATAmount",
      key: "RentIncVATAmount",
      align: align.right,
      ellipsis: false,

      width: 130,
      render: (RentIncVATAmount) => <>{formatNumber(RentIncVATAmount)}</>,
    },
    {
      title: L("ALLOWANCE"),
      dataIndex: "AllowanceAmountIncVAT",
      align: align.right,
      ellipsis: false,
      key: "AllowanceAmountIncVAT",
      width: 130,
      render: (allowance, row) => <>{formatNumber(allowance)}</>,
    },

    {
      title: L("SAP_ALLOWANCE"),
      dataIndex: "SAPAllowanceAmount",
      align: align.right,
      ellipsis: false,
      key: "SAPAllowanceAmount",
      width: 130,
      render: (allowance, row) => <>{formatNumber(allowance)}</>,
    },

    {
      title: L("RENT_ONLY"),
      dataIndex: "OnlyRent",
      align: align.right,
      key: "OnlyRent",
      ellipsis: false,
      width: 120,
      render: (OnlyRent) => <>{formatNumber(OnlyRent)}</>,
    },

    {
      title: L("CONTRACT_RENT_INCL_SC_EXCL_VAT"),
      dataIndex: "RentVATAmount",
      key: "RentVATAmount",
      align: align.right,
      ellipsis: false,

      width: 130,
      render: (RentVATAmount) => <>{formatNumber(RentVATAmount ?? 0)}</>,
    },
    {
      title: L("VAT_AMOUNT"),
      dataIndex: "RentVATAmount",
      key: "RentVATAmount",
      align: align.right,
      ellipsis: false,

      width: 130,
      render: (RentVATAmount) => <>{formatNumber(RentVATAmount)}</>,
    },
    {
      title: L("DEPOSIT"),
      dataIndex: "DepositAmount",
      key: "DepositAmount",
      align: align.right,
      ellipsis: false,

      width: 130,
      render: (DepositAmount) => <>{formatNumber(DepositAmount)}</>,
    },
    {
      title: L("TENANT"),
      dataIndex: "Occupier",
      ellipsis: false,
      key: "Occupier",
      width: 130,
      render: (Occupier) => <>{Occupier}</>,
    },
    {
      title: L("NATIONNALITY"),
      dataIndex: "Nationnality",
      ellipsis: false,
      key: "Nationnality",
      width: 170,
      render: (Nationnality) => <>{Nationnality}</>,
    },
    {
      title: L("COMPANY"),
      dataIndex: "Company",
      ellipsis: false,
      key: "Company",
      width: 200,
      render: (Company) => <>{Company}</>,
    },
    {
      title: L("DEALER"),
      dataIndex: "Dealer",
      ellipsis: false,
      key: "Dealer",
      width: 170,
      render: (Dealer) => <>{Dealer}</>,
    },
  ]

  return data
}

export default LAreportColumns
