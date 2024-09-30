import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateAdminDto {
  @IsString({ message: 'Name must be a string.' })
  @IsNotEmpty({ message: 'Name is required.' })
  @Length(2, 100, { message: 'Name must be between 2 and 100 characters.' })
  name: string;

  @IsEmail({}, { message: 'Invalid email address.' })
  @IsNotEmpty({ message: 'Email is required.' })
  authProviderEmail: string;

  @IsString({ message: 'Auth Provider ID must be a string.' })
  @IsNotEmpty({ message: 'Auth Provider ID is required.' })
  authProviderId: string;
}
