import { Component, OnInit, Input, Output , ElementRef, EventEmitter, ViewChild, ViewEncapsulation }  from '@angular/core';

@Component({
  selector: 'app-chat-input',
  templateUrl: './chat-input.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./chat-input.component.css']
})
export class ChatInputComponent implements OnInit {
  @Input() public buttonText = '↩︎'
  @Input() public focus = new EventEmitter()
  @Output() public send = new EventEmitter()
  @Output() public dismiss = new EventEmitter()
  @ViewChild('message') message: ElementRef

  constructor() { }

  ngOnInit(): void {
  }

  public focusMessage() {
    this.message.nativeElement.focus()
  }

  public getMessage() {
    return this.message.nativeElement.value
  }

  public clearMessage() {
    this.message.nativeElement.value = ''
  }

  onSubmit()
  {
    console.log('Submit toggle chat');
    console.log(this.message.nativeElement.value);
    const message = this.getMessage()
    this.send.emit({ message })
  }
}
