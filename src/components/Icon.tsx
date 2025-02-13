import React, { CSSProperties } from "react"

export const FilterIcon = (props) => <img src="/assets/icons/filter.svg" />
export const ExcelIcon = (props) => <img src="/assets/icons/excel.svg" />
export const PdfIcon = (props) => <img src="/assets/icons/pdf.svg" />
export const WordIcon = (props) => <img src="/assets/icons/word.svg" />

export const PowerPointIcon = (props) => (
  <img src="assets/icons/power-point.svg" />
)
export const ImageIcon = (props) => (
  <img src="/assets/icons/image-file.svg" className={props?.imageClass} />
)
export const OtherFileIcon = (props) => (
  <img src="/assets/icons/other-file.svg" />
)
export const BuildingIcon = (props) => <img src="/assets/icons/.svg" />

export const SiteVisitIcon = (props) => (
  <img src="../assets/icons/siteVisit.svg" />
)

export const DolarIcon = (props) => (
  <span role="img" aria-label="edit" className="anticon anticon-edit">
    <svg
      width="16"
      height="11"
      viewBox="0 0 16 11"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0.00390625 10.332H16.0039V0.332031H0.00390625V10.332ZM14.0039 3.78203V6.89203C13.4039 7.23824 12.9043 7.73447 12.5539 8.33203H3.43391C3.0891 7.73697 2.59655 7.24098 2.00391 6.89203V3.78203C2.60502 3.4329 3.10478 2.93315 3.45391 2.33203H12.5539C12.903 2.93315 13.4028 3.4329 14.0039 3.78203ZM6.50391 5.33203C6.50391 6.43703 7.17591 7.33203 8.00391 7.33203C8.83191 7.33203 9.50391 6.43703 9.50391 5.33203C9.50391 4.22703 8.83191 3.33203 8.00391 3.33203C7.17591 3.33203 6.50391 4.22703 6.50391 5.33203Z"
      />
    </svg>
  </span>
)
export const DolarRefundIcon = (props) => (
  <svg
    width="21"
    height="21"
    viewBox="0 0 21 21"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12.4608 1.42196L10.3808 3.51196H12.5508C14.6725 3.51196 16.7073 4.35482 18.2076 5.85511C19.7079 7.3554 20.5508 9.39023 20.5508 11.512H18.5508C18.5508 9.92066 17.9186 8.39454 16.7934 7.26932C15.6682 6.1441 14.1421 5.51196 12.5508 5.51196H10.3808L12.4708 7.60196L11.0508 9.01196L6.55078 4.51196L7.96078 3.10196L11.0508 0.0119629L12.4608 1.42196ZM0.550781 10.512V20.512H16.5508V10.512H0.550781ZM2.55078 17.072V13.962C3.1519 13.6128 3.65165 13.1131 4.00078 12.512H13.1008C13.4499 13.1131 13.9497 13.6128 14.5508 13.962V17.072C13.9581 17.4209 13.4656 17.9169 13.1208 18.512H4.00078C3.65043 17.9144 3.15076 17.4182 2.55078 17.072ZM8.55078 17.512C9.37878 17.512 10.0508 16.617 10.0508 15.512C10.0508 14.407 9.37878 13.512 8.55078 13.512C7.72278 13.512 7.05078 14.407 7.05078 15.512C7.05078 16.617 7.72278 17.512 8.55078 17.512Z"
      fill="#FEC20C"
    />
  </svg>
)
type IconCustomProps = {
  iconPath: string;
  className?: string | undefined;
  style?: CSSProperties | undefined;
};

export function IconCustom({ iconPath, ...res }: IconCustomProps) {
  return <img src={iconPath} {...res} />
}
