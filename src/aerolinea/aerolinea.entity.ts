import { AeropuertoEntity } from "src/aeropuerto/aeropuerto.entity";
import { Column, Entity, JoinColumn, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class AerolineaEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column()
    nombre: string;
    @Column()
    descripcion: string;
    @Column()
    fechaFundacion: Date;
    @Column()
    paginaWeb: string;
    @ManyToMany(() => AeropuertoEntity, (aeropuerto) => aeropuerto.aerolineas)
    @JoinColumn()
    aeropuertos: AeropuertoEntity[];
}
