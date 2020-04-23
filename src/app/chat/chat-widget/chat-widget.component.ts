import { Component, OnInit, Input } from '@angular/core';
import { fadeIn, fadeInOut } from '../animation';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ChatServicesService } from '../chat-services/chat-services.service';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};


const rand = (max) => Math.floor(Math.random() * max);

@Component({
  selector: 'app-chat-widget',
  templateUrl: './chat-widget.component.html',
  styleUrls: ['./chat-widget.component.css'],
  animations: [fadeInOut, fadeIn],
})
export class ChatWidgetComponent implements OnInit {
  public _visible = false;

  public sender = {
    avatar: `https://randomuser.me/api/portraits/women/${rand(100)}.jpg`,
  };
  public client = {
    avatar: `https://randomuser.me/api/portraits/men/${rand(100)}.jpg`,
  };

  public messages = [];
  
  val = []
  public get visible() {
    return this._visible;
  }

  @Input() public set visible(visible) {
    this._visible = visible;
    if (this._visible) {
      setTimeout(() => {}, 0);
    }
  }

  constructor(
    public httpClient: HttpClient,
    private chatservice: ChatServicesService
  ) {}

  ngOnInit(): void {
    setTimeout(() => (this.visible = true), 1000);
    setTimeout(() => {
      this.addMessage(this.sender, 'Hi, how can we help you?', 'received');
    }, 1500);
  }

  public botMessage(message) {
    this.addMessage(this.sender, message, 'received');
  }

  public addMessage(from, message, type) {
    this.messages.unshift({
      from,
      message,
      type,
      date: new Date().getTime(),
    });
  }

  public sendMessage({ message }) {
    console.log('Im in the send message');

    //return empty strings
    if (message.trim() === '') {
      return;
    }

    //User Message
    this.addMessage(this.client, message, 'sent');

    this.chatservice.botMessageRequest(message).subscribe((res) => {
      console.log("res", res);
      this.val = JSON.parse(res.toString());
      console.log('Val', this.val[0].text);
    });

    //Bot will respond back
    setTimeout(() => this.botMessage(this.val[0].text), 1000);
  }

  toggleChat() {
    console.log('Toggle chat');
    this.visible = !this.visible;
  }
}
