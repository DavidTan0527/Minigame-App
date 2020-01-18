<template>
  <div class="crossword-container" ref="crossword-container">
    <b-row v-if="showPlayAgain" align-h="center">
      <b-button
        size="sm"
        class="m-3"
        @click="playAgain">
        Play Again
      </b-button>
    </b-row>
    <div v-if="grid"
      class="crossword-board-container">
      <b-row>
        <b-col :class="[ smallContainer ? 'col-12' : 'col-7' ]">
          <div class="crossword-board">
            <template v-for="(row, index1) in grid">
              <template v-for="(item, index2) in row">
                <input v-if="item"
                  :key="`row-${index1}-${index2}`"
                  :id="index(index1, index2)"
                  class="crossword-board__item"
                  :class="{'crossword-board__item--valid': equalsLetters(form[index1][index2], item.char)}"
                  type="text"
                  minlength="1"
                  maxlength="1"
                  :pattern="pattern(item.char)"
                  required="required"
                  v-model="form[index1][index2]"/>
                <span v-else
                  :key="`row-${index1}-${index2}`"
                  :id="index(index1, index2)"
                  class="crossword-board__item--blank"/>
              </template>
            </template>
          </div>
        </b-col>
        <b-col :class="[ smallContainer ? ['col-12', 'px-5', 'my-5'] : 'col-4' ]">
          <div class="crossword-clues">
            <dl v-if="across.length > 0"
              class="crossword-clues__list crossword-clues__list--across">
              <dt class="crossword-clues__list-title">{{ this.across }}</dt>
              <dd class="crossword-clues__list-item"
                v-for="(word, index) in acrossWords"
                :key="`across-${word.word}-${index}`">
                <span class="hightlighted">{{index+1}}. {{word.clue}} ({{word.word}})</span>
              </dd>
            </dl>
            <dl v-if="down.length > 0"
              class="crossword-clues__list crossword-clues__list--down">
              <dt class="crossword-clues__list-title">{{ this.down }}</dt>
              <dd class="crossword-clues__list-item"
                v-for="(word, index) in downWords"
                :key="`down-${word.word}-${index}`">
                <span class="hightlighted">{{index+1}}. {{word.clue}} ({{word.word}})</span>
              </dd>
            </dl>
          </div>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
import wordsWithReflexions from "./data/crosswords.json";

function CrosswordCell (letter) {
  this.char = letter
  this.across = null
  this.down = null
}
function CrosswordCellNode (is_start_of_word, index) {
  this.is_start_of_word = is_start_of_word
  this.index = index
}
function WordElement (word, index) {
  this.word = word
  this.index = index
}
function Crossword (words_in, clues_in) {
  var GRID_ROWS = 50
  var GRID_COLS = 50
  var char_index = {}
  var bad_words
  this.getSquareGrid = function (max_tries) {
    var best_grid = null
    var best_ratio = 0
    for (var i = 0; i < max_tries; i++) {
      var a_grid = this.getGrid(1)
      if(a_grid == null) continue
      var ratio = Math.min(a_grid.length, a_grid[0].length) * 1.0 / Math.max(a_grid.length, a_grid[0].length)
      if (ratio > best_ratio) {
        best_grid = a_grid
        best_ratio = ratio
      }

      if (best_ratio == 1) break
    }
    return best_grid
  }

  this.getGrid = function(max_tries){
    for (var tries = 0; tries < max_tries; tries++) {
      clear();
      var start_dir = randomDirection()
      var r = Math.floor(grid.length / 2)
      var c = Math.floor(grid[0].length / 2)
      var word_element = word_elements[0]
      if (start_dir == "across") {
        c -= Math.floor(word_element.word.length/2)
      } else {
        r -= Math.floor(word_element.word.length/2)
      }

      if (canPlaceWordAt(word_element.word, r, c, start_dir) !== false) {
        placeWordAt(word_element.word, word_element.index, r, c, start_dir)
      } else {
        bad_words = [word_element]
        return null
      }

      var groups = []
      let word_has_been_added_to_grid
      groups.push(word_elements.slice(1))
      for (var g = 0; g < groups.length; g++) {
        word_has_been_added_to_grid = false
        for (var i = 0; i < groups[g].length; i++) {
          word_element = groups[g][i]
          var best_position = findPositionForWord(word_element.word)
          if (!best_position) {
            if (groups.length - 1 == g) groups.push([])
            groups[g+1].push(word_element)
          } else {
            r = best_position["row"], c = best_position["col"]
            var dir = best_position['direction']
            placeWordAt(word_element.word, word_element.index, r, c, dir)
            word_has_been_added_to_grid = true
          }
        }
        if(!word_has_been_added_to_grid) break
      }
      if (word_has_been_added_to_grid) return minimizeGrid()
    }
    bad_words = groups[groups.length - 1]
    return null
  }

  this.getBadWords = function(){
    return bad_words;
  }
  
  this.getLegend = function(grid){
    var groups = {"across" : [], "down" : []};
    var position = 1;
    for (var r = 0; r < grid.length; r++) {
      for (var c = 0; c < grid[r].length; c++) {
        var cell = grid[r][c];
        var increment_position = false
        for (var k in groups) {
          if (cell && cell[k] && cell[k]['is_start_of_word']) {
            var index = cell[k]['index']
            groups[k].push({"position" : position, "index" : index, "clue" : clues_in[index], "word" : words_in[index]})
            increment_position = true
          }
        }

        if (increment_position) position++
      }
    }
    return groups;
  }
  var minimizeGrid = function(){
    var r_min = GRID_ROWS-1, r_max = 0, c_min = GRID_COLS-1, c_max = 0
    for (var r = 0; r < GRID_ROWS; r++) {
      for (var c = 0; c < GRID_COLS; c++) {
        var cell = grid[r][c]
        if (cell != null) {
          if (r < r_min) r_min = r
          if (r > r_max) r_max = r
          if (c < c_min) c_min = c
          if (c > c_max) c_max = c
      }
      }
    }
    var rows = r_max - r_min + 1
    var cols = c_max - c_min + 1
    var new_grid = new Array(rows)
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        new_grid[r] = new Array(cols)
      }
    }
    for (let r = r_min, r2 = 0; r2 < rows; r++, r2++) {
      for (let c = c_min, c2 = 0; c2 < cols; c++, c2++) {
         new_grid[r2][c2] = grid[r][c]
      }
    }

    return new_grid
  }

  var addCellToGrid = function (word, index_of_word_in_input_list, index_of_char, r, c, direction) {
    var char = word.charAt(index_of_char)
    if (grid[r][c] == null) {
        grid[r][c] = new CrosswordCell(char)
        if (!char_index[char]) char_index[char] = []
        char_index[char].push({"row" : r, "col" : c})
    }
    var is_start_of_word = index_of_char == 0
    grid[r][c][direction] = new CrosswordCellNode(is_start_of_word, index_of_word_in_input_list)
  }

  var placeWordAt = function (word, index_of_word_in_input_list, row, col, direction) {
    if (direction == "across") {
      for (let c = col, i = 0; c < col + word.length; c++, i++) {
        addCellToGrid(word, index_of_word_in_input_list, i, row, c, direction)
      }
    } else if (direction == "down") {
      for (let r = row, i = 0; r < row + word.length; r++, i++) {
        addCellToGrid(word, index_of_word_in_input_list, i, r, col, direction)
      }
    } else {
      throw "Invalid Direction"
    }
  }
  
  var canPlaceCharAt = function(char, row, col){
    if (grid[row][col] == null) return 0
    if (grid[row][col]['char'] == char) return 1
    return false
  }

  var canPlaceWordAt = function (word, row, col, direction) {
    if (row < 0 || row >= grid.length || col < 0 || col >= grid[row].length) return false
    var intersections
    if (direction == "across") {
      if (col + word.length > grid[row].length) return false
      if (col - 1 >= 0 && grid[row][col - 1] != null) return false
      if (col + word.length < grid[row].length && grid[row][col+word.length] != null) return false
      for (let r = row - 1, c = col, i = 0; r >= 0 && c < col + word.length; c++, i++) {
        let is_empty = grid[r][c] == null
        let is_intersection = grid[row][c] != null && grid[row][c]['char'] == word.charAt(i)
        let can_place_here = is_empty || is_intersection
        if(!can_place_here) return false
      }
      for (let r = row + 1, c = col, i = 0; r < grid.length && c < col + word.length; c++, i++) {
        let is_empty = grid[r][c] == null
        let is_intersection = grid[row][c] != null && grid[row][c]['char'] == word.charAt(i)
        let can_place_here = is_empty || is_intersection
        if (!can_place_here) return false
      }
      intersections = 0
      for (let c = col, i = 0; c < col + word.length; c++, i++) {
        let result = canPlaceCharAt(word.charAt(i), row, c)
        if(result === false) return false
        intersections += result
      }
    } else if (direction == "down") {
      if (row + word.length > grid.length) return false
      if (row - 1 >= 0 && grid[row - 1][col] != null) return false
      if (row + word.length < grid.length && grid[row+word.length][col] != null) return false
      for (let c = col - 1, r = row, i = 0; c >= 0 && r < row + word.length; r++, i++) {
        let is_empty = grid[r][c] == null
        let is_intersection = grid[r][col] != null && grid[r][col]['char'] == word.charAt(i)
        let can_place_here = is_empty || is_intersection
        if (!can_place_here) return false
      }
      for (let c = col + 1, r = row, i = 0; r < row + word.length && c < grid[r].length; r++, i++) {
        let is_empty = grid[r][c] == null
        let is_intersection = grid[r][col] != null && grid[r][col]['char'] == word.charAt(i)
        let can_place_here = is_empty || is_intersection
        if (!can_place_here) return false
      }
      intersections = 0
      for (let r = row, i = 0; r < row + word.length; r++, i++) {
        let result = canPlaceCharAt(word.charAt(i, 1), r, col)
        if(result === false) return false
        intersections += result
      }
    } else {
        throw "Invalid Direction"
    }
    return intersections
  }

  var randomDirection = function() {
    return Math.floor(Math.random()*2) ? "across" : "down"
  }

  var findPositionForWord = function (word) {
    var bests = []
    for (var i = 0; i < word.length; i++) {
      var possible_locations_on_grid = char_index[word.charAt(i)]
      if(!possible_locations_on_grid) continue
      for (var j = 0; j < possible_locations_on_grid.length; j++) {
        var point = possible_locations_on_grid[j]
        var r = point['row']
        var c = point['col']
        var intersections_across = canPlaceWordAt(word, r, c - i, "across")
        var intersections_down = canPlaceWordAt(word, r - i, c, "down")

        if (intersections_across !== false)
          bests.push({"intersections" : intersections_across, "row" : r, "col" : c - i, "direction" : "across"})
        if (intersections_down !== false)
          bests.push({"intersections" : intersections_down, "row" : r - i, "col" : c, "direction" : "down"})
      }
    }
    if(bests.length == 0) return false;
    var best = bests[Math.floor(Math.random()*bests.length)]
    return best
  }

  var clear = function () {
    for (var r = 0; r < grid.length; r++) {
      for (var c = 0; c < grid[r].length; c++) {
        grid[r][c] = null
      }
    }
    char_index = {}
  }
  
  if (words_in.length < 2) throw "A crossword must have at least 2 words";
  if (words_in.length != clues_in.length) throw "The number of words must equal the number of clues";	

  var grid = new Array(GRID_ROWS)
  for (var i = 0; i < GRID_ROWS; i++) {
    grid[i] = new Array(GRID_COLS)
  }

  var word_elements = []
  for (let i = 0; i < words_in.length; i++) {
    word_elements.push(new WordElement(words_in[i], i))
  }

  word_elements.sort(function(a, b){ return b.word.length - a.word.length; })
}
var CrosswordUtils = {
  PATH_TO_PNGS_OF_NUMBERS : "numbers/",

  toHtml : function(grid, show_answers){
    if (grid == null) return
    var html = []
    html.push("<table class='crossword'>")
    var label = 1
    for (var r = 0; r < grid.length; r++) {
      html.push("<tr>");
      for (var c = 0; c < grid[r].length; c++) {
        var cell = grid[r][c]
        var is_start_of_word = false
        var css_class, char
        if (cell == null) {
          char = "&nbsp;"
          css_class = "no-border"
        } else {
          char = cell['char']
          css_class = ""
          is_start_of_word = (cell['across'] && cell['across']['is_start_of_word']) || (cell['down'] && cell['down']['is_start_of_word'])
        }

        if (is_start_of_word) {
          var img_url = CrosswordUtils.PATH_TO_PNGS_OF_NUMBERS + label + ".png"
          html.push("<td class='" + css_class + "' title='" + r + ", " + c + "' style=\"background-image:url('" + img_url + "')\">")
          label++
        } else {
          html.push("<td class='" + css_class + "' title='" + r + ", " + c + "'>")
        }

        if (show_answers) {
          html.push(char)
        } else {
          html.push("&nbsp;")
        }
      }
      html.push("</tr>")
    }
    html.push("</table>")
    return html.join("\n")
  }
}

export default {
  data: () => ({
    selectedWords: [],
    acrossWords: [],
    downWords: [],
    matrix: null,
    grid: null,
    form: null,
    smallContainer: false,
    lang: "EN",
    showPlayAgain: true,
    wordsWithReflexions,
  }),
  computed: {
    words: function () {
      return this.selectedWords.map(wordWithReflexion => wordWithReflexion.word)
    },

    clues: function () {
      return this.selectedWords.map(wordWithReflexion => wordWithReflexion.description)
    },

    across: function () {
      let acrossWord
      switch (this.lang) {
        case 'ES':
          acrossWord = 'Horizontales'
          break
        // case 'FR':
        //   acrossWord = 'Horizontal'
        //   break
        default:
          acrossWord = 'Across'
          break
      }
      return acrossWord
    },

    down: function () {
      let downWord
      switch (this.lang) {
        case 'ES':
          downWord = 'Verticales'
          break
        // case 'FR':
        //   across = 'Vertical'
        //   break
        default:
          downWord = 'Down'
          break
      }
      return downWord
    }
  },
  methods: {
    index: function (index1, index2) {
      let id = `item${index1+1}-${index2+1}`
      return id
    },
    pattern: function (value) {
      let pattern = `^[${value.toLowerCase()}${value.toUpperCase()}]{1}$`
      return pattern
    },
    equalsLetters: function (letter1, letter2) {
      return (letter1.toUpperCase() === letter2.toUpperCase()) || (letter1.toLowerCase() === letter2.toLowerCase())
    },
    setRandomWords: function () {
      let eightWords = []
      while (eightWords.length < 8) {
        let word = this.wordsWithReflexions[Math.floor(Math.random()*this.wordsWithReflexions.length)]
        if (eightWords.indexOf(word) < 0) {
          eightWords.push(word)
        }
      }
      this.selectedWords = eightWords
    },
    generateGrid: function () {
      const MATRIX_LENGTH = 13
      let grid
      while ((!grid) || (grid.length>MATRIX_LENGTH)) {
        this.setRandomWords()
        var cw = new Crossword(this.words, this.clues)
        var tries = 10
        grid = cw.getSquareGrid(tries)
      }
      this.grid = grid
      this.form = [ ...Array(MATRIX_LENGTH) ].map(() => Array(MATRIX_LENGTH).fill(''))
      if (this.grid.length < MATRIX_LENGTH) {
        while (this.grid.length < MATRIX_LENGTH) {
          this.grid.push([])
        }
        this.grid.forEach(row => {
          while (row.length < MATRIX_LENGTH) {
            row.push(null)
          }
        })
        let legend = cw.getLegend(this.grid)
        this.acrossWords = legend.across
        this.downWords = legend.down
      }
      console.log("object")
    },
    playAgain: function () {
      this.generateGrid()
    },
    getWindowWidth: function () {
      if (this.$refs['crossword-container'].parentElement.parentElement.clientWidth < 1200) {
        this.smallContainer = true
      }
    }
  },
  mounted () {
    this.generateGrid()
    this.$nextTick(function() {
      window.addEventListener('resize', this.getWindowWidth)
      this.getWindowWidth()
    })
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.getWindowWidth)
  }
}
</script>

<style>
.crossword-board__item--valid {
  background: #9aff67;
}

.hightlighted {
  background: rgba(255, 255, 255, 0.95);
  padding: 3px 5px;
  margin: -3px -5px;
  line-height: 1.7;
  display: inline;
}

.crossword-board-container {
  position: relative;
  /* background: #fff; */
}

.crossword-board {
  position: relative;
  z-index: 1;
  background: transparent;
  border: 1px solid #000;
  width: 650px;
  height: 650px;
  display: grid;
  grid-template: repeat(13, 7.69231%) / repeat(13, 7.69231%);
  list-style-type: none;
  padding: 0;
  margin: 0 auto;
}

.crossword-board__item {
  border: 1px solid #000;
  position: relative;
  z-index: 100;
  text-align: center;
  font-size: 20px;
  font-weight: bold;
  text-transform: uppercase;
}

.crossword-board__item:not(.crossword-board__item--valid) {
  background-color: #fff;
}

.crossword-board__item:active:not(.crossword-board__item--valid), .crossword-board__item:focus:not(.crossword-board__item--valid) {
  background: #ffff74;
  border: 1px solid #000;
  outline: 1px solid #000;
}

.crossword-board__item--blank {
  background-color: #75489794;
  border: 1px solid #000;
  outline: 1px solid #000;
}

.crossword-clues {
  /* position: absolute;
  margin-top: 650px; */
  color: #000;
  /* top: 0;
  left: 650px;
  width: 650px; */
}

.crossword-clues__list {
  margin: 0 0 0 60px;
  padding: 0;
  display: inline-block;
  vertical-align: top;
}

.crossword-clues__list-title {
  font-weight: bold;
  padding: 4px;
}

.crossword-clues__list-item {
  margin: 0;
  padding: 4px;
}
</style>
