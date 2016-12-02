import {Injectable} from "@angular/core";
import { ApiService } from '../services/api.service';
import {BehaviorSubject, Observable} from "rxjs";

@Injectable()
export class AccountService {
  private _account = new BehaviorSubject(Object);
  //public account: Observable<Object> = this._account.asObservable();
  private account;

  constructor(private apiService:ApiService) {
  }

  updateAccount() {
    this.apiService.getAccount().then( res => {
      this.account = res;
      this._account.next(this.account);
    });
  }

  getAccount() {
    if (!this.account) {
      this.updateAccount();
    }
    return this._account.asObservable();
  }
}
