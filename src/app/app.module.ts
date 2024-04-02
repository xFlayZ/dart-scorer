import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DartComponent } from './dart/dart.component';
import { DartBoardComponent } from './dart-board/dart-board.component';
import { DartPresetComponent } from './dart-preset/dart-preset.component';
import { DartPresetInfoComponent } from './dart-preset-info/dart-preset-info.component';
import { ErrorMessageComponent } from './error-message/error-message.component';
import { FormsModule } from '@angular/forms';
import { DartGameComponent } from './dart-game/dart-game.component';
import { DartWinnerModalComponent } from './dart-winner-modal/dart-winner-modal.component';
import { FooterComponent } from './footer/footer.component';

@NgModule({
  declarations: [
    AppComponent,
    DartComponent,
    DartBoardComponent,
    DartPresetComponent,
    DartPresetInfoComponent,
    ErrorMessageComponent,
    DartGameComponent,
    DartWinnerModalComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
