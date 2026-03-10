export interface Project {
  id?: string;
  title: string;
  description: string;
  technologies: string[];
  imageUrl?: string;
  githubUrl?: string;
  liveUrl?: string;
  startDate: Date | string;
  endDate?: Date | string;
  isFeatured: boolean;
  displayOrder: number;
  show : boolean;
}

export interface CreateProject {
  title: string;
  description: string;
  technologies: string[];
  imageUrl?: string;
  githubUrl?: string;
  liveUrl?: string;
  startDate: Date | string;
  endDate?: Date | string;
  isFeatured: boolean;
  displayOrder: number;
  show : boolean;
}

export interface UpdateProject extends CreateProject {}