import {Injectable} from "@angular/core";
import { ApiService } from '../services/api.service';
import {BehaviorSubject, Observable} from "rxjs";

@Injectable()
export class AccountService {
  private _account = new BehaviorSubject(Object);
  public account: Observable<Object> = this._account.asObservable();

  constructor(private apiService:ApiService) {
    let token = localStorage.getItem('authToken');
    if (token != undefined) {
      this.getAccount();
    }
  }

  getAccount() {
    this.apiService.getAccount().then( res => {
      this._account.next(res);
    });
  }
}
