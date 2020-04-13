<template>
    <div class="content">
        <textarea :value="showContext" @blur="editHostContext"></textarea>
    </div>
</template>

<script>
export default {
    props: ['showContext'],
    methods: {
        editHostContext(e){
            this.$emit('editHostContext', e.target.value);
        }
    },
}
</script>
<style lang="less" scoped>
.content {
  background: #2a2c35;
  flex-grow: 1;
  height: 100%;
  overflow-y: scroll;
  padding: 0 20px;
}

.content textarea {
  width: 100%;
  height: 100%;
  outline: none;
  background: none;
  color: #fff;
  font-size: 16px;
  border: none;
  line-height: 2;
  letter-spacing: 1px;
  padding-bottom: 80px;
}
</style>