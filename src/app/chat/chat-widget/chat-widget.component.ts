import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { fadeIn, fadeInOut } from '../animation';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ChatServicesService } from '../chat-services/chat-services.service';
import { query } from '@angular/animations';

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

  public val = [];

  public get visible() {
    return this._visible;
  }

  @Input() public set visible(visible) {
    this._visible = visible;
    if (this._visible) {
      setTimeout(() => {}, 0);
    }
  }

  @Input() public image: string;

  i = 'https://i.imgur.com/nGF1K8f.jpg';

  constructor(
    public httpClient: HttpClient,
    private chatservice: ChatServicesService
  ) {}

  ngOnInit(): void {
    setTimeout(() => (this.visible = true), 1000);
    setTimeout(() => {
      this.addMessage(
        this.sender,
        'Hi, how can we help you?',
        'received',
        'text'
      );
    }, 1500);
  }

  public botMessage(message, text) {
    if (text !== 'image') {
      this.addMessage(this.sender, message, 'received', text);
    } else {
      this.image = message;
      this.addMessage(this.sender, this.image, 'received', text);
    }
  }

  public addMessage(from, message, source, type) {
    this.messages.unshift({
      from,
      message,
      source,
      date: new Date().getTime(),
      type,
    });
  }

  public sendMessage({ message }) {
    console.log('Im in the send message');

    //return empty strings
    if (message.trim() === '') {
      return;
    }

    //User Message
    this.addMessage(this.client, message, 'sent', 'text');

    this.chatservice.botMessageRequest(message).subscribe((res) => {
      console.log('res', res);
      this.val = JSON.parse(res);
      console.log('val', this.val);
      for (var key in this.val) {
        console.log('Key: ' + key);

        //Bot will respond back
        if (this.val[key].text) {
          console.log('Text' + this.val[key].text);

          this.botMessage(this.val[key].text, 'text');
        } else if (this.val[key].image) {
          console.log('Image' + this.val[key].image);

          this.botMessage(this.val[key].image, 'image');
        } else {
          console.log('not working');
        }
      }
    });
  }

  toggleChat() {
    console.log('Toggle chat');
    this.visible = !this.visible;
  }
}
