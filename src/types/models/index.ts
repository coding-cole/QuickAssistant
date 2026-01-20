export interface BaseModel {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserModel extends BaseModel {
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  isVerified: boolean;
}
