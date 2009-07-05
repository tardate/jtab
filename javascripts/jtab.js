/**
 * JTab - Javascript/CSS Guitar Tab Notation.
 * Version 1.0
 * Copyright (C) 2009 Paul Gallagher
 * http://tardate.com/jtab
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
  fb : {
    margin_top : 40,
    margin_left : 10,
    string_spacing : 20,
    strings_drawn : 6,
    fret_spacing : 30,
    frets_drawn : 5,
    color : "#000"
  },
  Strings : {
  	AboutDialog : '<html><head><title>About...</title></head><body class="dp-about"><table cellspacing="0"><tr><td class="copy"><p class="title">dp.SyntaxHighlighter</div><div class="para">Version: {V}</p><p><a href="http://www.dreamprojections.com/syntaxhighlighter/?ref=about" target="_blank">http://www.dreamprojections.com/syntaxhighlighter</a></p>&copy;2004-2007 Alex Gorbatchev.</td></tr><tr><td class="footer"><input type="button" class="close" value="OK" onClick="window.close()"/></td></tr></table></body></html>'
  },
  Version : '1.0',
  d : {
    chords : new Object()
  }
};
jtab.d.chords['A'] = [ [ 0, -1,  0,  2,  2,  2,  0 ], [ 5, 5, 7, 7, 6, 5, 5 ] ];
jtab.d.chords['A']     = [ [ 0, -1,  0,  2,  2,  2,  0 ], [ 5, 5, 7, 7, 6, 5, 5 ] ];
jtab.d.chords['Am']    = [ [ 0, -1,  0,  2,  2,  1,  0 ], [ 5, 5, 7, 7, 5, 5, 5 ] ];
jtab.d.chords['A7']    = [ [ 0, -1,  0,  2,  0,  2,  0 ], [  ] ];
jtab.d.chords['Amaj7'] = [ [ 0, -1,  0,  2,  1,  2,  0 ], [  ] ];
jtab.d.chords['Am7']   = [ [ 0, -1,  0,  2,  0,  1,  0 ], [  ] ];
jtab.d.chords['B']     = [ [ 0,  2,  2,  4,  4,  4,  2 ], [  ] ];
jtab.d.chords['C']     = [ [ 0,  0,  3,  2,  0,  1,  0 ], [  ] ];
jtab.d.chords['D']     = [ [ 0, -1,  0,  0,  2,  3,  2 ], [  ] ];
jtab.d.chords['Dsus4'] = [ [ 0, -1,  0,  0,  2,  3,  3 ], [  ] ];
jtab.d.chords['E']     = [ [ 0,  0,  2,  2,  1,  0,  0 ], [ 7, -1, 7, 9, 9, 9, 7 ] ];


//
// define extensions to the Raphael class
//
    
Raphael.fn.margin_top = 40;
Raphael.fn.margin_left = 10;
Raphael.fn.string_spacing = 20;
Raphael.fn.strings_drawn = 6;
Raphael.fn.fret_spacing = 30;
Raphael.fn.frets_drawn = 5;
Raphael.fn.color = "#000";


Raphael.fn.fretboard = function (position) {
  
  // nut
  var nut = this.path({stroke: jtab.fb.color, "stroke-width":3 }).relatively().moveTo(this.margin_left, this.margin_top).lineTo(this.string_spacing * (this.strings_drawn - 1), 0);
  // frets
  for (var i = 0; i < this.frets_drawn; i++ ) {
    var c = this.path({stroke: jtab.fb.color}).relatively().moveTo(this.margin_left, this.margin_top + (i * this.fret_spacing)).lineTo(this.string_spacing * (this.strings_drawn - 1), 0 );
  }
  
  // strings
  for (var i = 0; i < this.strings_drawn; i++ ) {
    var c = this.path({stroke: jtab.fb.color}).relatively().moveTo(this.margin_left + (i * this.string_spacing), this.margin_top).lineTo(0, this.fret_spacing * (this.frets_drawn - 0.5) );
  }
  
}

Raphael.fn.note = function (string_number,fret_number) {

  if (fret_number < 0 ) {
    // muted/not played
    this.text(this.margin_left + (string_number - 1) * this.string_spacing, this.margin_top - 10, "x").attr({stroke: jtab.fb.color, "font-size":"9px"});
  } else if (fret_number == 0 ) {
    // open
    this.text(this.margin_left + (string_number - 1) * this.string_spacing, this.margin_top - 10, "o").attr({stroke: jtab.fb.color, "font-size":"9px"});
  } else {
    var circle = this.circle(this.margin_left + (string_number - 1) * this.string_spacing, this.margin_top + (fret_number - 0.5) * this.fret_spacing, 5);
    circle.attr("fill", "#000");
    circle.attr("stroke", "#000");
  }
}
Raphael.fn.chord = function (name,position) {

  var text = this.text(this.margin_left + 2.5 * this.string_spacing, this.margin_top - 25, name);
  text.attr({stroke: jtab.fb.color});
  text.attr("font-size", "20px");

  var ch = jtab.d.chords[name][position-1];
  for (var i = 1; i < ch.length ; i++) {  
    this.note(i, ch[i]);
  }

}

//function jTab() {}
jtab.notate = function (element,command) {
 
  $(element).update('');
  canvas = Raphael(element, 320, 200); 
  canvas.fretboard(1);
  canvas.chord(command,1);
}


jtab.renderimplicit = function() {
  $$('.jtab').each( function(name, index) { jtab.notate(name,name.innerHTML); } );
}

jtab.init = function() {
  if (typeof window.onload != 'function') {
    window.onload = jtab.renderimplicit;
  } else {
    var oldonload = window.onload;
    window.onload = function() {
      if (oldonload) {
        oldonload();
      }
      jtab.renderimplicit();
    }
  }
}


jtab.init();

