<template>
  <div class="article">
    <el-card class="search-card">
      <div slot="header" class="clearfix">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/article'}">内容管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <el-form ref="form" :model="form" label-width="80px">
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
        <el-form-item label="选择频道">
            <el-select v-model="form.region" placeholder="请选择频道">
              <el-option :value='null' label='全部'></el-option>
              <el-option v-for='(item, index) in form.channelList' :key='index' :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        <el-form-item label="活动时间">
            <el-date-picker
              v-model="form.searchDate"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format='yyyy-MM-DD'
              value-format='yyyy-MM-DD'>
            </el-date-picker>
         </el-form-item>
        <el-form-item>
          <el-button type="primary" @click='getArticles()'>查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="result-card">
      <div slot="header" class="clearfix">
        <span>根据搜索条件共搜索到{{totalCount}}条信息</span>
      </div>
      <el-table
        :data="articles"
        style="width: 100%"
        stripe
        border>
        <el-table-column
          prop="date"
          label="封面">
          <template>
            <img src="../login/雷电芽衣.jpg" class="coverImg" alt="">
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
          <el-tag :type="articleStatus[scope.row.status].type">{{articleStatus[scope.row.status].text}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="pubdate"
          label="发布时间">
        </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope='scope'>
            <el-button
              size="mini"
              icon='el-icon-edit'
              circle
              type='primary'
              @click='onEdit(scope.row.id)'
            ></el-button>
            <el-button
              size="mini"
              type="danger"
              icon='el-icon-delete'
              circle
              @click='ondelete(scope.row.id)'
             ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        layout="prev, pager, next"
        :current-page.sync='currentPage'
        :total="totalCount"
        @current-change='offsetTo'
        :page-size='pageSize'>
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { getArticles, onDelete } from '../../api/article.js'
import { getChannelList } from '../../api/channel.js'
export default {
  name: 'articleList',
  data () {
    return {
      form: {
        name: '',
        region: null,
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: [],
        desc: '',
        searchDate: '',
        channelList: ''
      },
      articles: null,
      articleStatus: [
        { status: 0, text: '草稿', type: 'info' },
        { status: 1, text: '待审核', type: '' },
        { status: 2, text: '审核通过', type: 'success' },
        { status: 3, text: '审核失败', type: 'warning' },
        { status: 4, text: '已删除', type: 'danger' }
      ],
      currentPage: null,
      totalCount: 0,
      pageSize: 10,
      status: null
    }
  },
  created () {
    getArticles({ status: this.status }).then(res => {
      this.articles = res.data.data.results
      this.totalCount = res.data.data.total_count
    })
      .catch(err => {
        console.log(err)
      })
    getChannelList().then(res => {
      this.form.channelList = res.data.data.channels
    })
      .catch(err => {
        console.log(err)
      })
  },
  methods: {
    offsetTo () {
      getArticles({ page: this.currentPage, per_page: this.pageSize }).then(res => {
        this.articles = res.data.data.results
      })
        .catch(err => {
          console.log(err)
        })
    },
    getArticles () {
      getArticles({ status: this.status, channel_id: this.form.region, begin_pubdate: this.form.searchDate[0], end_pubdate: this.form.searchDate[1] }).then(res => {
        this.articles = res.data.data.results
        this.totalCount = res.data.data.total_count
        console.log(this.form.searchDate)
      })
        .catch(err => {
          console.log(err)
        })
    },
    ondelete (id) {
      id = id.toString()
      this.$confirm('确定删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        onDelete(id).then(res => {
          this.$message({
            type: 'success',
            message: '删除成功'
          })
          this.reload()
        })
          .catch(err => {
            this.$message({
              type: 'error',
              message: '删除失败'
            })
            console.log(err)
          })
      })
    },
    onEdit (id) {
      this.$router.push('/publish?id=' + id)
    }
  },
  inject: ['reload']
}
</script>

<style>
  .search-card{
    margin-bottom: 30px;
  }
  .coverImg {
    width: 60px;
  }
</style>
