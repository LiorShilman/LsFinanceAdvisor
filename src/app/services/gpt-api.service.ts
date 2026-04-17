import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GptApiService {

  private subUpdateAssistentResult = new Subject();

  public subUpdateAssistentResultObservable$ = this.subUpdateAssistentResult as Observable<string>;
  
  //private socket: WebSocketSubject<{ type: string, message: string }>;

  constructor(private http: HttpClient) {

    //this.socket = webSocket('ws://shilmanlior2608.ddns.net:8001');

    /* this.socket.subscribe(
      (message) => {
        // Handle incoming messages
        if (message.type === 'chank' || message.type === 'log') {
          this.subUpdateAssistentResult.next(message.message);
        }
      },
      (error) => {
        // Handle connection errors
        console.error('WebSocket connection error:', error);
        // Perform any necessary error handling, such as logging or displaying an error message
      }
    ); */
  }

  WriteToFile(content: any[],filePathChat: string) {
    const url = 'http://shilmanlior2608.ddns.net:8000/api/writeFile'; // Replace with the appropriate URL
    const body = { content,filePathChat}; // Update the body object with role and prompt keys
    return this.http.post(url, body);
  }

  // Read data (your array of objects) from a file on the server
  ReadFromFile(id: string) {
    return this.http.get(`http://shilmanlior2608.ddns.net:8000/api/readFile/${id}`);
  }

  sendPrompt(chat: { role: string, content: string },gptVersion:string) {
    const url = 'http://shilmanlior2608.ddns.net:8000/api/prompt'; // Replace with the appropriate URL
    const body = { chat: chat ,gptVersion: gptVersion}; // Update the body object with role and prompt keys

    return this.http.post(url, body);
  }
}
