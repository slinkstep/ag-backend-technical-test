import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

@InputType()
export class RegisterUserInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  name: string;

  @Field()
  @IsEmail()
  authProviderEmail: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  password: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  promoCode?: string;
}
