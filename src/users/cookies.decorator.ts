import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Request } from "express";

export const Cookies = createParamDecorator((context: ExecutionContext) => {
    const ctx = context.switchToHttp()
    const request = ctx.getRequest<Request>()  
})