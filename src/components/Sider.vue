<template>
        <Sider>
            <Menu :theme="theme3" :active-name="activeTitle" accordion  :open-names="openList" @on-select="gotoPage" style="width:240px;text-align:left;">
                <MenuItem v-for="(menu,j) in menu" :name="menu.menuUrl" :key="j">
                    <Icon :type="menu.icon" />
                    {{menu.menuName}}
                </MenuItem>
            </Menu>
        </Sider>
</template>
<script>
//暂未抽出
export default {
    name: "Slider",
    data () {
        return{
            openList:[],
            activeTitle:'/',
            theme3:'dark',
            menu: [
                {
                    menuName: '员工管理',
                    menuUrl: '/',
                    childMenu: [],
                    icon:'md-document',
                },
                {
                    menuName: '合同模板',
                    menuUrl: 'Ctemplate',
                    childMenu: [],
                    icon:'md-chatbubbles',
                },
                {
                    menuName: '合同管理',
                    menuUrl: 'Cmanager',
                    childMenu: [],
                    icon:'md-heart',
                },
                {
                    menuName: '人脸识别记录',
                    menuUrl: 'FaceRecord',
                    childMenu: [],
                    icon:'md-leaf',
                },
            ],              
        }
    },
    mounted() {

    },
    methods:{
        gotoPage (val) {
            console.log(val)
            this.activeTitle = val
            this.$router.push({path: val})
        },
    },
}
</script>
<style scoped>
.ivu-icon{
    font-size:20px;
}
.layout{
    border: 1px solid #d7dde4;
    background: #f5f7f9;
    position: relative;
    border-radius: 4px;
    overflow: hidden;
    min-width: 900px;
    height:100vh;
}
.ivu-layout-sider{
    width: 240px !important;
    flex: none !important;
    min-width: 240px !important;
    max-width: 240px !important;
}
.ivu-menu-item{
    text-align: left;
    padding-left: 50px;
}
</style>