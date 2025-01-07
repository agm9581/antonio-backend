import { ApiFileProperty } from "../decorators/api-file-property.decorator";

export class FilesSchema {

    @ApiFileProperty()
    file: Express.Multer.File[]
}
