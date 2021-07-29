<template>
  <div class='login-container'>
    <el-form
      ref="loginForm"
      :rules="rules"
      :model="user"
      class="login-form"
    >
      <div class="login-head">
        <img src="./logo_index.png" alt="">
      </div>
      <el-form-item prop="mobile">
        <el-input
          v-model="user.mobile"
          placeholder="请输入手机号"
        ></el-input>
      </el-form-item>
      <el-form-item prop="code">
        <el-input
          v-model="user.code"
          placeholder="请输入验证码"
        ></el-input>
      </el-form-item>
      <el-form-item prop="agree">
        <el-checkbox v-model="user.agree">我已阅读并同意用户协议和隐私条款</el-checkbox>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="onLogin"
          class="login-btn"
          :loading="loginLoading"
        >登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { login } from '@/api/user'

export default {
  name: 'Login',
  components: {},
  data () {
    return {
      user: {
        mobile: '13911111111',
        code: '246810',
        agree: false // 是否被选中
      },
      loginLoading: false,
      rules: {
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'change' },
          { pattern: /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/, message: '请输入正确的号码格式', trigger: 'change' }
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'change' },
          { pattern: /^\d{6}$/, message: '请输入正确的验证码格式', trigger: 'change' }
        ],
        agree: [
          {
            validator: (rule, value, callback) => {
              if (value) {
                callback()
              } else {
                callback(new Error('请同意用户协议'))
              }
            },
            // message: '请勾选同意用户协议',
            trigger: 'change'
          }
        ]
      }
    }
  },
  // 监听属性 类似于data概念
  computed: {},
  // 监控data中的数据变化
  watch: {},
  // 方法集合
  methods: {
    onLogin () {
      // 获取表单数据
      // const user = this.user
      // 表单验证
      this.$refs.loginForm.validate(valid => {
        if (!valid) {
          return false
        }
        // 验证通过，提交登录
        this.login()
      })
    },

    login () {
      this.loginLoading = true
      login(this.user).then(res => {
        this.$message({
          message: '登录成功！',
          type: 'success'
        })
        this.loginLoading = false
        //  将接口返回的用户相关数据放到本地存储
        window.localStorage.setItem('user', JSON.stringify(res.data.data))
        // 跳转到首页
        this.$router.push({
          name: 'home'
        })
      }).catch(err => {
        console.log('登录失败', err)
        this.$message.error('登录失败，手机号或验证码错误')
        this.loginLoading = false
      })
    }
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created () {

  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted () {

  },
  beforeCreate () {}, // 生命周期 - 创建之前
  beforeMount () {}, // 生命周期 - 挂载之前
  beforeUpdate () {}, // 生命周期 - 更新之前
  updated () {}, // 生命周期 - 更新之后
  beforeDestroy () {}, // 生命周期 - 销毁之前
  destroyed () {}, // 生命周期 - 销毁完成
  activated () {} // 如果页面有keep-alive缓存功能，这个函数会触发
}
</script>
<style lang='less' scoped>
// @import url(); 引入公共css类
.login-container {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: url("./login_bg.jpg") no-repeat;
  background-size: cover;
  .login-form {
    background-color: #fff;
    padding: 50px;
    width: 350px;
    .login-head {
      width: 100%;
      height: 57px;
      margin-bottom: 30px;
      img {
        margin: 0 auto;
        display: block;
      }
    }
  }
  .login-btn{
    width: 100%;
  }
}
</style>
