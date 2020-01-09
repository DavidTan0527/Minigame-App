<template>
  <div class="home">
    <div class="header">
      <div class="score">Score: {{score}}</div>
      <div class="timer" :class="{danger}">{{time}}</div>
    </div>
    <div class="quesBox">
      <span class="ques">
        {{ qs[selected_id].text }}
      </span>
    </div>
    <div class="allAns">
      <span class="ans" v-for="ans in qs[selected_id].answers" :key="ans.id" @click="check(ans.id)"
      :class="[chosen ? ans.id == qs[selected_id].ans ? 'correct' : 'wrong' : '']">
        {{ ans.text }}
      </span>
    </div>
    <!-- <div class="buttons">
      <span @click="selected_id > 0 ? selected_id-- : selected_id = selected_id" class="last">Last</span>
      <span @click="selected_id == qs.length - 1 ? selected_id = selected_id : selected_id++" class="next">Next</span>
    </div> -->
  </div>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
  props: ['qs'],
  mounted() {
    this.prog = setInterval(() => {
      this.time--;
      if (this.time <= 10) this.danger = true;
    }, 1000);
  },
  data: () => ({
    selected_id: 0,
    chosen: false,
    time: 180,
    danger: false,
    prog: null,
    score: 0,
  }),
  methods: {
    ...mapMutations({
      add: 'ADD_SCORE'
    }),
    check(id) {
      this.chosen = true;
      let inter = 1000;
      if (id != this.qs[this.selected_id].ans) inter = 3000;
      else this.score += this.qs[this.selected_id].score;

      if (this.selected_id == this.qs.length-1) inter = 0;
      setTimeout(() => {
        this.selected_id++;
        if (this.selected_id == this.qs.length) {
          
        }
      }, inter);
    },
    finishGame() {
      this.add(this.score);
      // display score popup
      alert(`You have scored ${this.score}.`);
      setTimeout(() => {
        this.$router.push('/');
      }, 3000);
    }
  },
  watch: {
    selected_id() { this.chosen = false; },
    time() {
      if (this.time <= 0) {
        clearInterval(this.prog);
        setTimeout(() => {
          this.finishGame();
        }, 1000)
      };
    }
  }
}
</script>

<style lang="scss">
.home {
  padding: 3rem;
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 3rem;
    .score {
      font-size: 1.5rem;
    }
    .timer {
      display: flex;
      justify-content: flex-end;
      font-size: 3rem;
      &.danger {
        color: red;
      }
    }

  }
  .quesBox {
    border: solid 1.5px #555;
    padding: 1rem 1.8rem;
    text-align: start;
    border-radius: .5rem;
    margin-bottom: 2.5rem;
    .ques{
      word-wrap: wrap;
      font-size: 1.2rem;
    }
  }
  .allAns {
    height: auto;
    display: flex;
    flex-direction: column;
    .ans {
      cursor: pointer;
      border: solid 1px #555;
      border-radius: .2rem;
      margin-bottom: 1rem;
      background-color: rgba(0,0,0, 0);
      transition-duration: 300ms;
      &:last-child {
        margin: 0;
      }
      &.correct {
        border-color: #8eff3e;
      }
      &.wrong {
        border-color: rgb(255, 41, 41);
      }
    }
  }
}
</style>
