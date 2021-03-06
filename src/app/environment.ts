
// Angular 2
// rc2 workaround
import { enableDebugTools, disableDebugTools } from '@angular/platform-browser';
import { enableProdMode, ApplicationRef } from '@angular/core';
import { FormBuilder } from '@angular/forms';


import { ApiService } from './services/api.service.ts';
import { WebSocketService } from './services/web-socket.service.ts';
import { CurrencyPairsService } from './services/currency-pairs.service';
import { OrdersService } from './services/orders.service';
import { AccountService} from './services/account.service';
import {HistoryValuesConstsService} from "./services/historyValuesConsts.service";

// Environment Providers
let PROVIDERS: any[] = [
  // common env directives
  FormBuilder,
  ApiService,
  WebSocketService,
  CurrencyPairsService,
  OrdersService,
  AccountService,
  HistoryValuesConstsService
];

// Angular debug tools in the dev console
// https://github.com/angular/angular/blob/86405345b781a9dc2438c0fbe3e9409245647019/TOOLS_JS.md
let _decorateModuleRef = function identity<T>(value: T): T { return value; };

if ('production' === ENV) {
  // Production
  disableDebugTools();
  enableProdMode();

  PROVIDERS = [
    ...PROVIDERS,
    // custom providers in production
  ];

} else {

  _decorateModuleRef = (modRef: any) => {
    const appRef = modRef.injector.get(ApplicationRef);
    const cmpRef = appRef.components[0];

    let _ng = (<any>window).ng;
    enableDebugTools(cmpRef);
    (<any>window).ng.probe = _ng.probe;
    (<any>window).ng.coreTokens = _ng.coreTokens;
    return modRef;
  };

  // Development
  PROVIDERS = [
    ...PROVIDERS,
    // custom providers in development
  ];

}

export const decorateModuleRef = _decorateModuleRef;

export const ENV_PROVIDERS = [
  ...PROVIDERS
];
