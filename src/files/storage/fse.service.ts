import { ConflictException, Injectable, NotFoundException, StreamableFile } from '@nestjs/common';
import { StorageService } from './storage.service';
import { BASE_PATH } from '../util/file.constants';
import { join } from 'path';
import { createReadStream, mkdirp, pathExists, readdir, remove, writeFile } from 'fs-extra';

@Injectable()
export class FseService implements StorageService {

    async saveFile(path: string, file: Express.Multer.File) {
        const { originalname, buffer } = file
        const uniqueFileName = this.genUniqueFilename(originalname)
        const fullPath = join(BASE_PATH, path, uniqueFileName)
        await writeFile(fullPath, buffer)
    }

    async createDir(path: string) {
        const fullPath = join(BASE_PATH, path)
        await mkdirp(fullPath)

    }

    getFile(path: string) {
        const fullPath = join(BASE_PATH, path)
        const stream = createReadStream(fullPath)
        return new StreamableFile(stream)
    }

    async getDirFilenames(path: string) {
        const fullPath = join(BASE_PATH, path)
        return readdir(fullPath)
    }

    async getDirFilecount(path: string) {
        const dirFileNames = await this.getDirFilenames(path)
        return dirFileNames.length
    }
    async delete(path: string) {
        const fullPath = join(BASE_PATH, path)
        await remove(fullPath)
    }
    async validatePath(path: string) {
        const fullPath = join(BASE_PATH, path)
        if (!await pathExists(fullPath)) {
            throw new NotFoundException('Path not found')
        }
    }

    validateFileCount(count: number, max: number) {
        if (count > max) {
            throw new ConflictException('File count exceeds max limit')
        }
    }
    genUniqueFilename(filename: string) {
        const uniquePrefix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
        return `${uniquePrefix}-${filename}`
    }
}
