import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AerolineaEntity } from '../aerolinea/aerolinea.entity';
import { AeropuertoEntity } from '../aeropuerto/aeropuerto.entity';
import { BusinessError, BusinessLogicException } from '../shared/errors/bussiness-errors';
import { Repository } from 'typeorm';

@Injectable()
export class AerolineaAeropuertoService {
    constructor(
        @InjectRepository(AerolineaEntity)
        private readonly aerolineaRepository: Repository<AerolineaEntity>,
        @InjectRepository(AeropuertoEntity)
        private readonly aeropuertoRepository: Repository<AeropuertoEntity>
    ) { }

    async addAirportToAirline(aerolineaId: string, aeropuertoId: string): Promise<AerolineaEntity> {
        const aeropuerto = await this.aeropuertoRepository.findOne({ where: { id: aeropuertoId } });
        if (!aeropuerto)
            throw new BusinessLogicException('El aeropuerto con el id proporcionado no fue encontrado.', BusinessError.NOT_FOUND);

        const aerolinea = await this.aerolineaRepository.findOne({
            where: { id: aerolineaId },
            relations: ['aeropuertos'],
        });
        if (!aerolinea)
            throw new BusinessLogicException('La aerolínea con el id proporcionado no fue encontrada.', BusinessError.NOT_FOUND);

        aerolinea.aeropuertos = [...aerolinea.aeropuertos, aeropuerto];
        return await this.aerolineaRepository.save(aerolinea);
    }


    async findAirportsFromAirline(aerolineaId: string): Promise<AeropuertoEntity[]> {
        const aerolinea = await this.aerolineaRepository.findOne({
            where: { id: aerolineaId },
            relations: ['aeropuertos'],
        });

        if (!aerolinea)
            throw new BusinessLogicException('La aerolínea con el id proporcionado no fue encontrada.', BusinessError.NOT_FOUND);

        return aerolinea.aeropuertos;
    }


    async findAirportFromAirline(aerolineaId: string, aeropuertoId: string): Promise<AeropuertoEntity> {
        const aeropuerto = await this.aeropuertoRepository.findOne({ where: { id: aeropuertoId } });
        if (!aeropuerto)
            throw new BusinessLogicException('El aeropuerto con el id proporcionado no fue encontrado.', BusinessError.NOT_FOUND);

        const aerolinea = await this.aerolineaRepository.findOne({
            where: { id: aerolineaId },
            relations: ['aeropuertos'],
        });
        if (!aerolinea)
            throw new BusinessLogicException('La aerolínea con el id proporcionado no fue encontrada.', BusinessError.NOT_FOUND);

        const found = aerolinea.aeropuertos.find((a) => a.id === aeropuerto.id);
        if (!found)
            throw new BusinessLogicException(
                'El aeropuerto con el id proporcionado no está asociado a la aerolínea.',
                BusinessError.PRECONDITION_FAILED,
            );

        return found;
    }


    async updateAirportsFromAirline(aerolineaId: string, aeropuertos: AeropuertoEntity[]): Promise<AerolineaEntity> {
        const aerolinea = await this.aerolineaRepository.findOne({
            where: { id: aerolineaId },
            relations: ['aeropuertos'],
        });

        if (!aerolinea)
            throw new BusinessLogicException('La aerolínea con el id proporcionado no fue encontrada.', BusinessError.NOT_FOUND);

        for (const aeropuerto of aeropuertos) {
            const found = await this.aeropuertoRepository.findOne({ where: { id: aeropuerto.id } });
            if (!found)
                throw new BusinessLogicException(
                    `El aeropuerto con id ${aeropuerto.id} no fue encontrado.`,
                    BusinessError.NOT_FOUND,
                );
        }

        aerolinea.aeropuertos = aeropuertos;
        return await this.aerolineaRepository.save(aerolinea);
    }


    async deleteAirportFromAirline(aerolineaId: string, aeropuertoId: string): Promise<void> {
        const aeropuerto = await this.aeropuertoRepository.findOne({ where: { id: aeropuertoId } });
        if (!aeropuerto)
            throw new BusinessLogicException('El aeropuerto con el id proporcionado no fue encontrado.', BusinessError.NOT_FOUND);

        const aerolinea = await this.aerolineaRepository.findOne({
            where: { id: aerolineaId },
            relations: ['aeropuertos'],
        });

        if (!aerolinea)
            throw new BusinessLogicException('La aerolínea con el id proporcionado no fue encontrada.', BusinessError.NOT_FOUND);

        const associated = aerolinea.aeropuertos.find((a) => a.id === aeropuertoId);
        if (!associated)
            throw new BusinessLogicException(
                'El aeropuerto con el id proporcionado no está asociado a la aerolínea.',
                BusinessError.PRECONDITION_FAILED,
            );

        aerolinea.aeropuertos = aerolinea.aeropuertos.filter((a) => a.id !== aeropuertoId);
        await this.aerolineaRepository.save(aerolinea);
    }

}
