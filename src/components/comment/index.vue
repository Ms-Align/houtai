<template>
  <div class="commit">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item><a href="/commit">用户评论</a></el-breadcrumb-item>
        </el-breadcrumb>
        <div>
          <el-table
                :data="articles"
                style="width: 100%"
                stripe>
                <el-table-column
                  prop="title"
                  label="标题"
                  width="180">
                </el-table-column>
                <el-table-column
                  prop="total_comment_count"
                  label="总评论数"
                  width="180">
                </el-table-column>
                <el-table-column
                  prop="fans_comment_count"
                  label="粉丝评论数">
                </el-table-column>
                <el-table-column
                  prop="comment_status"
                  label="评论状态">
                  <template slot-scope='scope'>
                    {{scope.row.comment_status ? '开启':'关闭'}}
                  </template>
                </el-table-column>
                <el-table-column
                  prop="setting"
                  label="操作">
                  <template slot-scope='scope'>
                    <el-switch
                      v-model="scope.row.comment_status"
                      :disabled='isDisabled'
                      active-color="#13ce66"
                      inactive-color="#ff4949"
                      @change='onButtonChange(scope.row.id, scope.row.comment_status)'>
                    </el-switch>
                  </template>
                </el-table-column>
              </el-table>
        </div>
        <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page.sync="page"
              :page-sizes="[10, 20, 50, 100]"
              :page-size.sync="per_page"
              layout="total, sizes, prev, pager, next, jumper"
              :total="commentTotal">
            </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getArticles, updataCommentStatus } from '../../api/article.js'
export default {
  name: 'userComment',
  data () {
    return {
      articles: [],
      isDisabled: false,
      commentTotal: 0,
      page: 1,
      per_page: 10
    }
  },
  methods: {
    handleSizeChange () {
      getArticles({
        response_type: 'comment',
        per_page: this.per_page,
        page: this.page
      }).then(res => {
        this.articles = res.data.data.results
      })
        .catch(err => {
          console.log(err)
        })
    },
    handleCurrentChange () {
      getArticles({
        response_type: 'comment',
        page: this.page,
        per_page: this.per_page
      }).then(res => {
        this.articles = res.data.data.results
        this.commentTotal = res.data.data.total_count
        console.log(res)
      })
        .catch(err => {
          console.log(err)
        })
    },
    onButtonChange (id, status) {
      this.isDisabled = true
      updataCommentStatus(id, status).then(res => {
        this.isDisabled = false
        this.$message({
          message: '操作成功',
          type: 'success'
        })
      })
        .catch(err => {
          console.log(err)
          this.$message({
            message: '操作失败',
            type: 'error'
          })
          this.reload()
          this.isDisabled = false
        })
    }
  },
  created () {
    getArticles({
      response_type: 'comment'
    }).then(res => {
      this.articles = res.data.data.results
      this.commentTotal = res.data.data.total_count
    })
      .catch(err => {
        console.log(err)
      })
  },
  inject: ['reload']
}
</script>

<style>
</style>
