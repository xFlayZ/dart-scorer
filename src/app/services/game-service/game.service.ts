import { Injectable, Input, NgZone, OnInit } from '@angular/core';
import { GameSettingsService } from '../game-settings/game-settings.service';
import { shuffleArray } from '../../helpers';
import { GameData } from '../../interfaces/game-data.interface';
import { CheckoutService } from '../checkout/checkout.service';
import { SoundService } from '../sound/sound.service';
import { CelebrateService } from '../celebrate/celebrate.service';
import { BehaviorSubject } from 'rxjs';
import { VoiceToTextService } from '../voice-to-text/voice-to-text.service';
import { TextToSpeechService } from '../text-to-speech/text-to-speech.service';

@Injectable({
  providedIn: 'root',
})
export class GameService implements OnInit {
  public gameData: GameData[] = [];
  public playerCount = 0;
  public currentPlayerCount = 0;
  public previousPlayerCount = 0;
  public winnerModalOpen = false;
  public lastRoundScore = 0;
  public lastThrownNumber = '-';
  public possibleCheckout = '-';
  public inRound = true;

  public currentPlayerCountSubject: BehaviorSubject<number> =
    new BehaviorSubject<number>(0);
  public currentPlayerCount$ = this.currentPlayerCountSubject.asObservable();

  public previousPlayerCountSubject: BehaviorSubject<number> =
    new BehaviorSubject<number>(0);
  public previousPlayerCount$ = this.previousPlayerCountSubject.asObservable();

  public legEnd: boolean = false;

  @Input() players: string[] = [];
  @Input() scoreValue = '';

  constructor(
    private gameSettingsService: GameSettingsService,
    private checkoutService: CheckoutService,
    private soundService: SoundService,
    private celebrateService: CelebrateService,
    private voiceToTextService: VoiceToTextService,
    private textToSpeechService: TextToSpeechService,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    this.gameSettingsService.loadSettings();
  }

  setupGame() {
    const savedData = localStorage.getItem('gameStartedData');
    if (savedData) {
      const { players, scoreValue } = JSON.parse(savedData);
      this.players = players;
      this.scoreValue = scoreValue;
    }

    const scoreValueNum = parseInt(this.scoreValue, 10);
    const shuffledPlayers = shuffleArray(this.players);

    this.gameData = shuffledPlayers.map((player) => ({
      playerName: player.playerName,
      score: scoreValueNum,
      wins: 0,
      roundAverage: 0,
      totalAverage: 0,
      highestRound: 0,
      firstDart: '-',
      secondDart: '-',
      thirdDart: '-',
      roundTotal: 0,
      round: 1,
      game: 0,
      isActive: true,
      winnerSong: player.winnerSong,
    }));

    this.playerCount = this.players.length - 1;
    localStorage.setItem('gameData', JSON.stringify(this.gameData));

    if (this.gameSettingsService.gameSettings.speakToTextEnabled) {
      this.speakText();
    }

    this.voiceToScore();
  }

  nextPlayer() {
    this.ngZone.run(() => {
      let currentPlayer = this.gameData[this.currentPlayerCount];

      if (currentPlayer.score === 0) {
        this.winnerModalOpen = true;
        this.celebrateService.celebrate(500);
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
          this.previousPlayerCountSubject.next(this.previousPlayerCount);
        }

        this.currentPlayerCount =
          this.playerCount > this.currentPlayerCount
            ? this.currentPlayerCount + 1
            : 0;

        currentPlayer = this.gameData[this.currentPlayerCount];
        this.currentPlayerCountSubject.next(this.currentPlayerCount);

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
      this.currentPlayerCountSubject.next(this.currentPlayerCount);

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

  specialThrownSounds(thrownNumber: string) {
    this.ngZone.run(() => {
      const currentPlayer = this.gameData[this.currentPlayerCount];
      if (currentPlayer.score < 0) {
        this.playSound('special', 'fail');
      } else {
        if (this.lastRoundScore == 180 && currentPlayer.thirdDart != '-') {
          this.playSound('special', 'score-180');
          this.celebrateService.celebrate(500);
        } else if (
          this.lastRoundScore >= 100 &&
          currentPlayer.thirdDart != '-'
        ) {
          this.playSound('special', 'nice-shot');
          this.celebrateService.celebrate(125);
        } else if (thrownNumber == '50') {
          this.playSound('special', 'clap');
          this.celebrateService.celebrate(125);
        } else if (thrownNumber == 'T20') {
          this.playSound('special', 'clap');
          this.celebrateService.celebrate(125);
        } else if (this.lastRoundScore == 0 && currentPlayer.thirdDart != '-') {
          this.playSound('special', 'fail');
        }
      }
    });
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

  playSound(path: string, sound: string): void {
    this.ngZone.run(() => {
      if (this.gameSettingsService.gameSettings.playSoundEnabled) {
        this.soundService.stopSound();
        this.soundService.playSound(`assets/sounds/${path}/${sound}.mp3`);
      }
    });
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
          this.stopScoreToVoice();
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
}
