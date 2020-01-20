<template>
  <div id="_hangman" v-if="arr.length">
    <div class="question">{{ arr[qId].question }}</div>
    <hangman-game
      ref="hangman"
      :words="[arr[qId].answer]"
      :show-play-again="false"
      @gameFinished="gameFinished"
      />
  </div>
</template>

<script>
import hangmanGame from '@/components/HangmanGame';

import questions from './data/hangman.json';

export default {
  mounted() {
    this.arr = this.shuffle(this.questions);
  },
  components: {
    hangmanGame,
  },
  data: () => ({
    qId: 0,
    arr: [],
    questions,
  }),
  methods: {
    shuffle(array) {
      var currentIndex = array.length, temporaryValue, randomIndex;
      while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
      }
      return array;
    },
    gameFinished: function (word, lose) {
      console.log('game finished!!!')
      console.log('user was guessing word:', word)
      console.log('she/he/it lost?', lose)
    }
  }
}
</script>

<style lang="scss">
#_hangman {
  .question {
    font-size: 1.2rem;
    font-weight: 500;
    padding: 0 1rem;
    color: white;
    margin-bottom: -2rem;
  }
  #board {
    background-color: inherit;
    box-shadow: none;
  }
  #word {
    margin-bottom: 2rem 0;
  }
  #keyboard {
    .keyboard-row {
      .keyboard-row-letter {
        margin: 3px;
      }
    }
  }
}
</style>