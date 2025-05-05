import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { AuthGuard } from 'src/guard/auth.guard';
import { createTaskDto } from './dto/create-task.dto';
import { updateTaskDto } from './dto/update-task.dto';

@UseGuards(AuthGuard)
@Controller('task')
export class TaskController {
  constructor(private readonly TaskService: TaskService) {}

  @Post('create')
  async createTask(
    @Req() req,
    @Body() createTaskDto: createTaskDto,
  ): Promise<object> {
    const userId = req.userId;
    return await this.TaskService.create(userId, createTaskDto);
  }

  @Put('/update/:id')
  async updateTask(
    @Param('id') taskId: string,
    @Body() updateTaskDto: updateTaskDto,
  ): Promise<string> {
    return await this.TaskService.update(taskId, updateTaskDto);
  }

  @Delete('/delete/:id')
  async deleteTask(@Param('id') taskId: string): Promise<string> {
    return await this.TaskService.deleteTask(taskId);
  }

  @Put('/recycle/:id')
  async recycleTask(@Param('id') taskId: string): Promise<string> {
    return await this.TaskService.recycleTask(taskId);
  }

  @Get('/find')
  async findByUser(@Req() req): Promise<string | object> {
    const userId = req.userId;
    return await this.TaskService.findbyUser(userId);
  }

  @Get('/find/project/:id')
  async findbyProID(@Param('id') projectId): Promise<string | object> {
    return await this.TaskService.findByProjectId(projectId);
  }

  @Get('/find/complete')
  async findCompTask(): Promise<object | string> {
    return await this.TaskService.completeTask();
  }
}
