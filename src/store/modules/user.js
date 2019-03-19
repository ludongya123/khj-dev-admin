
import {getUserBaseInfo ,getConfig} from "@/js/ajax"
let user = {
    state:{
        curpath:'/',
        token:'',
        // 财务信息
        financeInfo:false,
        userInfo:{},
        // 配置相关
        config:{}
    },
    mutations:{
        CHANGE_ROUTER:(state,data)=>{
            state.curpath = data
        },
        SET_TOKEN:(state,data)=>{
            state.token = data
        },
        SET_USERINFO:(state,data)=>{ 
            state.userInfo = data
        },
        SET_CONFIG:(state,data)=>{
            state.config = data
        }
    },
    actions:{
        changeRoute({commit},data){
            commit('CHANGE_ROUTER',data)
        },
        setToken({commit},data){
            commit('SET_TOKEN',data)
        },
        setUserInfo({commit},data){
            getUserBaseInfo().then(res=>{
                if(res.data.code == 200){
                    res.data.result.code='';
                    commit('SET_USERINFO',res.data.result)
                }
            })  
        },
        getConfigInfo({commit},data){
            getConfig().then(res=>{
                if(res.data.code == 200){
                    commit('SET_CONFIG',res.data.result)
                } 
            })
        }
    },
    getters:{
        getCurPath:state=>{
            return state.curpath
        },
        getToken:state=>{
            return state.token
        },
        getFinanceInfo:state=>{
            return state.financeInfo
        },
        getUserInfo:state=>{
            return state.userInfo
        },
        contacted:state=>{
            return state.userInfo.contacted
        },
        getConfig:state => {
            return state.config 
        }
    }
}

export default user;