<template>
  <div id="_game" :class="{'show': count >= 0}">
    <div class="loading" v-if="count >= 0">
      <h1>Game starts in...</h1>
      <pre class="lg-text">{{ count }}</pre>
    </div>
    <game-one class="game" v-else-if="$route.params.type == 0"
    :qs="qs"></game-one>
    <game-two class="game" v-else-if="$route.params.type == 1"></game-two>
    <game-three class="game" v-else-if="$route.params.type == 2"></game-three>
  </div>
</template>

<script>
import gameOne from './quiz';
import gameTwo from './match';
import gameThree from './hangman';

import qs from './data/questions.json';

export default {
  components: {
    gameOne,
    gameTwo,
    gameThree,
  },
  mounted() {
    this.qs = this.shuffle(this.qs);
    this.load = setInterval(() => {
      this.count--;
    }, 1000);
  },
  data: () => ({
    count: 3,
    load: null,
    qs
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
  },
  watch: {
    count() {
      if (this.count < 0) clearInterval(this.load);
    }
  }
}
</script>

<style lang="scss">
#_game {
  &.show {
    height: 100%; width: 100%;
    // background-image: url("../assets/background-trans.png");
    // background-size: contain;
    // background-repeat: no-repeat;
    // background-attachment: fixed;
    // background-position: center;
  }
  .loading {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    font-size: 1.5rem;
    font-weight: 700;
    color: darken(#80D7D9, 10%);
    .lg-text {
      margin: 0;
      font-size: 5rem;
      color: darken(#80D7D9, 10%);
    }
  }
}
</style>