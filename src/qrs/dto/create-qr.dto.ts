import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateQRDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    text: string;

    
}