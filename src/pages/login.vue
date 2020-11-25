<template>
  <div class="container">
    <div class="login-form">
      <div class="title">请登录</div>
      <el-form :model="formData">
        <el-form-item prop="username">
          <el-input v-model="formData.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" v-model="formData.password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="login">登&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
const qs = require('qs')

export default {
  data () {
    return {
      formData: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    login () {
      axios({
        method: 'post',
        // url: process.env.BASE_API + '/uaa/auth/form',
        url: 'http://localhost:8080/uaa/auth/form',
        data: qs.stringify(this.formData),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;'
        }
      }).then(data => {
        if (data.data.code === 0) {
          this.$message({
            type: 'success',
            message: data.data.msg
          })

          sessionStorage.setItem('userInfo', JSON.stringify(data.data.data))

          this.getHeader(data.data.data.access_token)
        } else {
          this.$message({
            type: 'error',
            message: data.data.msg
          })
        }
      })
    },
    getHeader (token) {
      axios({
        method: 'post',
        url: 'http://localhost:8080/pc/topOfColumn/getTopOfColumn',
        data: qs.stringify({access_token: token}),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;'
        }
      }).then(data => {
        if (data.data.code === 0) {
          console.log(data.data.data)
          sessionStorage.setItem('roleInfo', JSON.stringify(data.data.data))

          if (data.data.data.role === '2') {
            this.$router.push({path: '/client-manage'})
          } else {
            this.$router.push({path: '/home'})
          }
        } else {
          this.$message({
            type: 'error',
            message: data.data.msg
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: url('../assets/u4.jpg') no-repeat;
  background-size: 100% 100%;

  .title {
    width: 100%;
    height: 40px;
    line-height: 40px;
    text-align: center;
    color: #ddd;
    margin-top: 10px;
    margin-bottom: 10px;
  }

  .login-form {
    position: absolute;
    top: 50%;
    right: 20px;
    transform: translate(0, -50%);
    width: 300px;
    height: 300px;
    background: rgba(255, 255, 255, 0.1);
    padding: 20px;
    box-sizing: border-box;

    .el-form {
      .el-form-item {
        .el-form-item__content {
          .el-button {
            display: block;
            margin: 0 auto;
            width: 150px;
            height: 40px;
          }
        }
      }
    }
  }
}
</style>
