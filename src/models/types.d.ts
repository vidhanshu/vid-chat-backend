export interface IUser extends Document {
  email: string;
  password: string;
  access_token: string;
  isValidPassword(password: string): Promise<boolean>;
}
