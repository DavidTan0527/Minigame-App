<template>
  <div id="_spin">
    <h1 class="title">SPIN ME!!!</h1>
    <div class="wheel-container"  @click="getPrize">
      <div class="custom-lucky-wheel-button" :class="{dark}">
        <img 
          src="https://upload.wikimedia.org/wikipedia/commons/0/05/Red_Arrow_Left.png" 
          alt="" style="transform: rotate(-90deg);" width="60" height="40">
      </div>
      <div class="luckywheel">
        <div class="spin-text" v-if="!start">
          Click here to spin
        </div>
        <vue-luckywheel
          class="wheel"
          :class="{dark}"
          ref="luckyWheel"
          :prizeIndex="prizeIndex"
          :rotate-time="5"
          @game-over="gameOver">
          <vue-luckywheel-item v-for="(prize, index) in prizeList" :key="index">
            <div class="name">{{prize.name}}</div>
          </vue-luckywheel-item>
        </vue-luckywheel>
      </div>
    </div>
    <div class="btn-text" @click="$router.push('/')">Back to start menu</div>
    <h1 class="result" v-if="showResult">
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
};
</script>

<style lang="scss">
#_spin {
  .title {
    color: #80D7D9;
  }
  .wheel-container {
    transition-duration: 1s;
    &:hover {
      .spin-text { font-size: 2.2rem; }
    }
    .spin-text {
      position: absolute;
      font-size: 2rem;
      font-weight: 700;
      top: 50%;
      left: 50%;
      width: 100%;
      transform: translate(-50%, -50%);
      z-index: 100;
      color: white;
      animation: pop 0.8s ease-in-out infinite;
    }
    .custom-lucky-wheel-button {
      position: relative;
      top: 20px;
      z-index: 99;
      transition-duration: 500ms;
      &.dark {
        filter: blur(1px) saturate(.9) opacity(.8);
      }
    }
    .luckywheel {
      position: relative;
      .wheel {
        transition-duration: 500ms;
        &.dark {
          filter: blur(1px) saturate(.9) opacity(.8);
        }
        .vue-lucky-wheel-item-content {
          font-size: 12px;
          .name, .level {
            position: absolute;
            left: 0;
            width: 100%;
          }
          .name {
            top: 25px;
            font-size: 1rem;
            font-weight: 500;
            color: black;
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
  }

  .btn-text {
    color: #999;
    font-weight: 700;
    font-size: 1rem;
    position: relative;
    top: 5rem;
    cursor: pointer;
  }

  .result {
    width: 100%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%);
    color: rgba(#555, .5);
  }
}

@keyframes pop {
  50% {
    top: 45%;
  }
}
</style>