import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateQRDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @Transform(value => value.obj.text.toString())

    text: string;

    
}