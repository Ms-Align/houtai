<template>
  <div class="publish">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/publish'}">{{ this.$route.query.id? '修改文章': '发布文章'}}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <el-form ref="publishForm" :rules='rules' :model="form" label-width="40px">
        <el-form-item prop='title' label="标题">
          <el-input v-model="form.title"></el-input>
        </el-form-item>
        <el-form-item prop='content' label="内容">
          <el-tiptap
            v-model="form.content"
            :extensions="extensions"
          />
        </el-form-item>
        <el-form-item prop='cover' label="封面">
          <el-radio-group v-model="form.cover.type">
            <el-radio :label="1">单图</el-radio>
            <el-radio :label="3">三图</el-radio>
            <el-radio :label="0">无图</el-radio>
            <el-radio :label="-1">自动</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop='channel_id' label="频道">
          <el-select v-model="form.channel_id" placeholder="请选择频道">
            <el-option v-for='(item, index) in channelList' :label="item.name" :key='index' :value="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onPublish(form)">发布</el-button>
          <el-button @click='onDraft(form)'>存入草稿</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { getChannelList } from '../../api/channel.js'
import { publish } from '../../api/publish.js'
import { getArticle, onEdit } from '../../api/article.js'
import { upLoadImage } from '../../api/image/index.js'
import {
  // 需要的 extensions
  Doc,
  Text,
  Paragraph,
  Heading,
  Image,
  Bold,
  Underline,
  Italic,
  Strike,
  ListItem,
  BulletList,
  OrderedList,
  Fullscreen
} from 'element-tiptap'
export default {
  data () {
    return {
      form: {
        title: '',
        content: '',
        cover: {
          type: 0,
          images: []
        },
        channel_id: null
      },
      channelList: [],
      extensions: [
        new Doc(),
        new Text(),
        new Paragraph(),
        new Heading({ level: 5 }),
        new Bold({ bubble: true }), // 在气泡菜单中渲染菜单按钮
        new Underline({ bubble: true, menubar: false }), // 在气泡菜单而不在菜单栏中渲染菜单按钮
        new Italic(),
        new Strike(),
        new ListItem(),
        new BulletList(),
        new OrderedList(),
        new Fullscreen(),
        new Image({
          // 自定义图片上传方式，默认系统会将图片转换为base64字符串和文本放在一起
          // 当上传图片是，会触发该事件
          uploadRequest (file) {
            console.log(file)
            const fd = new FormData()
            fd.append('image', file)
            return upLoadImage(fd).then(res => {
              console.log(res)
              return res.data.data.url
            })
          }
        })
      ],
      rules: {
        title: [{ required: true, message: '标题不能为空', trigger: 'blur' }],
        content: [
          { required: true, message: '内容不能为空', trigger: 'blur' },
          { min: 15, message: '内容最少为15个字符！', trigger: 'blur' }],
        channel_id: [
          { required: true, message: '请选择频道' }
        ]
      }
    }
  },
  methods: {
    onPublish (data) {
      this.$refs.publishForm.validate(valid => {
        if (valid) {
          if (this.$route.query.id) {
            onEdit(this.$route.query.id, data).then(res => {
              this.$message({ message: '修改成功', type: 'success' })
            })
              .catch(err => {
                this.$message({ message: '修改失败', type: 'error' })
                console.log(err)
              })
          } else {
            publish(data).then((res) => {
              this.$message({ message: '发布成功', type: 'success' })
            })
              .catch(err => {
                this.$message({ message: '发布失败', type: 'error' })
                console.log(err)
              })
          }
        }
      })
    },
    onDraft (data) {
      publish(data, true).then(res => {
        this.$message({ message: '已存入草稿', type: 'success' })
      })
        .catch(err => {
          this.$message({ message: '存入草稿失败', type: 'error' })
          console.log(err)
        })
    }
  },
  created () {
    getChannelList().then(res => {
      this.channelList = res.data.data.channels
    })
    if (this.$route.query.id) {
      getArticle(this.$route.query.id).then(res => {
        this.form = res.data.data
      })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
</script>

<style>
</style>
