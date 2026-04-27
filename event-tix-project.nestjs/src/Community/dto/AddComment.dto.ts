import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class AddCommentDTO {
  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  comment: string;
}
