import { ROLE } from "src/enums/role.enum";
import { UserDto } from "src/users/dto/user.dto";

export const isOwner = (allowAdmin: boolean, propertyValidate: string, userDto?: UserDto) => {
  if (allowAdmin && userDto?.role === ROLE.Admin) {
    return true;
  }

  return userDto?.id === propertyValidate;
};
