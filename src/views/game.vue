<template>
  <div id="_game">
    <div class="loading" v-if="count >= 0">
      <h1>Game starts in...</h1>
      <pre class="lg-text">{{ count }}</pre>
    </div>
    <game-one class="game" v-else-if="$route.params.type == 0"
    :qs="qs"></game-one>
    <game-two class="game" v-else-if="$route.params.type == 1"></game-two>
    <div class="game" v-else-if="$route.params.type == 2"></div>
  </div>
</template>

<script>
import gameOne from './quiz';
import gameTwo from './match';

import qs from './data/questions.json';

export default {
  components: {
    gameOne,
    gameTwo
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
  .lg-text {
    margin: 0;
    font-size: 5rem;
  }
}
</style>