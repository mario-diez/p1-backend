import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Transform } from 'class-transformer';
import { ROLE } from 'src/enums/role.enum';

export class UserDto {
  @ApiProperty()
  @Expose()
  @Transform(value => value.obj._id.toString())
  id: string;
  @ApiProperty()
  @Expose()
  email: string;
  @Exclude()
  password: string;
  @ApiProperty()
  @Expose()
  role: ROLE;
  @ApiProperty()
  @Expose()
  ban: boolean;
}
