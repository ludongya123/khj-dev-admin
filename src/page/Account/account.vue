<template>
  <div class="wrapper">
    <h2 class="page-title text-l">账户管理</h2>
    <div class="tab-bar flex-wrap">
      <span :class="tab==1?'active':''" @click="tab=1">基本信息</span>
      <span :class="tab==2?'active':''" @click="tab=2">财务信息</span>
    </div>
    <!-- 账户基本信息 -->
    <div class="base-info" v-show="tab==1">
      <el-form
        :model="userInfo"
        ref="userInfo"
        label-width="100px"
        :hide-required-asterisk="false"
        size="small "
      >
        <el-form-item label="开发者名称：" prop="appName">
          <el-input v-model="userInfo.appName " readonly ></el-input>
        </el-form-item>
        <el-form-item label="公司名称：" prop="corporation">
          <el-input v-model="userInfo.corporation" readonly></el-input>
        </el-form-item>
        <el-form-item label="AppKey：" prop="appKey">
          <el-input v-model="userInfo.appKey" readonly></el-input>
        </el-form-item>
        <el-form-item label="AppSecret：" prop="appSecret">
          <el-input v-model="userInfo.appSecret" readonly></el-input>
        </el-form-item>
        <el-form-item label="联系人：" prop="userName">
          <el-input v-model="userInfo.userName" readonly></el-input>
        </el-form-item>
        <el-form-item label="手机号：" prop="mobile">
          <el-input v-model="userInfo.mobile" readonly></el-input>
        </el-form-item>
      </el-form>
      <div class="handle-btns flex-wrap">
        <button class="custom-button-primary" @click="reviseUserInfo()" >修改信息</button>
        <button class="custom-button-default" @click="revisePsd()">修改密码</button>
      </div>
    </div>
    <!-- 财务信息 -->
    <div class="finance-info" v-show="tab==2">
      <el-form
        :model="userInfo"
        ref="financeInfo"
        :rules="financeRules"
        label-width="100px"
        size="small "
      >
        <el-form-item label="收款公司：" prop="collectCorporation">
          <el-input v-model="userInfo.collectCorporation"></el-input>
        </el-form-item>
        <el-form-item label="营业执照号：" prop="businessIcence">
          <el-input v-model="userInfo.businessIcence"></el-input>
        </el-form-item>
        <el-form-item label="营业执照：" prop="businessIcencePic">
          <el-input v-show="false" v-model="userInfo.businessIcencePic"></el-input>
          <div class="upload-pic flex-wrap">
            <input type="file" id="yyzzPic" ref="businessIcencePic" @change="chooseImg(1,$event)">
            <img src="../../assets/add-icon.png" alt>
            <div class="preview-pic" v-show="userInfo.businessIcencePic!=''&&userInfo.businessIcencePic!=null">
              <img :src="userInfo.businessIcencePic" alt>
              <i class="el-icon-circle-close-outline" @click="delUploadPic(1)"></i>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="开户许可证：" prop="accountLicencePic">
          <el-input v-show="false" v-model="userInfo.accountLicencePic"></el-input>
          <div class="upload-pic flex-wrap">
            <input type="file" id="xkzPic" ref="accountLicencePic" @change="chooseImg(2,$event)">
            <img src="../../assets/add-icon.png" alt>
            <div class="preview-pic" v-show="userInfo.accountLicencePic!=''&&userInfo.accountLicencePic!=null">
              <img :src="userInfo.accountLicencePic" alt>
              <i class="el-icon-circle-close-outline" @click="delUploadPic(2)"></i>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="开户银行：" prop="accountBank">
          <el-input v-model="userInfo.accountBank"></el-input>
        </el-form-item>
        <el-form-item label="支行名称：" prop="accountSubbranch">
          <el-input v-model="userInfo.accountSubbranch"></el-input>
        </el-form-item>
        <el-form-item label="开户名：" prop="accountName">
          <el-input v-model="userInfo.accountName"></el-input>
        </el-form-item>
        <el-form-item label="账号：" prop="bankCardId">
          <el-input v-model="userInfo.bankCardId"></el-input>
        </el-form-item>
        <el-form-item label="手机号：" prop="mobile"  class="code">
          <el-input v-model="userInfo.mobile" disabled></el-input>
          <span @click="times==60?getCode():''">{{times==60?'发送验证码':times+"s后请重试"}}</span>
        </el-form-item>
        <el-form-item label="手机验证码：" prop="code" class="code">
          <el-input v-model="userInfo.code"></el-input> 
        </el-form-item>
        <el-form-item>
          <button class="custom-button-primary" @click="saveFinanceInfo('financeInfo')"  type="button">保存修改</button>
        </el-form-item>
      </el-form>
    </div>
    <div class="modal" v-show="showModal"></div>
    <div class="confirm-info" v-show="confirmInfo">
      <h3 class="title">修改基本信息</h3>
      <p class="desc">如果你需要修改基本信息，请与我们的商务联系，联系方式: {{configInfo.businessMobile}}</p>
      <button class="custom-button-primary" @click="showModal=false;confirmInfo=false;">确认</button>
    </div>
    <revise-psd :isShow="showRevisePsd" @hideModal="cancelRevisePsd"></revise-psd>
  </div>
</template>
<script>
import { uploadPic, reviseCWInfo, getTelCode } from "@/js/ajax";
import revisePsd from "@/components/revisePsd.vue";
import { Message } from "element-ui";
export default {
  components: {
    "revise-psd": revisePsd
  },
  data() {
    return {
      tab: 1,
      // 基本信息
      financeRules: {
        collectCorporation: [
          { required: true, message: "收款公司名称", trigger: "blur" }
        ],
        businessIcence: [
          { required: true, message: "请填写营业执照编号", trigger: "blur" }
        ],
        businessIcencePic: [
          { required: true, message: "上传营业执照", trigger: "blur" }
        ],
        accountLicencePic: [
          { required: true, message: "请上传开户许可证", trigger: "blur" }
        ],
        accountBank: [
          { required: true, message: "请填写开户行信息", trigger: "blur" }
        ],
        accountSubbranch: [
          { required: true, message: "请填写支行信息", trigger: "blur" }
        ],
        accountName: [
          { required: true, message: "请填写开户名", trigger: "blur" }
        ],
        bankCardId: [
          { required: true, message: "请填写银行账号", trigger: "blur" }
        ],
        mobile:[
            {required:true,message:'请输入手机号',trigger: "blur" }
        ],
        code:[
            {required:true,message:'亲，验证码不能为空哦',trigger: "blur" }
        ]
      }, 
      // 模态框
      showModal: false,
      // 确认信息弹层
      confirmInfo: false,
      // 显示密码修改弹层
      showRevisePsd: false,
      times: 60
    };
  },
  mounted() { 
    this.tab = this.$route.query.tab || 1
  },
  computed: {
    userInfo() {
      return this.$store.getters.getUserInfo;
    },
    configInfo(){
        return this.$store.getters.getConfig
    }
  },
  methods: {
    /**
     * 点击修改信息
     */
    reviseUserInfo() {
      this.showModal = true;
      this.confirmInfo = true;
    },
    /**
     * 点击修改密码
     */
    revisePsd() {
      this.showModal = true;
      this.showRevisePsd = true;
    },
    /**
     * 监听子组件的操作回调
     */
    cancelRevisePsd(r) {
      this.showModal = r;
      this.showRevisePsd = r;
    },
    /**
     * 选择图片
     */
    chooseImg(t, e) {
      let file =
        t == 1
          ? this.$refs.businessIcencePic.files[0]
          : this.$refs.accountLicencePic.files[0];
      let formData = new FormData();
      formData.append("file", file); 
      uploadPic(formData, t).then(res => {
          if(res.data.code!=200){
            Message({
              showClose: true,
              message: res.data.message,
              type: "error"
            });
            return;
          }
          if(t == 1){
              this.userInfo.businessIcencePic = res.data.result.url
          }
          if(t == 2){
              this.userInfo.accountLicencePic = res.data.result.url
          }
      }); 
    },
    /**
     * 删除预览
     */
    delUploadPic(t) {
      if (t == 1) {
        this.userInfo.businessIcencePic = "";
        let file = document.getElementById("yyzzPic");
        file.value = "";
      }
      if (t == 2) {
        this.userInfo.accountLicencePic = "";
        let file = document.getElementById("xkzPic");
        file.value = "";
      }
    },
    /**
     * 保存修改
     */
    saveFinanceInfo(form) { 
      this.$refs[form].validate(valid => {
        if (valid) { 
          reviseCWInfo({
            accountBank: this.userInfo.accountBank,
            accountLicencePic: this.userInfo.accountLicencePic,
            accountName: this.userInfo.accountName,
            accountSubbranch: this.userInfo.accountSubbranch,
            bankCardId: this.userInfo.bankCardId,
            businessIcence: this.userInfo.businessIcence,
            businessIcencePic: this.userInfo.businessIcencePic,
            code: this.userInfo.code,
            collectCorporation: this.userInfo.collectCorporation
          }).then(res => {
            if (res.data.code == 200) {
              Message({
                showClose: true,
                message: "修改成功",
                type: "success"
              });
              this.$store.dispatch("setUserInfo",'');
              this.userInfo.code = "";
            } else {
              Message({
                showClose: true,
                message: res.data.message,
                type: "error"
              });
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    /**
     * 获取验证码
     */
    getCode() {
      this.times = this.times - 1;
      this.countTime();
      getTelCode({
        codeType: 4,
        mobile: this.userInfo.mobile
      }).then(res => {
        if (res.data.code == 200) {
          Message({
            showClose: true,
            message: "信息已发送，注意接收",
            type: "success"
          });
        } else {
          Message({
            showClose: true,
            message: res.data.message,
            type: "error"
          });
        }
      });
    },
    /**
     * 倒计时
     */
    countTime() {
      setTimeout(() => {
        this.times = this.times - 1;
        if (this.times > 0) {
          this.countTime();
        } else {
          this.times = 60;
        }
      }, 1000);
    }
  }
};
</script>
<style lang="scss" scoped>
@import "./account.scss";
</style>

<style>
  .base-info .el-input__inner{
    background: #efefef;
  }
</style>
