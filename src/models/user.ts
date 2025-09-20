import { User as FirebaseUser } from 'firebase/auth';

export interface UserData {
  uid: string;
  email: string | null;
  name: string;
  createdAt?: Date;
}

// se algum dia precisar:
export interface CreateUserProfileParams {
  user: FirebaseUser;
  data: Omit<UserData, 'uid'>;
}
