<template>
  <div class="images">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/image'}">{{'素材管理'}}</el-breadcrumb-item>
        </el-breadcrumb>
        <el-button @click='dialogVisible = true' style="float: right; padding: 3px 0" type="text">
          上传图片
          <el-dialog
            :visible.sync="dialogVisible"
            width="30%"
            :append-to-body='true'>
            <el-upload
              class="upload-demo"
              drag
              action="http://api-toutiao-web.itheima.net/mp/v1_0/user/images"
              :headers='upLoadHeaders'
              name='image'
              multiple
              :on-success='onUploadSucess'>
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
              <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-dialog>
        </el-button>
      </div>
      <div style="margin-bottom: 10px;">
        <el-radio-group v-model="radio">
          <el-radio-button label="全部" @click.native='getAllImages'></el-radio-button>
          <el-radio-button label="收藏" @click.native='getCollectImages'></el-radio-button>
        </el-radio-group>
      </div>
      <el-row :gutter="10">
  <el-col :md='4' :xs='12' :lg='4' v-for='(item, index) in images' :key='index'>
  <div class="grid-content bg-purple" style='position: relative;'>
    <el-image
      :src="item.url"
      :fit="fit"
      v-loading.fullscreen.lock="loading"
      ></el-image>
      <div style="height: 40px;position: absolute;bottom: 0;background-color: rgba(204,204,204,0.5); left: 5px;right: 5px; display: flex;justify-content: space-around;align-items: center;">
        <span :class="item.is_collected? 'el-icon-star-on':'el-icon-star-off'" @click="oncollect(item)"></span><span class="el-icon-delete" @click="ondelete(item.id)"></span></div>
  </div>
  </el-col>
</el-row>
  <el-pagination
    background
    layout="prev, pager, next"
    :total="totalcount"
    :current-page.sync='currentPage'
    @current-change='offsetPage'>
  </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { getImages } from '../../api/image/getImages.js'
import { onCollect, onDelete } from '../../api/image/index.js'
export default {
  name: 'images',
  data () {
    const user = JSON.parse(window.localStorage.getItem('user'))
    return {
      radio: '全部',
      url: '',
      fit: 'cover',
      images: [],
      dialogVisible: false,
      upLoadHeaders: {
        Authorization: `Bearer ${user.token}`
      },
      currentPage: 1,
      totalcount: 0,
      loading: false
    }
  },
  methods: {
    getAllImages () {
      getImages({ per_page: 12 }).then(res => {
        console.log(res)
        this.images = res.data.data.results
        this.totalcount = res.data.data.total_count
      })
        .catch(err => {
          console.log(err)
        })
    },
    getCollectImages () {
      getImages({ collect: true, per_page: 12 }).then(res => {
        console.log(res)
        this.images = res.data.data.results
        this.totalcount = res.data.data.total_count
      })
        .catch(err => {
          console.log(err)
        })
    },
    onUploadSucess () {
      getImages().then(res => {
        console.log(res)
        this.images = res.data.data.results
        this.totalcount = res.data.data.total_count
        this.$message({
          message: '上传成功',
          type: 'success'
        })
      })
        .catch(err => {
          console.log(err)
        })
    },
    offsetPage () {
      getImages({ page: this.currentPage, per_page: 12 }).then(res => {
        console.log(res)
        this.images = res.data.data.results
        this.totalcount = res.data.data.total_count
      })
        .catch(err => {
          console.log(err)
        })
    },
    oncollect (image) {
      this.loading = true
      if (image.is_collected) {
        onCollect(image.id, false).then(res => {
          image.is_collected = false
          this.loading = false
        })
          .catch(err => {
            console.log(err)
            this.loading = false
          })
      } else {
        onCollect(image.id, true).then(res => {
          console.log(res)
          image.is_collected = true
          this.loading = false
        })
          .catch(err => {
            console.log(err)
            this.loading = false
          })
      }
    },
    ondelete (id) {
      onDelete(id).then(res => {
        this.reload()
      })
        .catch(err => {
          console.log(err)
        })
    }
  },
  created () {
    getImages({ per_page: 12 }).then(res => {
      console.log(res)
      this.images = res.data.data.results
      this.totalcount = res.data.data.total_count
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
