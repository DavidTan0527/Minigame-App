<template>
  <div id="_start">
    <div class="title">
      <div class="alph">
        <span class="A">A</span>
        <span class="C">C</span>
        <span class="T">T</span>
      </div>
      <div class="ext" v-if="show">
        <span class="A">ct</span>
        <span class="C">ount</span>
        <span class="T">hink</span>
      </div>
    </div>
    <div class="body" v-if="reveal">
      <div>
        <i data-feather="play"></i>
        <span class="btn" @click="$refs.modal.active = true">Start</span>
      </div>
      <div>
        <span class="btn" @click="$router.push('/notes')">Notes</span>
      </div>
    </div>

    <modal class="start-menu" title="Please select game type:" ref="modal">
      <template slot="body">
        <div class="modal-button" @click="goto('/game/0')">Quiz</div>
        <div class="modal-button" @click="goto('/game/1')">Matching</div>
        <div class="modal-button" @click="goto('/game/2')">Hangman</div>
        <div class="modal-button" @click="goto('/spin')">Random</div>
      </template>
      <template slot="footer">
        <pre class="scoreboard">Score: {{ score }}</pre>
        <span class="btn" @click="reset">Reset Score</span>
      </template>
    </modal>
  </div>
</template>

<script>
import modal from '@/components/modal';
import { mapState, mapMutations } from 'vuex';

export default {
  components: {
    modal,
  },
  mounted() {
    setTimeout(() => {
      this.show = true;
      setTimeout(() => {
        this.reveal = true;
      }, 800);
    }, 1500);
  },
  data: () => ({
    show: false,
    reveal: false
  }),
  methods: {
    ...mapMutations({
      reset: 'RESET_SCORE'
    }),
    goto(path) {
      setTimeout(() => {
        this.$router.push(path);
      }, 300);
    }
  },
  computed: {
    ...mapState([
      'score'
    ])
  }
}
</script>

<style lang="scss">
@keyframes reveal {
    0% { opacity:0; }
    100% { opacity:1; }
}

@keyframes shiftA {
  from { right: 0; }
  50% { right: 0; }
  to { right: 85px; }
}

@keyframes shiftC {
  from { right: 0; }
  50% { right: 0; }
  to { right: 45px; }
}

@keyframes shiftT {
  from { right: 0; }
  50% { right: 0; }
  to { right: -25px; }
}

@keyframes pullup {
  from { top: 50%; }
  80% { top: 50%; }
  to { top: 20%; }
}

#_start {
  height: 100vh;
  .title {
    font-size: 3.5rem;
    animation: 2.5s pullup forwards;
    height: auto;
    position: relative;
    & > div {
      transform: translate(-50%, -50%);
      position: absolute;
      left: 50%;
      animation: 1s reveal forwards;
      span { position: relative; }
    }
    .alph {
      font-weight: 700;
      .A { animation: 1.5s shiftA forwards; color: red; }
      .C { animation: 1.5s shiftC forwards; color: green; }
      .T { animation: 1.5s shiftT forwards; color: blue; }
    }
    .ext {
      span { font-size: 2rem; color: #80D7D9; }
      .A { right: 25px; }
      .C { left: 28px; }
      .T { left: 60px; }
    }
  }

  .body {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 50vh;
    transform: translateY(-50%);
    animation: 1s reveal;
    & > div {
      cursor: pointer;
      margin-bottom: 5rem;
      width: 80%;
      &:last-of-type {
        margin-bottom: 0;
      }
    }
    .btn {
      font-size: 1.8rem;
      font-weight: 500;
      color: #80D7D9;
      border: solid 1px darken(#2F64BB, 5%);
      border-radius: .5rem;
      background-color: #2F64BB;
      padding: 0 1rem;
      &:hover {
        background-color: darken(#2F64BB, 10%);
        border: solid 1px darken(#2F64BB, 15%);
        color: darken(#80D7D9, 20%);
      }
    }
  }

  .start-menu {
    .modal-button {
      display: inline-block;
      padding: .75rem 1.25rem;
      font-size: 1rem;
      letter-spacing: .15rem;
      transition: all .3s;
      margin-bottom: .5rem;
      position: relative;
      overflow: hidden;
      text-align: start;
      cursor: pointer;
      &:after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border-radius: 1rem;
        z-index: -2;
      }
      &:before {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 0%;
        height: 100%;
        background-color: rgba(#2F64BB,.7);
        transition: all .3s;
        border-radius: 1rem;
        z-index: -1;
      }
      &:hover {
        color: #fff;
        &:before {
          width: 100%;
        }
      }
      &:last-of-type {
        margin-bottom: 0;
      }
    }

    .scoreboard {
      font-size: 1rem;
    }

    .btn {
      $color: rgb(255, 51, 0);
      cursor: pointer;
      background-color: $color;
      color: white;
      padding: .3rem .8rem;
      border-radius: .2rem;
      &:hover, &:active {
        background-color: darken($color, 2%);
      }
    }
  }
}

</style>