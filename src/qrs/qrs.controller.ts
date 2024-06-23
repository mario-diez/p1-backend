import { Body, Controller, Get, Param, Post,Req, Request, Res, UseGuards } from '@nestjs/common';
import { CreateQRDto } from './dto/create-qr.dto';
import { QrsService } from './qrs.service';
import { ROLE } from 'src/enums/role.enum';
import { RolesGuard } from 'src/guards/roles.guard';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { Roles } from 'src/decorators/roles.decorator';
import {  Response } from 'express';
import { UserDto } from 'src/users/dto/user.dto';

@Controller('qrs')
export class QrsController {

    constructor(
        private qrService: QrsService,
    ) {}

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(ROLE.Admin,ROLE.User)
    async create(@Req() request: Request,@Body() qr: CreateQRDto) {
        return this.qrService.create(qr, request['user'] as UserDto);
    }

    @Get()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(ROLE.Admin)
    async findAll() {
        // return this.qrService.findAll();
        const qrs = await this.qrService.findAll();
        return qrs.map(qr => {
            return {
                id: qr.id,
                qrCodeDataURL: qr.qrCodeDataURL,
                user: qr.text,
            };
        });
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
                <img src="${qr.qrCodeDataURL}" alt="QR Code">
            </div>
            `);
        }

    }

}
