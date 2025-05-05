import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { task, taskDocument } from './schema/task.schema';
import { Model } from 'mongoose';
import { createTaskDto } from './dto/create-task.dto';
import { updateTaskDto } from './dto/update-task.dto';


@Injectable()
export class TaskService {
  constructor(@InjectModel(task.name) private taskModel: Model<taskDocument>) {}

  async create(userId: string, createTaskDto: createTaskDto): Promise<object> {
    const model = new this.taskModel({
      ...createTaskDto,
      status: 'IN_COMPLETE',
      userId: userId,
      isDeleted: false,
    });
    await model.save();
    return {
      msg: 'Task create sucessfully',
      model: model,
    };
  }

  async update(taskId: string, updateTaskDto: updateTaskDto): Promise<string> {
    const existingTask = await this.taskModel.findOne({
      _id: taskId,
      isDeleted: 'false',
    });

    if(!existingTask) return 'task not found'

    const updateObject: Partial<task> = {};

    if (updateTaskDto.title !== undefined) {
      updateObject.title = updateTaskDto.title;
    }

    if (updateTaskDto.description !== undefined) {
      updateObject.description = updateTaskDto.description;
    }

    if (updateTaskDto.status !== undefined) {
      updateObject.status = updateTaskDto.status;
    }
    if (updateTaskDto.projectId !== undefined) {
      updateObject.projectID = updateTaskDto.projectId;
    }
    await this.taskModel.findByIdAndUpdate(taskId, updateObject);
    return 'task update successfully';
  }

  async deleteTask(taskId: string): Promise<string> {
    const existingTask = await this.taskModel.findOne({
      _id: taskId,
      isDeleted: 'false',
    });

    if (!existingTask) return 'task not';

    await this.taskModel.findByIdAndUpdate(taskId, { isDeleted: 'true' });
    return 'Task delete successfully';
  }

  async recycleTask(taskId: string): Promise<string> {
    const existingTask = await this.taskModel.findOne({
      _id: taskId,
      isDeleted: 'true',
    });

    if(!existingTask) return 'task not found'

    await this.taskModel.findByIdAndUpdate(taskId, { isDeleted: 'false' });
    return 'task recycle successfully';
  }

  async findbyUser(userId: string): Promise<object | string> {
    const existingTask = await this.taskModel.find({
      userId: userId,
      isDeleted: 'false',
    });
    if(!existingTask) return 'task not found'

    return existingTask.map((task) => ({
      title: task.title,
      description: task.description,
      status: task.status,
    }));
  }

  async findByProjectId(projectId: string): Promise<object | string> {
    const tasks = await this.taskModel.find({
      projectID: projectId,
      isDeleted: 'false',
    });
    if (!tasks) return 'project not found';

    return tasks.map((task) => ({
      title: task.title,
      description: task.description,
      status: task.status,
    }));
  }

  async completeTask(): Promise<string | object> {
    const tasks = await this.taskModel.find({
      status: 'COMPLETED',
      isDeleted: 'false',
    });
    if (!tasks || tasks.length == 0) return 'no task complete';

    return tasks.map((task) => ({
      title: task.title,
      description: task.description,
      status: task.status,
    }));
  }
}

