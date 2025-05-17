import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AeropuertoEntity } from './aeropuerto.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/bussiness-errors';

@Injectable()
export class AeropuertoService {
  constructor(
    @InjectRepository(AeropuertoEntity)
    private readonly aeropuertoRepository: Repository<AeropuertoEntity>,
  ) {}

  async findAll(): Promise<AeropuertoEntity[]> {
    return await this.aeropuertoRepository.find({ relations: ['aerolineas'] });
  }

  async findOne(id: string): Promise<AeropuertoEntity> {
    const aeropuerto: AeropuertoEntity | null = await this.aeropuertoRepository.findOne({
      where: { id },
      relations: ['aerolineas'],
    });

    if (!aeropuerto)
      throw new BusinessLogicException(
        'El aeropuerto con el id proporcionado no fue encontrado.',
        BusinessError.NOT_FOUND,
      );

    return aeropuerto;
  }

  async create(aeropuerto: AeropuertoEntity): Promise<AeropuertoEntity> {
    if (!aeropuerto.codigo || aeropuerto.codigo.length !== 3) {
      throw new BusinessLogicException(
        'El código del aeropuerto debe tener exactamente tres caracteres.',
        BusinessError.PRECONDITION_FAILED,
      );
    }

    return await this.aeropuertoRepository.save(aeropuerto);
  }

  async update(id: string, aeropuerto: AeropuertoEntity): Promise<AeropuertoEntity> {
    const persistedAeropuerto: AeropuertoEntity | null = await this.aeropuertoRepository.findOne({ where: { id } });

    if (!persistedAeropuerto)
      throw new BusinessLogicException(
        'El aeropuerto con el id proporcionado no fue encontrado.',
        BusinessError.NOT_FOUND,
      );

    if (aeropuerto.codigo && aeropuerto.codigo.length !== 3) {
      throw new BusinessLogicException(
        'El código del aeropuerto debe tener exactamente tres caracteres.',
        BusinessError.PRECONDITION_FAILED,
      );
    }

    return await this.aeropuertoRepository.save({ ...persistedAeropuerto, ...aeropuerto });
  }

  async delete(id: string): Promise<void> {
    const aeropuerto: AeropuertoEntity | null = await this.aeropuertoRepository.findOne({ where: { id } });

    if (!aeropuerto)
      throw new BusinessLogicException(
        'El aeropuerto con el id proporcionado no fue encontrado.',
        BusinessError.NOT_FOUND,
      );

    await this.aeropuertoRepository.remove(aeropuerto);
  }
}
