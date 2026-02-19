export interface Experience {
  id?: string;
  company: string;
  position: string;
  description: string;
  achievements: string[];
  technologies: string[];
  startDate: Date | string;
  endDate?: Date | string;
  isCurrentJob: boolean;
  displayOrder: number;
}

export interface CreateExperience {
  company: string;
  position: string;
  description: string;
  achievements: string[];
  technologies: string[];
  startDate: Date | string;
  endDate?: Date | string;
  isCurrentJob: boolean;
  displayOrder: number;
}

export interface UpdateExperience extends CreateExperience {}