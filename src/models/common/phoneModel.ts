/* Phones Input */
export interface IPhoneModel {
  id?: number;
  phone: string;
  phoneCode?: string;
  countryId: number;
  phoneTypeId: number;
  isPrimary?: boolean;
}

export class PhoneModel implements IPhoneModel {
  id?: number;
  phone: string;
  phoneCode?: string;
  countryId: number;
  phoneTypeId: number;
  isPrimary?: boolean;
  constructor(phone?, countryId?, phoneTypeId?, isPrimary?) {
    this.phone = phone
    this.countryId = countryId
    this.phoneTypeId = phoneTypeId
    this.isPrimary = isPrimary
  }
}
