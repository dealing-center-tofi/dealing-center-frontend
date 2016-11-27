import {Injectable} from '@angular/core';
import 'rxjs/Rx';
import {Subject, Observable, Observer} from "rxjs";
const config = require('../../../config/api.conf');

@Injectable()
export class WebSocketService {
  private subject: Subject<any>;
  private ws: WebSocket;

  private connect(url): Subject<any> {
    if (!this.subject) {
      this.subject = this.create(url);
    }

    return this.subject;
  }

  private create(url): Subject<any> {
    this.ws = new WebSocket(url);

    let observable = Observable.create((obs: Observer<any>) => {
      this.ws.onmessage = obs.next.bind(obs);
      this.ws.onerror = obs.error.bind(obs);
      this.ws.onclose = obs.complete.bind(obs);

      return this.ws.close.bind(this.ws);
    });

    let observer = {
      next: (data: Object) => {
        this.send(data);
      }
    };

    return Subject.create(observer, observable);
  }

  private send(msg) {
    this.waitForSocketConnection(() => {
      this.ws.send(msg);
    });
  }

  private waitForSocketConnection(callback) {
    setTimeout(() => {
      if (this.ws.readyState == 1) {
        callback();
        return;
      }
      this.waitForSocketConnection(callback);
    }, 5)
  }

  public emitAuthorize() {
    this.connection.next(JSON.stringify(['authorize', {'token': localStorage.getItem('authToken')}]));
    this.connection.next(JSON.stringify(['subscribe', {}]));
  }

  public connection = this.connect(config.currenciesSocketUrl);

  public getData(type: string): Subject<any> {

    this.emitAuthorize();

    return <Subject<any>>this.connection
      .skipWhile((res) => {
        let dataType = JSON.parse(res.data)[0];
        return dataType !== type;
      })
      .map((res) => {
        return JSON.parse(res.data)[1];
      });
  }
}
