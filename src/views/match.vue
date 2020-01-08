<template>
  <div id="_match">
    <div class="question">
      {{ matches[2][qId].text }}
    </div>
    <div class="answer">
      <div class="debit">
        <div>Debit</div>
        <div class="selects" :ref="`debit-${d.id}`"
        :class="{
          'transparent': clickedD.includes(d.id),
          'selected': selectedD ? d.id == selectedD.id : '',
          'is-wrong': wrong
        }"
        v-for="d in matches[0]" :key="d.id" @click="() => {if(!freeze) selectedD = d}">
          {{ d.text }}
        </div>
      </div>
      <div class="credit">
        <div>Credit</div>
        <div class="selects" :ref="`credit-${c.id}`"
        :class="{
          'transparent': clickedC.includes(c.id),
          'selected': selectedC ? c.id == selectedC.id : '',
          'is-wrong': wrong
        }"
        v-for="c in matches[1]" :key="c.id" @click="() => {if(!freeze) selectedC = c}">
          {{ c.text }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import matches from './data/test.json';

export default {
  mounted() {
    this.matches[0] = this.shuffle(this.matches[0]);
    this.matches[1] = this.shuffle(this.matches[1]);
  },
  data: () => ({
    matches,
    match_num: matches[0].length,
    qId: 0,
    wrong: false,
    freeze: false,
    selectedD: null,
    selectedC: null,
    clickedD: [],
    clickedC: []
  }),
  methods: {
    reset() {
      this.selectedD = null;
      this.selectedC = null;
      this.wrong = false;
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
    }
  },
  watch: {
    selectedC(self) {
      if (self && this.selectedD) {
        if (self.id == matches[2][this.qId].id
          && this.selectedD.id == self.id) {
            this.clickedD.push(this.selectedD.id);
            this.clickedC.push(self.id);
            this.match_num--; this.qId += this.qId == this.matches[2].length - 1 ? 0 : 1;
            this.reset();
          } else { 
            this.wrong = true; this.freeze = true; 
            setTimeout(this.reset, 800);
          }
      }
    },
    selectedD(self) {
      if (self && this.selectedC) {
        if (self.id == matches[2][this.qId].id
          && this.selectedC.id == self.id) {
            this.clickedD.push(self.id);
            this.clickedC.push(this.selectedC.id);
            this.match_num--; this.qId += this.qId == this.matches[2].length - 1 ? 0 : 1;
            this.reset();
          } else { 
            this.wrong = true; this.freeze = true; 
            setTimeout(this.reset, 800);
          }
      }
    },
    match_num(x) {
      // next ques
      if (x == 0) console.log("won")
    }
  }
}
</script>

<style lang="scss">
#_match {
  .question {
    margin-bottom: 1rem;
  }
  .answer {
    display: flex;
    justify-content: space-around;
    .selects {
      border: 1px solid;
      padding: .15rem .25rem;
      border-radius: .25rem;
      margin-bottom: .5rem;
      &.transparent {
        opacity: 0;
      }
      &.selected {
        border-color: greenyellow;
        &.is-wrong {
          border-color: red !important;
        }
      }
    }
  }
}
</style>