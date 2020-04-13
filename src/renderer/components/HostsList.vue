<template>
  <div class="list">
    <div
      class="list-item"
      v-for="(item, index) in hostFiles"
      :class="showHostIndex === index && 'list-item-show'"
      @click="toggleShowHostIndex(index)"
      v-bind:key="index"
    >
      <span class="iconfont icon-wenjian"></span>
      <span
        v-if="!item.isNameEdit"
        class="name"
        @dblclick="renameTrigger(index)"
      >
        {{ item.name }}
        <span v-if="item.isSelect" class="checked iconfont icon-duihao"></span>
      </span>
      <input
        v-if="item.isNameEdit"
        :value="item.name"
        placeholder="input hostname"
        @keyup.enter="hanldeBlur($event, item, index)"
        @blur="hanldeBlur($event, item, index)"
        v-focus
      />
    </div>
  </div>
</template>

<script>
export default {
  props: ["hostFiles", "showHostIndex"],
  methods: {
    toggleShowHostIndex(index) {
      this.$emit("toggleShowHostIndex", index);
    },
    renameTrigger(index) {
      this.$emit("renameTrigger", index);
    },
    hanldeBlur(e, item, index) {
      let value = e.target.value;
      if (value !== "") {
        let isTrue = this.hostFiles.some(item => item.name === value);
        if (!isTrue) {
          this.$emit("editHostName", index, value);
        } else {
          this.$emit("escEditHostName", item, index);
        }
      } else {
        this.$emit("escEditHostName", item, index);
      }
    }
  }
};
</script>
<style lang="less" scoped>
.list {
  padding-bottom: 130px;
  &-item {
    height: 40px;
    line-height: 40px;
    width: 180px;
    margin-bottom: 10px;
    padding: 0 10px;
    cursor: pointer;
    &-show {
      background: cadetblue;
    }
    .name {
      margin-left: 5px;
    }
    .checked {
      float: right;
    }
  }
}
</style>