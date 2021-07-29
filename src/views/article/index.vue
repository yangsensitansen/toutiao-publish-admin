<template>
  <div class='article-container'>
    <el-card class="filter-card">
      <div slot="header" class="clearfix">
        <span>
          <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>内容管理</el-breadcrumb-item>
          </el-breadcrumb>
        </span>
      </div>
      <!-- 表单 -->
      <el-form ref="form" :model="form" label-width="40px" size="small">
        <el-form-item label="状态">
          <el-radio-group v-model="status">
            <el-radio :label="null">全部</el-radio>
            <el-radio label="0">草稿</el-radio>
            <el-radio label="1">待审核</el-radio>
            <el-radio label="2">审核通过</el-radio>
            <el-radio label="3">审核失败</el-radio>
            <el-radio label="4">已删除</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="频道">
          <el-select v-model="channelId" placeholder="请选择频道">
            <el-option
              label="全部"
              :value="null"
            ></el-option>
            <el-option
              v-for="(item, index) in channels"
              :key="index"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="日期">
          <el-date-picker
            v-model="rangeDate"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            :disabled="loading"
            @click="loadArticles(1)"
          >查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 下 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>根据筛选条件共查出{{ totalCount }}条数据</span>
      </div>
      <!-- 表格 -->
      <el-table
        v-loading="loading"
        :data="articles"
        class="list-table"
        stripe
        size="small"
        style="width: 100%">
        <el-table-column
          prop="date"
          label="封面">
          <template slot-scope="scope">
            <!-- <img
              v-if="scope.row.cover.images[0]"
              class="article-cover"
              :src="scope.row.cover.images[0]"
            >
            <img
              v-else
              class="article-cover"
              src="./no-img.png" alt=""
            > -->
            <el-image
              style="width: 100px; height: 100px"
              :src="scope.row.cover.images[0]"
              fit="cover"
              lazy
            >
              <div slot="error" class="image-slot">
                <img
                  class="article-cover"
                  src="./no-img.png" alt=""
                >
              </div>
              <div slot="placeholder" class="image-placeholder">
                加载中<span class="dot">...</span>
              </div>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column
          prop="title"
          label="标题">
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态">
          <template slot-scope="scope">
            <el-tag :type="articleStatus[scope.row.status].type">
              {{ articleStatus[scope.row.status].text }}
            </el-tag>
            <!-- <el-tag type="warning" v-if="scope.row.status === 0">草稿</el-tag>
            <el-tag type="success" v-if="scope.row.status === 1">待审核</el-tag>
            <el-tag v-if="scope.row.status === 2">审核通过</el-tag>
            <el-tag type="danger" v-if="scope.row.status === 3">审核失败</el-tag>
            <el-tag type="info" v-if="scope.row.status === 4">已删除</el-tag> -->
          </template>
        </el-table-column>
        <el-table-column
          prop="pubdate"
          label="发布时间">
        </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="scope">
            <el-button
              size="small"
              circle
              icon="el-icon-edit"
              type="primary"
            ></el-button>
            <el-button
              size="small"
              type="danger"
              icon="el-icon-delete"
              circle
              @click="onDeleteArticle(scope.row.id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <!-- total 用来设定总数据的条数
      它默认按照10条每页计算总页码
      page-size每页显示条目个数-->
      <el-pagination
        layout="prev, pager, next"
        background
        :total="totalCount"
        :page-size="pageSize"
        :current-page.sync="page"
        @current-change="onCurrentChange"
        :disabled="loading"
      />
    </el-card>
  </div>
</template>

<script>
import {
  getArticleList,
  getChannels,
  deleteArticle
} from '@/api/article'

export default {
  name: 'ArticleIndex',
  components: {},
  data () {
    return {
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      tableData: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }],
      articles: [], // 文章数据列表
      articleStatus: [
        { status: 0, text: '草稿', type: 'info' },
        { status: 1, text: '待审核', type: '' },
        { status: 2, text: '审核通过', type: 'success' },
        { status: 3, text: '审核失败', type: 'warning' },
        { status: 4, text: '已删除', type: 'danger' }
      ],
      totalCount: 0,
      pageSize: 10,
      // 查询文章的状态不传就是全部
      status: null,
      channels: {},
      channelId: null, // 查询频道id
      rangeDate: null,
      loading: true,
      page: 1
    }
  },
  // 监听属性 类似于data概念
  computed: {},
  // 监控data中的数据变化
  watch: {},
  // 方法集合
  methods: {
    loadArticles (page = 1) {
      this.loading = true
      getArticleList({
        // 当前页
        page,
        // 每页显示多少条信息
        per_page: this.pageSize,
        status: this.status,
        channel_id: this.channelId,
        begin_pubdate: this.rangeDate ? this.rangeDate[0] : null,
        end_pubdate: this.rangeDate ? this.rangeDate[1] : null
      }).then(res => {
        const { results, total_count: totalCount } = res.data.data
        this.articles = results
        this.totalCount = totalCount
        this.loading = false
      })
    },
    onSubmit () {
      console.log('submit!')
    },
    // 分页
    onCurrentChange (page) {
      this.loadArticles(page)
    },
    loadChannels () {
      getChannels().then(res => {
        this.channels = res.data.data.channels
      })
    },
    onDeleteArticle (articleId) {
      // 找到数据接口
      // 封装调用方法
      this.$confirm('确定删除吗?', '退出提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteArticle(articleId.toString()).then(res => {
          this.loadArticles(this.page)
          this.$message({
            message: '删除成功！',
            type: 'success'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created () {
    this.loadArticles(1)
    this.loadChannels()
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
.filter-card {
  margin-bottom: 20px;
}

.list-table {
  margin-bottom: 20px;
}

.article-cover {
  width: 100px;
  background-size: cover;
}

.image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
