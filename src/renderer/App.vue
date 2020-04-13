<template>
  <div id="app">
    <div class="header">
      <hosts-header
        @addHost="addHost"
        @delHost="delHost"
        @selectHost="selectHost"
      ></hosts-header>
    </div>
    <div class="bodyer">
      <div class="left">
        <hosts-list
          :hostFiles="hostFiles"
          :showHostIndex="showHostIndex"
          @toggleShowHostIndex="toggleShowHostIndex"
          @renameTrigger="renameTrigger"
          @escEditHostName="escEditHostName"
          @editHostName="editHostName"
        ></hosts-list>
      </div>
      <div class="right">
        <hosts-content
          :showContext="showContext"
          @editHostContext="editHostContext"
        ></hosts-content>
      </div>
    </div>
    <div class="footer">
      <hosts-footer  @showPwdDialogEvent="showPwdDialogEvent"></hosts-footer>
    </div>
    <password :showPwdDialog="showPwdDialog" @showPwdDialogEvent="showPwdDialogEvent"></password>
  </div>
</template>

<script>
import HostsHeader from "@/components/HostsHeader.vue";
import HostsList from "@/components/HostsList.vue";
import HostsContent from "@/components/HostsContent.vue";
import HostsFooter from "@/components/HostsFooter.vue";
import Password from "@/components/Password.vue";
import FileUtils from "../utils/files.js";
let {
  initFile,
  hostFiles,
  newFile,
  writeFile,
  removeFile,
  renameFile,
  readFile,
  readConfigFile,
  writeConfigFile,
  writeHost
} = FileUtils;

initFile();

export default {
  name: "free-host",
  components: {
    HostsHeader,
    HostsList,
    HostsContent,
    HostsFooter,
    Password
  },
  created() {
    this.readHostFile(this.hostFiles[0].name);
  },
  data() {
    let isSelectedHostFiles = readConfigFile("use") || [];
    isSelectedHostFiles.forEach((file, index) => {
      hostFiles.forEach(item => {
        if (file.name === item.name) {
          hostFiles[index].isSelect = true;
        }
      });
    });
    return {
      showHostIndex: 0,
      hostFiles: hostFiles,
      showContext: "",
      showPwdDialog: false
    };
  },
  watch: {
    showHostIndex(index) {
      this.readHostFile(this.hostFiles[index].name);
    }
  },
  methods: {
    // 新增host
    addHost() {
      this.hostFiles.unshift({
        name: "",
        isSelect: false,
        isNameEdit: true
      });
    },

    // 删除host
    delHost() {
      removeFile(this.hostFiles[this.showHostIndex].name);
      this.selectHost(false);
      this.hostFiles.splice(this.showHostIndex, 1);
      if (this.showHostIndex === 0) {
        this.readHostFile(this.hostFiles[0].name);
      } else {
        this.showHostIndex = this.showHostIndex - 1;
      }
    },

    // 激活或取消激活host
    selectHost(state) {
      let temp = [...this.hostFiles];
      temp[this.showHostIndex].isSelect = state;
      this.hostFiles = temp;

      let name = temp[this.showHostIndex].name;
      let useFiles = readConfigFile("use") || [];

      let tempArr = JSON.parse(JSON.stringify(useFiles));
      let isTrue = tempArr.some(item => item.name === name);
      if (isTrue) {
        useFiles.forEach((file, index) => {
          if (file.name === name && !state) {
            tempArr.splice(index, 1);
          }
        });
      } else {
        tempArr.push({ name: name });
      }
      writeConfigFile("use", tempArr);
      writeHost();
    },

    // 选中host
    toggleShowHostIndex(index) {
      this.showHostIndex = index;
    },

    // 双击重命名host
    renameTrigger(index) {
      let temp = [...this.hostFiles];
      temp[index].isNameEdit = true;
      this.hostFiles = temp;
      this.showHostIndex = index;
    },

    // 退出host名字编辑
    escEditHostName(item, index) {
      if (item.name === "" && this.hostFiles[0].name === "") {
        this.hostFiles.shift();
      } else {
        let temp = [...this.hostFiles];
        temp[index].isNameEdit = false;
        this.hostFiles = temp;
      }
    },

    // 编辑host名字
    editHostName(index, value) {
      let name = this.hostFiles[index].name;
      if (!name) {
        newFile(value);
        this.readHostFile(value);
        // this.showHostIndex = index;
      } else {
        renameFile(name, value);
      }
      this.hostFiles[index].isNameEdit = false;
      this.hostFiles[index].name = value;
    },

    // 读host文件内容
    readHostFile(name) {
      if (name || this.hostFiles[this.showHostIndex]) {
        this.showContext =
          readFile(name || this.hostFiles[this.showHostIndex].name) || "";
      }
    },

    // 写host文件内容
    editHostContext(value) {
      writeFile(this.hostFiles[this.showHostIndex].name, value);
    },

    // 展示密码输入框
    showPwdDialogEvent(state){
        this.showPwdDialog = state;
    }
  }
};
</script>

<style lang="less">
#app {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  color: #fff;
  overflow: hidden;
}
.header {
  width: auto;
  height: 50px;
  line-height: 50px;
  background: #191a30;
  color: #fff;
  padding: 0 20px;
}
.bodyer {
  flex-grow: 1;
  display: flex;
  .left {
    width: 200px;
    background: #373960;
    height: auto;
    padding: 20px;
    overflow: auto;
    flex-grow: 0;
  }
  .right {
    background: #2a2c35;
    flex-grow: 1;
    height: auto;
    overflow-y: scroll;
    padding: 20px;
  }
}
.footer {
  width: auto;
  height: 40px;
  line-height: 40px;
  background: #191a30;
  color: #fff;
  padding: 0 20px;
}
</style>
