<template>
  <div class="layout">
    <el-container class='layoutContainer'>
      <el-aside width="auto" class='aside'><app-aside :isCollapse='iscollapse' class="asideMenu"></app-aside></el-aside>
      <el-container>
        <el-header class='header'>
          <p class="topNavTitle">
            <i @click="iscollapse = !iscollapse" :class="iscollapse? 'el-icon-s-fold': 'el-icon-s-unfold'"></i>
            江苏梦亦同趋科技有限公司
          </p>
           <el-dropdown>
             <div class="userImage">
               <img :src="userImage" alt="">
               <span class="username">{{username}}</span>
             </div>
             <el-dropdown-menu slot="dropdown">
               <el-dropdown-item>个人中心</el-dropdown-item>
               <el-dropdown-item @click.native = 'open'>退出登录</el-dropdown-item>
             </el-dropdown-menu>
           </el-dropdown>
           </el-header>
        <el-main class='main'><router-view></router-view></el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import AppAside from './components/aside.vue'
import { getUserProfile } from '../../api/user.js'
export default {
  name: 'layout',
  components: {
    AppAside
  },
  data () {
    return {
      username: null,
      userImage: null,
      iscollapse: true
    }
  },
  created () {
    getUserProfile().then(res => {
      console.log(123)
      this.username = res.data.data.name
      this.userImage = res.data.data.photo
    }).catch(err => {
      console.log(err)
    })
  },
  methods: {
    unlogin () {
      window.localStorage.removeItem('user')
      this.$router.push('/login')
    },
    open () {
      this.$confirm('您将退出当前账号, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '退出成功!'
        })
        this.unlogin()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    }
  }
}
</script>

<style scoped="scoped">
  .layoutContainer{
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
  }
  .aside{
    background-color: #d3dce6;
  }
  .asideMenu{
    height: 100%;
  }
  .header{
    height: 60px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #ccc;
  }
  .main{
    background-color: #e9eef3;
  }
   .el-dropdown-link {
      cursor: pointer;
      color: #409EFF;
    }
    .el-icon-arrow-down {
      font-size: 12px;
    }
    .header{
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 60px;
    }
    .userImage img{
      width: 50px;
      height: 50px;
      border-radius: 50%;
    }
    .userImage{
      display: flex;
      align-items: center;
      justify-content: center;
    }
</style>
