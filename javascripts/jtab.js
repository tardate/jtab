/**
 * JTab - Javascript/CSS Guitar Chord and Tab Notation for the Web.
 * Version 1.3.1
 * Written by Paul Gallagher (http://tardate.com), 2009. (original version and maintainer)
 * Contributions:
 *   Jason Ong (https://github.com/jasonong)
 *   Bruno Bornsztein (https://github.com/bborn)
 *   Binary Bit LAN (https://github.com/binarybitlan)
 * See:
 *   http://jtab.tardate.com : more information on availability, configuration and use.
 *   http://github.com/tardate/jtab/tree/master : source code repository, wiki, documentation
 *
 * This library also depends on the following two libraries that must be loaded for it to work:
 *   jQuery - http://www.jquery.com/
 *   Raphael - http://raphaeljs.com/
 *
 *
 * This library is free software; you can redistribute it and/or modify it under the terms of the GNU Lesser General
 * Public License as published by the Free Software Foundation; either version 2.1 of the License, or (at your option)
 * any later version.
 *
 * This library is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more
 * details.
 *
 * You should have received a copy of the GNU Lesser General Public License along with this library; if not, write to
 * the Free Software Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA 02111-1307 USA
 */

//
// define the jtab class
//

var jtab = {
  Version : '1.3.1',
  element_count:0, //TODO:
  Strings : {
  	AboutDialog : '<html><head><title>About jTab</title></head><body style=""><p style="">jTab version: {V}</p><p><a href="http://jtab.tardate.com" target="_blank">http://jtab.tardate.com</a></p><p><input type="button" class="close" value="OK" onClick="window.close()"/></p></body></html>'
  },
  Chords : {
             // chord data - currently explicit representation for 6 string guitar, standard tuning only, and
             // each chord is an array of alternate positions
             //   0   : 1st (open) position
             //   1   : 1st barre position, generally at 12/13/14th fret
             //         - minimum, only required for CAGED chords where open strings are used in the 1st (open) position
             //           since the main purpose of this is to provide barre fingering positions for CAGED-based chords
             //   2.. : alternative positions/fingerings
             // each position is an array comprising: 1. base fret (0==nut); 2. 6x note definitions (strings 6,5,4,3,2,1)
             // each note is an array: (fret position), (left hand fingering if applicable 1,2,3,4,T)
             // fret position: -1 = muted/not played; 0 = open; 1,2,3... = fret position
    C       : [ [ 0, [-1 ],  [3,3],  [2,2],  [0  ],  [1,1],  [0  ] ], [ 12, [-1,-1],  [15,4],  [14,3],  [12,1],  [13,2],  [12,1 ] ] ],
    Cm      : [ [ 0, [-1 ],  [3,4],  [1,2],  [0  ],  [1,1],  [-1 ] ], [ 12, [-1,-1],  [15,4],  [13,3],  [12,1],  [13,2],  [-1,-1] ] ],
    C6      : [ [ 0, [-1 ],  [0  ],  [2,2],  [2,3],  [1,1],  [3,4] ], [ 12, [-1,-1],  [12,1],  [14,3],  [14,3],  [13,2],  [15,4] ] ],
    Cm6     : [ [ 0, [-1 ],  [-1 ],  [1,1],  [2,3],  [1,2],  [3,4] ], [  ] ],
    C69     : [ [ 0, [-1 ],  [3,2],  [2,1],  [2,1],  [3,3],  [3,4] ], [  ] ],
    C7      : [ [ 0, [-1 ],  [3,3],  [2,2],  [3,4],  [1,1],  [0  ] ], [ 12, [-1,-1],  [15,3],  [14,2],  [15,4],  [13,1],  [12,  ] ] ],
    Cm7     : [ [ 0, [-1 ],  [-1 ],  [1,1],  [3,3],  [1,1],  [3,4] ], [  ] ],
    Cmaj7   : [ [ 0, [-1 ],  [3,3],  [2,2],  [0  ],  [0  ],  [0  ] ], [ 12, [-1,-1],  [15,4],  [14,3],  [12,1],  [12,1],  [12,1] ] ],
    C7b5    : [ [ 2, [-1 ],  [3,1],  [4,3],  [3,2],  [5,4],  [-1 ] ], [  ] ],
    "C7#5"  : [ [ 0, [-1 ],  [-1 ],  [2,2],  [3,3],  [1,1],  [4,4] ], [  ] ],
    "Cm7b5" : [ [ 0, [-1 ],  [3,1],  [4,3],  [3,2],  [4,4],  [-1 ] ], [  ] ],
    C7b9    : [ [ 0, [-1 ],  [3,3],  [2,1],  [3,4],  [2,2],  [0  ] ], [  ] ],
    C9      : [ [ 0, [-1 ],  [3,2],  [2,1],  [3,3],  [3,4],  [-1 ] ], [  ] ],
    Cm9     : [ [ 0, [-1 ],  [3,2],  [1,1],  [3,3],  [3,3],  [3,3] ], [  ] ],
    Cmaj9   : [ [ 0, [-1 ],  [3,3],  [0  ],  [0  ],  [0  ],  [0  ] ], [ 12, [-1 ],  [15,3],  [12,1],  [12,1],  [12,1],  [12,1] ] ],
    Cadd9   : [ [ 0, [-1 ],  [3,2],  [2,1],  [0  ],  [3,3],  [0  ] ], [ 12, [-1 ],  [15,3],  [14,2],  [12,1],  [15,4],  [12,1] ] ],
    C13     : [ [ 2, [-1 ],  [3,1],  [5,2],  [3,1],  [5,3],  [5,4] ], [  ] ],
    Csus2   : [ [ 2, [ -1],  [3,1],  [5,3],  [5,4],  [3,1],  [3,1] ], [  ] ],
    Csus4   : [ [ 2, [ -1],  [3,1],  [5,2],  [5,3],  [6,4],  [3,1] ], [  ] ],
    Cdim    : [ [ 0, [-1 ],  [3,3],  [4,4],  [2,2],  [1,1],  [-1 ] ], [  ] ],
    Cdim7   : [ [ 0, [-1 ],  [-1 ],  [1,1],  [2,3],  [1,2],  [2,4] ], [  ] ],
    Caug    : [ [ 0, [-1 ],  [-1 ],  [2,2],  [1,1],  [1,1],  [4,4] ], [  ] ],

    "C#"    : [ [ 0, [-1 ],  [4,4],  [3,4],  [1,1],  [2,2],  [1,1] ], [  ] ],
    "C#m"   : [ [ 0, [-1 ],  [-1 ],  [2,2],  [1,1],  [2,3],  [0  ] ], [  ] ],
    "C#6"   : [ [ 0, [-1 ],  [-1 ],  [3,2],  [3,3],  [2,1],  [4,4] ], [  ] ],
    "C#m6"  : [ [ 0, [-1 ],  [4,3],  [2,1],  [3,2],  [2,1],  [4,4] ], [  ] ],
    "C#69"  : [ [ 2, [-1 ],  [4,2],  [3,1],  [3,1],  [4,3],  [4,4] ], [  ] ],
    "C#7"   : [ [ 0, [-1 ],  [-1 ],  [3,2],  [4,3],  [2,1],  [4,4] ], [  ] ],
    "C#m7"  : [ [ 0, [-1 ],  [-1 ],  [2,1],  [4,3],  [2,1],  [4,4] ], [  ] ],
    "C#maj7": [ [ 0, [-1 ],  [4,4],  [3,3],  [1,1],  [1,1],  [1,1] ], [  ] ],
    "C#7b5" : [ [ 0, [3,2],  [0  ],  [3,3],  [4,4],  [2,1],  [-1 ] ], [  ] ],
    "C#7#5" : [ [ 0, [-1 ],  [4,3],  [3,2],  [2,1],  [0  ],  [-1 ] ], [  ] ],
    "C#m7b5": [ [ 0, [-1 ],  [2,1],  [2,2],  [0  ],  [2,3],  [0  ] ], [  ] ],
    "C#7b9" : [ [ 0, [-1 ],  [4,2],  [3,1],  [4,3],  [3,1],  [4,4] ], [  ] ],
    "C#9"   : [ [ 3, [-1 ],  [4,1],  [6,2],  [6,3],  [4,1],  [4,1] ], [  ] ],
    "C#m9"  : [ [ 0, [0  ],  [2,2],  [1,1],  [1,1],  [2,3],  [0  ] ], [  ] ],
    "C#maj9": [ [ 0, [-1 ],  [4,4],  [1,1],  [1,1],  [1,1],  [1,1] ], [  ] ],
    "C#add9": [ [ 0, [1,1],  [-1 ],  [1,1],  [1,1],  [2,2],  [1,1] ], [  ] ],
    "C#13"  : [ [ 3, [-1 ],  [4,1],  [6,2],  [4,1],  [6,3],  [6,4] ], [  ] ],
    "C#sus2": [ [ 0, [-1 ],  [-1 ],  [3,3],  [3,4],  [1,1],  [1,1] ], [  ] ],
    "C#sus4": [ [ 0, [-1 ],  [-1 ],  [3,2],  [3,3],  [4,4],  [1,1] ], [  ] ],
    "C#dim" : [ [ 0, [-1 ],  [-1 ],  [2,1],  [3,3],  [2,2],  [3,4] ], [  ] ],
    "C#dim7": [ [ 0, [-1 ],  [-1 ],  [2,1],  [3,3],  [2,2],  [3,4] ], [  ] ],
    "C#aug" : [ [ 0, [-1 ],  [4,4],  [3,3],  [2,1],  [2,2],  [-1 ] ], [  ] ],


    D      : [ [ 0, [-1 ],  [0  ],  [0  ],  [2,1],  [3,3],  [2,2] ], [ 12, [-1,-1],  [12,1],  [12,1],  [14,3],  [15,4],  [14,2] ] ],
    Dm     : [ [ 0, [-1 ],  [0  ],  [0  ],  [2,2],  [3,3],  [1,1] ], [ 12, [-1,-1],  [12,1],  [12,1],  [14,3],  [15,4],  [13,2] ] ],
    D6     : [ [ 0, [-1 ],  [0  ],  [0  ],  [2,2],  [0  ],  [2,3] ], [ 12, [-1,-1],  [12,1],  [12,1],  [14,3],  [12,1],  [14,4] ] ],
    Dm6    : [ [ 0, [-1 ],  [2,2],  [0  ],  [2,3],  [0  ],  [1,1] ], [ 12, [-1,-1],  [14,3],  [12,1],  [14,4],  [12,1],  [1,2] ] ],
    D69    : [ [ 3, [-1 ],  [5,2],  [4,1],  [4,1],  [5,3],  [5,4] ], [  ] ],
    D7     : [ [ 0, [-1 ],  [0  ],  [0  ],  [2,2],  [1,1],  [2,3] ], [ 12, [-1,-1],  [12,1],  [12,1],  [14,3],  [13,2],  [14,4] ] ],
    Dm7    : [ [ 0, [-1 ],  [-1 ],  [0  ],  [2,2],  [1,1],  [1,1] ], [ 12, [-1,-1],  [-1,-1], [12,1],  [14,4],  [13,2],  [13,3] ] ],
    Dmaj7  : [ [ 0, [-1 ],  [5,4],  [4,3],  [2,1],  [2,1],  [2,1] ], [  ] ],
    D7b5   : [ [ 4, [-1 ],  [5,1],  [6,3],  [5,2],  [7,4],  [-1 ] ], [  ] ],
    "D7#5" : [ [ 0, [-1 ],  [-1 ],  [0  ],  [4,3],  [1,1],  [2,2] ], [ 12, [-1,-1],  [-1,-1], [12,1],  [16,4],  [13,2],  [14,3] ] ],
    Dm7b5  : [ [ 0, [-1 ],  [-1 ],  [0  ],  [1,1],  [1,1],  [1,1] ], [ 12, [-1,-1],  [-1,-1], [12,1],  [12,2],  [12,3],  [12,4] ] ],
    D7b9   : [ [ 3, [-1 ],  [5,2],  [4,1],  [5,3],  [4,1],  [5,4] ], [  ] ],
    D9     : [ [ 0, [2,2],  [-1 ],  [0  ],  [2,3],  [1,1],  [0  ] ], [ 12, [14,4 ],  [-1,-1],  [12,1],  [14,3],  [13,2],  [12,1] ] ],
    Dm9    : [ [ 0, [-1 ],  [-1 ],  [3,3],  [2,2],  [1,1],  [0  ] ], [ 12, [-1,-1],  [-1,-1],  [15,4],  [14,3],  [13,2],  [12,1] ] ],
    Dmaj9  : [ [ 0, [-1 ],  [5,4],  [2,1],  [2,1],  [2,1],  [2,1] ], [  ] ],
    Dadd9  : [ [ 0, [-1 ],  [-1 ],  [0  ],  [2,1],  [3,2],  [0  ] ], [ 12, [-1,-1],  [-1,-1],  [12,1],  [14,3],  [15,4],  [12,1] ] ],
    D13    : [ [ 4, [-1 ],  [5,1],  [7,2],  [5,1],  [7,3],  [7,4] ], [  ] ],
    Dsus2  : [ [ 0, [-1 ],  [-1 ],  [0  ],  [2,1],  [3,3],  [0  ] ], [ 12, [-1,-1],  [-1,-1],  [12,1],  [14,3],  [15,4],  [12,1] ] ],
    Dsus4  : [ [ 0, [-1 ],  [-1 ],  [0  ],  [2,1],  [3,3],  [3,4] ], [ 12, [-1,-1],  [-1,-1],  [12,1],  [14,2],  [15,3],  [15,4] ] ],
    Ddim   : [ [ 0, [-1 ],  [-1 ],  [0  ],  [1,1],  [0  ],  [1,2] ], [ 12, [-1,-1],  [-1,-1],  [12,1],  [13,2],  [12,1],  [13,3] ] ],
    Ddim7  : [ [ 0, [-1 ],  [2,3],  [0  ],  [1,1],  [0  ],  [1,2] ], [ 12, [-1,-1],  [14,4],  [12,1],  [13,2],  [12,1],  [13,3] ] ],
    Daug   : [ [ 0, [-1 ],  [-1 ],  [0  ],  [3,2],  [3,3],  [2,1] ], [ 12, [-1,-1],  [-1,-1],  [12,1],  [15,3],  [15,4],  [14,2] ] ],

    "Eb"    : [ [ 0, [-1 ],  [-1 ],  [5,4],  [3,1],  [4,3],  [3,2] ], [  ] ],
    "Ebm"   : [ [ 0, [-1 ],  [-1 ],  [4,3],  [3,2],  [4,4],  [2,1] ], [  ] ],
    "Eb6"   : [ [ 0, [-1 ],  [3,1],  [5,3],  [3,1],  [4,2],  [3,1] ], [  ] ],
    "Ebm6"  : [ [ 0, [-1 ],  [-1 ],  [1,1],  [3,3],  [1,1],  [2,2] ], [  ] ],
    "Eb69"  : [ [ 0, [-1 ],  [-1 ],  [1,1],  [0  ],  [1,2],  [1,3] ], [  ] ],
    "Eb7"   : [ [ 0, [-1 ],  [-1 ],  [1,1],  [3,3],  [2,2],  [3,4] ], [  ] ],
    "Ebm7"  : [ [ 0, [-1 ],  [-1 ],  [1,1],  [3,4],  [2,2],  [2,3] ], [  ] ],
    "Ebmaj7": [ [ 0, [-1 ],  [-1 ],  [1,1],  [3,2],  [3,3],  [3,4] ], [  ] ],
    "Eb7b5" : [ [ 0, [-1 ],  [-1 ],  [1,1],  [2,2],  [2,3],  [4,4] ], [  ] ],
    "Eb7#5" : [ [ 0, [-1 ],  [-1 ],  [1,1],  [4,4],  [2,2],  [3,3] ], [  ] ],
    "Ebm7b5": [ [ 0, [-1 ],  [-1 ],  [1,1],  [2,2],  [2,3],  [2,4] ], [  ] ],
    "Eb7b9" : [ [ 0, [-1 ],  [-1 ],  [1,1],  [0  ],  [2,3],  [0  ] ], [  ] ],
    "Eb9"   : [ [ 0, [3,4],  [1,1],  [1,1],  [0  ],  [2,1],  [1,1] ], [  ] ],
    "Ebm9"  : [ [ 0, [2,2],  [1,1],  [1,1],  [3,4],  [2,3],  [1,1] ], [  ] ],
    "Ebmaj9": [ [ 0, [-1 ],  [-1 ],  [1,1],  [0  ],  [3,4],  [1,2] ], [  ] ],
    "Ebadd9": [ [ 0, [3,4],  [2,2],  [2,2],  [0  ],  [-1 ],  [1,1] ], [  ] ],
    "Eb13"  : [ [ 4, [-1 ],  [6,2],  [5,1],  [6,3],  [8,4],  [8,4] ], [  ] ],
    "Ebsus2": [ [ 0, [1,1],  [1,1],  [1,1],  [3,3],  [-1 ],  [1,1] ], [  ] ],
    "Ebsus4": [ [ 0, [-1 ],  [-1 ],  [1,1],  [3,3],  [4,4],  [4,4] ], [  ] ],
    "Ebdim" : [ [ 0, [-1 ],  [-1 ],  [1,1],  [2,3],  [1,2],  [2,4] ], [  ] ],
    "Ebdim7": [ [ 0, [-1 ],  [-1 ],  [1,1],  [2,3],  [1,2],  [2,4] ], [  ] ],
    "Ebaug" : [ [ 0, [3,3],  [2,2],  [1,1],  [0  ],  [0  ],  [3,4] ], [  ] ],

    E       : [ [ 0, [ 0 ],  [2,2],  [2,3],  [1,1],  [0  ],  [0  ] ], [ 12, [ 12,1],  [14,3],  [14,4],  [13,2],  [12,1],  [12,1] ] ],
    Em      : [ [ 0, [ 0 ],  [2,2],  [2,3],  [0  ],  [0  ],  [0  ] ], [ 12, [ 12,1],  [14,3],  [14,4],  [12,1],  [12,1],  [12,1] ] ],
    E6      : [ [ 0, [ 0 ],  [2,2],  [2,3],  [1,1],  [2,4],  [0  ] ], [ 12, [ 12,1],  [14,3],  [14,3],  [13,2],  [14,4],  [12,1] ] ],
    Em6     : [ [ 0, [ 0 ],  [2,1],  [2,2],  [0  ],  [2,3],  [0  ] ], [ 12, [ 12,1],  [14,2],  [14,3],  [12,1],  [14,4],  [12,1] ] ],
    E69     : [ [ 0, [-1 ],  [2,2],  [2,2],  [1,1],  [2,3],  [2,3] ], [  ] ],
    E7      : [ [ 0, [ 0 ],  [2,2],  [0  ],  [1,1],  [0  ],  [0  ] ], [ 12, [ 12,1],  [14,3],  [12,1],  [13,2],  [12,1],  [12,1] ] ],
    Em7     : [ [ 0, [ 0 ],  [2,2],  [2,3],  [0  ],  [3,4],  [0  ] ], [ 12, [ 12,1],  [14,2],  [14,3],  [12,1],  [15,4],  [12,1] ] ],
    Emaj7   : [ [ 0, [ 0 ],  [2,3],  [1,1],  [1,2],  [0  ],  [0  ] ], [ 12, [ 12,1],  [14,4],  [13,2],  [13,3],  [12,1],  [12,1] ] ],
    E7b5    : [ [ 0, [-1 ],  [1,1],  [0  ],  [1,2],  [3,4],  [0  ] ], [ 12, [-1,-1],  [13,2],  [12,1],  [13,3],  [15,4],  [12,1] ] ],
    "E7#5"  : [ [ 0, [0  ],  [3,4],  [0  ],  [1,1],  [1,2],  [-1 ] ], [ 12, [ 12,1],  [15,4],  [12,1],  [13,3],  [13,2],  [-1 ] ] ],
    Em7b5   : [ [ 0, [-1 ],  [-1 ],  [2,1],  [3,2],  [3,3],  [3,4] ], [  ] ],
    E7b9    : [ [ 0, [0  ],  [2,3],  [0  ],  [1,1],  [0  ],  [1,2] ], [ 12, [ 12,1],  [14,4],  [12,1],  [13,3],  [12,1],  [13,2] ] ],
    E9      : [ [ 0, [0  ],  [2,2],  [0  ],  [1,1],  [0  ],  [2,3] ], [ 12, [ 12,1],  [14,3],  [12,1],  [13,2],  [12,1],  [14,4] ] ],
    Em9     : [ [ 0, [0  ],  [2,1],  [0  ],  [0  ],  [0  ],  [2,2] ], [ 12, [ 12,1],  [14,2],  [12,1],  [12,1],  [12,1],  [14,4] ] ],
    Emaj9   : [ [ 0, [0  ],  [2,2],  [1,1],  [1,1],  [0  ],  [2,4] ], [ 12, [ 12,1],  [14,3],  [13,2],  [13,2],  [12,1],  [14,4] ] ],
    Eadd9   : [ [ 0, [2,2],  [2,3],  [2,4],  [1,1],  [0  ],  [0  ] ], [ 12, [ 14,3],  [14,3],  [14,4],  [13,2],  [12,1],  [12,1] ] ],
    E13     : [ [ 0, [0  ],  [2,2],  [0  ],  [1,1],  [2,3],  [0  ] ], [ 12, [ 12,1],  [14,3],  [12,1],  [13,2],  [14,4],  [12,1] ] ],
    Esus2   : [ [ 0, [ -1],  [2,1],  [4,3],  [4,4],  [-1 ],  [0  ] ], [ 12, [ -1,-1],  [14,2],  [16,3],  [16,4],  [-1 ],  [12,1] ] ],
    Esus4   : [ [ 0, [ 0 ],  [2,2],  [2,3],  [2,4],  [0  ],  [0  ] ], [ 12, [ 12,1],  [14,2],  [14,3],  [14,4],  [12,1],  [12,1] ] ],
    Edim    : [ [ 0, [-1 ],  [1,1],  [2,2],  [3,4],  [2,3],  [-1 ] ], [  ] ],
    Edim7   : [ [ 0, [-1 ],  [-1 ],  [2,1],  [3,3],  [2,2],  [3,4] ], [  ] ],
    Eaug    : [ [ 0, [ 0 ],  [3,4],  [2,3],  [1,1],  [1,2],  [0  ] ], [ 12, [ 12,1],  [15,4],  [14,3],  [13,2],  [13,2],  [12,1] ] ],

    F       : [ [ 0, [1,1],  [3,3],  [3,4],  [2,2],  [1,1],  [1,1] ], [  ] ],
    Fm      : [ [ 0, [1,1],  [3,3],  [3,4],  [1,1],  [1,1],  [1,1] ], [  ] ],
    F6      : [ [ 0, [-1 ],  [3,2],  [3,3],  [2,1],  [3,4],  [-1 ] ], [  ] ],
    Fm6     : [ [ 0, [-1 ],  [-1 ],  [0  ],  [1,1],  [1,1],  [1,1] ], [  ] ],
    F69     : [ [ 0, [1,1],  [0  ],  [0  ],  [0  ],  [1,2],  [1,3] ], [  ] ],
    F7      : [ [ 0, [1,1],  [3,3],  [1,1],  [2,2],  [1,1],  [1,1] ], [  ] ],
    Fm7     : [ [ 0, [1,1],  [3,3],  [3,4],  [1,1],  [4,4],  [1,1] ], [  ] ],
    Fmaj7   : [ [ 0, [1,1],  [-1 ],  [2,3],  [2,4],  [1,2],  [-1 ] ], [  ] ],
    F7b5    : [ [ 0, [1,1],  [-1 ],  [1,2],  [2,3],  [0  ],  [-1 ] ], [  ] ],
    "F7#5"  : [ [ 0, [1,1],  [-1 ],  [1,2],  [2,3],  [2,4],  [-1 ] ], [  ] ],
    Fm7b5   : [ [ 2, [-1 ],  [-1 ],  [3,1],  [4,2],  [4,3],  [4,4] ], [  ] ],
    F7b9    : [ [ 0, [-1 ],  [-1 ],  [3,2],  [2,1],  [4,4],  [2,1] ], [  ] ],
    F9      : [ [ 0, [3,3],  [0  ],  [3,4],  [2,2],  [1,1],  [1,1] ], [  ] ],
    Fm9     : [ [ 0, [-1 ],  [-1 ],  [1,1],  [1,1],  [1,1],  [3,4] ], [  ] ],
    Fmaj9   : [ [ 0, [0  ],  [0  ],  [3,3],  [0  ],  [1,1],  [3,4] ], [  ] ],
    Fadd9   : [ [ 0, [-1 ],  [-1 ],  [3,3],  [2,2],  [1,1],  [3,4] ], [  ] ],
    F13     : [ [ 0, [1,1],  [0  ],  [1,2],  [3,4],  [3,4],  [3,4] ], [  ] ],
    Fsus2   : [ [ 0, [-1 ],  [3,3],  [3,4],  [0  ],  [1,1],  [1,1] ], [  ] ],
    Fsus4   : [ [ 0, [1,1],  [3,2],  [3,3],  [3,4],  [1,1],  [1,1] ], [  ] ],
    Fdim    : [ [ 0, [-1 ],  [-1 ],  [0  ],  [1,1],  [0  ],  [1,2] ], [  ] ],
    Fdim7   : [ [ 0, [-1 ],  [2,3],  [0  ],  [1,1],  [0  ],  [1,2] ], [  ] ],
    Faug    : [ [ 0, [1,1],  [-1 ],  [3,4],  [2,2],  [2,3],  [1,1] ], [  ] ],

    "F#"    : [ [ 0, [2,1],  [4,3],  [4,4],  [3,2],  [2,1],  [2,1] ], [  ] ],
    "F#m"   : [ [ 0, [2,1],  [4,3],  [4,4],  [2,1],  [2,1],  [2,1] ], [  ] ],
    "F#6"   : [ [ 0, [2,1],  [4,3],  [-1 ],  [3,2],  [4,4],  [-1 ] ], [  ] ],
    "F#m6"  : [ [ 0, [-1 ],  [-1 ],  [1,1],  [2,2],  [2,3],  [2,4] ], [  ] ],
    "F#69"  : [ [ 0, [2,2],  [1,1],  [1,1],  [1,1],  [2,3],  [2,4] ], [  ] ],
    "F#7"   : [ [ 0, [2,1],  [4,3],  [2,1],  [3,2],  [2,1],  [2,1] ], [  ] ],
    "F#m7"  : [ [ 0, [2,1],  [4,3],  [4,4],  [2,1],  [5,4],  [2,1] ], [  ] ],
    "F#maj7": [ [ 0, [2,1],  [-1 ],  [3,3],  [3,4],  [2,2],  [-1 ] ], [  ] ],
    "F#7b5" : [ [ 0, [2,2],  [-1 ],  [2,3],  [3,4],  [1,1],  [-1 ] ], [  ] ],
    "F#7#5" : [ [ 0, [2,2],  [-1 ],  [2,3],  [3,4],  [3,4],  [-1 ] ], [  ] ],
    "F#m7b5": [ [ 0, [-1 ],  [-1 ],  [2,2],  [2,3],  [1,1],  [2,4] ], [  ] ],
    "F#7b9" : [ [ 0, [2,2],  [1,1],  [2,3],  [0  ],  [2,4],  [0  ] ], [  ] ],
    "F#9"   : [ [ 0, [2,1],  [4,3],  [2,1],  [3,2],  [2,1],  [4,4] ], [  ] ],
    "F#m9"  : [ [ 0, [3,3],  [0  ],  [3,4],  [1,1],  [2,3],  [2,3] ], [  ] ],
    "F#maj9": [ [ 0, [2,1],  [-1 ],  [3,2],  [3,3],  [-1 ],  [4,4] ], [  ] ],
    "F#add9": [ [ 0, [2,2],  [1,1],  [-1 ],  [1,1],  [2,3],  [2,4] ], [  ] ],
    "F#13"  : [ [ 0, [2,1],  [4,3],  [2,1],  [3,2],  [4,4],  [2,1] ], [  ] ],
    "F#sus2": [ [ 0, [2,2],  [-1 ],  [-1 ],  [1,1],  [2,3],  [2,4] ], [  ] ],
    "F#sus4": [ [ 0, [2,1],  [4,2],  [4,3],  [4,4],  [2,1],  [2,1] ], [  ] ],
    "F#dim" : [ [ 0, [-1 ],  [-1 ],  [1,1],  [2,3],  [1,2],  [2,4] ], [  ] ],
    "F#dim7": [ [ 0, [-1 ],  [-1 ],  [1,1],  [2,3],  [1,2],  [2,4] ], [  ] ],
    "F#aug" : [ [ 0, [2,1],  [-1 ],  [4,4],  [3,2],  [3,3],  [2,1] ], [  ] ],

    G       : [ [ 0, [3,3],  [2,2],  [0  ],  [0  ],  [0  ],  [3,4] ], [ 12, [15,3], [14,2], [12,1], [12,1], [12,1], [15,4] ] ],
    Gm      : [ [ 0, [3,2],  [1,1],  [0  ],  [0  ],  [3,3],  [3,4] ], [ 12, [15,3], [13,2], [12,1], [12,1], [15,4], [15,4] ] ],
    G6      : [ [ 0, [3,3],  [2,2],  [0  ],  [0  ],  [0  ],  [0  ] ], [ 12, [15,4],  [14,3],  [12,1],  [12,1],  [12,1],  [12,1] ] ],
    Gm6     : [ [ 0, [-1 ],  [-1 ],  [2,1],  [3,3],  [3,3],  [3,3] ], [  ] ],
    G69     : [ [ 0, [3,3],  [2,1],  [0  ],  [2,2],  [0  ],  [0  ] ], [ 12, [15,4],  [14,3],  [12,1],  [14,2],  [12,1],  [12,1] ] ],
    G7      : [ [ 0, [3,3],  [2,2],  [0  ],  [0  ],  [0  ],  [1,1] ], [ 12, [15,4],  [14,3],  [12,1],  [12,1],  [12,1],  [13,2] ] ],
    Gm7     : [ [ 0, [-1 ],  [1,1],  [3,3],  [0  ],  [3,4],  [-1 ] ], [ 12, [-1 ],  [13,2],  [15,3],  [12,1],  [15,4],  [-1 ] ] ],
    Gmaj7   : [ [ 0, [3,3],  [2,2],  [0  ],  [0  ],  [0  ],  [2,1] ], [ 12, [15,3],  [14,2],  [12,1],  [12,1],  [12,1],  [14,4] ] ],
    "G7b5"  : [ [ 0, [3,2],  [-1 ],  [3,3],  [4,4],  [2,1],  [-1 ] ], [  ], [ 4, [-1 ],  [-1 ],  [5,1],  [6,2],  [6,3],  [7,4] ] ],
    "G7#5"  : [ [ 0, [3,1],  [-1 ],  [3,2],  [4,3],  [4,4],  [-1 ] ], [  ] ],
    Gm7b5   : [ [ 2, [3,1],  [4,2],  [3,1],  [3,1],  [6,4],  [3,1] ], [  ] ],
    G7b9    : [ [ 0, [3,4],  [2,3],  [0  ],  [1,1],  [0  ],  [1,2] ], [ 12, [15,4],  [14,3],  [12,1],  [13,2],  [12,1],  [13,] ] ],
    G9      : [ [ 0, [3,3],  [-1 ],  [0  ],  [2,2],  [0  ],  [1,1] ], [ 12, [15,4],  [-1 ],  [12,1],  [14,3],  [12,1],  [13,2] ] ],
    Gm9     : [ [ 2, [3,1],  [5,3],  [3,1],  [3,1],  [3,1],  [5,4] ], [  ] ],
    Gmaj9   : [ [ 0, [3,3],  [-1 ],  [0  ],  [2,1],  [0  ],  [2,2] ], [ 12, [15,4],  [-1 ],  [12,1],  [14,3],  [12,1],  [14,2] ] ],
    Gadd9   : [ [ 0, [3,2],  [0  ],  [0  ],  [0  ],  [0  ],  [3,3] ], [ 12, [15,3],  [12,1],  [12,1],  [12,1],  [12,1],  [15,4] ] ],
    G13     : [ [ 0, [3,2],  [2,1],  [3,3],  [0  ],  [0  ],  [0  ] ], [ 12, [15,3],  [14,2],  [15,3],  [12,1],  [12,1],  [12,1] ] ],
    Gsus2   : [ [ 0, [3,1],  [0  ],  [0  ],  [0  ],  [3,3],  [3,4] ], [ 12, [15,2],  [12,1],  [12,1],  [12,1],  [15,3],  [15,4] ] ],
    Gsus4   : [ [ 2, [3,1],  [5,2],  [5,3],  [5,4],  [3,1],  [3,1] ], [  ] ],
    Gdim    : [ [ 2, [-1 ],  [-1 ],  [5,2],  [6,4],  [5,3],  [3,1] ], [  ] ],
    Gdim7   : [ [ 0, [-1 ],  [-1 ],  [2,1],  [3,3],  [2,2],  [3,4] ], [  ] ],
    Gaug    : [ [ 0, [3,1],  [-1 ],  [5,4],  [4,2],  [4,3],  [3,1] ], [  ] ],

    "G#"    : [ [ 0, [4,4],  [3,3],  [1,1],  [1,1],  [1,1],  [-1 ] ], [  ] ],
    "G#m"   : [ [ 0, [-1 ],  [2,2],  [1,1],  [1,1],  [4,4],  [4,4] ], [  ] ],
    "G#6"   : [ [ 0, [-1 ],  [-1 ],  [1,1],  [1,1],  [1,1],  [1,1] ], [  ] ],
    "G#m6"  : [ [ 0, [-1 ],  [-1 ],  [1,1],  [1,2],  [0  ],  [1,3] ], [  ] ],
    "G#69"  : [ [ 0, [4,2],  [3,1],  [3,1],  [3,1],  [4,3],  [4,4] ], [  ] ],
    "G#7"   : [ [ 0, [-1 ],  [-1 ],  [1,1],  [1,1],  [1,1],  [2,2] ], [  ] ],
    "G#m7"  : [ [ 3, [4,1],  [6,3],  [4,1],  [4,1],  [7,4],  [4,1] ], [  ] ],
    "G#maj7": [ [ 0, [-1 ],  [-1 ],  [1,1],  [1,1],  [1,1],  [3,3] ], [  ] ],
    "G#7b5" : [ [ 2, [4,2],  [-1 ],  [4,3],  [5,4],  [3,2],  [-1 ] ], [  ] ],
    "G#7#5" : [ [ 3, [4,1],  [-1 ],  [4,2],  [5,3],  [5,4],  [-1 ] ], [  ] ],
    "G#m7b5": [ [ 0, [4,1],  [5,2],  [4,1],  [4,1],  [7,4],  [4,1] ], [  ] ],
    "G#7b9" : [ [ 0, [4,3],  [3,2],  [4,4],  [2,1],  [-1 ],  [-1 ] ], [  ] ],
    "G#9"   : [ [ 0, [2,2],  [1,1],  [1,1],  [1,1],  [1,1],  [2,4] ], [  ] ],
    "G#m9"  : [ [ 0, [2,2],  [1,1],  [1,1],  [1,1],  [0  ],  [2,4] ], [  ] ],
    "G#maj9": [ [ 2, [4,2],  [3,1],  [5,4],  [3,1],  [4,3],  [-1 ] ], [  ] ],
    "G#add9": [ [ 0, [-1 ],  [1,1],  [1,1],  [1,1],  [1,1],  [-1 ] ], [  ] ],
    "G#13"  : [ [ 0, [4,3],  [3,2],  [4,4],  [1,1],  [1,1],  [1,1] ], [  ] ],
    "G#sus2": [ [ 0, [-1 ],  [1,1],  [1,2],  [1,3],  [-1 ],  [-1 ] ], [  ] ],
    "G#sus4": [ [ 0, [-1 ],  [-1 ],  [1,1],  [1,1],  [2,2],  [4,4] ], [  ] ],
    "G#dim" : [ [ 0, [-1 ],  [-1 ],  [0  ],  [1,1],  [0  ],  [1,2] ], [  ] ],
    "G#dim7": [ [ 0, [-1 ],  [-1 ],  [0  ],  [1,1],  [0  ],  [1,2] ], [  ] ],
    "G#aug" : [ [ 0, [0,-1], [3,4],  [2,3],  [1,1],  [1,2],  [0,-1] ], [  ] ],

    A       : [ [ 0, [-1],  [0  ],  [2,2],  [2,1],  [2,3],  [0  ] ], [ 12, [-1,-1], [12,1], [14,2], [14,3], [14,4], [12,1] ] ],
    Am      : [ [ 0, [-1],  [0  ],  [2,2],  [2,3],  [1,1],  [0  ] ], [ 12, [-1,-1], [12,1], [14,3], [14,4], [13,2], [12,1] ] ],
    A6      : [ [ 0, [-1],  [0  ],  [2,1],  [2,1],  [2,1],  [2,1] ], [ 12, [-1,-1], [12,1], [14,3], [14,3], [14,3], [14,3] ] ],
    Am6     : [ [ 0, [-1],  [0  ],  [2,2],  [2,3],  [1,1],  [2,4] ], [ 12, [-1,-1], [12,1], [14,3], [14,3], [13,2], [14,4] ] ],
    A69     : [ [ 3, [5,2], [4,1],  [4,1],  [4,1],  [5,3],  [5,4] ], [  ] ],
    A7      : [ [ 0, [-1],  [0  ],  [2,2],  [0  ],  [2,3],  [0  ] ], [ 12, [-1,-1], [12,1], [14,2], [12,1], [14,3], [12,1] ] ],
    Am7     : [ [ 0, [-1],  [0  ],  [2,2],  [0  ],  [1,1],  [0  ] ], [ 12, [-1,-1], [12,1], [14,3], [12,1], [13,2], [12,1] ] ],
    Amaj7   : [ [ 0, [-1],  [0  ],  [2,2],  [1,1],  [2,3],  [0  ] ], [ 12, [-1,-1], [12,1], [14,3], [13,2], [14,4], [12,1] ] ],
    A7b5    : [ [ 3, [5,2], [-1 ],  [5,3],  [6,4],  [4,1],  [-1 ] ], [  ] ],
    "A7#5"  : [ [ 4, [5,1], [-1 ],  [5,2],  [6,3],  [6,4],  [-1 ] ], [  ] ],
    Am7b5   : [ [ 0, [-1],  [-1 ],  [1,1],  [2,3],  [1,2],  [3,4] ], [  ] ],
    A7b9    : [ [ 0, [-1],  [0  ],  [2,1],  [3,3],  [2,2],  [3,4] ], [ 12, [-1,-1], [12,''],  [14,1],  [15,3],  [14,2],  [15,4] ] ],
    A9      : [ [ 0, [-1],  [0  ],  [2,1],  [4,4],  [2,2],  [3,3] ], [ 12, [-1],  [12,],  [14,1],  [16,4],  [14,2],  [15,3] ] ],
    Am9     : [ [ 0, [-1],  [0  ],  [1,1],  [1,1],  [1,1],  [3,4] ], [ 12, [-1],  [12,1],  [13,2],  [13,2],  [13,2],  [15,4] ] ],
    Amaj9   : [ [ 0, [-1],  [0  ],  [2,1],  [4,3],  [2,1],  [4,4] ], [ 12, [-1],  [12,  ],  [14,1],  [16,3],  [14,1],  [16,4] ] ],
    Aadd9   : [ [ 0, [-1],  [0  ],  [2,2],  [2,3],  [0  ],  [0  ] ], [ 12, [-1],  [12,1],  [14,3],  [14,4],  [12,1],  [12,1] ] ],
    A13     : [ [ 0, [-1],  [0  ],  [2,1],  [0  ],  [2,2],  [3,3] ], [ 12, [-1],  [12,1],  [14,2],  [12,1],  [14,3],  [15,4] ] ],
    Asus2   : [ [ 0, [-1],  [0  ],  [2,1],  [2,2],  [0  ],  [0  ] ], [ 12, [-1],  [12,1],  [14,3],  [14,4],  [12,1],  [12,1] ] ],
    Asus4   : [ [ 0, [-1],  [0  ],  [2,1],  [2,2],  [3,3],  [0  ] ], [ 12, [-1],  [12,1],  [14,2],  [14,3],  [15,4],  [12,1] ] ],
    Adim    : [ [ 0, [-1],  [0  ],  [1,1],  [2,3],  [1,2],  [-1 ] ], [ 12, [-1],  [12,1],  [13,2],  [14,4],  [13,3],  [-1 ] ] ],
    Adim7   : [ [ 0, [-1],  [-1 ],  [1,1],  [2,3],  [1,2],  [2,4] ], [  ] ],
    Aaug    : [ [ 0, [-1],  [0  ],  [3,4],  [2,2],  [2,3],  [1,1] ], [ 12, [-1],  [12,],  [15,4],  [14,2],  [14,3],  [13,1] ] ],

    "Bb"    : [ [ 0, [-1],  [1,1],  [3,3],  [3,3],  [3,3],  [1,1] ], [  ] ],
    "Bbm"   : [ [ 0, [-1],  [1,1],  [3,3],  [3,4],  [2,2],  [1,1] ], [  ] ],
    "Bb6"   : [ [ 0, [-1],  [1,1],  [3,3],  [3,3],  [3,3],  [3,3] ], [  ] ],
    "Bbm6"  : [ [ 0, [-1],  [1,1],  [3,3],  [0  ],  [2,2],  [-1 ] ], [  ] ],
    "Bb69"  : [ [ 0, [-1],  [1,1],  [0  ],  [0  ],  [1,2],  [1,3] ], [  ] ],
    "Bb7"   : [ [ 0, [-1],  [1,1],  [3,3],  [1,1],  [4,4],  [1,1] ], [  ] ],
    "Bbm7"  : [ [ 0, [-1],  [1,1],  [3,3],  [1,1],  [2,2],  [1,1] ], [  ] ],
    "Bbmaj7": [ [ 0, [-1],  [1,1],  [3,3],  [2,2],  [3,4],  [1,1] ], [  ] ],
    "Bb7b5" : [ [ 4, [6,2], [-1 ],  [6,3],  [7,4],  [5,1],  [-1 ] ], [  ] ],
    "Bb7#5" : [ [ 5, [6,1], [-1 ],  [6,2],  [7,3],  [7,4],  [-1 ] ], [  ] ],
    "Bbm7b5": [ [ 0, [-1],  [1,1],  [-1 ],  [1,2],  [2,3],  [-1 ] ], [  ] ],
    "Bb7b9" : [ [ 6, [-1],  [-1 ],  [8,2],  [7,1],  [9,4],  [7,1] ], [  ] ],
    "Bb9"   : [ [ 0, [1,1], [1,2],  [0  ],  [1,3],  [1,3],  [1,3] ], [  ] ],
    "Bbm9"  : [ [ 5, [-1],  [-1 ],  [-1 ],  [6,1],  [6,1],  [8,4] ], [  ] ],
    "Bbmaj9": [ [ 0, [-1],  [1,1],  [0  ],  [2,4],  [1,2],  [1,3] ], [  ] ],
    "Bbadd9": [ [ 0, [1,1], [1,1],  [0  ],  [3,4],  [1,1],  [1,1] ], [  ] ],
    "Bb13"  : [ [ 0, [-1 ], [1,1],  [0  ],  [1,2],  [3,4],  [3,4] ], [  ] ],
    "Bbsus2": [ [ 0, [-1],  [1,1],  [3,3],  [3,4],  [1,1],  [1,1] ], [  ] ],
    "Bbsus4": [ [ 0, [-1],  [1,1],  [3,2],  [3,3],  [4,4],  [1,1] ], [  ] ],
    "Bbdim" : [ [ 0, [-1],  [1,1],  [2,2],  [3,4],  [2,3],  [-1 ] ], [  ] ],
    "Bbdim7": [ [ 0, [-1],  [-1 ],  [2,1],  [3,3],  [2,2],  [3,4] ], [  ] ],
    "Bbaug" : [ [ 0, [-1],  [1,1],  [4,4],  [3,2],  [3,3],  [2,1] ], [  ] ],

    B       : [ [ 0, [ -1], [2,1],  [4,3],  [4,3],  [4,3],  [2,1] ], [  ] ],
    Bm      : [ [ 0, [ -1], [2,1],  [4,3],  [4,4],  [3,2],  [2,1] ], [  ] ],
    B6      : [ [ 0, [ -1], [2,1],  [4,3],  [4,3],  [4,3],  [4,3] ], [  ] ],
    Bm6     : [ [ 0, [ -1], [-1 ],  [4,2],  [4,3],  [3,1],  [4,4] ], [  ] ],
    B69     : [ [ 0, [ -1], [2,2],  [1,1],  [1,1],  [2,3],  [2,4] ], [  ] ],
    B7      : [ [ 0, [ -1], [2,2],  [1,1],  [2,3],  [0  ],  [2,4] ], [  ] ],
    Bm7     : [ [ 0, [ -1], [2,2],  [0  ],  [2,3],  [0  ],  [2,4] ], [  ] ],
    Bmaj7   : [ [ 0, [ -1], [2,1],  [4,3],  [3,2],  [4,4],  [2,1] ], [  ] ],
    B7b5    : [ [ 5, [7,2], [-1 ],  [7,3],  [8,4],  [6,1],  [-1 ] ], [  ] ],
    "B7#5"  : [ [ 0, [ -1], [2,2],  [1,1],  [2,3],  [0  ],  [3,4] ], [  ] ],
    "Bm7b5" : [ [ 0, [-1 ], [2,2],  [0  ],  [2,3],  [0  ],  [1,1] ], [  ] ],
    B7b9    : [ [ 0, [ -1], [2,2],  [1,1],  [2,3],  [1,1],  [2,4] ], [  ] ],
    B9      : [ [ 6, [7,1], [9,3],  [7,1],  [8,2],  [7,1],  [9,4] ], [  ] ],
    Bm9     : [ [ 0, [ -1], [2,1],  [0  ],  [2,2],  [2,3],  [2,4] ], [  ] ],
    Bmaj9   : [ [ 0, [ -1], [2,2],  [1,1],  [3,4],  [2,3],  [2,3] ], [  ] ],
    Badd9   : [ [ 0, [ -1], [2,1],  [4,3],  [4,4],  [2,1],  [2,1] ], [  ] ],
    B13     : [ [ 0, [-1 ], [2,2],  [1,1],  [2,3],  [0  ],  [4,4] ], [  ] ],
    Bsus2   : [ [ 0, [ -1], [2,1],  [4,3],  [4,4],  [2,1],  [2,1] ], [  ] ],
    Bsus4   : [ [ 0, [ -1], [2,1],  [4,2],  [4,3],  [5,4],  [2,1] ], [  ] ],
    Bdim    : [ [ 0, [-1],  [2,1],  [3,2],  [4,4],  [3,3],  [-1 ] ], [  ] ],
    Bdim7   : [ [ 0, [-1],  [-1 ],  [0  ],  [1,1],  [0  ],  [1,2] ], [  ] ],
    Baug    : [ [ 0, [-1],  [2,1],  [5,4],  [4,2],  [4,3],  [3,1] ], [  ] ]
  },
  WesternScale: {
    BaseNotes:  { // for each: array[ translated western scale note, caged base, base fret ]
      'C' : [ 'C' , 'C', 0 ],
      'C#': [ 'C#', 'C', 1 ],
      'Db': [ 'C#', 'C', 1 ],
      'D' : [ 'D' , 'D', 0 ],
      'D#': [ 'Eb', 'D', 1 ],
      'Eb': [ 'Eb', 'D', 1 ],
      'E' : [ 'E' , 'E', 0 ],
      'F' : [ 'F' , 'E', 1 ],
      'F#': [ 'F#', 'E', 2 ],
      'Gb': [ 'F#', 'E', 2 ],
      'G' : [ 'G' , 'G', 0 ],
      'G#': [ 'G#', 'G', 1 ],
      'Ab': [ 'G#', 'G', 1 ],
      'A' : [ 'A' , 'A', 0 ],
      'A#': [ 'Bb', 'A', 1 ],
      'Bb': [ 'Bb', 'A', 1 ],
      'B' : [ 'B' , 'A', 2 ]
    },
    BaseIntervals: ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'G#', 'A', 'Bb', 'B']
  },
  ChordList : function() {
    var list = [];
    for (var key in jtab.Chords) {
      list.push( key );
    }
    return list;
  },
  /*
   * Usage: jtab.AddChord("ChordName", Chord-Array)
   * Example of Add: jtab.AddChord("Dsus4l", [ [ 0, [-1 ],  [-1 ],  [3,2],  [2,1],  [3,3],  [3,4] ], [ 12, [-1,-1],  [-1,-1],  [12,1],  [14,2],  [15,3],  [15,4] ] ]);
   * Example of Update: jtab.AddChord("A", [ [ 0, [-1],  [0  ],  [2,3],  [2,2],  [2,1],  [0  ] ], [ 12, [-1,-1], [12,1], [14,2], [14,3], [14,4], [12,1] ] ]);
   */
  AddChord : function(chordName, chord) {
    this.Chords[chordName] = chord;
  }
};

//
// define Array utility functions
//

Array.prototype.max_chars = function() {
  var max = this[0].length;
  var len = this.length;
  for (var i = 1; i < len; i++) if (this[i].length > max) max = this[i].length;
  return max;
}


//
// define jtabChord class
// public members:
//  isValid        = whether valid chord defined
//  isCaged        = whether chord is CAGED type
//  isCustom       = whether chord is a custom fingering
//  fullChordName  = full chord name, including position e.g. D#m7:3
//  chordName      = chord name, without position e.g. D#m7
//  baseName       = translated chord name (B <-> #), without position e.g. Ebm7
//  rootNote       = root note e.g. D#
//  rootExt        = root note extension e.g. m7
//  cagedBaseShape = caged base shape e.g. D
//  cagedBaseFret  = caged base fret e.g. 0
//  cagedPos       = caged position e.g. 3
//

function jtabChord (token) {

  this.scale = jtab.WesternScale;
  this.baseNotes = this.scale.BaseNotes;
  this.baseChords = jtab.Chords;
  this.chordArray = null;
  this.isValid = false;

  this.fullChordName = token;
  this.isCustom = ( this.fullChordName.match( /\%/ ) != null )
  this.isCaged = ( this.fullChordName.match( /\:/ ) != null )


  if (this.isCaged) {
    var parts = this.fullChordName.split(':');
    this.chordName = parts[0];
    this.cagedPos = parts[1];
  } else if (this.isCustom){
    var parts = this.fullChordName.match( /\[(.+?)\]/ );
    if(parts){
      this.chordName = parts[1];
    } else {
      this.chordName = '';
    }
  } else {
    this.chordName = this.fullChordName;
    this.cagedPos = 1;
  }
  this.rootExt = this.chordName.replace(/^[A-G#b]{1,2}/,'');
  this.rootNote = this.chordName.substr(0, this.chordName.length - this.rootExt.length);
  var baseNoteInfo = this.baseNotes[this.rootNote];
  if (baseNoteInfo) {
    this.baseName = baseNoteInfo[0] + this.rootExt;
    this.cagedBaseShape = baseNoteInfo[1];
    this.cagedBaseFret = baseNoteInfo[2];
  } else {
    this.cagedBaseShape = '';
    this.cagedBaseFret = 0;
  }

  if ( ( this.isCaged ) && ( this.cagedPos > 1 ) ) {
    this.setCagedChordArray();
  } else if (this.isCustom){
    this.setCustomChordArray();
  } else {
    this.setChordArray(this.baseName);
  }
}

jtabChord.prototype.setCustomChordArray = function(){
  this.chordArray = new Array();
  this.chordArray = this.parseCustomChordArrayFromToken();
};

jtabChord.prototype.parseCustomChordArrayFromToken = function() {
  notes = this.fullChordName.replace(/(\%|\[.+\])/g, '');
  pairs = notes.split('.');
  if (pairs.length < 6){
    this.isValid = false;
    return;
  }
  this.isValid = true;

  array = [];
  for (var i = 0; i < pairs.length; i++){
    pair = pairs[i].split('/')
    if (pair[0].match(/X/)){
      pair = [-1]
    }
    array.push(pair)
  }

  // fingeredFrets = array.reject(function(p){
  //   return p.length === 1
  // }).collect(function(p){
  //   return parseInt(p[0])
  //   }).flatten().without(0,-1)

  // `array` is an array of string/fretnumber pairs like [0,1].

  fingeredFrets = jQuery.grep(array, function(pair){
    // get only the pairs with two elements
    return (pair.length != 1);
  }).map(function(pair){
    return parseInt(pair[0]);
    }).map(function(i){
      if ((i != 0) || (i != -1)){
        return i;
      } else {
        return null;
      }
    })

  fingeredFrets = jQuery.grep(fingeredFrets,function(n){
    return(n);
  });

  //find all the fret positions which arent X or 0. I'm sure there's a better way to do this.

  min = Math.min.apply( Math, fingeredFrets );

  array.unshift(min-1);
  return array;
};

jtabChord.prototype.setChordArray = function(chordName) { // clones chord array (position 0) from chord ref data into this object
  this.chordArray = new Array();
  if (this.baseChords[chordName] === undefined ) {
    this.isValid = false;
    return;
  }
  this.isValid = true;
  var modelRef = this.baseChords[chordName][0];
  this.chordArray[0] = modelRef[0]
  for (var i = 1; i < modelRef.length ; i++) {
    this.chordArray[i] = modelRef[i];    // TODO: this.chordArray[i] = modelRef[i].clone();
  }
};

jtabChord.prototype.setCagedChordArray = function() {
  if ( ! this.cagedBaseShape.match( /[CAGED]/ ) ) return;
  var caged_index = "CAGED".indexOf(this.cagedBaseShape) + 1; // get 1-based index
  var fret_widths = [3,2,3,2,2];

  var starting_fret = this.cagedBaseFret;

  for (var i = 1; i < this.cagedPos ; i++) {
    var index = (caged_index - 1) % 5;
    caged_index  = ( caged_index >= 5) ? 1 : caged_index + 1;
    starting_fret += fret_widths[index];
  }

  var modelChord =  "CAGED".charAt( caged_index - 1 ) + this.rootExt;
  this.setChordArray(modelChord);
  this.shiftChordArray(starting_fret,modelChord);
};

jtabChord.prototype.shiftChordArray = function(atFret,modelChord) { // shift chord to new fret position
  var initFret = this.chordArray[0];
  if (atFret != initFret) {
    var use_caged_fingering = ( (this.isCaged) && (this.cagedPos > 0) && ( ! ( this.baseChords[modelChord][1][0] === undefined ) )  );

    this.chordArray[0] = atFret - 1;
    for (var i = 1; i < this.chordArray.length ; i++) {
      var fret = (this.chordArray[i][0] >= 0 ) ? this.chordArray[i][0] + atFret - initFret : this.chordArray[i][0];
      var finger = (use_caged_fingering) ? this.baseChords[modelChord][1][i][1] : this.chordArray[i][1];
      this.chordArray[i] = [ fret ,  finger ];
    }
  }
};



//
// define extensions to the Raphael class
//

Raphael.fn.tabtype = 0;  // 0 = none, 1 = tab & chord, 2 = chord, 3 = tab
Raphael.fn.has_chord = false;
Raphael.fn.has_tab = false;

Raphael.fn.debug = false;
Raphael.fn.scale = 1;
Raphael.fn.margin_top = 36;
Raphael.fn.margin_bottom = 10;
Raphael.fn.margin_left = 16;
Raphael.fn.margin_right = 10;

Raphael.fn.current_offset = Raphael.fn.margin_left;

Raphael.fn.string_spacing = 16;
Raphael.fn.strings_drawn = 6;
Raphael.fn.fret_spacing = 16;
Raphael.fn.frets_drawn = 4;
Raphael.fn.note_radius = 7;

Raphael.fn.fret_width = Raphael.fn.string_spacing * ( Raphael.fn.strings_drawn - 1 );
Raphael.fn.fret_height = Raphael.fn.fret_spacing * (Raphael.fn.frets_drawn + 0.5);
Raphael.fn.chord_width = Raphael.fn.margin_left + Raphael.fn.fret_width + Raphael.fn.string_spacing + Raphael.fn.margin_right;
Raphael.fn.chord_height = Raphael.fn.margin_top + Raphael.fn.fret_height + Raphael.fn.margin_bottom;

Raphael.fn.tab_current_string = 0; // 1,2,3,4,5,6 or 0 = not set
Raphael.fn.tab_margin_top = 10;
Raphael.fn.tab_top = Raphael.fn.chord_height + Raphael.fn.tab_margin_top;
Raphael.fn.tab_spacing = Raphael.fn.fret_spacing;
Raphael.fn.tab_height = Raphael.fn.tab_spacing * 5;
Raphael.fn.tab_char_width = 8;

Raphael.fn.total_height = Raphael.fn.tab_top + Raphael.fn.tab_height + Raphael.fn.margin_bottom;

Raphael.fn.color = "#000";
Raphael.fn.fingering_text_color = "#fff";
Raphael.fn.tab_text_color = "#000";


// debug helper - puts grid marks on the rendered image
Raphael.fn.debug_grid = function (width) {
  // h ticks
  this.path(this.svg_params(this.current_offset, 0,0,4)).attr({stroke: this.color, "stroke-width":0.2 })
  this.path(this.svg_params(  this.current_offset + this.margin_left, 0,0,2)).attr({stroke: this.color, "stroke-width":0.2 })
  this.path(this.svg_params(  this.current_offset + width - this.margin_right, 0,0,2)).attr({stroke: this.color, "stroke-width":0.2 })
  // v ticks
  if (this.tabtype == 3) {
    this.path(this.svg_params(this.current_offset, this.tab_margin_top,2,0)).attr({stroke: this.color, "stroke-width":0.2 })
  } else {
    this.path(this.svg_params(this.current_offset, this.margin_top,2, 0)).attr({stroke: this.color, "stroke-width":0.2 })
  }
}


// step the current position for drawing
Raphael.fn.increment_offset = function (width) {
  w = ( width === undefined ) ? this.chord_width : width;
  if (this.debug) this.debug_grid(w);
  this.current_offset += w;
  this.setSize( this.current_offset, this.total_height );
}

Raphael.fn.svg_params = function(x,y,l1,l2) {
  // http://www.w3.org/TR/SVG/paths.html#PathData --helpful reading
  var move_line_to = "m"+x+" "+y+"l"+l1+" "+l2
  if(arguments.length == 4) return move_line_to
}

// draw the fretboard
Raphael.fn.chord_fretboard = function ( position, chord_name ) {
  var fret_left = this.current_offset + this.margin_left;
  // conventional fret labels
  var fret_labels = [ '', '', '', 'III', '', 'V', '', 'VII', '', 'IX', '', '', 'XII', '', '', 'XV', '', 'XVII', '', 'XIX', '', 'XXI', '' ];
  // alternative friendly fret labels. Currently disabled, maybe bring these back as a configurable option?
  // var fret_labels = [ '', '1fr', '2fr', '3fr', '4fr', '5fr', '6fr', '7fr', '8fr', '9fr', '10fr', '11fr', '12fr', '13fr', '14fr', '15fr', '16fr', '17fr', '18fr', '19fr', '20fr', '21fr', '' ];

  this.text( // chord name
    fret_left + 2.5 * this.string_spacing,
    this.margin_top - 20,
    chord_name).attr({fill: this.tab_text_color, "font-size":"20px"});

  var stroke_width = position == 0 ? 3 : 0  // nut
  var chord_fretboard_path = this.path(this.svg_params(fret_left,this.margin_top,this.string_spacing * (this.strings_drawn - 1),0))
        chord_fretboard_path.attr({stroke: this.color, "stroke-width":stroke_width })

  for (var i = 0; i <= this.frets_drawn; i++ ) { // frets

    this.path(this.svg_params(fret_left,this.margin_top + (i * this.fret_spacing),this.string_spacing * (this.strings_drawn - 1), 0))

    pos = ( fret_labels[ position + i ] === undefined ) ? '' : fret_labels[ position + i ];

    if ( pos.length > 0 ) { // draw fret position
      this.text(
          fret_left + this.fret_width + this.string_spacing * 1.0,
          this.margin_top + ( ( i - 0.5 ) * this.fret_spacing),
          pos).attr({stroke: this.tab_text_color, "font-size":"12px"});
    }
  }
  for (var i = 0; i < this.strings_drawn; i++ ) {
    this.path(this.svg_params(fret_left + (i * this.string_spacing),this.margin_top,0, this.fret_spacing * (this.frets_drawn + 0.5)))  // strings
  }
  this.tab_extend(this.chord_width); // extend the tab if present
}


// draw a stroke (/)
Raphael.fn.stroke = function () {

  if (this.has_tab) {
    var width = this.tab_char_width * 3;
    // extend tab
    this.tab_extend(width);
    //  stroke
    var stroke_path = this.path(this.svg_params(this.current_offset + this.tab_char_width, this.tab_top  + (3.5 * this.tab_spacing),this.tab_char_width, - 2 * this.tab_spacing))
        stroke_path.attr({stroke: this.tab_text_color, "stroke-width":4 })

    this.increment_offset(width);
  } else if (this.has_chord) {
    var dx = this.string_spacing;
    var dy = 2 * this.fret_spacing;
    this.path(this.svg_params(this.current_offset + this.margin_left,
                         this.margin_top + this.fret_spacing + dy,dx,-dy)).attr({stroke: this.tab_text_color, "stroke-width":4 })

    this.increment_offset(  this.margin_left + dx + this.margin_right );
  }
}


// draw a bar
Raphael.fn.bar = function () {

  if (this.has_tab) {
    var width = this.tab_char_width * 2;
    // extend tab
    this.tab_extend(width);
    var bar_stroke=this.path(this.svg_params(this.current_offset + this.tab_char_width, this.tab_top,0, this.tab_height))
    this.increment_offset(width);

  } else if (this.has_chord) {
    var fret_left = this.current_offset + this.margin_left;
    var bar_stroke=this.path(this.svg_params(this.current_offset + this.margin_left, this.margin_top,0, 0, this.fret_height))
    this.increment_offset( this.margin_left + this.margin_right );
  }
    bar_stroke.attr({stroke: this.color, "stroke-width":1 })

}


// draw double bar
Raphael.fn.doublebar = function () {
  if (this.has_tab) {
    var width = this.tab_char_width + 8;
    // extend tab
    this.tab_extend(width);
    //  bar
    var path_1 = this.path(this.svg_params(this.current_offset + this.tab_char_width, this.tab_top,0, this.tab_height))
    var path_2 = this.path(this.svg_params(this.current_offset + this.tab_char_width + 6, this.tab_top,0, this.tab_height  ))
    this.increment_offset(width);

  } else if (this.has_chord) {
    var left = this.current_offset + this.margin_left;

    var path_1 = this.path(this.svg_params(left, this.margin_top,0, this.fret_height))
    var path_2 = this.path(this.svg_params(left + 6, this.margin_top,0, this.fret_height))

    this.increment_offset( this.margin_left + 6 + this.margin_right );
  }
    path_1.attr({stroke: this.color, "stroke-width":1 })
    path_2.attr({stroke: this.color, "stroke-width":4 })
}


// draw a note in a chord
Raphael.fn.chord_note = function (position, string_number, note) {
  // NB: internal string_number in chords counts from low to high
  var fret_number = note[0];
  var fret_left = this.current_offset + this.margin_left;

  if (fret_number < 0 ) {
    // muted/not played
    this.text(fret_left + (string_number - 1) * this.string_spacing, this.margin_top - 8, "x").attr({stroke: this.tab_text_color, "font-size":"9px"});
  } else if (fret_number == 0 ) {
    // open
    this.text(fret_left + (string_number - 1) * this.string_spacing, this.margin_top - 8, "o").attr({stroke: this.tab_text_color, "font-size":"9px"});
  } else {
    var fret_dy = (fret_number - position - 0.5) * this.fret_spacing;
    //var circle =
    this.circle(
      fret_left + (string_number - 1) * this.string_spacing,
      this.margin_top + fret_dy, this.note_radius).attr({stroke: this.color, fill: this.color});
    if ( ! (note[1] === undefined) ) {
      this.text( fret_left + (string_number - 1) * this.string_spacing,
      this.margin_top + fret_dy, note[1] ).attr({fill: this.fingering_text_color, "font-size":"12px"});
    }
  }

  if ( this.has_tab && fret_number >= 0 ) {
    this.draw_tab_note( (this.strings_drawn - string_number + 1), fret_number, this.margin_left + this.string_spacing * 2.5 );
  }
}


// extend the tab drawing area
Raphael.fn.tab_extend = function (width) {
  if (this.has_tab == false) return;
  for (var i = 0; i < this.strings_drawn; i++ ) {
    this.path(this.svg_params(this.current_offset, this.tab_top  + (i * this.tab_spacing),width, 0)).attr({stroke: this.color})
  }
}


// start the tab
Raphael.fn.tab_start = function () {
  if (this.has_tab == false) return;
  var width = this.tab_char_width * 3;
  //  start bar
  this.path(this.svg_params(this.current_offset, this.tab_top,0, this.tab_height)).attr({stroke: this.color, "stroke-width":1 })

  // extend tab
  this.tab_extend(width);

  //write TAB
  this.text(this.current_offset + this.tab_char_width, this.tab_top + this.tab_spacing * 1.5, "T").attr({stroke: this.color, "font-size":"14px"});
  this.text(this.current_offset + this.tab_char_width, this.tab_top + this.tab_spacing * 2.5, "A").attr({stroke: this.color, "font-size":"14px"});
  this.text(this.current_offset + this.tab_char_width, this.tab_top + this.tab_spacing * 3.5, "B").attr({stroke: this.color, "font-size":"14px"});
  this.increment_offset(width);

}


// draw an individual note in the tab
Raphael.fn.draw_tab_note = function (string_number, token, left_offset) {
  // NB: internal string_number in tab counts from high to low
  this.text(this.current_offset + left_offset,
          this.tab_top + this.tab_spacing * (string_number - 1),
          token).attr({fill: this.color, "font-size":"16px"});
}

// gets string number from token $[1-6|EADGBe]
Raphael.fn.get_string_number = function (token) {
  var string_number = null;
  if ( token.match( /^\$[1-6]/ ) != null ) {
     string_number = token.substr(1,1);
  } else if ( token.match( /^\$[EADGBe]/ ) != null ) {
     string_number =  6 - "EADGBe".indexOf(token.substr(1,1));
  }
  return string_number;
}


// identify if full chord of notes specified i.e. A:1 = X02220 or C:4 = 8.10.10.9.8.8
// returns:
//   false = not a full chord representation
//   array = array of notes (low to high)
Raphael.fn.get_fullchord_notes = function (token) {
  var rc = false;
  if ( token.match( /[^\.xX0-9]/ ) != null ) {
    rc = false;
  } else {
    if ( token.match( /\./ ) != null ) {
       rc = token.split('.');
    } else {
      rc = token.split('');
    }
    if (rc.length != 6) rc = false;
  }
  return rc;
}


// draw a token on the tab
Raphael.fn.tab_note = function (token) {
  if (this.has_tab == false) return;

  if ( token.match( /\$/ ) != null ) { // contains a string specifier
    if ( token.match( /\./ ) != null ) { // is a multi-string specifier
      var parts = token.split(".");
      var width = 2;
      for (var i = 0; i < parts.length ; i++) { // get the max length of the multi-string specifiers
        if ( parts[i].length > width ) width = parts[i].length;
      }
      width *= this.tab_char_width + 1;
      this.tab_extend( width );
      for (var i = 0; i < parts.length ; i++) {
        var part = parts[i];
        var string_number = this.get_string_number(part);
        if (string_number != null) {
          this.tab_current_string = string_number;
        } else if ( this.tab_current_string > 0 )  {
          this.draw_tab_note( this.tab_current_string, part, width * 0.5 );
        }
      }
      this.increment_offset( width );

    } else { // just a string setting
      this.tab_current_string = this.get_string_number(token);
    }
  } else {
    var fullchord_notes = this.get_fullchord_notes(token);
    if ( fullchord_notes ) {
      var max_chars = fullchord_notes.max_chars();
      var width = this.tab_char_width * (max_chars + 2);
      this.tab_extend( width );
      for (var i = 0; i < fullchord_notes.length ; i++) {
        this.draw_tab_note( 6 - i, fullchord_notes[i], width * 0.5 );
      }
      this.increment_offset( width );
    } else if ( this.tab_current_string > 0 ) { // else draw literal, but only if a current string selected
      var width = this.tab_char_width * ( token.length + 2 );
      this.tab_extend( width );
      this.draw_tab_note( this.tab_current_string, token, width * 0.5 );
      this.increment_offset( width );
    }
  }
}


// main drawing routine entry point: to render a token - chord or tab
Raphael.fn.render_token = function (token) {

  var c = new jtabChord(token);

  if ( c.isValid ) { // draw chord
    var chord = c.chordArray;
    // this.chord_fretboard(chord[0], c.fullChordName );
    this.chord_fretboard(chord[0], c.chordName );
    for (var i = 1; i < chord.length ; i++) {
      this.chord_note(chord[0], i, chord[i]);
    }
    this.increment_offset();

  } else {
    if (token == "/" ) {
      this.stroke();
    } else if (token == "|" ) {
      this.bar();
    } else if (token == "||" ) {
      this.doublebar();
    } else if ( this.has_tab ) {
      this.tab_note( token );
    }

  }
}


//
// add jtab class methods
//


// determine nature of the token stream
// returns:
//   1 : chord and tab present
//   2 : chord only
//   3 : tab only
//   0 : unknown
jtab.characterize = function (notation) {
  var tabtype = 0;

  if(notation == undefined){
    notation = '';
  }

  var gotCustomChord = ( notation.match( /[\%]([0-4|T|X])?/ )   != undefined );
  var gotNormalChord = ( notation.match( /[^\$][A-G]|^[A-G]/ )  != undefined );
  var gotTab = ( ( notation.match( /\$/ ) != null ) || ( notation.match( /[^\%][0-9|Xx|\.]{6,}/ ) != null ) );
  var gotChord =  gotNormalChord || gotCustomChord ;

  // set defaults - apply scaling here (TODO)
  Raphael.fn.current_offset = Raphael.fn.margin_left;
  if ( gotChord && gotTab ) { // chord and tab
    tabtype = 1;
    Raphael.fn.has_chord = true;
    Raphael.fn.has_tab = true;
    Raphael.fn.tab_top = Raphael.fn.chord_height + Raphael.fn.tab_margin_top;
    Raphael.fn.total_height = Raphael.fn.tab_top + Raphael.fn.tab_height + Raphael.fn.margin_bottom;
  } else if ( gotChord ) { // chord only
    tabtype = 2;
    Raphael.fn.has_chord = true;
    Raphael.fn.has_tab = false;
    Raphael.fn.tab_top = Raphael.fn.chord_height + Raphael.fn.tab_margin_top;
    Raphael.fn.total_height = Raphael.fn.chord_height;
  } else if ( gotTab ) { // tab only
    tabtype = 3;
    Raphael.fn.has_chord = false;
    Raphael.fn.has_tab = true;
    Raphael.fn.tab_top = Raphael.fn.tab_margin_top;
    Raphael.fn.total_height = Raphael.fn.tab_top + Raphael.fn.tab_height + Raphael.fn.margin_bottom;
  }
  Raphael.fn.tabtype = tabtype;
  return tabtype;
}

// utility function to get calculated style based on given element
jtab.getStyle = function (element, style) {
  var value = element.css(style);
  if(!value) {
    if(document.defaultView) {
      value = document.defaultView.getComputedStyle(element[0], "").getPropertyValue(style);
    } else if(element.currentStyle) {
      value = element.currentStyle[style];
    }
  }

  return value;
}

// set color pallette for the jtab rendering
jtab.setPalette = function (element) {
  var fgColor = jtab.getStyle( jQuery(element), 'color' );
  if (!fgColor) {
    fgColor = '#000';
  }
  Raphael.fn.color = fgColor;
  Raphael.fn.tab_text_color = fgColor;

  bgColor = jtab.getStyle( jQuery(element), 'background-color' );
  if (!bgColor || (bgColor == 'transparent') || (bgColor == 'rgba(0, 0, 0, 0)')) {
    bgColor = '#fff';
  }
  Raphael.fn.fingering_text_color = bgColor;
}

// Render the tab for a given +element+.
// +element+ is a DOM node
// +notation_text+ is the optional notation to render (if not specified, +element+ text content will be used)
// After rendering, the +element+ will be given the additional "rendered" class.
jtab.render = function (element,notation_text) {

  var notation = notation_text || jQuery(element).text() || '';

  var tabtype = jtab.characterize( notation );
  if (tabtype == 0 ) return;

  var rndID="builder_"+jtab.element_count++;

  // add the Raphael canvas in its own DIV. this gets around an IE6 issue with not removing previous renderings
  var canvas_holder = jQuery('<div id="'+rndID+'"></div>').css({height: Raphael.fn.total_height});

  jQuery(element).html(canvas_holder);
  jtab.setPalette(element);
  canvas = Raphael(rndID, 80, Raphael.fn.total_height );
  canvas.tab_start();

  var tokens = notation.split(/\s/);
  for(var i = 0; i < tokens.length; i++) {
    canvas.render_token(tokens[i]);
  }
  jQuery(element).addClass('rendered');
}

// Render all nodes with class 'jtab'.
// +within_scope+ is an optional selector that will restrict rendering to only those nodes contained within.
jtab.renderimplicit = function(within_scope) {
  jQuery('.jtab',within_scope).not('.rendered').each( function(name, index) { jtab.render(this); } );
}

// initialize jtab library.
// Sets up to run implicit rendering on window.onload
jtab.init = function() {
  var oldonload = window.onload;
  window.onload = function() {
    if (typeof oldonload == 'function') oldonload();
    jtab.renderimplicit(null);
  }
}

// bootstrap jtab when jQuery is ready
jQuery(document).ready(function($) {
  jtab.init();
});
