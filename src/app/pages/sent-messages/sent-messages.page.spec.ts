import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SentMessagesPage } from './sent-messages.page';

describe('SentMessagesPage', () => {
  let component: SentMessagesPage;
  let fixture: ComponentFixture<SentMessagesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SentMessagesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SentMessagesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
