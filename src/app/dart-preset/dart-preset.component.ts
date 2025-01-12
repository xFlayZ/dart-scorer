import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { ChooseSongModalComponent } from '../shared/choose-song-modal/choose-song-modal.component';

interface Player {
  name: string;
  winnerSong: string;
}

@Component({
  selector: 'app-dart-preset',
  templateUrl: './dart-preset.component.html',
  styleUrl: './dart-preset.component.scss',
})
export class DartPresetComponent implements OnInit {
  gameModes = [
    {
      value: 'singleOut',
      label: 'Single Out',
      backgroundImage: 'assets/images/single_out.webp',
    },
    {
      value: 'doubleOut',
      label: 'Double Out',
      backgroundImage: 'assets/images/double_out.webp',
    },
    {
      value: 'aroundTheClock',
      label: 'Around the Clock',
      backgroundImage: 'assets/images/around_the_clock.webp',
      difficulty: [
        {
          value: 'easy',
          label: 'Einfach',
          backgroundImage: 'assets/images/easy.png',
        },
        {
          value: 'normal',
          label: 'Doppel',
          backgroundImage: 'assets/images/normal.png',
        },
      ],
    },
    {
      value: 'luckyNumber',
      label: 'Lucky Number',
      backgroundImage: 'assets/images/lucky_number.webp',
      difficulty: [
        {
          value: 'easy',
          label: 'Einfach',
          backgroundImage: 'assets/images/easy.png',
        },
        {
          value: 'normal',
          label: 'Doppel',
          backgroundImage: 'assets/images/normal.png',
        },
      ],
    },
    {
      value: 'killerDart',
      label: 'Killer Dart',
      backgroundImage: 'assets/images/killer_dart.webp',
      difficulty: [
        {
          value: 'easy',
          label: 'Einfach',
          backgroundImage: 'assets/images/easy.png',
        },
        {
          value: 'normal',
          label: 'Doppel',
          backgroundImage: 'assets/images/normal.png',
        },
      ],
    },
  ];

  scores = [
    {
      value: '301',
      label: '301',
      backgroundImage: 'assets/images/score_301.webp',
    },
    {
      value: '501',
      label: '501',
      backgroundImage: 'assets/images/score_501.webp',
    },
  ];

  needScore = ['singleOut', 'doubleOut'];
  needDifficulty = ['aroundTheClock', 'luckyNumber', 'killerDart'];

  selectedGameMode = 'singleOut';
  selectedScore = '301';
  selectedDifficulty = 'easy';

  isLiteMode: boolean = false;
  players: Player[] = [];
  gameSettings: string[] = [];
  newPlayerName: string = '';
  scoreValue: string = '301';
  gameMode: string = 'singleOut';
  errorMessage: string = '';
  resetButton: boolean = false;
  @Output() gameStarted: EventEmitter<{
    players: Player[];
    scoreValue: string;
    gameMode: string;
  }> = new EventEmitter();
  @ViewChild(ChooseSongModalComponent) songModal!: ChooseSongModalComponent;

  constructor(private router: Router) {}

  ngOnInit(): void {
    const savedPlayers = localStorage.getItem('players');
    if (savedPlayers) {
      this.players = JSON.parse(savedPlayers);
      this.resetButton = true;
    }
  }

  addPlayer(): void {
    const savedPlayers = localStorage.getItem('players');
    if (savedPlayers) {
      this.players = JSON.parse(savedPlayers);
    }
    let playerName = this.newPlayerName.trim();
    if (playerName !== '') {
      playerName = playerName.charAt(0).toUpperCase() + playerName.slice(1);
      this.players.push({ name: playerName, winnerSong: 'default' });
      this.newPlayerName = '';
      this.errorMessage = '';
      this.resetButton = true;
    }
    localStorage.setItem('players', JSON.stringify(this.players));
  }

  removePlayer(index: number): void {
    if (index >= 0 && index < this.players.length) {
      this.players.splice(index, 1);
    }
    if (this.players.length == 0) {
      this.resetButton = false;
    }
    localStorage.setItem('players', JSON.stringify(this.players));
  }

  updateParticipantsList(): void {
    const participantsList = document.querySelector('.card-body ul');

    if (participantsList) {
      participantsList.innerHTML = '';

      this.players.forEach((player) => {
        const listItem = document.createElement('li');
        listItem.textContent = player.name;
        participantsList.appendChild(listItem);
      });
    } else {
      console.error('Teilnehmerliste nicht gefunden.');
    }
  }

  startGame(): void {

    const savedPlayers = localStorage.getItem('players');
    if (savedPlayers) {
      this.players = JSON.parse(savedPlayers);
    }
    if (this.players.length > 0) {
      localStorage.setItem(
        'gameStartedData',
        JSON.stringify({
          players: this.players,
          scoreValue: this.scoreValue,
          gameMode: this.gameMode,
          difficulty: this.selectedDifficulty
        })
      );
      localStorage.removeItem('gameData');
      this.router.navigate([this.gameMode]);
    } else {
      this.errorMessage = 'Es muss mindestens einen Spieler geben!';
    }
  }

  updateScoreValue(scoreValue: string): void {
    this.scoreValue = scoreValue;
  }

  updateGameMode(gameMode: string): void {
    this.gameMode = gameMode;
  }

  resetData(): void {
    localStorage.removeItem('gameData');
    localStorage.removeItem('gameStartedData');
    localStorage.removeItem('players');
    localStorage.removeItem('speakToTextEnabled');
    window.location.reload();
  }

  openModal(index: number): void {
    if (this.songModal) {
      this.songModal.openModal(index);
    }
  }

  capitalizeFirstLetter() {
    this.newPlayerName =
      this.newPlayerName.charAt(0).toUpperCase() + this.newPlayerName.slice(1);
  }

  // Methode, um das Spielmodus-Objekt anhand seines Wertes zu finden
  getCurrentGameMode() {
    return (
      this.gameModes.find(
        (mode) => mode.value === this.selectedGameMode
      ) || null
    );
  }

  // Methode, um die Schwierigkeiten sicher zu erhalten
  getDifficultyOptions() {
    return this.getCurrentGameMode()?.difficulty || [];
  }
}
