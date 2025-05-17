import { Test, TestingModule } from '@nestjs/testing';
import { AeropuertoService } from './aeropuerto.service';
import { AeropuertoEntity } from './aeropuerto.entity';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('AeropuertoService', () => {
  let service: AeropuertoService;
  let repository: Repository<AeropuertoEntity>;
  let aeropuertosList: AeropuertoEntity[];

  const seedDatabase = async () => {
    await repository.clear();
    aeropuertosList = [];

    for (let i = 0; i < 5; i++) {
      const aeropuerto: AeropuertoEntity = await repository.save({
        nombre: faker.lorem.words(2),
        codigo: faker.string.alpha({ length: 3 }),
        pais: faker.location.country(),
        ciudad: faker.location.city(),
        aerolineas: [],
      });
      aeropuertosList.push(aeropuerto);
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AeropuertoService],
    }).compile();

    service = module.get<AeropuertoService>(AeropuertoService);
    repository = module.get<Repository<AeropuertoEntity>>(getRepositoryToken(AeropuertoEntity));

    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all aeropuertos', async () => {
    const aeropuertos = await service.findAll();
    expect(aeropuertos).not.toBeNull();
    expect(aeropuertos).toHaveLength(aeropuertosList.length);
  });

  it('findOne should return a aeropuerto by id', async () => {
    const stored = aeropuertosList[0];
    const aeropuerto = await service.findOne(stored.id);
    expect(aeropuerto).not.toBeNull();
    expect(aeropuerto.nombre).toEqual(stored.nombre);
    expect(aeropuerto.codigo).toEqual(stored.codigo);
  });

  it('findOne should throw error for invalid id', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'El aeropuerto con el id proporcionado no fue encontrado.'
    );
  });

  it('create should return a new aeropuerto', async () => {
    const aeropuerto: AeropuertoEntity = {
      nombre: faker.lorem.words(2),
      codigo: 'XYZ',
      pais: faker.location.country(),
      ciudad: faker.location.city(),
      aerolineas: [],
      id: ''
    };

    const newAeropuerto = await service.create(aeropuerto);
    expect(newAeropuerto).not.toBeNull();

    const stored = await repository.findOne({ where: { id: newAeropuerto.id } });
    expect(stored).not.toBeNull();
    if (stored) {
      expect(stored.nombre).toEqual(aeropuerto.nombre);
    }
  });

  it('create should throw error if code is not 3 characters', async () => {
    const aeropuerto: AeropuertoEntity = {
      nombre: faker.lorem.words(2),
      codigo: '123456',
      pais: faker.location.country(),
      ciudad: faker.location.city(),
      aerolineas: [],
      id: ''
    };

    await expect(() => service.create(aeropuerto)).rejects.toHaveProperty(
      'message',
      'El código del aeropuerto debe tener exactamente tres caracteres.'
    );
  });


  it('update should modify an existing aeropuerto', async () => {
    const aeropuerto = aeropuertosList[0];
    aeropuerto.nombre = 'nuevo nombre';

    const updated = await service.update(aeropuerto.id, aeropuerto);
    expect(updated.nombre).toEqual('nuevo nombre');

    const stored = await repository.findOne({ where: { id: aeropuerto.id } });
    expect(stored).not.toBeNull();
    if (stored) {
      expect(stored.nombre).toEqual('nuevo nombre');
    }
  });

  it('update should throw error for invalid id', async () => {
    const aeropuerto: AeropuertoEntity = {
      id: '',
      nombre: 'nombre aeropuerto',
      codigo: '123',
      pais: 'pais aeropuerto',
      ciudad: 'ciudad aeropuerto',
      aerolineas: [],
    };

    await expect(() => service.update('invalid-id', aeropuerto)).rejects.toHaveProperty(
      'message',
      'El aeropuerto con el id proporcionado no fue encontrado.'
    );
  });

  it('update should throw error if code is invalid', async () => {
    const aeropuerto = aeropuertosList[0];
    aeropuerto.codigo = '1234';

    await expect(() => service.update(aeropuerto.id, aeropuerto)).rejects.toHaveProperty(
      'message',
      'El código del aeropuerto debe tener exactamente tres caracteres.'
    );
  });

  it('delete should remove a aeropuerto', async () => {
    const aeropuerto = aeropuertosList[0];
    await service.delete(aeropuerto.id);

    const deleted = await repository.findOne({ where: { id: aeropuerto.id } });
    expect(deleted).toBeNull();
  });

  it('delete should throw error for invalid id', async () => {
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'El aeropuerto con el id proporcionado no fue encontrado.'
    );
  });
});
