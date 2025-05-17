import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AerolineaEntity } from './aerolinea.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/bussiness-errors';

@Injectable()
export class AerolineaService {
    constructor(
        @InjectRepository(AerolineaEntity)
        private readonly aerolineaRepository: Repository<AerolineaEntity>,
    ) { }

    async findAll(): Promise<AerolineaEntity[]> {
        return await this.aerolineaRepository.find({ relations: ['aeropuertos'] });
    }

    async findOne(id: string): Promise<AerolineaEntity> {
        const aerolinea: AerolineaEntity | null = await this.aerolineaRepository.findOne({
            where: { id },
            relations: ['aeropuertos'],
        });

        if (!aerolinea)
            throw new BusinessLogicException(
                'La aerolínea con el id proporcionado no fue encontrada.',
                BusinessError.NOT_FOUND,
            );

        return aerolinea;
    }

    async create(aerolinea: AerolineaEntity): Promise<AerolineaEntity> {
        if (new Date(aerolinea.fechaFundacion) >= new Date()) {
            throw new BusinessLogicException(
                'La fecha de fundación debe ser una fecha en el pasado.',
                BusinessError.PRECONDITION_FAILED,
            );
        }

        return await this.aerolineaRepository.save(aerolinea);
    }

    async update(id: string, aerolinea: AerolineaEntity): Promise<AerolineaEntity> {
        const persistedAerolinea: AerolineaEntity | null = await this.aerolineaRepository.findOne({ where: { id } });

        if (!persistedAerolinea)
            throw new BusinessLogicException(
                'La aerolínea con el id proporcionado no fue encontrada.',
                BusinessError.NOT_FOUND,
            );

        if (aerolinea.fechaFundacion && new Date(aerolinea.fechaFundacion) >= new Date()) {
            throw new BusinessLogicException(
                'La fecha de fundación debe ser una fecha en el pasado.',
                BusinessError.PRECONDITION_FAILED,
            );
        }

        return await this.aerolineaRepository.save({ ...persistedAerolinea, ...aerolinea });
    }

    async delete(id: string): Promise<void> {
        const aerolinea: AerolineaEntity | null = await this.aerolineaRepository.findOne({ where: { id } });

        if (!aerolinea)
            throw new BusinessLogicException(
                'La aerolínea con el id proporcionado no fue encontrada.',
                BusinessError.NOT_FOUND,
            );

        await this.aerolineaRepository.remove(aerolinea);
    }
}
