import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { ROLE } from 'src/enums/role.enum';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ unique: true, required: true })
  email: string;

  @Prop({ type: String, unique: true, required: true })
  password: string;

  @Prop({ required: false, default: ROLE.User })
  role: ROLE;

  @Prop({ required: false, default: false })
  ban: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
