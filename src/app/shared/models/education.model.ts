export interface Education {
  id?: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: Date | string;
  endDate?: Date | string;
  isCurrentlyStudying: boolean;
  description?: string;
  displayOrder: number;
}

export interface CreateEducation {
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: Date | string;
  endDate?: Date | string;
  isCurrentlyStudying: boolean;
  description?: string;
  displayOrder: number;
}

export interface UpdateEducation extends CreateEducation {}