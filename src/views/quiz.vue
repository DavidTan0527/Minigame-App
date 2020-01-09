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
    time: 30,
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
      console.log("finish", this.score);
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
      &:hover {
        background-color: rgba(0,0,0, 0.2); 
        transition-duration: 500ms;
      }
      &:last-child {
        margin: 0;
      }
      &.correct {
        border-color: #8eff3e;
        animation: pop;
      }
      &.wrong {
        border-color: rgb(255, 41, 41);
      }
    }
  }
  .buttons {
    margin-top: 5rem;
    display: flex;
    justify-content: space-around;
    span {
      cursor: pointer;
      font-size: 1.2rem;
      border: 1px solid;
      border-color: #8fc866;
      color: #8fc866;
      border-radius: .2rem;
      outline: none;
      background: none;
      line-height: 1;
      margin: 0.5em;
      padding: 1em 2em;
      transition: ease-out 300ms;
      &:hover, &:focus {
        border-color: var(--hover);
        color: #fff;
        &.last{ box-shadow: inset -6.5em 0 0 0 adjust-hue(#8fc866, 45deg); }
        &.next{ box-shadow: inset 6.5em 0 0 0 adjust-hue(#8fc866, 45deg); }
      }
    }
  }
  @keyframes pop {
    0% {}
    100% {}
  };
}
</style>
