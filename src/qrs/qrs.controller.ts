import { Body, Controller, Get, Param, Post, Res, UseGuards } from '@nestjs/common';
import { CreateQRDto } from './dto/create-qr.dto';
import { QrsService } from './qrs.service';
import { ROLE } from 'src/enums/role.enum';
import { RolesGuard } from 'src/guards/roles.guard';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { Response } from 'express';

@Controller('qrs')
export class QrsController {

    constructor(
        private qrService: QrsService,
    ) {}

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(ROLE.Admin,ROLE.User)
    async create(@Body() qr: CreateQRDto) {
        return this.qrService.create(qr);
    }

    @Get()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(ROLE.Admin)
    async findAll() {
        return this.qrService.findAll();
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(ROLE.Admin)
    async findOne(@Param('id') id: string, @Res() res: Response) {
        const qr= await this.qrService.findOne(id);
        if (qr) {
            res.setHeader('Content-Type', 'text/html');
            res.send(`
            <div>
                <h1>QR Code for "${qr.URL}"</h1>
                <img src="${qr.qrCodeDataURL}" alt="QR Code">
            </div>
            `);
        }

    }

}
