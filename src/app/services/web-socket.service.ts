import {Injectable} from '@angular/core';
import 'rxjs/Rx';
import {Subject, Observable, Observer} from "rxjs";
const config = require('../../../config/api.conf');

@Injectable()
export class WebSocketService {
  private subject: Subject<any>;
  private ws: WebSocket;
  private isConnected = false;
  private types:Set = new Set([]);

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
    }).share();

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
    this.isConnected = true;
    this.connection.next(JSON.stringify(['authorize', {'token': localStorage.getItem('authToken')}]));
    this.connection.next(JSON.stringify(['subscribe', {}]));
    this.connection.next(JSON.stringify(['orders_closing_subscribe', {}]));
  }

  public connection = this.connect(config.currenciesSocketUrl);

  public getData(type: string): Subject<any> {
    if (!this.isConnected)
      this.emitAuthorize();

    this.types.add(type);
    console.log('start', type);

    return <Subject<any>>this.connection
      .skipWhile((res) => {
        let dataType = JSON.parse(res.data)[0];
        console.log(this.types);
        return !this.types.has(dataType);
      }).filter((res) => {
        console.log(res);
        return true;
      })
      .map((res) => {
        let dataType = JSON.parse(res.data)[0];
        return {event: dataType, res: JSON.parse(res.data)[1]};
      });
  }

  unsubscribe() {
    this.isConnected = false;
    this.connection.next(JSON.stringify(['unsubscribe', {}]));
  }

}
