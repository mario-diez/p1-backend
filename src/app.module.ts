import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { configSchemaValidation } from './schemas/config.schema';
import { UsersController } from './users/users.controller';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { QrsController } from './qrs/qrs.controller';
import { QrsService } from './qrs/qrs.service';
import { QrsModule } from './qrs/qrs.module';


@Module({
  imports: [MongooseModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: async (config: ConfigService) => ({
      uri: config.get('MONGO_URI'),
    }),
  }),
  ConfigModule.forRoot({
    isGlobal: true,
    validationSchema: configSchemaValidation,
  }),
  UsersModule,
  AuthModule,
  QrsModule
  ],
  controllers: [],
  providers: [ConfigService],
})
export class AppModule {
  constructor(private configService: ConfigService) {
    console.log(this.configService.get('MONGO_URI'));
  }

}
