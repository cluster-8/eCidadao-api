import { UserAuth } from '@src/utils/dtos/user.auth.dto';

declare global {
  namespace Express {
    interface Request {
      user: UserAuth;
    }
  }
}
