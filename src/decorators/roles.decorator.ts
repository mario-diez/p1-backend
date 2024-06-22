import { SetMetadata } from '@nestjs/common';
import { ROLE } from 'src/enums/role.enum';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: ROLE[]) => {
  return SetMetadata(ROLES_KEY, roles);
};
