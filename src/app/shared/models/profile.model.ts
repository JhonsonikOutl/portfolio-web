export interface Profile {
  id?: string;
  fullName: string;
  title: string;
  bio: string;
  email: string;
  phone: string;
  location: string;
  photoUrl?: string;
  availableToJob?: true;
  socialLinks?: SocialLinks;
}

export interface SocialLinks {
  linkedIn?: string;
  gitHub?: string;
  twitter?: string;
  website?: string;
  email?: string;
}

export interface UpdateProfile {
  fullName: string;
  title: string;
  bio: string;
  email: string;
  phone: string;
  location: string;
  photoUrl?: string;
  availableToJob?: true;
  socialLinks?: SocialLinks;
}