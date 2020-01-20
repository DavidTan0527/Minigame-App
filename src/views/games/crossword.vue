<template>
  <div id="_crossword">
    <crossword
      :wordsWithReflexions="words"
      :showPlayAgain="false"
    ></crossword>
  </div>
</template>

<script>
import crossword from '@/components/CrosswordGame';

export default {
  props: ['words'],
  components: {
    crossword,
  },
  data: () => ({
      
  })
}
</script>

<style lang="scss">
#_crossword {
  .crossword-board-container {
    .crossword-board {
      width: 350px;
      height: 350px;
    }
    .crossword-clues {
      display: flex;
      justify-content: space-around;
      width: 100%;
      margin: 0;
      dl {
        font-size: 1.5rem;
        color: white;
        margin: 0;
        .hightlighted {
          font-size: 1.2rem;
          background: #101747;
        }
      }
    }
  }
}
</style>