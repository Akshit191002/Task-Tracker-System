import { IsOptional, IsString, IsIn } from 'class-validator';
import { Types } from 'mongoose';

export class updateTaskDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  @IsIn(['IN_COMPLETE', 'COMPLETED'])
  status?: 'IN_COMPLETE' | 'COMPLETED';

  @IsOptional()
  @IsString()
  projectId?: Types.ObjectId;
}
