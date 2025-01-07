import { Module } from '@nestjs/common';
import { StorageService } from './storage/storage.service';
import { FseService } from './storage/fse.service';
import { APP_FILTER } from '@nestjs/core';
import { FilesExceptionFilter } from './exception-filters/files-exception/files-exception.filter';

@Module({
  providers: [{ provide: StorageService, useClass: FseService }, { provide: APP_FILTER, useClass: FilesExceptionFilter }],
  exports: [StorageService]
})
export class FilesModule { }
