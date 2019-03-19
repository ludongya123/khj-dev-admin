<template>
    <div class="layout-wrapper">
        <div class="aside">
            <div class="logo">
                <div class="logo-bg">
                    <img src="../../assets/logo.png" alt="">
                </div>
                <p>口红机开发者后台</p>
            </div>
            <div class="router-g">
                <div to="/layout/income" tag="div" @click="changeRoute('/layout/income')">
                    <div class="flex-wrap" :class="curpath=='/'||curpath=='/layout/income'?'active':''">
                        <img src="../../assets/sy.png" alt="">
                        <span>首页-收益</span>
                    </div>
                </div>
                <div to="/layout/account" tag="div"  @click="changeRoute('/layout/account')">
                    <div class="flex-wrap" :class="curpath=='/layout/account'?'active':''">
                        <img src="../../assets/me.png" alt="">
                        <span>账户管理</span>
                    </div>
                </div>
            </div>
            <div class="logout" @click="logOut()"><span>&lt; 退出</span></div>
        </div>
        <div class="layout-content">
            <router-view></router-view>
        </div>
        <div class="layer">

        </div>
    </div>
</template>
<script>
import { getUserBaseInfo } from "@/js/ajax"
export default {
    data(){
        return{
            
        }
    },
    computed:{
        curpath(){
            return this.$store.getters.getCurPath
        }
    },
    mounted(){    
        this.$store.dispatch("setUserInfo",''); 
        this.$store.dispatch("getConfigInfo",''); 
        this.$store.dispatch("changeRoute",this.$route.path);   
    },
    methods:{
       
        changeRoute(path){
            this.$router.push(path)
            this.$store.dispatch("changeRoute",path);
        },
        logOut(){
            sessionStorage.removeItem('userTag')
            this.$router.replace('/login')
        }
    }
}
</script>
<style lang="scss" scoped>
@import './layout.scss';
</style>


