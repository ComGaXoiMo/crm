/* Address Input */
export interface IAddressModel {
  id?: number;
  address?: string;
  country?: string;
  countryId?: number;
  province?: string;
  provinceId?: number;
  district?: string;
  districtId?: number;
  isActive?: boolean;
  latitude?: string;
  longitude?: string;
  isPrimary?: boolean;
}

export class AddressModel implements IAddressModel {
  id?: number;
  address: string;
  country?: string;
  countryId?: number;
  province?: string;
  provinceId?: number;
  district?: string;
  districtId?: number;
  isActive?: boolean;
  latitude?: string;
  longitude?: string;
  isPrimary?: boolean;

  constructor(address?, countryId?, provinceId?, districtId?, isPrimary?) {
    this.address = address || ""
    this.isActive = true
    this.countryId = countryId
    this.provinceId = provinceId
    this.districtId = districtId
    this.isPrimary = isPrimary
  }
}
