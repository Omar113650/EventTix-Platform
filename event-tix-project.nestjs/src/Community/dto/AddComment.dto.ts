import { IsString, IsNotEmpty } from 'class-validator';

export class AddCommentDTO {
  @IsString()
  @IsNotEmpty()
  comment: string;
}
