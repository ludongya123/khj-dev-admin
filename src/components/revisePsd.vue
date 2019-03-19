<template> 
    <div class="com-wrapper" v-if="isShow">
        <h3 class="title">修改密码</h3>
        <el-form :model="reviseForm" :rules="rules" ref="reviseForm" label-width="90px"  size="mini" label-position="left">
            <el-form-item  prop="oldPsd" class="tel-input" label="旧密码">
                <el-input v-model="reviseForm.oldPsd" placeholder="请输入旧密码" type="password"></el-input>  
            </el-form-item>
            <el-form-item  prop="newPsd"  label="新密码">
                <el-input v-model="reviseForm.newPsd" placeholder="请输入新密码" type="password"></el-input>
            </el-form-item>
            <el-form-item  prop="confirmPsd"  label="确认密码">
                <el-input v-model="reviseForm.confirmPsd" placeholder="确认新密码" type="password"></el-input>
            </el-form-item>
            <el-form-item>
                <button class="custom-button-primary" @click="okRevise('reviseForm')"  type="button">确定</button>
                <button class="custom-button-default" @click="cancelRevise('reviseForm')">取消</button>
                <!-- <el-button  >登录</el-button>  -->
            </el-form-item>
        </el-form>
    </div>
</template>
<script>

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
}
import {revisePsd} from "@/js/ajax"
import { Message } from "element-ui";
export default {
    props:['isShow'],
    data(){
        var validatePass2 = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请再次输入密码'));
            } else if (value != this.reviseForm.newPsd) {
                callback(new Error('两次输入密码不一致!'));
            } else {
                callback();
            }
        };
        return{
            reviseForm:{
                oldPsd:'',
                newPsd:'',
                confirmPsd:''
            },
            rules:{
                oldPsd:[
                    {required:true,message:'请输入旧密码',trigger:'blur'}
                ],
                newPsd:[
                    {validator:checkPsd,required:true,trigger:'blur'}
                ],
                confirmPsd:[
                    { validator: validatePass2, required:true,trigger: 'blur'}
                ],
            }
        }
    },
    methods:{
       /**
        * 取消
        */
        cancelRevise(form){ 
            this.$refs[form].resetFields();
            this.reviseForm.oldPsd = ''
            this.reviseForm.newPsd = ''
            this.reviseForm.confirmPsd = ''
            this.$emit('hideModal',false)
        },
        /**
         * 确认更改密码
         */
        okRevise(form){
            this.$refs[form].validate((valid) => {
                if (valid) { 
                    revisePsd({
                        "newPasswrod": this.reviseForm.newPsd,
                        "password": this.reviseForm.oldPsd
                    }).then(res=>{
                        if(res.data.code==200){
                            Message({
                                showClose: true,
                                message: "密码修改成功",
                                type: "success"
                            });
                            this.$refs[form].resetFields();
                            this.$emit('hideModal',false)
                        }
                    })
                    
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
            
        }
    }
}
</script>
<style lang="scss" scoped>
.com-wrapper{
    @include posFixed(330px,auto,calc((100% - 330px) / 2),30%);
    background: #fff;
    z-index:11;
    padding:25px 30px 0 20px;
    .title{
        margin-bottom:10px;
        font-size: 16px;
        font-weight: bold;
        text-align: left;
        padding-left:5px;
        border-left: 4px solid $base-color;
        line-height: 1;
    }
}
.custom-button-primary,.custom-button-default{
    width:68px;
    height:30px;
}
</style>


