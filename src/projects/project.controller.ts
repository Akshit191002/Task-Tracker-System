import { Body, Controller, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/guard/auth.guard';
import { projectService } from './project.service';
import { CreateProjectDto } from './dto/project-create.dto';

@UseGuards(AuthGuard)
@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: projectService) {}

  @Post('create')
  async createTask(
    @Body() CreateProjectDto: CreateProjectDto,
  ): Promise<object> {
    return await this.projectService.create(CreateProjectDto);
  }

  @Put('/delete/:id')
  async deleteProject(@Param() projecID: string): Promise<string> {
    return await this.projectService.deleteProject(projecID);
  }
}
