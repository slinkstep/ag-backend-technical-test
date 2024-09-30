import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty } from 'class-validator';

@InputType()
export class LoginAdminInput {
  @Field()
  @IsEmail({}, { message: 'Invalid email address.' })
  authProviderEmail: string;

  @Field()
  @IsNotEmpty({ message: 'Password is required.' })
  password: string;
}
