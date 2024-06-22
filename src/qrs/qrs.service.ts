import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { QR } from "./schemas/qr.schema";
import { QrDto } from "./dto/qr.dto";
import { CreateQRDto } from "./dto/create-qr.dto";
import * as QRCode from 'qrcode';


@Injectable()
export class QrsService {
    constructor(
        @InjectModel(QR.name) private readonly qrModel: Model<QR>,
    ) {}

    async create(qr: CreateQRDto): Promise<QR> {
        // Construir la URL final basada en el texto proporcionado
        const URL = `https://www.example.com/user/${encodeURIComponent(qr.text)}`;
    
        // Generar la imagen del QR en formato Data URL a partir de la URL
        const qrCodeDataURL = await QRCode.toDataURL(URL);
    
        // Crear un nuevo documento QR y guardarlo en la base de datos
        const createdQR = new this.qrModel({
          text: qr.text,
          qrCodeDataURL: qrCodeDataURL,
          URL: URL,
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
