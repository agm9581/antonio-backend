import { IntersectionType } from "@nestjs/swagger";
import { IdDto } from "src/common/dto/id.dto";
import { FileNameDto } from "./filename.dto";

export class IdFilenameDto extends IntersectionType(IdDto, FileNameDto) {

}