import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dart-game-single-out',
  templateUrl: './dart-game-single-out.component.html',
  styleUrls: ['./dart-game-single-out.component.scss'],
})
export class DartGameSingleOutComponent implements OnInit {
  
  ngOnInit(): void {
    console.log("It works!")
  }

  // settings-top-bar events

  onResetGameChange(resetGame: boolean) {
    console.log("resetGame", resetGame)
  }

  onResetRoundChange(resetRound: boolean) {
    console.log("resetRound", resetRound)
  }


  
}
