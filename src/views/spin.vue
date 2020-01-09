<template>
  <div id="_spin">
    <h1 class="title">SPIN ME!!!</h1>
    <div class="wheel-container" :class="{dark}" @click="getPrize">
      <div class="custom-lucky-wheel-button">
        <img 
          src="https://upload.wikimedia.org/wikipedia/commons/0/05/Red_Arrow_Left.png" 
          alt="" style="transform: rotate(-90deg);" width="60" height="40">
      </div>
      <vue-luckywheel
        class="wheel"
        ref="luckyWheel"
        :prizeIndex="prizeIndex"
        :rotate-time="5"
        @game-over="gameOver">
        <div class="spin-text" v-if="!start">
          Click here to spin
        </div>
        <vue-luckywheel-item v-for="(prize, index) in prizeList" :key="index">
          <div class="name">{{prize.name}}</div>
        </vue-luckywheel-item>
      </vue-luckywheel>
    </div>
    <pre class="scoreboard">Your score: {{ score }}</pre>
    <span class="btn" @click="reset">Reset Score</span>
    <h1 class="result" v-if="showResult">
      <!-- Entering game mode {{records.gameType}} -->
      Entering Game
    </h1>
  </div>
</template>

<script>
import prizeList from './data/spinwheel-sectors.json';
import { mapState, mapMutations } from 'vuex';

export default {
  data: () => ({
    prizeIndex: 0,
    prizeList,
    records: {},
    start: false,
    showResult: false,
    dark: true,
  }),
  methods: {
    ...mapMutations({
      reset: 'RESET_SCORE'
    }),
    getPrize() {
      if (this.start) return;
      this.dark = false;
      this.start = true;
      this.$refs.luckyWheel.getPrize();
      setTimeout(() => {
        this.prizeIndex = Math.floor(Math.random() * this.prizeList.length);
        this.$nextTick(this.$refs.luckyWheel.draw);
      }, 300);
    },
    gameOver() {
      this.records = this.prizeList[this.prizeIndex]
      this.dark = true;
      setTimeout(() => {
        this.showResult = true;
      }, 500);
      setTimeout(() => {
        this.$router.push(`/game/${this.records.gameType}`)
      }, 3500);
    }
  },
  computed: {
    ...mapState([
      'score'
    ])
  }
};
</script>

<style lang="scss">
.wheel-container {
  transition-duration: 1s;
  &.dark {
    opacity: .5;
  }
  &:hover {
    .spin-text { font-size: 1.9rem; }
  }
  .spin-text {
    position: absolute;
    font-size: 1.8rem;
    top: 50%;
    left: 50%;
    width: 100%;
    transform: translate(-50%, -50%);
    z-index: 100;
    animation: pop 0.8s ease-in-out infinite;
  }
  .custom-lucky-wheel-button {
    position: relative;
    top: 20px;
    z-index: 99;
  }
  .wheel {
    .vue-lucky-wheel-item-content {
      font-size: 12px;
      .name, .level {
        position: absolute;
        left: 0;
        width: 100%;
      }
      .name {
        top: 30px;
      }
      .level {
        bottom: 60px;
      }
    }
    .vue-lucky-wheel-button {
      display: none;
    }
  }
}

.scoreboard {
  margin-top: 3rem;
  margin-bottom: 3rem;
  font-size: 1.5rem;
}

.btn {
  $color: rgb(255, 60, 0);
  cursor: pointer;
  background-color: $color;
  color: white;
  padding: .3rem .8rem;
  border-radius: .2rem;
  &:hover, &:active {
    background-color: darken($color, 2%);
  }
}

.result {
  width: 100%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateX(-50%);
  color: rgba(#555, .5);
}


@keyframes pop {
  50% {
    top: 45%;
  }
}
</style>