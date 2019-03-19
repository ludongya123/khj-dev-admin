<template>
  <div class="wrapper">
    <div class="login-content" v-if="type==2">
      <p class="title text-c">口红机开发者后台</p>
      <div class="tab-bar flex-wrap">
        <span :class="loginType==1?'active':''" @click="changeLoginType(1,'loginForm')">密码登录</span>
        <span :class="loginType==2?'active':''" @click="changeLoginType(2,'loginForm')">验证码登录</span>
      </div>
      <el-form
        :model="loginForm"
        :rules="rules1"
        ref="loginForm"
        label-width="0"
        class="demo-loginForm"
      >
        <el-form-item prop="tel" class="tel-input">
          <el-input v-model="loginForm.tel" placeholder="请输入手机号"></el-input>
          <span
            @click="times1==60?getCode('times1'):''"
            v-if="loginType==2"
          >{{times1==60?'获取验证码':times1+"s后请重试"}}</span>
        </el-form-item>
        <el-form-item prop="psd" v-if="loginType==1">
          <el-input v-model="loginForm.psd" placeholder="请输入密码" type="password"></el-input>
        </el-form-item>
        <el-form-item prop="code" v-if="loginType==2">
          <el-input v-model="loginForm.code" placeholder="请输入验证码"></el-input>
        </el-form-item>
        <el-form-item>
          <button class="custom-button-primary" type="button" @click="logIn('loginForm')">登录</button>
          <!-- <el-button  >登录</el-button>  -->
        </el-form-item>
      </el-form>
      <p class="tip text-c">
        没有账号？
        <span @click="changeType(1,'loginForm')">马上注册</span>
      </p>
    </div>
    <div class="regist-content" v-if="type==1">
      <p class="title text-c">注册信息</p>
      <el-form
        :model="registeForm"
        :rules="rules2"
        ref="registeForm"
        label-width="0"
        class="demo-registeForm"
      >
        <el-form-item prop="companyName">
          <el-input v-model="registeForm.companyName" placeholder="请输入公司名称"></el-input>
        </el-form-item>
        <el-form-item prop="regTel" class="tel-input">
          <el-input v-model="registeForm.regTel" placeholder="请输入手机号"></el-input>
          <span @click="times2==60?getCode('times2'):''">{{times2==60?'获取验证码':times2+"s后请重试"}}</span>
        </el-form-item>
        <el-form-item prop="regCode">
          <el-input v-model="registeForm.regCode" placeholder="请输入验证码"></el-input>
        </el-form-item>
        <el-form-item prop="regPsd">
          <el-input v-model="registeForm.regPsd" type="password" placeholder="请输入密码"></el-input>
        </el-form-item>

        <el-form-item>
          <button class="custom-button-primary" type="button" @click="registeIn('registeForm')">注册</button>
          <!-- <el-button  >登录</el-button>  -->
        </el-form-item>
      </el-form>
      <p class="tip text-c">
        已有账号？
        <span @click="changeType(2,'registeForm')">马上登录</span>
      </p>
    </div>
  </div>
</template>
<script>
var checkPhone = (rule, value, callback) => {
  if (!value) {
    return callback(new Error("手机号不能为空"));
  } else {
    const reg = /^1[3|4|5|7|8][0-9]\d{8}$/;
    if (reg.test(value)) {
      callback();
    } else {
      return callback(new Error("请输入正确的手机号"));
    }
  }
};
var checkPsd = (rule, value, callback) => {
  if (!value) {
    return callback(new Error("请输入6-15位包含数字和字母的组合密码"));
  } else {
    const reg = /^(?=.*[A-Za-z])(?=.*\d)[^]{6,15}$/;
    if (reg.test(value)) {
      callback();
    } else {
      return callback(new Error("请输入6-15位包含数字和字母的组合密码"));
    }
  }
};
import { Login, getTelCode, Regist } from "@/js/ajax";
import { Message } from "element-ui";
const GetQueryString = key => {
  let href = window.location.search.substr(1)
  let obj = {}
  href.split('&').forEach(function (t) {
    let str = t.split('=')
    obj[str[0]] = str[1]
  })
  return obj[key]
}
export default {
  data() {
    return {
      // 1 注册  2登录
      type: 2,
      loginType: 1,
      loginForm: {
        tel: "",
        psd: "",
        code: ""
      },
      registeForm: {
        companyName: "",
        regTel: "",
        regCode: "",
        regPsd: ""
      },
      rules1: {
        tel: [{ validator: checkPhone, trigger: "blur" }],
        psd: [{ required: true, message: "请输入密码", trigger: "blur" }],
        code: [{ required: true, message: "亲，验证码不能为空哦", trigger: "blur" }]
      },
      rules2: {
        companyName: [
          { required: true, message: "请输入公司名称", trigger: "blur" }
        ],
        regTel: [{ validator: checkPhone, trigger: "blur" }],
        regCode: [
          { required: true, message: "亲，验证码不能为空哦", trigger: "blur" }
        ],
        regPsd: [{ validator: checkPsd, trigger: "blur" }]
      },
      // 登录倒计时
      times1: 60,
      // 注册倒计时
      times2: 60
    };
  },
  created(){
    if(GetQueryString('r') == 1){
      this.type = 1
    }
  },
  mounted(){ 
    
  },
  methods: {
    /**
     * 登录
     */
    logIn(form) { 
      this.$refs[form].validate(valid => { 
        if (!valid) {return}
          Login({
            mobile: this.loginForm.tel,
            password: this.loginForm.psd,
            code: this.loginType == 1 ? null : this.loginForm.code
          }).then(res => {
            if (res.data.code != 200) {
              Message({
                showClose: true,
                message: res.data.message,
                type: "error"
              });
              return;
            }
            sessionStorage.setItem(
              "userTag",
              `APPTOKEN_&&_${res.data.result.appKey}_&&_${
                res.data.result.token
              }`
            );
            this.$router.push("/");
          }); 
      });
    },
    /**
     * 注册
     */
    registeIn(form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          Regist({
            corporation: this.registeForm.companyName,
            code: this.registeForm.regCode,
            mobile: this.registeForm.regTel,
            password: this.registeForm.regPsd
          }).then(res => {
            if (res.data.code != 200) {
              Message({
                showClose: true,
                message: res.data.message,
                type: "error"
              });
              return;
            }
            Message({
              showClose: true,
              message: "注册成功，请登录",
              type: "success"
            });
            this.type = 2;
          });
        }
      });
    },
    /**
     * 切换登录方式
     */
    changeLoginType(t, loginForm) {
      this.$refs[loginForm].resetFields();
      this.loginType = t;
    },
    /**
     * 切换登录和注册
     */
    changeType(t, form) {
      this.$refs[form].resetFields();
      this.type = t;
    },
    /**
     * 获取验证码
     */
    getCode(t) {
      const reg = /^1[3|4|5|7|8][0-9]\d{8}$/;
      if (t == "times1") {
        if (!reg.test(this.loginForm.tel)) {
          Message({
            showClose: true,
            message: "请输入正确的手机号",
            type: "error"
          });
          return;
        }
        this.times1 = this.times1 - 1;
        this.getYzCode(2);
      }
      if (t == "times2") { 
        if (!reg.test(this.registeForm.regTel)) {
          Message({
            showClose: true,
            message: "请输入正确的手机号",
            type: "error"
          });
          return;
        }
        this.times2 = this.times2 - 1;
        this.getYzCode(1);
      }
      this.countTime(t);
    },
    getYzCode(t) {
      getTelCode({
        codeType: t,
        mobile: t == "2" ? this.loginForm.tel : this.registeForm.regTel
      });
    },
    /**
     * 倒计时
     */
    countTime(t) {
      setTimeout(() => {
        if (t == "times1") {
          this.times1 = this.times1 - 1;
          if (this.times1 > 0) {
            this.countTime(t);
          } else {
            this.times1 = 60;
          }
        }
        if (t == "times2") {
          this.times2 = this.times2 - 1;
          if (this.times2 > 0) {
            this.countTime(t);
          } else {
            this.times2 = 60;
          }
        }
      }, 1000);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./login.scss";
</style>
