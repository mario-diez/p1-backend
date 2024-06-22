import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { QR, QRSchema } from './schemas/qr.schema';
import { QrsController } from './qrs.controller';
import { QrsService } from './qrs.service';

@Module({
    imports: [
        MongooseModule.forFeature([
        {
        name: QR.name,
        schema: QRSchema,
        }
      ])],
    controllers: [QrsController],
    providers: [QrsService],
    exports: [QrsService],
})
export class QrsModule {}
