import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { project, projectSchema } from './schema/project.schema';
import { ProjectController } from './project.controller';
import { projectService } from './project.service';
import { task, taskSchema } from 'src/task/schema/task.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: project.name, schema: projectSchema }]),
    MongooseModule.forFeature([{ name: task.name, schema: taskSchema }]),
    UserModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: '1h',
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [ProjectController],
  providers: [projectService],
})
export class projectModule {}
