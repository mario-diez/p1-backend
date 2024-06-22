import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { ROLE } from 'src/enums/role.enum';

export class UpdateRoleDto {
  @ApiProperty()
  @IsEnum(ROLE)
  role: ROLE;
}
