<template>
  <div id="_modal" v-if="active">
    <div class="modal-header">
      <div class="title">{{ title }}</div>
      <div class="close" @click="active = false">X</div>
    </div>
    <div class="modal-body">
      <slot name="body" />
    </div>
    <div class="modal-footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<script>
export default {
  props: ['title'],
  data: () => ({
    active: false,
  }),
}
</script>

<style lang="scss">
@keyframes fade-in {
  from { opacity: 0; transform: translate(-50%, -50%) scale(0, 0); }
  50% { transform: translate(-50%, -50%) scale(1.1, 1.1); }
  to { opacity: 1; transform: translate(-50%, -50%) scale(1, 1); }
}
#_modal {
  position: absolute;
  top: 50%; left: 50%;
  width: 90%;
  padding: 1rem 1.2rem;
  background-color: white;
  border: solid 1px #eee;
  border-radius: .5rem;
  box-shadow: 0 7px 35px rgba(#aaa,.3);
  animation: 300ms fade-in forwards;
  & > div { border: none; }
  .modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;
    .title {
      font-size: 1.3rem;
      word-wrap: normal;
    }
    .close {
      cursor: pointer;
      text-decoration: none;
      color: #888;
      font-size: 1.5rem;
      &:hover {
        color: #666;
      }
    }
  }
  .modal-body {
    display: flex;
    flex-direction: column;
    align-content: flex-start;
  }
  .modal-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
</style>