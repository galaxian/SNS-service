import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { typeORMConfig } from './config/typeorm.config';
import { UserModule } from './user/user.module';
import { BoardModule } from './board/board.module';
import { ThumbModule } from './thumb/thumb.module';

@Module({
  imports: [TypeOrmModule.forRoot(typeORMConfig), UserModule, BoardModule, ThumbModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
