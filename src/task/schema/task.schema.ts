import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type taskDocument = task & Document;

@Schema()
export class task {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({
    required: true,
    enum: ['IN_COMPLETE', 'COMPLETED'],
    default: 'IN_COMPLETE',
  })
  status: string;

  @Prop({ type: Types.ObjectId, required: true, ref: 'userData' })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'projectData' })
  projectID: Types.ObjectId;

  @Prop({ enum: ['true', 'false'], default: 'false' })
  isDeleted: boolean;
}

export const taskSchema = SchemaFactory.createForClass(task);
