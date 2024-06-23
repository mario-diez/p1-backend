import { HttpException, Inject, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { QR } from "./schemas/qr.schema";
import { QrDto } from "./dto/qr.dto";
import { CreateQRDto } from "./dto/create-qr.dto";
import * as QRCode from 'qrcode';
import { UserDto } from "src/users/dto/user.dto";
import { User } from "src/users/schemas/user.schema";


@Injectable()
export class QrsService {
    constructor(
        @InjectModel(QR.name) private readonly qrModel: Model<QR>,
        @InjectModel(User.name) private readonly userModel: Model<User>,
    ) {}

    async create(qr: CreateQRDto,user : UserDto): Promise<QR> {
            if(!Types.ObjectId.isValid(qr.text)){
                throw new HttpException('Invalid user id',400);
            }
        const foundUser = await this.userModel.findById(qr.text).exec();

        if(!foundUser){
            throw new HttpException('User not found',404);
        }


        if(user.id !== qr.text && user.role !== 'ADMIN'){
            throw new HttpException('Forbidden',403);
        }
        console.log(user);
        const URL = `https://www.example.com/user/${encodeURIComponent(qr.text)}`;
    
        const qrCodeDataURL = await QRCode.toDataURL(URL);
    
        const createdQR = new this.qrModel({
          text: qr.text,
          qrCodeDataURL: qrCodeDataURL,
          URL: URL,
          ownerId: user.id,
        });
        return createdQR.save();
    }

    async findAll() {
        return await this.qrModel.find().exec();
    }

    async findOne(id: string) {
        const qr:QR = await this.qrModel.findById(id).exec();

        if (!qr) {
            return null;
        }

        return qr;
    }
}
