/* Teams Input */
export interface ITeamModel {
  id?: number;
  team?: any;
  isHead?: boolean;
}

export class TeamModel implements ITeamModel {
  id?: number;

  team: number;
  isHead?: boolean;
  constructor(id?, team?, isHead?) {
    this.id = id
    this.team = team
    this.isHead = isHead
  }
}
