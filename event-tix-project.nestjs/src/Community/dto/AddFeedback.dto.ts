import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class AddCommunityFeedbackDto {
  @IsString()
  @IsOptional()
  feedbackThisCommunity?: string;
}
