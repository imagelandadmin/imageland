
import { Injectable, InjectionToken, ErrorHandler } from '@angular/core';
import { Logger } from 'aws-amplify';

const log = new Logger('error');
export let IErrorService_Token = new InjectionToken<IErrorService>('IErrorService');

export interface IErrorService extends ErrorHandler {

}

@Injectable({ providedIn: 'root' })
export class ErrorService implements IErrorService  {
    handleError(error) {
        log.error(`Uncaught error: \n${JSON.stringify(error)}`);
        alert(`Uncaught error: \n${JSON.stringify(error)}`);
      }
}