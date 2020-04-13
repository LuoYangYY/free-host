<template>
  <div>
    <div class="header-tool" @click="newfile">
      <span class="iconfont icon-xinjian"></span>
      <div class="tip">新建host</div>
    </div>
    <div class="header-tool" @click="deletefile">
      <span class="iconfont icon-shanchu"></span>
      <div class="tip">删除host</div>
    </div>
    <div class="header-tool" @click="selectFile(true)">
      <span class="iconfont icon-zengjia"></span>
      <div class="tip">激活host</div>
    </div>
    <div class="header-tool" @click="selectFile(false)">
      <span class="iconfont icon-jianshao"></span>
      <div class="tip">取消激活host</div>
    </div>
    <div v-if="!isWindows" class="header-tool" @click="flushChromeDNS">
      <span class="iconfont icon-dns"></span>
      <div class="tip">清DNS缓存</div>
    </div>
    <div v-if="isWindows" class="header-tool" @click="reconnectWifi">
      <span class="iconfont icon-WiFi"></span>
      <div class="tip">断网重连</div>
    </div>
  </div>
</template>

<script>
import FileUtils from "../../utils/files.js";
let { reconnectWifi, flushChromeDNS, isWindows } = FileUtils;

export default {
  name: "tool-bar",
  components: {},
  data() {
      return {
          isWindows
      }
  },
  methods: {
    newfile() {
        this.$emit('addHost')
    },
    deletefile() {
        this.$emit('delHost')
    },
    selectFile(state) {
        this.$emit('selectHost', state)
    },
    flushChromeDNS(){
        flushChromeDNS();
    },
    reconnectWifi() {
        reconnectWifi();
    }
  }
};
</script>

<style scoped>
.header-tool {
  position: relative;
  display: inline-block;
  width: 30px;
  height: 30px;
  line-height: 30px;
  border-radius: 100%;
  text-align: center;
  margin-top: 10px;
  cursor: pointer;
  margin-right: 20px;
}
.tip {
  display: none;
  position: absolute;
  bottom: -35px;
  height: 30px;
  background: #999;
  color: #fff;
  width: max-content;
  font-size: 15px;
  padding: 0 10px;
  left: 0;
  border-radius: 6px;
}
.header-tool:hover {
  background: blueviolet;
}
.header-tool:hover .tip {
  display: block;
}
</style>
