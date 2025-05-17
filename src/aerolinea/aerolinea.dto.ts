import { IsNotEmpty, IsString, IsDateString, IsUrl } from 'class-validator';

export class AerolineaDto {
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @IsNotEmpty()
  @IsString()
  descripcion: string;

  @IsNotEmpty()
  @IsDateString()
  fechaFundacion: string;

  @IsNotEmpty()
  @IsUrl()
  paginaWeb: string;
}
