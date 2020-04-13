<template>
  <div class="dialog" v-if="showPwdDialog || show">
    <div class="dialog-content">
      <div class="label">请输入你的电脑开机密码</div>
      <input
        type="password"
        placeholder="请输入你的电脑开机密码"
        @keyup.enter="inputHandle"
      />
      <button @click="inputHandle">确认</button>
    </div>
  </div>
</template>

<script>
import FileUtils from "../../utils/files.js";
let { whoami, readConfigFile, writeConfigFile, changeOwner } = FileUtils;
export default {
  name: "host-context",
  components: {},
  props: ["showPwdDialog"],
  data() {
    return {
      show: false,
      val: ""
    };
  },
  created() {
    // 密码
    let passwordVal = readConfigFile("password");
    let owner = whoami;
    if (!passwordVal) {
      this.show = true;
    } else {
      this.val = passwordVal;
      changeOwner(passwordVal, owner, (err, stdout, stderr) => {
        if (err) {
          this.show = true;
        } else {
          this.show = false;
        }
      });
    }
  },
  methods: {
    inputHandle(e) {
      let val = e.target.value;
      let owner = whoami;
      this.val = val;
      this.show = false;
      this.$emit("showPwdDialogEvent", false);
      changeOwner(val, owner, (err, stdout, stderr) => {
        if (err) {
          this.show = true;
        } else {
          this.show = false;
          writeConfigFile("password", val);
        }
      });
    }
  }
};
</script>

<style scoped>
.dialog {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: rgba(233, 233, 233, 0.5);
}
.dialog-content {
  position: absolute;
  border-radius: 6px;
  width: 300px;
  height: 140px;
  top: 50%;
  left: 50%;
  margin-top: -70px;
  margin-left: -150px;
  background: aliceblue;
}
.dialog-content .label {
  height: 30px;
  line-height: 30px;
  border-bottom: 1px solid #999;
  padding: 0 10px;
  font-weight: bolder;
  color: cornflowerblue;
}
.dialog-content input {
  width: 80%;
  height: 30px;
  margin-left: 10%;
  margin-top: 20px;
  outline: none;
}
.dialog-content button {
  width: 60px;
  height: 30px;
  border-radius: 6px;
  float: right;
  margin-right: 10%;
  color: black;
  font-weight: bolder;
  font-size: 15px;
  background-color: aliceblue;
  margin-top: 10px;
  outline: none;
}
</style>
 
