import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { fadeIn, fadeInOut } from '../animation';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ChatServicesService } from '../chat-services/chat-services.service';


const rand = (max) => Math.floor(Math.random() * max);

@Component({
  selector: 'app-chat-widget',
  templateUrl: './chat-widget.component.html',
  styleUrls: ['./chat-widget.component.css'],
  animations: [fadeInOut, fadeIn],
})
export class ChatWidgetComponent implements OnInit {
  public _visible = false;
  @ViewChild('mydiv') mydiv: ElementRef;
  public sender = {
    avatar: `https://randomuser.me/api/portraits/women/${rand(100)}.jpg`,
  };
  public client = {
    avatar: `https://randomuser.me/api/portraits/men/${rand(100)}.jpg`,
  };

  public messages = [];
  public BT = [];
  a: string;
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
        'text',
        false
      );
    }, 1500);
  }

  public botMessage(message, text, buttons) {
    if (text !== 'image') {
      this.addMessage(this.sender, message, 'received', text, buttons);
    } else {
      this.image = message;
      this.addMessage(this.sender, this.image, 'received', text, buttons);
    }
  }

  public addMessage(from, message, source, type, buttons) {
    this.messages.unshift({
      from,
      message,
      source,
      date: new Date().getTime(),
      type,
      buttons,
    });
  }

  public sendMessage({ message }) {
    console.log('Im in the send message');

    //return empty strings
    if (message.trim() === '') {
      return;
    }

    //User Message
    this.addMessage(this.client, message, 'sent', 'text', false);

    this.BotRequestMessage(message);
  }

  addBT(title: any) {
    this.BT.push({ title });
  }

  buttonclick($event: Event) {
    var a = $event.srcElement as HTMLElement;

    //To find the right Payload.
    var payloadval: any;
    for (var i = 0; i < this.BT.length; i++)
      if (this.BT[i].title.title === a.innerText)
        payloadval = this.BT[i].title.payload;

    //return empty strings
    if (a.innerText.trim() === '') return;

    //console.log('mydiv', this.mydiv);

    for (var i = 0; i < this.messages.length; i++)
      if (this.messages[i].buttons === true) this.messages[i].buttons = false;

    this.BT = [];

    //User Message
    this.addMessage(this.client, a.innerText, 'sent', 'text', false);

    // pass is at JSON /inform {facility_type:Hospital}
    this.BotRequestMessage(payloadval);
  }

  BotRequestMessage(m: any) {
    this.chatservice.botMessageRequest(m).subscribe((res) => {
      this.val = JSON.parse(res);

      for (var key in this.val) {
        //Bot will respond back
        if (this.val[key].text) {
          this.botMessage(this.val[key].text, 'text', false);

          if (this.val[key].buttons) {
            this.botMessage(this.val[key].text, 'text', true);

            for (var k in this.val[key].buttons) {
              this.addBT(this.val[key].buttons[k]);
            }
          }
        }
        if (this.val[key].image) {
          this.botMessage(this.val[key].image, 'image', false);
        } else {
          console.log('not working', this.val[key]);
        }
      }
    });
  }

  toggleChat() {
    console.log('Toggle chat');
    this.visible = !this.visible;
  }
}
