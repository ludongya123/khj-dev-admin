<template>
    <div class="wrapper">
        <h2 class="page-title text-l">首页-收益</h2>
        <div class="income-part flex-wrap">
            <div class="income-item">
                <h4>结算中收益(元)  
                    <el-popover
                        placement="top-start"
                        title=""
                        width="200"
                        trigger="hover"
                        popper-class="popper-class"
                        content="已获得但还未完成结算，不能立即发起提现的收益，包括上周六至当前的所有收益。"> 
                        <i class="el-icon-question" slot="reference"></i>
                    </el-popover>
                </h4>
                <p class="income-money">{{userInfo.balance / 100 }}</p>
            </div>
            <div class="and-icon"><i class="el-icon-plus"></i></div>
            <div class="income-item">
                <h4>可提现收益(元) 
                    <el-popover
                        placement="top-start"
                        title=""
                        width="200"
                        trigger="hover"
                        popper-class="popper-class"
                        :content="'已入账但还未完成结算，不能立即发起提现的收益，包括上周六至当前的所有收益。(最小提现金额'+configInfo.minAppCash+'元)'"> 
                        <i class="el-icon-question" slot="reference"></i>
                    </el-popover>
                </h4>
                <p class="income-money">{{userInfo.canWithdraw / 100 }}</p>
                <button v-if="userInfo.canWithdraw / 100 >= configInfo.minAppCash " class="custom-button-primary" @click="clickDrawCash()">提现</button>
                <button v-else class="custom-button-default"    disabled >提现</button>
            </div>
            <div class="and-icon"><i class="el-icon-plus"></i></div>
            <div class="income-item">
                <h4>提现中收益(元) 
                    <el-popover
                        placement="top-start"
                        title=""
                        width="200"
                        trigger="hover"
                        popper-class="popper-class"
                        content="已提交提现申请，但我方财务还未收到发票信息和结算确认函，未能完成打款的收益。"> 
                        <i class="el-icon-question" slot="reference"></i>
                    </el-popover>
                </h4>
                <p class="income-money">{{userInfo.withdrawing / 100}}</p> 
            </div>
            <div class="and-icon"><i class="el-icon-plus"></i></div>
            <div class="income-item">
                <h4>已提现收益(元) 
                    <el-popover
                        placement="top-start"
                        title=""
                        width="200"
                        trigger="hover"
                        popper-class="popper-class"
                        content="已完成提现的收益总和。"> 
                        <i class="el-icon-question" slot="reference"></i>
                    </el-popover>
                </h4>
                <p class="income-money">{{userInfo.withdrew / 100}}</p>
                <button class="custom-button-primary" @click="getCashRecordList(showType)">{{showType == 1?"提现记录":"返回收益"}}</button>
            </div>
            <div class="and-icon"><i style="color:#aaa;font-size:20px;">=</i> </div>
            <div class="income-item">
                <h4>累计收益(元) 
                    <el-popover
                        placement="top-start"
                        title=""
                        width="200"
                        trigger="hover"
                        popper-class="popper-class"
                        content="所获得的所有收益，包含可提现、结算中、提现中和已提现收益。"> 
                        <i class="el-icon-question" slot="reference"></i>
                    </el-popover>
                </h4>
                <p class="income-money">{{(userInfo.balance+userInfo.canWithdraw+userInfo.withdrawing+userInfo.withdrew) / 100   }}</p>
            </div>
        </div>
        <!-- 数据报表 -->
        <div class="income-filter" v-show="showType==1">
            <div class="filter-title">
                <span>数据报表</span>
                <el-dropdown @command="selectItem1"  trigger="click"  >
                    <button size="small" class="custom-button-default">
                        {{command1=='0'?'周期-天':command1=='1'?'周期-周':'周期-月'}}<i class="el-icon-arrow-down el-icon--right"></i>
                    </button>
                    <el-dropdown-menu slot="dropdown"  >
                        <el-dropdown-item command="0">周期-天</el-dropdown-item>
                        <el-dropdown-item command="1">周期-周</el-dropdown-item> 
                        <el-dropdown-item command="2">周期-月</el-dropdown-item> 
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
            <div class="date-filter">
                <el-date-picker
                    v-model="dateStart1"
                    size="small"
                    :type="command1==0?'date':command1==1?'week':'month'" 
                    :picker-options="limitDate1"
                    unlink-panels  
                    :editable="false"
                    placeholder="选择开始日期"
                    @change="selectDateStart1()" >
                </el-date-picker>
                <span>—</span>
                <el-date-picker
                    v-model="dateEnd1"
                    size="small"
                    :type="command1==0?'date':command1==1?'week':'month'" 
                    :picker-options="limitDate1"
                    unlink-panels  
                    :editable="false"
                    placeholder="选择结束日期"
                    @change="selectDateEnd1()" >
                </el-date-picker>
                <button class="custom-button-default" size='small' @click="getChartsData()">查询</button>
            </div>
            <div class="tab-bar flex-wrap chart" >
                <span :class="chartTab==1?'active':''" @click="changeChartTab(1)">收益</span>
                <span :class="chartTab==2?'active':''" @click="changeChartTab(2)">PV/UV</span>
            </div>
            <div id="income" class="charts">

            </div>
        </div>
        <!-- 账单 -->
        <div class="order-count" v-show="showType==1">
            <div class="filter-title">
                <span>账单</span>
                <el-dropdown @command="selectItem2"  trigger="click"  >
                    <button size="small" class="custom-button-default">
                        {{command2=='0'?'周期-天':command2=='1'?'周期-周':'周期-月'}}<i class="el-icon-arrow-down el-icon--right"></i>
                    </button>
                    <el-dropdown-menu slot="dropdown"  >
                        <el-dropdown-item command="0">周期-天</el-dropdown-item>
                        <el-dropdown-item command="1">周期-周</el-dropdown-item> 
                        <el-dropdown-item command="2">周期-月</el-dropdown-item> 
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
            <div class="date-filter"   style="margin-bottom:0">
                <el-date-picker
                    v-model="dateStart2"
                    size="small"
                    :type="command2==0?'date':command2==1?'week':'month'" 
                    :picker-options="limitDate1"
                    unlink-panels  
                    :editable="false"
                    placeholder="选择开始日期"
                    @change="selectDateStart2()" >
                </el-date-picker>
                <span>—</span>
                <el-date-picker
                    v-model="dateEnd2"
                    size="small"
                    :type="command2==0?'date':command2==1?'week':'month'" 
                    :picker-options="limitDate1"
                    unlink-panels  
                    :editable="false"
                    placeholder="选择结束日期"
                    @change="selectDateEnd2()" >
                </el-date-picker>
                <button class="custom-button-default" size='small' @click="getBaseCustomOrOrderList()">查询</button>
                <button class="custom-button-default" size='small' @click="exportIncome()" v-show="ordertab==1" >  导出</button>
            </div>
            <div class="tab-bar flex-wrap">
                <span :class="ordertab==1?'active':''" @click="ordertab=1">基础消费</span>
                <span :class="ordertab==2?'active':''" @click="ordertab=2">订单记录</span>
            </div>
            <el-table
                v-show="ordertab==1"
                :data="baseConsumeTable"
                :summary-method="getSummariesBaseCustom"
                show-summary
                :header-cell-style="{color:'#333',fontWeight:'bold',background:'#fafafa'}"
                style="width: 100%"
                height="500">
                <el-table-column  prop="createDate" label="日期" align="center"  width="150">  </el-table-column>
                <el-table-column  prop="indexPv" align="center" label="页面pv" > </el-table-column>
                <el-table-column  prop="indexUv" align="center" label="页面UV" > </el-table-column>
                <el-table-column  prop="playerCount"  align="center" label="消费人数" > </el-table-column>
                <el-table-column  prop="moneySum" align="center" :render-header="renderHeader" >
                    <template slot-scope="scope">
                        <span >{{scope.row.moneySum / 100}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="revenue" align="center" label="分账收益（元）" > 
                    <template slot-scope="scope">
                        <span >{{scope.row.revenue / 100}}</span>
                    </template>
                </el-table-column> 
            </el-table>
            <el-table
                v-show="ordertab==2"
                :data="orderRecordTable"
                :header-cell-style="{color:'#333',fontWeight:'bold',background:'#fafafa'}"
                style="width: 100%"
                height="500">
                <el-table-column  prop="orderId" width="300"  label="订单号" align="center"> </el-table-column>
                <el-table-column prop="nickname" align="center" label="用户昵称" >  </el-table-column>
                <el-table-column prop="orderPrice" align="center"   label="订单金额" >
                    <template slot-scope="scope">
                        <span>{{scope.row.orderPrice / 100}}</span>
                    </template>
                </el-table-column>    
                <el-table-column prop="createDate"  align="center" label="时间" > </el-table-column>
                <el-table-column  prop="refund" align="center" label="退款状态" >
                    <template slot-scope="scope">
                        <span>{{scope.row.refund == 0 ? '未退款' : '已退款'}}</span>
                    </template>
                </el-table-column>
                <el-table-column  prop="refundSum" align="center" label="退款金额" >
                    <template slot-scope="scope">
                        <span>{{scope.row.refundSum ? scope.row.refundSum / 100:'--'}}</span>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 基础数据的分页 -->
            <div class="pagination" v-show="ordertab==1">
                <el-pagination
                    background
                    :current-page="baseConsumePage"
                    :page-count="baseConsumePageCount"
                    @current-change="changeBasicCustomPage"
                    layout="prev, pager, next" >
                </el-pagination>
            </div>
            <!-- 订单的分页 -->
            <div class="pagination" v-show="ordertab==2">
                <el-pagination
                    background
                    :current-page="orderRecordPage"
                    :page-count="orderRecordPageCount"
                    @current-change="changeOrderRecordPage"
                    layout="prev, pager, next" >
                </el-pagination>
            </div>
        </div>
        <!-- 提现记录 -->
        <div class="drawcash-record" v-show="showType==2">
            <div class="filter-title">
                <span>提现记录</span><small>如有疑问请与客服联系</small> 
            </div>
            <div class="date-filter">
                <el-date-picker
                    v-model="date3"
                    size="small"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    :picker-options="limitDate3"
                    end-placeholder="结束日期">
                </el-date-picker>
                <button class="custom-button-default" size='small' @click="getCashRecordList()">查询</button> 
            </div> 
            <el-table
                :data="drawCashRecordTable"
                style="width: 100%"
                :header-cell-style="{color:'#333',fontWeight:'bold',background:'#fafafa'}"
                height="400">
                <el-table-column  prop="financeType" label="财务类型" align="center" >  </el-table-column>
                <el-table-column  prop="accountBank" label="银行名称" align="center" > </el-table-column>
                <el-table-column  prop="accountSubbranch"  align="center"  label="支行名称" > </el-table-column>
                <el-table-column  prop="accountName" align="center"  label="账户名" > </el-table-column>
                <el-table-column  prop="bankCardId" align="center"  label="账号" > </el-table-column>
                <el-table-column  prop="cashAmount" align="center" label="提现金额(元)" > 
                    <template slot-scope="scope">
                        <span>{{scope.row.cashAmount / 100}}</span> 
                    </template>
                </el-table-column>
                <el-table-column  prop="applyTime" align="center" label="申请时间" > </el-table-column>
                <el-table-column  prop="sendTime" align="center" label="支付时间" > </el-table-column>
                <el-table-column  align="center" label="状态" >
                    <template slot-scope="scope">
                        <span v-if="scope.row.state==1">已打款</span>
                        <span v-if="scope.row.state==0" class="download" @click="showDrawCashFlow()">待查收发票</span>
                    </template>
                </el-table-column>
                <el-table-column  align="center" label="结算确认函下载" >
                    <template slot-scope="scope">
                        <span v-if="scope.row.state==0" class="download" @click="downloadLetter(scope.row.id)">点击下载</span>
                    </template>
                </el-table-column>
                <el-table-column  align="center" label="结算详情" > 
                    <template  slot-scope="scope">
                        <span class="download" @click="cashAccountList(scope.row.id,'1')">点击查看</span>
                    </template> 
                </el-table-column>
            </el-table> 
            <div class="pagination">
                <el-pagination
                    background
                    layout="prev, pager, next"
                    :current-page="cashRecordPage"
                    @current-change="changeCashRecordPage"
                    :page-count="cashRecordPageCount">
                </el-pagination>
            </div>
        </div>
        <!-- 结算详情 -->
        <div class="settle-accounts-detail" v-show="settleAccounts">
            <el-table
                :data="settleAccountsDetailTable"
                :header-cell-style="{color:'#333',fontWeight:'bold',background:'#fafafa'}"
                style="width: 100%"
                show-summary
                :summary-method="getSummaries"
                height="250">
                <el-table-column fixed  prop="accountTime" label="日期"  align="center"  width="150">
                </el-table-column>
                <el-table-column prop="accountAmount" align="center" label="消费金额（元）" >
                    <template slot-scope="scope">
                        <span>{{scope.row.accountAmount / 100}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="accountRevenue" align="center" label="分账收益（元）" >
                    <template slot-scope="scope">
                        <span>{{scope.row.accountRevenue / 100}}</span>
                    </template>
                </el-table-column> 
            </el-table> 
            <div class="pagination">
                <el-pagination
                    background
                    :current-page="settleAccountsPage"
                    @current-change="getSettleAccounts"
                    :page-count="settleAccountsPageCount"
                    layout="prev, pager, next" >
                </el-pagination>
            </div>
            <div class="btns">
                <button class="custom-button-primary" @click="settleAccounts=false;showModal=false;">确定</button>
            </div>
        </div>
        <!-- 模态背景 -->
        <div class="modal" v-show="showModal || isConnect==0"></div>
        <!-- 未接入提示 -->
        <div class="notice-client"  v-if="isConnect==0"> 
            <h3>您还未接入我们的产品，请先接入产品。</h3>
            <p>商务合作联系方式：{{configInfo.businessMobile}}</p>  
        </div>
        <!-- 完善财务信息提示 -->
        <div class="fill-finance" v-show="isFillFinance"> 
            <h3>您还未完善财务信息，请先完善财务信息后方可提现。</h3>
            <div class="btns flex-wrap">
                <button class="custom-button-default"  @click="isFillFinance=false;showModal=false">放弃提现</button>
                <button class="custom-button-primary" @click="fillFinanceInfo()">完善财务信息</button>
            </div> 
        </div>
        <!-- 提现须知 -->
        <div class="drawcash-notice" v-show="showDrawCashNotice">
            <div class="drawcash-notice-info"> 
                <p>1、提现周期：</p>
                <p>每周可以提现一次，每周一至周五可以提现上周五（包括）之前所有未提现的收益。例：2月18号是周一，则2月18号之后的工作日（包括2月18号）可以提现2月15号（上周五）当天以及之前所有未提现的收益，2月16号（上周六）开始的收益需要到2月25号（下周一）当天及之后的工作日方可提现。</p>
                <p>2、提现金额：</p>
                <p>原则上任意金额均可提现。考虑到人工成本请勿频繁提现过小的金额。 </p>
                <p>3、提现流程：</p>
                <p>对公提现：开发者提现—完善财务信息— <span>下载打印结算确认函填写完整并盖章签字</span>—开增值税普通发票—<span>结算确认函及发票寄往我司</span>—财务收到发票审核后3个工作日内打款 </p>
                <p>对私提现：开发者提现—完善财务信息—下载打印结算确认函填写完整并盖章签字—凭本人身份证去当地国税代开增值税普通发票—<span>结算确认函及发票寄往我司</span>—财务收到发票审核后3个工作日内打款 </p>
                <p>4、发票内容：</p>
                <p>“信息技术服务*信息技术服务费” </p>
                <p><span>5、开票信息：</span></p>
                <p><span>请按合同签订的主体对应开具如下开票信息 (特别注意)</span></p>
                <p><span>1）、毕节火眼开票信息</span></p>
                <p><span>名 称：毕节火眼网络科技有限公司</span></p>
                <p><span>纳税人识别号：91520502MA6GU2QD34</span></p>
                <p><span>地 址：贵州省毕节市七星关区洪山街道办瑞丰新城十二栋2504</span></p>
                <p><span>开户行及账号：中国建设银行股份有限公司毕节桂花支行 52050169413600000670</span></p>
                <p>6、邮寄信息（请注意，与开票信息不同）：</p>
                <p>地址：浙江省杭州市西湖区文一西路767号西溪国际E座北楼7楼</p>
                <p>收件人：财务部</p>
                <p>电话：0571-86916157</p>
                <p>7、鉴于部分省份已实行个税由企业代扣，我司做以下调整，针对个人结算用户，请提交以下材料：</p>
                <p>1）、增值税发票</p>
                <p>2）、对应劳务发票的个税完税证明</p>
                <p>如未提交上述材料，我司将按最新个税制度，统一代扣个税（税款从结算款中直接扣除）。</p>
                <p>8、如有疑问可咨询相应商务或媒介</p>
            </div>
            <div class="btns flex-wrap">
                <button class="custom-button-default" @click="NoMoreHints()">不再提示</button>
                <button class="custom-button-primary" @click="showDrawCash=true;showDrawCashNotice=false">我已知晓</button>
            </div>
        </div>
        <!-- 提现确认 -->
        <div class="confirm-drawcash" v-show="showDrawCash">
            <h3>信息确认</h3>
            <p>您本次提现的收益为{{userInfo.accountBeginDate}}至{{userInfo.accountEndDate}}累计产生的收益，共计{{userInfo.canWithdraw / 100}}元。</p>
            <p>您的收款信息为：</p>
            <p>公司名称：{{userInfo.collectCorporation}}</p>
            <p>税号：{{userInfo.businessIcence}}</p>
            <p>电话：{{userInfo.mobile}}</p>
            <p>开户行 & 账号：{{userInfo.accountBank}}  &nbsp;&nbsp;  {{userInfo.bankCardId}}</p>
            <p>请您仔细核对您的收款信息，确认无误后点击申请提现按钮。如果收款信息有误请先在账户管理-财务信息中修改您的财务信息。如果您对
            收益金额有疑问请及时联系相应的商务或媒介。</p>
            <div class="btns flex-wrap">
                <button class="custom-button-default" @click="showDrawCash=false;showModal=false">取消</button>
                <button class="custom-button-primary" @click="confirmDrawCash()" :disabled="cashLoading"> <i class="el-icon-loading" v-show="cashLoading"></i> 申请提现</button>
            </div>
        </div>
        <!-- 提交成功 -->
        <div class="drawcash-success" v-show="successCash">
            <div class="success-icon">
                <img v-show="successType==1" src="../../assets/succ-icon.png" alt="">
                <h3 v-show="successType==1">您已成功提交信息</h3>
                <h3 v-show="successType==2">提现流程说明</h3>
            </div>
            <div class="drawcash-success-info">
                <p>请按以下步骤完成提现的线下流程：</p>
                <p>1、下载打印结算确认函填写完整并盖章签字。请于本页面（提现记录页）最新的提现记录中，点击
                右侧的点击下载按钮下载结算确认函，在核对结算确认函内容无误后，完整填写相关信息，并于相应位置签字
                盖章。</p>
                <p>2、开具发票。请至您所在地的税务部门开增值税普通发票，发票内容包括：</p>
                <p> <span> 名 称：毕节火眼网络科技有限公司</span></p>
                <p><span>纳税人识别号：91520502MA6GU2QD34</span></p>
                <p><span>地 址：贵州省毕节市七星关区洪山街道办瑞丰新城十二栋2504</span></p>
                <p><span>开户行及账号：中国建设银行股份有限公司毕节桂花支行 52050169413600000670</span></p>
                <p><span>3、邮寄发票和结算确认函。请将开具的增值税普通发票同盖章签字后的结算确认函
                一并邮寄至我司，邮寄信息：</span></p>
                <p><span>地址：浙江省杭州市西湖区文一西路767号西溪国际E座北楼7楼</span></p>
                <p><span>收件人：财务部</span></p>
                <p><span>电话：0571-86916157</span></p>
                <p>我司的财务会在收到发票后的三个工作日内完成打款，请您在邮寄发票后耐心等待
                结果。如有疑问请联系相应商务或媒介。</p>
            </div>
            <div class="btns">
                <button class="custom-button-primary" @click="showModal=false;successCash=false">确定</button>
            </div>
        </div>
    </div>
</template>
<script>
import {startDrawCash ,knewsNotice,cashList,revenueList,orderList,getUserBaseInfo,accountList ,downRevenue,downloadAccount} from "@/js/ajax"
import { Message } from "element-ui";
let download = require("@/js/download/download.js");
export default {
    data(){
        return{ 
            command1:'0',
            command2:'0',
            ordertab:1,
            chartTab:1,
            successType:1, // 提现成功提示、提现流程说明
            // isConnect:false, // 是否已经对接
            showDrawCashNotice:false, // 是否显示提现须知
            showDrawCash:false, //显示最终提现
            isFillFinance:false, // 是否完善财务信息
            successCash:false, // 提现成功提示
            settleAccounts:false, // 结算详情是否显示
            showModal:false, //背景模态
            showType:1, //1 为收益数据 2 为提现记录
            dateStart1:'', // 数据报表开始日期
            dateEnd1:'', //  数据报表结束日期
            dateStart2:'',// 账单基础数据开始日期
            dateEnd2:'',// 账单基础数据结束日期
            date3:'', // 提现记录时间
            incomeChart:{
                title:'收益',
                date:[ ],
                list:[ ]
            }, // 收益数据
            pvAndUv:{
                title:'pv、uv',
                title1:'pv',
                title2:'uv',
                date:[ ],
                list1:[ ],
                list2:[ ],
            }, // pv 、uv数据
            baseConsumeTable: [ ], // 基础消费数据
            baseConsumePage:1, // 基础数据分页页码
            baseConsumePageCount:0, // 基础数据总页码
            baseConsumeTotal:{}, // 基础消费的合计数据
            orderRecordTable:[], // 订单记录数据
            orderRecordPage:1, // 订单记录分页页码
            orderRecordPageCount:0, // 订单记录分页总数
            drawCashRecordTable:[ ],
            cashRecordPage:1, // 提现记录页码
            cashRecordPageCount:0, // 提现记录总页数
            cashLoading:false, // 显示提现的loading
            settleAccountsDetailTable:[], // 结算详情列表
            settleAccountsPage:1,// 结算详情页码
            settleAccountsPageCount:0, // 结算详情总页码
            settleAccountsTotal:{},  // 结算详情的合计
            cashId:'', // 某一条提现记录的id
            // 限制最大时间
            limitDate1:{
                disabledDate:(time)=>{
                    // return (time.getTime() > Date.now() - 8.64e6  || time.getTime() < (new Date('2019-01-22').getTime() - 3600000*24) );//如果没有后面的-8.64e6就是不可以选择今天的
                },
                firstDayOfWeek :6 
            },
            limitDate3:{
                disabledDate(time) {
                    return time.getTime() > Date.now() - 8.64e6;//如果没有后面的-8.64e6就是不可以选择今天的
                }
            } 
        }
    },
    mounted(){ 
        this.intChart(this.incomeChart)
        this.$store.dispatch("setUserInfo",''); 
        var timer = setInterval(() => {  
            if(this.userInfo.chooseBeginDate){  
                this.limitDate1.disabledDate = (time)=>{ 
                    return (time.getTime() > Date.now() - 8.64e6  || time.getTime() < (new Date(this.userInfo.chooseBeginDate).getTime() - 3600000*24) );//如果没有后面的-8.64e6就是不可以选择今天的
                }  
                clearInterval(timer)
                timer = null
            } 
        }, 50); 
    },
    computed:{
        userInfo(){ 
            return this.$store.getters.getUserInfo;
        },
        isConnect(){
           return this.$store.getters.contacted; 
        },
        configInfo(){
            return this.$store.getters.getConfig
        }
    },
    methods:{
        /**
         * 跳转完善财务信息
         */
        fillFinanceInfo(){
            this.$store.dispatch('changeRoute','/layout/account')
            this.$router.push({path:'/layout/account',query:{tab:2}}); 
        },
        /**
         * 不再提示
         */
        NoMoreHints(){
            knewsNotice().then(res=>{
                if(res.data.code == 200){
                    this.showDrawCashNotice = false;
                    this.showDrawCash = true
                }
            })
        },
        /**
         * 点击提现操作
         */
        clickDrawCash(){ 
            if(this.userInfo.financeMessage == 1){
                this.showModal = true
                if(this.userInfo.cashNotice == 1){
                    this.showDrawCash = true
                } else {
                    this.showDrawCashNotice = true
                }
            } else {
                this.showModal = true
                this.isFillFinance = true
            } 
        },
        /**
         * 确认提现
         */
        confirmDrawCash(){
            this.cashLoading = true;
            this.successType = 1;
            startDrawCash( ).then(res=>{
                setTimeout(()=>{
                    this.cashLoading = false 
                },300)  
                if(res.data.code == 200){ 
                    this.successCash = true 
                    this.showDrawCash = false
                    this.showType = 2
                    this.getCashRecordList()
                    this.$store.dispatch("setUserInfo",'');
                } else {
                    Message({
                        showClose: true,
                        message: res.data.message,
                        type: "error"
                    });
                }
            })
        }, 
        /**
         * 获取提现记录
         */
        getCashRecordList(t){ 
           this.showType = t == 1 ? 2 : t==2 ? 1: 2 
           if(t == 2){
               this.date3 = ''
               return
           }
            cashList({
                pageSize:30,
                pageNum: this.cashRecordPage,
                beginDate: this.date3? this.format(this.date3[0]) : '',
                endDate: this.date3? this.format(this.date3[1]) : ''
            }).then(res=>{
                if(res.data.code == 200){
                    this.drawCashRecordTable = res.data.result.list
                    this.cashRecordPageCount = res.data.result.pageCount
                }
            })
        },
        /**
         * 结算函下载
         */
        downloadLetter(id){
            downloadAccount({
                cashId:id
            }).then(res=>{
                download.download(res.data,'结算函.xlsx');
            })
        },
        // 改变提现记录页码
        changeCashRecordPage(v){
            this.cashRecordPage = v
            this.getCashRecordList();
        },
        /**
         * 显示提现流程
         */
        showDrawCashFlow(){
            this.showModal = true;
            this.successType = 2;
            this.successCash = true;
        },
        /**
         * 查看结算详情
         */
        cashAccountList(id,n){
            if(n == 1) {this.settleAccountsPage = 1;this.cashId = id}
            this.settleAccounts = true
            this.showModal = true 
            accountList({
                cashId:id,
                pageNum:this.settleAccountsPage,
                pageSize:10,
                period:  1
            }).then(res=>{
                if(res.data.code == 200){
                    this.settleAccountsDetailTable = res.data.result.list
                    this.settleAccountsPageCount = res.data.result.pageCount
                    this.settleAccountsTotal = res.data.result.total
                }
            })
        },
        /**
         * 求结算详情列表的合计
         */
        getSummaries(){ 
            return ['合计',this.settleAccountsTotal.accountAmount / 100,this.settleAccountsTotal.accountRevenue / 100 ];
        },
        /**
         * 改变结算记录详情的页码
         */
        getSettleAccounts(v){
            this.settleAccountsPage = v
            this.cashAccountList(this.cashId,0)
        },
        /**
         * 转化时间格式
         */
        format(Date){
            var Y = Date.getFullYear();
            var M = Date.getMonth() + 1;
                M = M < 10 ? '0' + M : M;// 不够两位补充0
            var D = Date.getDate();
                D = D < 10 ? '0' + D : D; 
                return Y + '-' + M + '-' + D ;
        },
        /**
         * 图表日期类别筛选
         */
        selectItem1(v){  
            this.command1 = v
            this.dateStart1 = ''
            this.dateEnd1 = ''
        },
        /**
         * 账单基础数据日期类别筛选
         */
        selectItem2(v){  
            this.command2 = v
            this.dateStart2 = ''
            this.dateEnd2 = ''
        },
        /**
         * 获取收益图表数据
         */
        getChartsData(){
            if(!this.dateStart1 || !this.dateEnd1){
                Message({
                    showClose: true,
                    message: '开始和结束时间日期不能为空',
                    type: "error"
                });
                return;
            } 
            revenueList({
                pageNum:1,
                pageSize:14,
                beginDate:this.format(new Date(this.dateStart1)),
                endDate:this.command1==0 || this.command1==2 ? this.format(new Date(this.dateEnd1)):this.command1==1?this.format(new Date(this.dateEnd1.getTime()+5*24*3600000)):'',
                period:this.command1==0?1:this.command1==1?3:this.command1==2?4:''
            }).then(res=>{ 
                if(res.data.code != 200){
                    Message({
                        showClose: true,
                        message: res.data.message,
                        type: "error"
                    });
                    return;
                }
                let list = res.data.result.list;
                this.incomeChart.list = list.map(item=>{
                    return item.moneySum / 100
                })
                this.incomeChart.list.reverse()
                this.incomeChart.date = list.map(item=>{
                    if(this.command1 == 2){
                        return item.createDate.slice(0, 7)
                    }
                    return item.createDate 
                }) 
                this.incomeChart.date.reverse()
                this.pvAndUv.date = list.map(item=>{
                    if(this.command1 == 2){
                        return item.createDate.slice(0, 7)
                    }
                    return item.createDate 
                })
                this.pvAndUv.date.reverse()
                this.pvAndUv.list1 = list.map(item=>{
                    return item.indexPv 
                })
                this.pvAndUv.list1.reverse() 
                this.pvAndUv.list2 = list.map(item=>{
                    return item.indexUv 
                })
                this.pvAndUv.list2.reverse()
                this.intChart(this.chartTab == 1 ? this.incomeChart : this.pvAndUv)
            })
        },
        /**
         * 切换图表显示
         * @t 1:收益  2：pv,uv
         */
        changeChartTab(t){
            this.chartTab = t; 
            if(t == 1){
                this.intChart(this.incomeChart)
            }
            if(t == 2){
                this.intChart(this.pvAndUv)
            }
        },
        // 初始化图表
        intChart(data){ //#endregion
            let series = [];
            if(data.title == "收益"){
                series = [ {  name: data.title, data: data.list } ]
            } else {
                series = [  {  name: data.title1,  data: data.list1  },  {  name: data.title2, data: data.list2 } ]
            }
            var chart = Highcharts.chart('income', {
                chart: {
                    type: 'line',
                    background:'#fff'
                },
                title: {
                    text: data.title
                },
                xAxis: {
                    categories: data.date
                },
                yAxis: {
                    title: {
                        text: data.title=="收益"?'金额 (元)':'pv、uv'
                    }
                },
                credits: {  
                        enabled: false     //不显示LOGO 
                    },
                plotOptions: {
                    line: {
                        dataLabels: {
                            // 开启数据标签
                            enabled: true          
                        },
                        // 关闭鼠标跟踪，对应的提示框、点击事件会失效
                        enableMouseTracking: false
                    }
                },
                series: series
            });
        },
        /**
         * 选择时间1   可视化图表
         */
        selectDateStart1(v){   
            // 日
            if(this.command1==0){ 
                if(!this.dateStart1 || !this.dateEnd1){
                    return 
                }
                if(this.dateEnd1.getTime() < this.dateStart1.getTime()) {
                    alert('结束时间不能小于开始日期')
                    this.dateStart1 = ''
                    return
                }
                if(this.dateEnd1.getTime() - this.dateStart1.getTime() > 14*24*3600000 ) {
                    alert('日期间隔不能大于14天')
                    this.dateStart1 = ''
                }
            } 
            // 周
            if(this.command1 == 1){ 
                if(this.dateStart1){  
                    this.dateStart1 =  this.dateStart1.getTime()-24*3600000 
                }
                
                if(this.dateEnd1 && this.dateStart1){
                    if(this.dateEnd1.getTime()+5*24*3600000   < this.dateStart1 ) {
                        alert('结束周不能小于开始周')
                        this.dateStart1 = ''
                        return
                    }
                    if(this.dateStart1 + 98*24*3600000 < this.dateEnd1.getTime()+5*24*3600000){
                        alert('时间间隔不能大于14周（98天）')
                        this.dateStart1 = ''
                        return ;
                    }
                }
            }
            // 月
            if(this.command1 == 2){ 
                if(this.dateEnd1 && this.dateStart1){
                    let startY = this.dateStart1.getFullYear()
                    let endY = this.dateEnd1.getFullYear()
                    let startM = this.dateStart1.getMonth() + 1;
                    let endM = this.dateEnd1.getMonth() + 1;
                    if(12*(endY - startY)+(endM - startM) < 0){
                        alert('开始月份不能大于结束月份')
                        this.dateStart1 = ''
                    }
                    if(12*(endY - startY)+(endM - startM) + 1 > 14){
                        alert('月数间隔不能超过14个月')
                        this.dateStart1 = ''
                    }
                }
            }
        },
        selectDateEnd1(v){  
            if(this.command1 == 0){ 
                if(!this.dateStart1 || !this.dateEnd1){
                    return 
                }
                if(this.dateEnd1.getTime() < this.dateStart1.getTime()) {
                    alert('结束时间不能小于开始日期')
                    this.dateEnd1 = ''
                    return
                }
                if(this.dateEnd1.getTime() - this.dateStart1.getTime()>14*24*3600000 ) {
                    alert('日期间隔不能大于14天')
                    this.dateEnd1 = ''
                }
            }
            // 周
            if(this.command1 == 1){ 
                if( this.dateEnd1 && this.dateEnd1.getTime()+5*24*3600000  > new Date().getTime()){
                   alert('不能选择此周时间段')
                   this.dateEnd1 = '' 
                }  
                if(this.dateStart1 && this.dateEnd1){
                    if(this.dateEnd1.getTime()+5*24*3600000  < this.dateStart1 ) {
                        alert('结束周不能小于开始周')
                        this.dateEnd1 = ''
                        return
                    }
                }
            }
            // 月
            if(this.command1 == 2){ 
                console.log(this.dateEnd1)
                if(this.dateEnd1 && this.dateStart1){
                    let startY = this.dateStart1.getFullYear()
                    let endY = this.dateEnd1.getFullYear()
                    let startM = this.dateStart1.getMonth() + 1;
                    let endM = this.dateEnd1.getMonth() + 1;
                    if(12*(endY - startY)+(endM - startM) < 0){
                        alert('开始月份不能大于结束月份')
                        this.dateEnd1 = ''
                    }
                    if(12*(endY - startY)+(endM - startM) + 1 > 14){
                        alert('月数间隔不能超过14个月')
                        this.dateEnd1 = ''
                    }
                }
            }
            
        },
        /**
         * 账单基础数据 时间选择组件
         */
        selectDateStart2(v){   
            // 日
            if(this.command2==0){ 
                if(!this.dateStart2 || !this.dateEnd2){
                    return 
                }
                if(this.dateEnd2.getTime() < this.dateStart2.getTime()) {
                    alert('结束时间不能小于开始日期')
                    this.dateStart2 = ''
                    return
                }
                if(this.dateEnd2.getTime() - this.dateStart2.getTime() > 30*24*3600000 ) {
                    alert('日期间隔不能大于30天')
                    this.dateStart2 = ''
                }
            } 
            // 周
            if(this.command2 == 1){ 
                if(this.dateStart2){  
                    this.dateStart2 =  this.dateStart2.getTime()-24*3600000 
                }
                
                if(this.dateEnd2 && this.dateStart2){
                    if(this.dateEnd2.getTime()+5*24*3600000   < this.dateStart2 ) {
                        alert('结束周不能小于开始周')
                        this.dateStart2 = ''
                        return
                    }
                    if(this.dateStart2 + 210*24*3600000 < this.dateEnd2.getTime()+5*24*3600000){
                        alert('时间间隔不能大于30周（210天）')
                        this.dateStart2 = ''
                        return ;
                    }
                }
            }
            // 月
            if(this.command2 == 2){ 
                if(this.dateEnd2 && this.dateStart2){
                    let startY = this.dateStart2.getFullYear()
                    let endY = this.dateEnd2.getFullYear()
                    let startM = this.dateStart2.getMonth() + 1;
                    let endM = this.dateEnd2.getMonth() + 1;
                    if(12*(endY - startY)+(endM - startM) < 0){
                        alert('开始月份不能大于结束月份')
                        this.dateStart2 = ''
                    }
                    if(12*(endY - startY)+(endM - startM) + 1 > 30){
                        alert('月数间隔不能超过30个月')
                        this.dateStart2 = ''
                    }
                }
            }
        },
        selectDateEnd2(v){  
            if(this.command2 == 0){ 
                if(!this.dateStart2 || !this.dateEnd2){
                    return 
                }
                if(this.dateEnd2.getTime() < this.dateStart2.getTime()) {
                    alert('结束时间不能小于开始日期')
                    this.dateEnd2 = ''
                    return
                }
                if(this.dateEnd2.getTime() - this.dateStart2.getTime()>30*24*3600000 ) {
                    alert('日期间隔不能大于30天')
                    this.dateEnd2 = ''
                }
            }
            // 周
            if(this.command2 == 1){
                if( this.dateEnd2 && this.dateEnd2.getTime()+5*24*3600000  > new Date().getTime()){
                   alert('不能选择此周时间段')
                   this.dateEnd2 = '' 
                   return 
                }  
                if(this.dateStart2 && this.dateEnd2){
                    if(this.dateEnd2.getTime()+5*24*3600000  < this.dateStart2 ) {
                        alert('结束周不能小于开始周')
                        this.dateEnd2 = ''
                        return
                    }
                    if(this.dateStart2 + 210*24*3600000 < this.dateEnd2.getTime()+5*24*3600000){
                        alert('时间间隔不能大于30周（210天）')
                        this.dateStart2 = ''
                        return ;
                    }
                } 
                
            }
            // 月
            if(this.command2 == 2){  
                if(this.dateEnd2 && this.dateStart2){
                    let startY = this.dateStart2.getFullYear()
                    let endY = this.dateEnd2.getFullYear()
                    let startM = this.dateStart2.getMonth() + 1;
                    let endM = this.dateEnd2.getMonth() + 1;
                    if(12*(endY - startY)+(endM - startM) < 0){
                        alert('开始月份不能大于结束月份')
                        this.dateEnd2 = ''
                    }
                    if(12*(endY - startY)+(endM - startM) + 1 > 30){
                        alert('月数间隔不能超过30个月')
                        this.dateEnd2 = ''
                    }
                }
            }
            
        },
        /**
         * 获取基础消费数据或者订单
         */
        getBaseCustomOrOrderList(){
            if(this.ordertab == 1){
                this.baseConsumePage = 1
                this.getBaseOrderDate()
            }
            if(this.ordertab == 2){
                this.orderRecordPage = 1
                this.getOrderList()
            }
        },
        /**
         * 查询账单基础数据
         */
        getBaseOrderDate(){
            if(!this.dateStart2 || !this.dateEnd2){
                Message({
                    showClose: true,
                    message: '开始和结束时间日期不能为空',
                    type: "error"
                });
                return;
            } 
            revenueList({
                pageNum:this.baseConsumePage,
                pageSize:30,
                beginDate:this.format(new Date(this.dateStart2)),
                endDate:this.command2==0 || this.command2==2?this.format(new Date(this.dateEnd2)):this.command2==1?this.format(new Date(this.dateEnd2.getTime()+5*24*3600000)):'',
                period:this.command2==0?1:this.command2==1?3:this.command2==2?4:''
            }).then(res=>{ 
                if(res.data.code == 200){
                    this.baseConsumeTable = res.data.result.list
                    this.baseConsumePageCount = res.data.result.pageCount
                    this.baseConsumeTotal = res.data.result.total
                }
            })
        },
        /**
         * 基础收益合计计算
         */
        getSummariesBaseCustom(){
            return ['合计',this.baseConsumeTotal.indexPv ,this.baseConsumeTotal.indexUv,this.baseConsumeTotal.playerCount,this.baseConsumeTotal.moneySum / 100,this.baseConsumeTotal.revenue / 100]
        },
        /**
         * 收益基础数据的翻页
         */
        changeBasicCustomPage(p){
            this.baseConsumePage = p;
            this.getBaseOrderDate()
        },
        /**
         * 导出收益
         */
        exportIncome(){
            if(!this.dateStart2 || !this.dateEnd2){
                Message({
                    showClose: true,
                    message: '开始和结束时间日期不能为空',
                    type: "error"
                });
                return;
            }
            downRevenue({
                beginDate:this.format(new Date(this.dateStart2)),
                endDate:this.command2==0 || this.command2==2?this.format(new Date(this.dateEnd2)):this.command2==1?this.format(new Date(this.dateEnd2.getTime()+5*24*3600000)):'',
                period:this.command2==0?1:this.command2==1?3:this.command2==2?4:''
            }).then(res=>{ 
                download.download(res.data,'收益.xlsx'); 
            })
        },
        /**
         * 获取订单记录
         */
        getOrderList(){
            if(!this.dateStart2 || !this.dateEnd2){
                Message({
                    showClose: true,
                    message: '开始和结束时间日期不能为空',
                    type: "error"
                });
                return;
            }
            orderList({
                pageNum:this.orderRecordPage,
                pageSize:30,
                beginDate:this.format(new Date(this.dateStart2)),
                endDate:this.command2==0 || this.command2==2?this.format(new Date(this.dateEnd2)):this.command2==1?this.format(new Date(this.dateEnd2.getTime()+5*24*3600000)):'',
                period:this.command2==0?1:this.command2==1?3:this.command2==2?4:''
            }).then(res=>{
                if(res.data.code==200){
                    this.orderRecordTable = res.data.result.list
                    this.orderRecordPageCount = res.data.result.pageCount
                }
            })
        },
        /**
         * 订单记录分页
         */
        changeOrderRecordPage(v){ 
            this.orderRecordPage = v;
            this.getOrderList()
        },
        // 表头添加？图表
        renderHeader(h, { column, $index }){
            return (
                <div style="line-height:20px">
                    <span>消费金额(元) </span>
                    <el-popover
                        placement="top-start"
                        title=""
                        width="200"
                        trigger="hover"
                        popper-class="popper-class"
                        content="该消费金额为用户成功消费并未发生退款行为的金额。该金额会因为用户的退款行为发生实时的变动。"> 
                        <i class="el-icon-question" slot="reference"></i>
                    </el-popover>
                </div>
            )
        } 
    }
}
</script>
<style lang="scss" scoped>
@import './income.scss';
</style>

