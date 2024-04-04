import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CheckoutDoubleOutService {
  private checkoutTable: { [key: number]: string } = {
    170: "T20, T20, 50",
    167: "T20, T19, 50",
    164: "T20, T18, 50",
    161: "T20, T17, 50",
    160: "T20, T20, D20",
    158: "T20, T20, D19",
    157: "T20, T19, D20",
    156: "T20, T20, D18",
    155: "T20, T19, D19",
    154: "T20, T18, D20",
    153: "T20, T19, D18",
    152: "T20, T20, D16",
    151: "T20, T17, D20",
    150: "T20, T18, D18",
    149: "T20, T19, D16",
    148: "T20, T16, D20",
    147: "T20, T17, D18",
    146: "T20, T18, D16",
    145: "T20, T15, D20",
    144: "T20, T20, D12",
    143: "T20, T17, D16",
    142: "T20, T14, D20",
    141: "T20, T19, D12",
    140: "T20, T20, D10",
    139: "T19, T14, D20",
    138: "T20, T18, D12",
    137: "T20, T19, D10",
    136: "T20, T20, D8",
    135: "T20, T17, D12",
    134: "T20, T14, D16",
    133: "T20, T19, D8",
    132: "T20, T20, D6",
    131: "T20, T13, D16",
    130: "T20, T20, D5",
    129: "T19, T16, D12",
    128: "T20, T20, D4",
    127: "T20, T17, D8",
    126: "T19, T19, D6",
    125: "T20, T20, D3",
    124: "T20, T16, D8",
    123: "T20, T13, D12",
    122: "T20, T18, D4",
    121: "T20, T15, D8",
    120: "T20, 20, D20",
    119: "T19, T10, D16",
    118: "T20, 18, D20",
    117: "T20, 17, D20",
    116: "T20, 16, D20",
    115: "T20, 15, D20",
    114: "T20, 14, D20",
    113: "T20, 13, D20",
    112: "T20, 20, D16",
    111: "T20, 19, D16",
    110: "T20, 18, D16",
    109: "T20, 17, D16",
    108: "T20, 16, D16",
    107: "T19, 18, D16",
    106: "T20, 14, D16",
    105: "T20, 13, D16",
    104: "T18, 18, D16",
    103: "T20, 3, D20",
    102: "T20, 10, D16",
    101: "T17, 17, D16",
    100: "T20, D20",
    99: "T19, 10, D16",
    98: "T20, D19",
    97: "T19, D20",
    96: "T20, D18",
    95: "T19, D19",
    94: "T18, D20",
    93: "T19, D18",
    92: "T20, D16",
    91: "T17, D20",
    90: "T18, D18",
    89: "T19, D16",
    88: "T16, D20",
    87: "T17, D18",
    86: "T18, D16",
    85: "T15, D20",
    84: "T20, D12",
    83: "T17, D16",
    82: "T14, D20",
    81: "T15, D18",
    80: "T20, D10",
    79: "T13, D20",
    78: "T18, D12",
    77: "T15, D16",
    76: "T20, D8",
    75: "T13, D18",
    74: "T14, D16",
    73: "T19, D8",
    72: "T16, D12",
    71: "T13, D16",
    70: "T18, D8",
    69: "T19, D6",
    68: "T20, D4",
    67: "T17, D8",
    66: "T10, D18",
    65: "T19, D4",
    64: "T16, D8",
    63: "T13, D12",
    62: "T10, D16",
    61: "T15, D8",
    60: "20, D20",
    59: "19, D20",
    58: "18, D20",
    57: "17, D20",
    56: "16, D20",
    55: "15, D20",
    54: "14, D20",
    53: "13, D20",
    52: "20, D16",
    51: "19, D16",
    50: "18, D16",
    49: "17, D16",
    48: "16, D16",
    47: "15, D16",
    46: "14, D16",
    45: "13, D16",
    44: "12, D16",
    43: "11, D16",
    42: "10, D16",
    41: "9, D16",
    40: "D20",
    39: "7, D16",
    38: "D19",
    37: "5, D16",
    36: "D18",
    35: "3, D16",
    34: "D17",
    33: "1, D16",
    32: "D16",
    31: "15, D8",
    30: "D15",
    29: "13, D8",
    28: "D14",
    27: "11, D8",
    26: "D13",
    25: "9, D8",
    24: "D12",
    23: "7, D8",
    22: "D11",
    21: "5, D8",
    20: "D10",
    19: "3, D8",
    18: "D9",
    17: "1, D8",
    16: "D8",
    15: "7, D4",
    14: "D7",
    13: "5, D4",
    12: "D6",
    11: "3, D4",
    10: "D5",
    9: "1, D4",
    8: "D4",
    7: "3, D2",
    6: "D3",
    5: "1, D2",
    4: "D2",
    3: "1, D1",
    2: "D1"
  };

  private checkoutTwoDartsTable: { [key: number]: string } = {
    100: "T20, D20",
    98: "T20, D19",
    97: "T19, D20",
    96: "T20, D18",
    95: "T19, D19",
    94: "T18, D20",
    93: "T19, D18",
    92: "T20, D16",
    91: "T17, D20",
    90: "T18, D18",
    89: "T19, D16",
    88: "T16, D20",
    87: "T17, D18",
    86: "T18, D16",
    85: "T15, D20",
    84: "T20, D12",
    83: "T17, D16",
    82: "T14, D20",
    81: "T15, D18",
    80: "T20, D10",
    79: "T13, D20",
    78: "T18, D12",
    77: "T15, D16",
    76: "T20, D8",
    75: "T13, D18",
    74: "T14, D16",
    73: "T19, D8",
    72: "T16, D12",
    71: "T13, D16",
    70: "T18, D8",
    69: "T19, D6",
    68: "T20, D4",
    67: "T17, D8",
    66: "T10, D18",
    65: "T19, D4",
    64: "T16, D8",
    63: "T13, D12",
    62: "T10, D16",
    61: "T15, D8",
    60: "20, D20",
    59: "19, D20",
    58: "18, D20",
    57: "17, D20",
    56: "16, D20",
    55: "15, D20",
    54: "14, D20",
    53: "13, D20",
    52: "20, D16",
    51: "19, D16",
    50: "18, D16",
    49: "17, D16",
    48: "16, D16",
    47: "15, D16",
    46: "14, D16",
    45: "13, D16",
    44: "12, D16",
    43: "11, D16",
    42: "10, D16",
    41: "9, D16",
    40: "D20",
    39: "7, D16",
    38: "D19",
    37: "5, D16",
    36: "D18",
    35: "3, D16",
    34: "D17",
    33: "1, D16",
    32: "D16",
    31: "15, D8",
    30: "D15",
    29: "13, D8",
    28: "D14",
    27: "11, D8",
    26: "D13",
    25: "9, D8",
    24: "D12",
    23: "7, D8",
    22: "D11",
    21: "5, D8",
    20: "D10",
    19: "3, D8",
    18: "D9",
    17: "1, D8",
    16: "D8",
    15: "7, D4",
    14: "D7",
    13: "5, D4",
    12: "D6",
    11: "3, D4",
    10: "D5",
    9: "1, D4",
    8: "D4",
    7: "3, D2",
    6: "D3",
    5: "1, D2",
    4: "D2",
    3: "1, D1",
    2: "D1"
  };

  private checkoutOneDartTable: { [key: number]: string } = {
    60: "20, D20",
    57: "17, D20",
    54: "18, D18",
    50: "50",
    48: "16, D16",
    40: "D20",
    38: "D19",
    36: "D18",
    34: "D17",
    33: "D11",
    32: "D16",
    30: "D15",
    28: "D14",
    26: "D13",
    25: "25",
    24: "D12",
    22: "D11",
    20: "D10",
    19: "19",
    18: "D9",
    17: "17",
    16: "D8",
    15: "15",
    14: "D7",
    13: "13",
    12: "D6",
    11: "11",
    10: "D5",
    8: "D4",
    6: "D3",
    4: "D2",
    2: "D1",
  };

  constructor() {}

  getCheckout(score: number): string {
    return this.checkoutTable[score] || '';
  }
  
  getTwoDartsCheckout(score: number): string {
    return this.checkoutTwoDartsTable[score] || '';
  }

  getOneDartCheckout(score: number): string {
    return this.checkoutOneDartTable[score] || '';
  }
}
