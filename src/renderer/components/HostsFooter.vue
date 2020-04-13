<template>
  <div>
    <div class="left">&copy; copyright 2020, power by LY</div>
    <div class="right">
      <div class="iconfont icon-shezhi"></div>
      <div class="tip">
        <div @click="showDialog(true)">修改密码</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    showDialog() {
      this.$emit("showPwdDialogEvent", true);
    }
  }
};
</script>

<style lang="less" scoped>
.footer {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 40px;
  line-height: 40px;
  background: #191a30;
  color: #fff;
  padding: 0 20px;
  .left {
    float: left;
  }
  .iconfont {
    float: right;
  }
  .right{
      position: relative;
      cursor: pointer;
  }
  .tip {
    display: none;
    position: absolute;
    width: 100px;
    height: 30px;
    background: aliceblue;
    right: 10px;
    bottom: -10px;
    border-radius: 4px;
    line-height: 30px;
    color: #000;
    text-align: center;
    font-size: 15px;
  }
  .right:hover .tip {
    display: block;
  }
}
</style>