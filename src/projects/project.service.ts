import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { project, projectDocument } from './schema/project.schema';
import { CreateProjectDto } from './dto/project-create.dto';
import { task, taskDocument } from 'src/task/schema/task.schema';

@Injectable()
export class projectService {
  constructor(
    @InjectModel(project.name) private projectModel: Model<projectDocument>,
    @InjectModel(task.name) private taskModel: Model<taskDocument>,
  ) {}

  async create(CreateProjectDto: CreateProjectDto): Promise<object> {
    const model = new this.projectModel({
      ...CreateProjectDto,
    });
    await model.save();
    return {
      msg: 'project create successfully',
      model: model,
    };
  }

  async deleteProject(projectID: string | { id: string }): Promise<string> {
    const id = typeof projectID === 'object' ? projectID.id : projectID;

    const existingProject = await this.projectModel.findOne({
      _id: id,
      isDeleted: 'false',
    });

    if (!existingProject) {
      return 'project not found';
    }

    await this.projectModel.findByIdAndUpdate(id, { isDeleted: 'true' });

    await this.taskModel.updateMany(
      { projectID: id, isDeleted: false },
      {
        $set: { isDeleted: true },
      },
    );
    return 'project delete successfully';
  }
}
