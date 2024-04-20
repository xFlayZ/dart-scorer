import { Injectable, Input, OnInit } from '@angular/core';
import { GameSettingsService } from '../game-settings/game-settings.service';
import { shuffleArray } from '../../helpers';
import { GameData } from '../../interfaces/game-data.interface';

@Injectable({
  providedIn: 'root',
})
export class GameService implements OnInit {
  public gameData: GameData[] = [];
  public playerCount = 0;

  @Input() players: string[] = [];
  @Input() scoreValue = '';

  constructor(private gameSettingsService: GameSettingsService) {}

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
      //this.speakText();
    }

    //this.voiceToScore();
  }
}
