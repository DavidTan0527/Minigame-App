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
      <span class="ans" v-for="ans in answers" :key="ans.id" @click="check(ans.id)"
      :class="[chosen ? ans.id == qs[selected_id].ans ? 'correct' : 'wrong' : '']">
        {{ ans.text }}
      </span>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
  props: ['qs'],
  mounted() {
    this.answers = this.shuffle(this.qs[this.selected_id].answers);
    this.prog = setInterval(() => {
      this.time--;
      if (this.time <= 10) this.danger = true;
    }, 1000);
  },
  data: () => ({
    selected_id: 0,
    chosen: false,
    time: 90,
    danger: false,
    prog: null,
    score: 0,
    answers: [],
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
        this.answers = this.shuffle(this.qs[this.selected_id].answers);
        if (this.selected_id == this.qs.length) {
          clearInterval(this.prog);
          setTimeout(() => {
            this.finishGame();
          }, 500)
        }
      }, inter);
    },
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
    finishGame() {
      this.add(this.score);
      // display score popup
      alert(`You have scored ${parseInt(this.score)}.`);
      setTimeout(() => {
        this.$router.push('/');
      }, 1000);
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
  },
  computed: {
    answers() {
      // return shuffle()
    }
  }
}
</script>

<style lang="scss">
.home {
  padding: 2.5rem;
  color: #80D7D9;
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
      color: white;
      &.danger {
        color: red;
      }
    }
  }
  .quesBox {
    border: solid 1.5px #80D7D9;
    padding: 1rem 1.8rem;
    text-align: start;
    border-radius: .5rem;
    margin-bottom: 2.5rem;
    .ques{
      word-wrap: wrap;
      font-size: 1.2rem;
      font-weight: 500;
    }
  }
  .allAns {
    height: auto;
    display: flex;
    flex-direction: column;
    .ans {
      cursor: pointer;
      border: solid 1px white;
      border-radius: .2rem;
      margin-bottom: 1rem;
      background-color: rgba(0,0,0, 0);
      transition-duration: 300ms;
      font-weight: 500;
      border-color: #80D7D9;
      border-width: 2px;
      padding: .2rem .5rem;
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
