import { Test, TestingModule } from '@nestjs/testing';
import { AerolineaService } from '../aerolinea/aerolinea.service';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { AerolineaEntity } from '../aerolinea/aerolinea.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('AerolineaService', () => {
  let service: AerolineaService;
  let repository: Repository<AerolineaEntity>;
  let aerolineasList: AerolineaEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AerolineaService],
    }).compile();

    service = module.get<AerolineaService>(AerolineaService);
    repository = module.get<Repository<AerolineaEntity>>(getRepositoryToken(AerolineaEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    await repository.clear();
    aerolineasList = [];
    for (let i = 0; i < 5; i++) {
      const aerolinea = await repository.save({
        nombre: faker.company.name(),
        descripcion: faker.lorem.sentence(),
        fechaFundacion: faker.date.past({ years: 30 }),
        paginaWeb: faker.internet.url(),
        aeropuertos: [],
      });
      aerolineasList.push(aerolinea);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all aerolineas with their aeropuertos', async () => {
    const aerolineas = await service.findAll();
    expect(aerolineas).not.toBeNull();
    expect(aerolineas.length).toBe(aerolineasList.length);
    aerolineas.forEach(aerolinea => {
      expect(aerolinea.aeropuertos).toBeDefined();
    });
  });

  it('findOne should return an aerolinea by id', async () => {
    const aerolinea = aerolineasList[0];
    const found = await service.findOne(aerolinea.id);
    expect(found).not.toBeNull();
    expect(found.nombre).toBe(aerolinea.nombre);
    expect(found.aeropuertos).toBeDefined();
  });

  it('findOne should throw an error if aerolinea not found', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'La aerolínea con el id proporcionado no fue encontrada.'
    );
  });

  it('create should save a new aerolinea', async () => {
    const newAerolinea: AerolineaEntity = {
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      fechaFundacion: faker.date.past({ years: 10 }),
      paginaWeb: faker.internet.url(),
      aeropuertos: [],
      id: ''
    };

    const created = await service.create(newAerolinea);
    expect(created).not.toBeNull();
    expect(created.nombre).toBe(newAerolinea.nombre);
  });

  it('create should throw error if fechaFundacion is future date', async () => {
    const newAerolinea: AerolineaEntity = {
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      fechaFundacion: faker.date.future({ years: 10 }),
      paginaWeb: faker.internet.url(),
      aeropuertos: [],
      id: ''
    };

    await expect(() => service.create(newAerolinea)).rejects.toHaveProperty(
      'message',
      'La fecha de fundación debe ser una fecha en el pasado.'
    );
  });

  it('update should modify an existing aerolinea', async () => {
    const aerolinea = aerolineasList[0];
    aerolinea.nombre = 'Nombre Actualizado';
    aerolinea.fechaFundacion = faker.date.past({ years: 15 });

    const updated = await service.update(aerolinea.id, aerolinea);
    expect(updated.nombre).toEqual('Nombre Actualizado');

    const stored = await repository.findOne({ where: { id: aerolinea.id } });
    expect(stored).not.toBeNull();
    if (stored) {
      expect(stored.nombre).toEqual('Nombre Actualizado');
    }
  });


  it('update should throw error if aerolinea not found', async () => {
    const aerolinea = aerolineasList[0];
    aerolinea.nombre = 'Nombre Actualizado';
    aerolinea.fechaFundacion = faker.date.past({ years: 15 });


    await expect(() => service.update('0', aerolinea)).rejects.toHaveProperty(
      'message',
      'La aerolínea con el id proporcionado no fue encontrada.'
    );
  });

  it('update should throw error if fechaFundacion is future date', async () => {
    const aerolinea = aerolineasList[0];
    aerolinea.fechaFundacion = faker.date.future({ years: 10 });
    await expect(() => service.update(aerolinea.id, aerolinea)).rejects.toHaveProperty(
      'message',
      'La fecha de fundación debe ser una fecha en el pasado.'
    );
  });

  it('delete should remove an aerolinea', async () => {
    const aerolinea = aerolineasList[0];
    await service.delete(aerolinea.id);

    await expect(() => service.findOne(aerolinea.id)).rejects.toHaveProperty(
      'message',
      'La aerolínea con el id proporcionado no fue encontrada.'
    );
  });

  it('delete should throw error if aerolinea not found', async () => {
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'La aerolínea con el id proporcionado no fue encontrada.'
    );
  });
});
