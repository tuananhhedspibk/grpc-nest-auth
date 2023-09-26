import { GrpcMethod, GrpcStreamMethod } from '@nestjs/microservices';
import { util, configure } from 'protobufjs/minimal';
import Long from 'long';
import { Observable } from 'rxjs';

export const protobufPackage = 'auth';

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface RegisterResponse {
  status: number;
  error: string[];
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  status: number;
  error: string[];
  token: string;
}

export interface ValidateRequest {
  token: string;
}

export interface ValidateResponse {
  status: number;
  error: string[];
  userId: number;
}

export const AUTH_PACKAGE_NAME = 'auth';

export interface AuthServiceClient {
  register(request: RegisterRequest): Observable<RegisterResponse>;
  login(request: LoginRequest): Observable<LoginResponse>;
  validate(request: ValidateRequest): Observable<ValidateResponse>;
}

export interface AuthServiceController {
  request(
    request: RegisterRequest,
  ):
    | Promise<RegisterResponse>
    | Observable<RegisterResponse>
    | RegisterResponse;
  login(
    request: LoginRequest,
  ): Promise<LoginResponse> | Observable<LoginResponse> | LoginResponse;
  validate(
    request: ValidateRequest,
  ):
    | Promise<ValidateResponse>
    | Observable<ValidateResponse>
    | ValidateResponse;
}

export const AuthServiceControllerMethods = () => {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return function (constructor: Function) {
    const grpcMethods: string[] = ['register', 'login', 'validate'];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method,
      );
      GrpcMethod('AuthService', method)(
        constructor.prototype[method],
        method,
        descriptor,
      );
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method,
      );
      GrpcStreamMethod('AuthService', method)(
        constructor.prototype[method],
        method,
        descriptor,
      );
    }
  };
};

export const AUTH_SERVICE_NAME = 'AuthService';

if (util.Long !== Long) {
  util.Long = Long;
  configure();
}
