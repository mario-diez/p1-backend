import { ApiProperty } from "@nestjs/swagger";
import { Expose, Transform, Exclude } from "class-transformer";
import { ROLE } from "src/enums/role.enum";

export class QrDto {
    @ApiProperty()
    @Expose()
    @Transform(value => value.obj._id.toString())
    id: string;

    @ApiProperty()
    @Expose()
    @Transform(value => value.obj.ownerId.toString())
    ownerId: string;

    
  }