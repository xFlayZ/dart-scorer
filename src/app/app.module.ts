import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DartBoardComponent } from './shared/dart-board/dart-board.component';
import { DartPresetComponent } from './dart-preset/dart-preset.component';
import { DartPresetInfoComponent } from './dart-preset/dart-preset-info/dart-preset-info.component';
import { ErrorMessageComponent } from './shared/alerts/error-message/error-message.component';
import { FormsModule } from '@angular/forms';
import { DartGameSingleOutComponent } from './dart-game-single-out/dart-game-single-out.component';
import { DartWinnerModalComponent } from './shared/modals/dart-winner-modal/dart-winner-modal.component';
import { FooterComponent } from './shared/footer/footer.component';
import { DartGameAroundTheClockComponent } from './dart-game-around-the-clock/dart-game-around-the-clock.component';
import { DartGameDoubleOutComponent } from './dart-game-double-out/dart-game-double-out.component';
import { TextToSpeechService } from './services/text-to-speech.service';
import { SoundService } from './services/sound.service';
import { ChooseSongModalComponent } from './shared/modals/choose-song-modal/choose-song-modal.component';
import { VoiceToTextService } from './services/voice-to-text.service';
import { ModalConfirmActionComponent } from './shared/modal-confirm-action/modal-confirm-action.component';

@NgModule({
  declarations: [
    AppComponent,
    DartBoardComponent,
    DartPresetComponent,
    DartPresetInfoComponent,
    ErrorMessageComponent,
    DartGameSingleOutComponent,
    DartWinnerModalComponent,
    FooterComponent,
    DartGameAroundTheClockComponent,
    DartGameDoubleOutComponent,
    ChooseSongModalComponent,
    ModalConfirmActionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
  ],
  providers: [TextToSpeechService, VoiceToTextService, SoundService],
  bootstrap: [AppComponent]
})
export class AppModule { }
