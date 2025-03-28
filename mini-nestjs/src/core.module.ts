import { Module } from "@nestjs/common";
import { CommonModule } from "./common.module";
import { OtherModule } from "./other.module";

@Module({
  imports: [CommonModule, OtherModule],
  exports: [CommonModule, OtherModule],
})
export class CoreModule {}
