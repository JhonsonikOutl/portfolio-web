export interface Skill {
  id?: string;
  name: string;
  category: string;
  level: number;
  icon?: string;
  displayOrder: number;
}

export interface CreateSkill {
  name: string;
  category: string;
  level: number;
  icon?: string;
  displayOrder: number;
}

export interface UpdateSkill extends CreateSkill {}