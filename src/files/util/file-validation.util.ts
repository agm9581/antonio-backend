import { FileTypeValidator, FileValidator, MaxFileSizeValidator } from "@nestjs/common"
import bytes from "bytes"
import { lookup } from "mime-types"
import { NonEmptyArray } from "src/common/util/array.util"
type FileSize = `${number}${'KB' | 'MB' | 'GB'}`
type FileType = 'png' | 'jpeg' | 'pdf'


const createFileTypeRegex = (fileTypes: FileType[]) => {
    const mediaTypes = fileTypes.map(type => lookup(type))
    return new RegExp(mediaTypes.join('|'))
}

export const createFileValidators = (maxSize: FileSize, ...fileTypes: NonEmptyArray<FileType>): FileValidator[] => {
    const fileTypeRegex = createFileTypeRegex(fileTypes)
    return [new MaxFileSizeValidator({ maxSize: bytes(maxSize) }), new FileTypeValidator({ fileType: fileTypeRegex })]
}