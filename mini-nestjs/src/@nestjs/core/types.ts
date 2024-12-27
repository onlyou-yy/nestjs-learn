import { from } from "rxjs";
import { Request, Response } from "express";
export type ClassConstructor<T = any> = new (...args: any[]) => T;
export type ExpressRequest = Request;
export type ExpressResponse = Response;
