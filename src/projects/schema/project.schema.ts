import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type projectDocument = project & Document;

@Schema()
export class project {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: Types.ObjectId, required: true, ref: 'userData' })
  userId: Types.ObjectId;

  @Prop({ enum: ['true', 'false'], default: 'false' })
  isDeleted: boolean;
}

export const projectSchema = SchemaFactory.createForClass(project);
