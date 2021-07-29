<template>
  <el-container class="layout-container">
    <el-aside
      class="aside"
      width="auto"
    >
      <aside-index
        class="aside-menu"
        :is-collapse="isCollapse"
      />
    </el-aside>
    <el-container>
      <el-header class="header">
        <div class="header-title">
          <i
            :class="{
              'el-icon-s-fold': !isCollapse,
              'el-icon-s-unfold': isCollapse
            }"
            @click="isCollapse = !isCollapse"
          ></i>
          <div>河北信通网络技术有限公司</div>
        </div>
        <el-dropdown>
          <div class="avatar-cnt">
            <img :src="user.photo" class="avatar">
            <span>{{ user.name }}</span>
            <i class="el-icon-arrow-down el-icon--right"></i>
          </div>
          <!-- <span class="el-dropdown-link">
            下拉菜单<i class="el-icon-arrow-down el-icon--right"></i>
          </span> -->
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>设置</el-dropdown-item>
            <el-dropdown-item
              @click.native="onLogout"
            >退出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-header>
      <el-main class="main">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import AsideIndex from './components/aside'
import { getUserProfile } from '@/api/user'

export default {
  name: 'LayoutIndex',
  components: {
    AsideIndex
  },
  data () {
    return {
      // 当前登录用户信息
      user: {

      },
      isCollapse: false
    }
  },
  // 监听属性 类似于data概念
  computed: {},
  // 监控data中的数据变化
  watch: {},
  // 方法集合
  methods: {
    async loadUserProfile () {
      const { data } = await getUserProfile()
      console.log(data)
      this.user = data.data
    },
    onLogout () {
      this.$confirm('确定退出吗?', '退出提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 把用户的登录状态清楚
        window.localStorage.removeItem('user')
        // 跳转到登录页面
        this.$router.push('./login')
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消退出'
        })
      })
    }
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created () {
    // 获取用户资料
    this.loadUserProfile()
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
.layout-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
.aside {
  background-color: #d3dce6;
  .aside-menu {
    height: 100%;
    background-color: #002033;
  }
}
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #ccc;
  .header-title {
    display: flex;
    align-items: center;
    justify-content: center;
    .el-icon-s-fold, .el-icon-s-unfold {
      font-size: 20px;
      margin-right: 5px;
    }
  }
  .avatar-cnt {
    display: flex;
    align-items: center;
    .avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      margin-right: 5px;
    }
  }
}
.main {
  background-color: #e9eef3;
}
</style>
