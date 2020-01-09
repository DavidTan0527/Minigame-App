<template>
  <div id="_match">
    <div class="header">
      <div class="score">Score: {{ correct }}</div>
      <div class="timer" :class="{danger}">{{ time }}</div>
    </div>
    <div class="question">
      {{ QArr.length ? QArr[qId].text : '' }}
    </div>
    <div class="answer">
      <div class="debit">
        <div>Debit</div>
        <div class="selects" :ref="`debit-${d.id}`"
        :class="{
          'transparent': clickedD.includes(d.id),
          'selected': selectedD ? d.id == selectedD.id : '',
          'is-wrong': wrong,
          'is-correct': right,
        }"
        v-for="d in DArr" :key="d.id" @click="() => {if(!freeze && !clickedD.includes(d.id)) selectedD = d}">
          {{ d.text }}
        </div>
      </div>
      <div class="credit">
        <div>Credit</div>
        <div class="selects" :ref="`credit-${c.id}`"
        :class="{
          'transparent': clickedC.includes(c.id),
          'selected': selectedC ? c.id == selectedC.id : '',
          'is-wrong': wrong,
          'is-correct': right,
        }"
        v-for="c in CArr" :key="c.id" @click="() => {if(!freeze && !clickedC.includes(c.id)) selectedC = c}">
          {{ c.text }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import matches from './data/match.json';
import { mapMutations } from 'vuex';

export default {
  mounted() {
    this.prog = setInterval(() => {
      this.time--;
      if (this.time <= 10) this.danger = true;
    }, 1000);
    this.randomize(5);
  },
  data: () => ({
    matches,
    match_num: 0,
    qId: 0,
    prog: null,
    wrong: false,
    right: false,
    freeze: false,
    selectedD: null,
    selectedC: null,
    clickedD: [],
    clickedC: [],
    time: 60,
    CArr: [],
    DArr: [],
    QArr: [],
    danger: false,
    endgame: 3,
    correct: 0,
  }),
  methods: {
    ...mapMutations({
      score: 'ADD_SCORE'
    }),
    hard_reset() {
      clearInterval(this.prog);
      this.match_num = 0
      this.qId = 0
      this.prog = null
      this.wrong = false
      this.freeze = false
      this.selectedD = null
      this.selectedC = null
      this.clickedD = []
      this.clickedC = []
      this.CArr = []
      this.DArr = []
      this.QArr = []
      this.danger = false
    },
    reset() {
      this.selectedD = null;
      this.selectedC = null;
      this.wrong = false;
      this.right = false;
      this.freeze = false;
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
    searchById(id, key) {
      let targetArr = key == "C" ? this.matches[1] : this.matches[0];
      return targetArr.filter(el => el.id == id)[0];
    },
    randomize(count) {
      this.DArr = []; this.CArr = []; this.QArr = [];
      this.match_num = count;
      this.matches[2] = this.shuffle(this.matches[2]);
      let DSet = new Set(), CSet = new Set();
      for (let i = 0; i < this.matches[2].length; i++) {
        let obj = this.matches[2][i];
        let C = this.searchById(obj.id, "C"), D = this.searchById(obj.id, "D");
        if (DSet.has(D.text) || CSet.has(C.text)) continue;
        this.QArr.push(obj);
        DSet.add(D.text); CSet.add(C.text);
        this.DArr.push(D); this.CArr.push(C);
        this.matches[2].splice(i, 1);
        if (this.QArr.length == count) break;
      }
      this.DArr = this.shuffle(this.DArr);
      this.CArr = this.shuffle(this.CArr);
    },
    inc() {
      this.correct++;
      this.match_num--; this.qId += this.qId == this.QArr.length - 1 ? 0 : 1;
    },
    finish_game() {
      this.score(this.correct);
      alert(`You have scored ${this.correct}.`);
      setTimeout(() => {
        this.$router.push('/');
      }, 3000);
    }
  },
  watch: {
    selectedC(self) {
      if (self && this.selectedD) {
        if (self.id == this.QArr[this.qId].id
          && this.selectedD.id == self.id) {
            this.clickedD.push(this.selectedD.id);
            this.clickedC.push(self.id);
            this.right = true;
            this.inc();
            this.reset();
          } else { 
            this.wrong = true; this.freeze = true; 
            setTimeout(this.reset, 800);
          }
      }
    },
    selectedD(self) {
      if (self && this.selectedC) {
        if (self.id == this.QArr[this.qId].id
          && this.selectedC.id == self.id) {
            this.clickedD.push(self.id);
            this.clickedC.push(this.selectedC.id);
            this.right = true;
            this.inc();
            this.reset();
          } else { 
            this.wrong = true; this.freeze = true; 
            setTimeout(this.reset, 800);
          }
      }
    },
    match_num(x) {
      if (x == 0) {
        if (this.endgame == 0) {
          clearInterval(this.prog);
          setTimeout(this.finish_game, 500);
        }
        else {
          setTimeout(() => {
            this.endgame--;
            this.time = 45+this.endgame*5;
            this.hard_reset();
            this.prog = setInterval(() => {
              this.time--;
              if (this.time <= 10) this.danger = true;
            }, 1000);
            this.randomize(5);
          }, 1000);
        }
      }
    },
    time(self) {
      if (self <= 0) {
        clearInterval(this.prog);
        setTimeout(this.finish_game, 500);
      }
    }
  }
}
</script>

<style lang="scss">
#_match {
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
  .question {
    margin-bottom: 1rem;
    font-size: 1.3rem;
    font-weight: 500;
  }
  .answer {
    display: flex;
    justify-content: space-around;
    font-size: 1.3rem;
    .debit {
      margin-right: .2rem;
    }
    .credit {
      margin-left: .2rem;
    }
    .selects {
      border: 1.5px solid #999;
      padding: .15rem .25rem;
      border-radius: .25rem;
      margin-top: .2rem;
      margin-bottom: .5rem;
      font-size: 1rem;
      &.transparent {
        opacity: 0;
      }
      &.selected {
        // border: 2px solid;
        border-color: #333;
        &.is-correct {
          border-color: greenyellow;
        }
        &.is-wrong {
          border-color: red !important;
        }
      }
    }
  }
}
</style>