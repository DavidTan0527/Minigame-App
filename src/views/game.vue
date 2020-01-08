<template>
  <div id="_game">
    <div class="loading" v-if="count >= 0">
      <h1>Game starts in...</h1>
      <pre class="lg-text">{{ count }}</pre>
    </div>
    <game-one class="game" v-else-if="$route.params.type == 0"></game-one>
    <game-two class="game" v-else-if="$route.params.type == 1"></game-two>
    <div class="game" v-else-if="$route.params.type == 2"></div>
  </div>
</template>

<script>
import gameOne from './quiz';
import gameTwo from './match';

export default {
  components: {
    gameOne,
    gameTwo
  },
  mounted() {
    this.load = setInterval(() => {
      this.count--;
    }, 1000);
    
  },
  data: () => ({
    count: 5,
    load: null,
  }),
  watch: {
    count() {
      if (this.count < 0) clearInterval(this.load);
    }
  }
}
</script>

<style lang="scss">
.lg-text {
  margin: 0;
  font-size: 5rem;
}
</style>