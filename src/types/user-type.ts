export type TMasterUser = {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "USER" | "GUEST" | string;
  password_hash?: string;
  department?: string;
  is_online?: boolean;
  last_seen?: string;
  last_login?: string;
  created_at?: string;
};

export type TUser = {
  id: string;
  email: string;
  role: string;
  name: string;
  error: string;
};

export type TUnitUser = {
  id: string;
  email: string;
  role: string;
  username: string;
  error: string;
};

export type TUserData = {
  success: boolean;
  message: string;
  token: string;
  accessToken: string;
  code: string;
  user: TUser;
  error: string;
};

export type TFetchUsersResponse = {
  users: TUnitUser[];
  meta: {
    page: number;
    limit: number;
    totalRows: number;
    hasMore: boolean;
  };
};

export type TUsersResponseWithoutMeta = {
  users: TMasterUser[];
};
