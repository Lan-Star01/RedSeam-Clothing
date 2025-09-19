export interface User {
  user: {
    email: string;
    name: string;
    profile_photo: string;
    id: number;
  };
  token: string;
}
