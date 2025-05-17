/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';

import { AerolineaEntity } from '../aerolinea/aerolinea.entity';
import { AeropuertoEntity } from '../aeropuerto/aeropuerto.entity';
import { AerolineaAeropuertoService } from './aerolinea-aeropuerto.service';

describe('AerolineaAeropuertoService', () => {
  let service: AerolineaAeropuertoService;
  let aerolineaRepository: Repository<AerolineaEntity>;
  let aeropuertoRepository: Repository<AeropuertoEntity>;
  let aerolinea: AerolineaEntity;
  let aeropuertosList: AeropuertoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AerolineaAeropuertoService],
    }).compile();

    service = module.get<AerolineaAeropuertoService>(AerolineaAeropuertoService);
    aerolineaRepository = module.get<Repository<AerolineaEntity>>(getRepositoryToken(AerolineaEntity));
    aeropuertoRepository = module.get<Repository<AeropuertoEntity>>(getRepositoryToken(AeropuertoEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    await aeropuertoRepository.clear();
    await aerolineaRepository.clear();

    aeropuertosList = [];
    for (let i = 0; i < 5; i++) {
      const aeropuerto = await aeropuertoRepository.save({
        nombre: faker.lorem.words(2),
        codigo: faker.string.alpha({ length: 3 }),
        pais: faker.location.country(),
        ciudad: faker.location.city(),
      });
      aeropuertosList.push(aeropuerto);
    }

    aerolinea = await aerolineaRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      fechaFundacion: faker.date.past({ years: 30 }),
      paginaWeb: faker.internet.url(),
      aeropuertos: aeropuertosList,
    });
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addAeropuertoAerolinea should add an aeropuerto to an aerolinea', async () => {
    const newAeropuerto = await aeropuertoRepository.save({
      nombre: faker.lorem.words(2),
      codigo: faker.string.alpha({ length: 3 }),
      pais: faker.location.country(),
      ciudad: faker.location.city(),
    });

    const newAerolinea = await aerolineaRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      fechaFundacion: faker.date.past({ years: 30 }),
      paginaWeb: faker.internet.url(),
    });

    const result = await service.addAirportToAirline(newAerolinea.id, newAeropuerto.id);
    expect(result.aeropuertos.length).toBe(1);
    expect(result.aeropuertos[0].nombre).toBe(newAeropuerto.nombre);
  });

  it('addAeropuertoAerolinea should throw error for invalid aeropuerto', async () => {
    const newAerolinea = await aerolineaRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      fechaFundacion: faker.date.past({ years: 30 }),
      paginaWeb: faker.internet.url(),
    });

    await expect(() => service.addAirportToAirline(newAerolinea.id, "0"))
      .rejects.toHaveProperty("message", "El aeropuerto con el id proporcionado no fue encontrado.");
  });

  it('addAeropuertoAerolinea should throw error for invalid aerolinea', async () => {
    const newAeropuerto = await aeropuertoRepository.save({
      nombre: faker.lorem.words(2),
      codigo: faker.string.alpha({ length: 3 }),
      pais: faker.location.country(),
      ciudad: faker.location.city(),
    });

    await expect(() => service.addAirportToAirline("0", newAeropuerto.id))
      .rejects.toHaveProperty("message", "La aerolínea con el id proporcionado no fue encontrada.");
  });

  it('findAeropuertoByAerolineaIdAeropuertoId should return aeropuerto by aerolinea', async () => {
    const aeropuerto = aeropuertosList[0];
    const result = await service.findAirportFromAirline(aerolinea.id, aeropuerto.id);
    expect(result.nombre).toBe(aeropuerto.nombre);
  });

  it('findAeropuertoByAerolineaIdAeropuertoId should throw error for invalid aeropuerto', async () => {
    await expect(() => service.findAirportFromAirline(aerolinea.id, "0"))
      .rejects.toHaveProperty("message", "El aeropuerto con el id proporcionado no fue encontrado.");
  });

  it('findAeropuertoByAerolineaIdAeropuertoId should throw error for invalid aerolinea', async () => {
    const aeropuerto = aeropuertosList[0];
    await expect(() => service.findAirportFromAirline("0", aeropuerto.id))
      .rejects.toHaveProperty("message", "La aerolínea con el id proporcionado no fue encontrada.");
  });

  it('findAeropuertoByAerolineaIdAeropuertoId should throw error if aeropuerto not associated', async () => {
    const newAeropuerto = await aeropuertoRepository.save({
      nombre: faker.lorem.words(2),
      codigo: faker.string.alpha({ length: 3 }),
      pais: faker.location.country(),
      ciudad: faker.location.city(),
    });

    await expect(() => service.findAirportFromAirline(aerolinea.id, newAeropuerto.id))
      .rejects.toHaveProperty("message", "El aeropuerto con el id proporcionado no está asociado a la aerolínea.");
  });

  it('findAeropuertosByAerolineaId should return all aeropuertos for a given aerolinea', async () => {
    const result = await service.findAirportsFromAirline(aerolinea.id);
    expect(result.length).toBe(5);
  });

  it('findAeropuertosByAerolineaId should throw error for invalid aerolinea', async () => {
    await expect(() => service.findAirportsFromAirline("0"))
      .rejects.toHaveProperty("message", "La aerolínea con el id proporcionado no fue encontrada.");
  });



  it('deleteAeropuertoAerolinea should remove an aeropuerto from an aerolinea', async () => {
    const aeropuerto = aeropuertosList[0];
    await service.deleteAirportFromAirline(aerolinea.id, aeropuerto.id);
    const result = await aerolineaRepository.findOne({
      where: { id: aerolinea.id },
      relations: ['aeropuertos']
    });
    expect(result).not.toBeNull();
    const deleted = result!.aeropuertos.find(a => a.id === aeropuerto.id);
    expect(deleted).toBeUndefined();
  });

  it('deleteAeropuertoAerolinea should throw error for invalid aeropuerto', async () => {
    await expect(() => service.deleteAirportFromAirline(aerolinea.id, "0"))
      .rejects.toHaveProperty("message", "El aeropuerto con el id proporcionado no fue encontrado.");
  });

  it('deleteAeropuertoAerolinea should throw error for invalid aerolinea', async () => {
    const aeropuerto = aeropuertosList[0];
    await expect(() => service.deleteAirportFromAirline("0", aeropuerto.id))
      .rejects.toHaveProperty("message", "La aerolínea con el id proporcionado no fue encontrada.");
  });

  it('deleteAeropuertoAerolinea should throw error for non-associated aeropuerto', async () => {
    const newAeropuerto = await aeropuertoRepository.save({
      nombre: faker.lorem.words(2),
      codigo: faker.string.alpha({ length: 3 }),
      pais: faker.location.country(),
      ciudad: faker.location.city(),
    });

    await expect(() => service.deleteAirportFromAirline(aerolinea.id, newAeropuerto.id))
      .rejects.toHaveProperty("message", "El aeropuerto con el id proporcionado no está asociado a la aerolínea.");
  });
});
