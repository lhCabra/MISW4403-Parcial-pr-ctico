import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { AerolineaAeropuertoService } from './aerolinea-aeropuerto.service';
import { AeropuertoDto } from 'src/aeropuerto/aeropuerto.dto';
import { plainToInstance } from 'class-transformer';
import { AeropuertoEntity } from 'src/aeropuerto/aeropuerto.entity';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors.interceptor';

@Controller('airlines')
@UseInterceptors(BusinessErrorsInterceptor)
export class AerolineaAeropuertoController {
    constructor(private readonly aerolineaAeropuertoService: AerolineaAeropuertoService) { }
    @Post(':aerolineaId/airports/:aeropuertoId')
    async addAirportToAirline(@Param('aerolineaId') aerolineaId: string, @Param('aeropuertoId') aeropuertoId: string) {
        return await this.aerolineaAeropuertoService.addAirportToAirline(aerolineaId, aeropuertoId);
    }
    @Get(':aerolineaId/airports/:aeropuertoId')
    async findAirportFromAirline(@Param('aerolineaId') aerolineaId: string, @Param('aeropuertoId') aeropuertoId: string) {
        return await this.aerolineaAeropuertoService.findAirportFromAirline(aerolineaId, aeropuertoId);
    }
    @Get(':aerolineaId/airports')
    async findAirportsFromAirline(@Param('aerolineaId') aerolineaId: string) {
        return await this.aerolineaAeropuertoService.findAirportsFromAirline(aerolineaId);
    }
    @Delete(':aerolineaId/airports/:aeropuertoId')
    @HttpCode(204)
    async deleteAirportFromAirline(@Param('aerolineaId') aerolineaId: string, @Param('aeropuertoId') aeropuertoId: string) {
        return await this.aerolineaAeropuertoService.deleteAirportFromAirline(aerolineaId, aeropuertoId);
    }
    @Put(':aerolineaId/airports')
    async updateAirportsFromAirline(@Body() aeropuertoDto: AeropuertoDto[], @Param('aerolineaId') aerolineaId: string) {
        const airports = plainToInstance(AeropuertoEntity, aeropuertoDto)
        return await this.aerolineaAeropuertoService.updateAirportsFromAirline(aerolineaId, airports);
    }
}
