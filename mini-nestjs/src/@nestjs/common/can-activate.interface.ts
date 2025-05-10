import { ExecutionContext } from "@nestjs/common";

export interface CanActivate {
  canActivate(context: ExecutionContext): boolean;
}
