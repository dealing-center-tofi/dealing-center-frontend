import {Injectable} from '@angular/core'; 
import 'rxjs/Rx'; 
import {Subject, Observable, Observer} from "rxjs"; 

@Injectable() 
export class WebSocketService { 
  private subject: Subject<any>; 
  private ws; 

  public connect(url): Subject<any> { 
  
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
        this.sendMessage(data);
      }
    }; 
    
    return Subject.create(observer, observable); 
  } 

  private sendMessage(msg) { 
    this.waitForSocketConnection(() => { 
      this.ws.send(msg); 
    }); 
  }; 

  private waitForSocketConnection(callback) { 
    setTimeout(() => { 
      if (this.ws.readyState == 1) { 
        callback(); 
      return; 
      } 
    this.waitForSocketConnection(callback); 
    }, 5); 
  }; 
}
