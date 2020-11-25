<template>
  <div class="home-container">
    <el-container>

      <el-header height="70px">
        <router-link to="/home" class="logo-btn">
        波波生鲜
        </router-link>

        <div class="user-info">
          <el-popover
            placement="top"
            v-model="visible">
            <el-button size="mini" type="text" @click="signOut">退出登录</el-button>
            <div slot="reference">
              <img v-show="role.userImage" :src="role.userImage" alt="">
              <img v-show="!role.userImage" src="../assets/user_default.png" alt="">
              <span>{{role.userName}}</span>
            </div>
          </el-popover>

        </div>
      </el-header>

      <el-container>
        <el-aside width="200px">
          <el-menu @select="handlerSelect">
            <el-menu-item v-for="(item, index) in menuList" :index="item.menuPath" :key="index">
              <span slot="title">{{item.menuName}}</span>
            </el-menu-item>
          </el-menu>
        </el-aside>

        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>

    </el-container>
  </div>
</template>

<script>
import req from '@/api/home.js'

export default {
  name: 'home',
  data () {
    return {
      menuList: [
        {title: '用户管理', path: '/user-manage'},
        {title: '菜单管理', path: '/menu-manage'},
        {title: '商品管理', path: '/comm-manage'},
        {title: '首页轮播图管理', path: '/home-pic-manage'},
        {title: '商品分类管理', path: '/comm-classify-manage'},
        {title: '客户管理', path: '/client-manage'},
        {title: '订单管理', path: '/order-manage'},
        {title: '热门位商品管理', path: '/hot-comm-manage'},
        {title: '门店信息管理', path: '/shop-info-manage'},
        {title: '司机信息管理', path: '/driver-info-manage'}
      ],
      visible: false
    }
  },
  mounted () {
    this.getMenu()
  },
  computed: {
    role () {
      return JSON.parse(sessionStorage.getItem('roleInfo'))
    }
  },
  methods: {
    handlerSelect (key, path) {
      if (key !== this.$route.path) {
        this.$router.replace({path: key})
      }
    },
    getMenu () {
      req('listMenu', {role: JSON.parse(sessionStorage.getItem('roleInfo')).role}).then(data => {
        this.menuList = data.data.menuList
      })
    },
    signOut () {
      sessionStorage.clear('userInfo')

      sessionStorage.clear('roleInfo')

      this.$router.push({path: 'login'})
    }
  }
}
</script>

<style lang="scss" scoped>
.home-container {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}

.el-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgb(242,242,242);

  .logo-btn {
    font-size: 35px;
    color: pink;
    text-decoration: none;
    margin-left: 50px;
    font-weight: 800;
  }

  .user-info {
    display: flex;
    align-items: center;
    height: 100%;

    img {
      margin-right: 20px;
      width: 60px;
      height: 60px;
      border-radius: 50%;
    }

    .el-popover__reference {
      display: flex;
      justify-content: flex-end;
      align-items: center;
    }
  }
}

.el-main {
  padding: 0;
}
</style>
