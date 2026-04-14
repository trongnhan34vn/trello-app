export type User = {
  id: string;
  fullName: string;
  email: string;
  avatarUrl: string;
  createdAt: string;
  updatedAt: string;
};

export type SignInReqest = Pick<User, 'email'> & { password: string };
export type SignUpRequest = Pick<User, 'email' | 'fullName'> & {password: string, confirmedPassword: string}
