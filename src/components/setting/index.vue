<template>
  <div class="setting">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-row :gutter="20">
          <el-col :span='16'>
            <div>
              <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/setting' }">个人设计</el-breadcrumb-item>
              </el-breadcrumb>
            </div>
            <el-form ref="form" :model="form" label-width="40px">
              <el-form-item label="编号">
                {{ this.form.id }}
              </el-form-item>
              <el-form-item label="手机">
                <el-input v-model="form.mobile"></el-input>
              </el-form-item>
              <el-form-item label="媒体名称">
                <el-input v-model="form.name"></el-input>
              </el-form-item>
              <el-form-item label="媒体介绍">
                <el-input type="textarea" v-model="form.intro"></el-input>
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input v-model="form.email"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button v-loading='isLoading' type="primary" @click='onSave'>保存设置</el-button>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span='8'>
            <el-avatar :size="250" @click.native='$refs.file.click()' shape="square" :src="form.photo"></el-avatar>
            <input type="file" ref='file' hidden  name="avater" @change="onFileChange">
          </el-col>
        </el-row>
      </div>
    </el-card>
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%"
      append-to-body
      @opened='onOpened'
      @closed='onClosed'>
      <div class="preImageWrap">
        <img :src="preImage" alt="" style="width: 200px;" ref='preImage'>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click='onConfirmed' v-loading.body='isLoading'>确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'
import { getUserProfile, upLoadUserPhoto, updateUserInfo } from '../../api/user.js'
export default {
  name: 'setting',
  data () {
    return {
      form: {
        id: '',
        mobile: '',
        name: '',
        intro: '',
        email: '',
        photo: ''
      },
      url: 'http://toutiao-img.itheima.net/FgIC9s6eVDBTr6kCYO7L-NQ7VyX7',
      dialogVisible: false,
      preImage: '',
      cropper: null,
      isLoading: false
    }
  },
  created () {
    getUserProfile().then(res => {
      this.form = res.data.data
    })
  },
  methods: {
    onFileChange () {
      // 获取文件对象
      const file = this.$refs.file.files[0]
      this.preImage = window.URL.createObjectURL(file)
      this.dialogVisible = true
    },
    onOpened () {
      const image = this.$refs.preImage
      // 裁切器必须在图片显示的情况下才能正常初始话
      // 初始话的裁切在图片变换后并不会更新，除非销毁（destory()）该次初始化实例或者替换他（replace()）
      this.cropper = new Cropper(image, {
        aspectRatio: 1,
        viewMode: 1,
        dragMode: 'none'
      })
    },
    onClosed () {
      this.cropper.destroy()
    },
    onConfirmed () {
      this.isLoading = true
      this.cropper.getCroppedCanvas().toBlob(blob => {
        const file = new FormData()
        file.append('photo', blob)
        upLoadUserPhoto(file).then(res => {
          this.photo = res.data.data.photo
          this.dialogVisible = false
          this.reload()
          this.isLoading = false
          this.$message({
            message: '设置成功',
            type: 'success'
          })
        })
          .catch(err => {
            console.log(err)
            this.dialogVisible = false
            this.isLoading = false
            this.$message({
              message: '设置失败',
              type: 'error'
            })
          })
      })
    },
    onSave () {
      updateUserInfo(this.form).then(res => {
        this.reload()
        this.isLoading = false
        this.$message({
          message: '设置成功',
          type: 'success'
        })
      })
        .catch(err => {
          console.log(err)
          this.isLoading = false
          this.$message({
            message: '设置失败',
            type: 'error'
          })
        })
    }
  },
  inject: ['reload']
}
</script>

<style>
  .preImageWrap {
  }
  .preImageWrap image {
    display: block;
    max-width: 100%;
  }
</style>
