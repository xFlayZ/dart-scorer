import { Component, EventEmitter, Input, NgZone, OnInit } from '@angular/core';
import { CheckoutService } from '../services/checkout/checkout.service';
import { GameData } from '../interfaces/game-data.interface';
import { TextToSpeechService } from '../services/text-to-speech/text-to-speech.service';
import { SoundService } from '../services/sound/sound.service';
import confetti from 'canvas-confetti';
import { VoiceToTextService } from '../services/voice-to-text/voice-to-text.service';
import { GameSettingsService } from '../services/game-settings/game-settings.service';
import { GameService } from '../services/game-service/game.service';

@Component({
  selector: 'app-dart-game-single-out',
  templateUrl: './dart-game-single-out.component.html',
  styleUrls: ['./dart-game-single-out.component.scss'],
})
export class DartGameSingleOutComponent implements OnInit {
  public gameData: GameData[] = [];
  public playerCount = 0;
  public currentPlayerCount = 0;
  public previousPlayerCount = 0;
  public lastRoundScore = 0;
  public lastThrownNumber = '-';
  public possibleCheckout = '-';
  public inRound = true;
  public winnerModalOpen = false;
  public legEnd = false;
  public isOneActivePlayer = true;

  @Input() players: string[] = [];
  @Input() scoreValue = '';

  constructor(
    private checkoutService: CheckoutService,
    private textToSpeechService: TextToSpeechService,
    private soundService: SoundService,
    private voiceToTextService: VoiceToTextService,
    private ngZone: NgZone,
    private gameSettingsService: GameSettingsService,
    private gameService: GameService
  ) {}

  ngOnInit(): void {
    this.gameSettingsService.loadSettings();
    this.gameService.setupGame();
    this.gameData = this.gameService.gameData;
  }

  onThrownNumberChange(thrownNumber: string) {
    if (this.inRound && !this.legEnd) {
      const currentPlayer = this.gameData[this.currentPlayerCount];
      const darts = ['firstDart', 'secondDart', 'thirdDart'];
      const emptyDartIndex = darts.findIndex(
        (dart) => currentPlayer[dart] === '-'
      );

      if (emptyDartIndex !== -1) {
        this.calcScore(thrownNumber);
        currentPlayer[darts[emptyDartIndex]] = thrownNumber;
        this.calculateCheckoutCurrentPlayer();

        this.specialThrownSounds(thrownNumber);

        if (emptyDartIndex === 2 || currentPlayer.score <= 0) {
          this.inRound = false;
          this.stopScoreToVoice();
        }
      }
    }
    this.lastThrownNumber = thrownNumber;
  }

  nextRound() {
    this.ngZone.run(() => {
      const scoreValueNum = parseInt(this.scoreValue, 10);

      if (this.gameData && this.gameData.length > 0) {
        const lastPlayer = this.gameData.shift();

        if (lastPlayer) {
          this.gameData.push(lastPlayer);
        }

        this.gameData.forEach((player) => {
          if (player) {
            player.roundTotal = 0;
            player.firstDart = '-';
            player.secondDart = '-';
            player.thirdDart = '-';
            player.round = 1;
            player.roundAverage = 0;
            player.score = scoreValueNum;
          }
        });

        if (this.gameData[0]) {
          this.gameData[0].game++;
        }

        this.playerCount = this.gameData.length - 1;
      }
      this.legEnd = false;
      localStorage.setItem('gameData', JSON.stringify(this.gameData));

      const currentPlayer = this.gameData[this.currentPlayerCount];

      if (!currentPlayer.isActive) {
        this.nextPlayer();
      }

      if (
        this.gameSettingsService.gameSettings.speakToTextEnabled &&
        currentPlayer.isActive
      ) {
        this.speakText();
      }

      this.lastRoundScore = 0;
    });
  }

  nextPlayer() {
    this.ngZone.run(() => {
      let currentPlayer = this.gameData[this.currentPlayerCount];

      if (currentPlayer.score === 0) {
        this.winnerModalOpen = true;
        this.celebrate(500);
        this.playSound('victory', currentPlayer.winnerSong);
      } else {
        if (currentPlayer.score < 0) {
          this.deleteLastDart();
          this.deleteLastDart();
          this.deleteLastDart();
        }
        if (this.lastRoundScore > currentPlayer.highestRound) {
          if (this.lastRoundScore > 180) {
            currentPlayer.highestRound = 180;
          } else {
            currentPlayer.highestRound = this.lastRoundScore;
          }
        }
        this.lastRoundScore = 0;
        currentPlayer.roundAverage = parseFloat(
          (currentPlayer.roundTotal / currentPlayer.round).toFixed(2)
        );

        if (currentPlayer.isActive) {
          currentPlayer.round += 1;
          this.previousPlayerCount = this.currentPlayerCount;
        }

        this.currentPlayerCount =
          this.playerCount > this.currentPlayerCount
            ? this.currentPlayerCount + 1
            : 0;

        currentPlayer = this.gameData[this.currentPlayerCount];

        if (!currentPlayer.isActive) {
          this.nextPlayer();
        }

        currentPlayer.firstDart = '-';
        currentPlayer.secondDart = '-';
        currentPlayer.thirdDart = '-';
      }
      this.calculateCheckoutCurrentPlayer();
      if (
        this.gameSettingsService.gameSettings.speakToTextEnabled &&
        currentPlayer.isActive
      ) {
        this.speakText();
      }
      this.inRound = true;
      localStorage.setItem('gameData', JSON.stringify(this.gameData));
      this.voiceToScore();
    });
  }

  calcScore(thrownNumber: string) {
    const multiplier = thrownNumber.charAt(0);
    const number =
      multiplier === 'T' || multiplier === 'D'
        ? thrownNumber.slice(1)
        : thrownNumber;
    const multiplierFactor =
      multiplier === 'T' ? 3 : multiplier === 'D' ? 2 : 1;
    const score = parseInt(number) * multiplierFactor;

    this.lastRoundScore += score;
    this.gameData[this.currentPlayerCount].roundTotal += score;
    this.gameData[this.currentPlayerCount].score -= score;
    localStorage.setItem('gameData', JSON.stringify(this.gameData));
  }

  deleteLastDart() {
    this.ngZone.run(() => {
      const currentPlayer = this.gameData[this.currentPlayerCount];
      const darts = ['thirdDart', 'secondDart', 'firstDart'];
      const filledDartIndex = darts.findIndex(
        (dart) =>
          typeof currentPlayer[dart] === 'string' && currentPlayer[dart] !== '-'
      );

      if (filledDartIndex !== -1) {
        const score = currentPlayer[darts[filledDartIndex]] as string;
        const multiplier = score.charAt(0);
        const number =
          multiplier === 'T' || multiplier === 'D' ? score.slice(1) : score;
        const multiplierFactor =
          multiplier === 'T' ? 3 : multiplier === 'D' ? 2 : 1;

        this.lastRoundScore -= parseInt(number) * multiplierFactor;
        currentPlayer.roundTotal -= parseInt(number) * multiplierFactor;
        currentPlayer.score += parseInt(number) * multiplierFactor;
        currentPlayer[darts[filledDartIndex]] = '-';
        this.calculateCheckoutCurrentPlayer();
      }
      this.inRound = true;
      localStorage.setItem('gameData', JSON.stringify(this.gameData));
    });
  }

  closeWinnerModal() {
    const currentPlayer = this.gameData[this.currentPlayerCount];
    currentPlayer.wins += 1;
    this.legEnd = true;
    this.winnerModalOpen = false;
    localStorage.setItem('gameData', JSON.stringify(this.gameData));
  }

  calculateCheckoutCurrentPlayer() {
    const currentPlayer = this.gameData[this.currentPlayerCount];
    const score = currentPlayer.score;
    let checkout = this.checkoutService.getCheckout(score);

    if (currentPlayer.thirdDart !== '-') {
      checkout = '';
    } else if (currentPlayer.secondDart !== '-') {
      checkout = this.checkoutService.getOneDartCheckout(score);
    } else if (currentPlayer.firstDart !== '-') {
      checkout = this.checkoutService.getTwoDartsCheckout(score);
    }

    this.possibleCheckout = checkout !== '' ? checkout : '-';
    localStorage.setItem('gameData', JSON.stringify(this.gameData));
  }

  get sortedGameData() {
    return this.gameData.slice().sort((a, b) => b.wins - a.wins);
  }

  speakText(): void {
    const currentPlayer = this.gameData[this.currentPlayerCount];

    let possibleCheckoutText = ``;
    if (this.possibleCheckout != '-') {
      possibleCheckoutText = `Möglicher Checkout: ${this.possibleCheckout}`;
    }

    let textToSpeak = `${currentPlayer.playerName} | Verbleibender Score: ${currentPlayer.score} | ${possibleCheckoutText}`;

    if (currentPlayer.score == 0) {
      textToSpeak = `${currentPlayer.playerName} hat die Runde Gewonnen!`;
    }

    this.textToSpeechService.speak(textToSpeak);
  }

  playSound(path: string, sound: string): void {
    this.ngZone.run(() => {
      if (this.gameSettingsService.gameSettings.playSoundEnabled) {
        this.soundService.stopSound();
        this.soundService.playSound(`assets/sounds/${path}/${sound}.mp3`);
      }
    });
  }

  specialThrownSounds(thrownNumber: string) {
    this.ngZone.run(() => {
      const currentPlayer = this.gameData[this.currentPlayerCount];
      if (currentPlayer.score < 0) {
        this.playSound('special', 'fail');
      } else {
        if (this.lastRoundScore == 180 && currentPlayer.thirdDart != '-') {
          this.playSound('special', 'score-180');
          this.celebrate(500);
        } else if (
          this.lastRoundScore >= 100 &&
          currentPlayer.thirdDart != '-'
        ) {
          this.playSound('special', 'nice-shot');
          this.celebrate(125);
        } else if (thrownNumber == '50') {
          this.playSound('special', 'clap');
          this.celebrate(125);
        } else if (thrownNumber == 'T20') {
          this.playSound('special', 'clap');
          this.celebrate(125);
        } else if (this.lastRoundScore == 0 && currentPlayer.thirdDart != '-') {
          this.playSound('special', 'fail');
        }
      }
    });
  }

  celebrate(particleCount: number) {
    if (this.gameSettingsService.gameSettings.animationEnabled) {
      const duration = 5000; // in milliseconds

      confetti({
        particleCount: particleCount,
        spread: 320,
        origin: { y: 0.4 },
      });

      // Clear confetti after a certain duration
      setTimeout(() => confetti.reset(), duration);
    }
  }

  voiceToScore() {
    if (this.gameSettingsService.gameSettings.voiceToTextEnabled) {
      this.voiceToTextService.startListening('', (transcript: string) => {
        const cleanedTranscript = transcript.trim().toLowerCase();
        const words = cleanedTranscript.split(' ');
        console.log(cleanedTranscript);
        if (words.length === 2 && words[0] === 'treffer') {
          const thrownNumber = words[1];
          console.log(thrownNumber.toUpperCase());
          this.onThrownVoiceNumberChange(thrownNumber.toUpperCase());
        }
        if (cleanedTranscript === 'nächster spieler') {
          this.nextPlayer();
          //this.stopScoreToVoice();
        }
        if (cleanedTranscript === 'dart löschen') {
          this.deleteLastDart();
        }
      });
    }
  }

  stopScoreToVoice() {
    if (this.gameSettingsService.gameSettings.voiceToTextEnabled) {
      this.voiceToTextService.stopListening();
    }
  }

  onThrownVoiceNumberChange(thrownNumber: string) {
    this.ngZone.run(() => {
      const currentPlayer = this.gameData[this.currentPlayerCount];
      if (this.inRound && !this.legEnd) {
        const darts = ['firstDart', 'secondDart', 'thirdDart'];
        const emptyDartIndex = darts.findIndex(
          (dart) => currentPlayer[dart] === '-'
        );

        if (emptyDartIndex !== -1) {
          this.calcScore(thrownNumber);
          currentPlayer[darts[emptyDartIndex]] = thrownNumber;
          this.calculateCheckoutCurrentPlayer();

          this.specialThrownSounds(thrownNumber);

          if (emptyDartIndex === 2 || currentPlayer.score <= 0) {
            this.inRound = false;
          }
        }
      }
      this.lastThrownNumber = thrownNumber;
    });
  }

  resetRound(): void {
    this.legEnd = true;
  }

  resetGame(): void {
    this.gameService.setupGame();
  }

  togglePlayerStatuss(player: any): void {
    const currentPlayer = this.gameData[this.currentPlayerCount];
    this.checkIfOneActivePlayer(player);

    if (!this.isOneActivePlayer && !this.legEnd) {
      // add confirm modal
      this.legEnd = true;
    } else if (currentPlayer.playerName == player.player) {
      // add confirm modal
      if (!this.legEnd) {
        this.nextPlayer();
      }
    }
  }

  checkIfOneActivePlayer(player: any) {
    player.isActive = !player.isActive;
    this.isOneActivePlayer = this.gameData.some((player) => player.isActive);
  }
}
