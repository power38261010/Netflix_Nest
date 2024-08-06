export class CreateUserDto {
  username: string;
  passwordHash: string;
  email?: string;
  subscriptionId?: number;
  expirationDate?: Date;
  isPaid?: boolean;
}
export class UserRequest {
  readonly username: string;
  readonly passwordHash: string;
  readonly email?: string;
  readonly subscriptionId?: number;
}
