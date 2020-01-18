<template>
  <div id="_hangman">
    <div class="question"></div>
    <hangman-game
      :words="words"
      :show-play-again="false"
      @gameFinished="gameFinished"
      />
  </div>
</template>

<script>
export default {
  data: () => ({
    words: ['Apple', 'Orange', 'Banana', 'Watermelon', 'Papaya'],
  }),
  methods: {
    gameFinished: function (word, lose) {
      console.log('game finished!!!')
      console.log('user was guessing word:', word)
      console.log('she/he/it lost?', lose)
    }
  }
}
</script>

<style lang="scss">

</style>