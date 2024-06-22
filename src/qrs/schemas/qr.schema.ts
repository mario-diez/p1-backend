import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'QRs' })  // Especifica el nombre de la colección
export class QR {
  @Prop({ required: true })
  text: string;

  @Prop({ required: true })
  qrCodeDataURL: string;

  @Prop({ required: true })
  URL: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const QRSchema = SchemaFactory.createForClass(QR);
