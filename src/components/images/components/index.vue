<template>
  <div class="imageList">
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
        @click.native = 'selected = index; selectedUrl = item.url'
        :class="selected == index? 'selected': '' "
        ></el-image>
    </div>
    </el-col>
    </el-row>
  </div>
</template>

<script>
import { getImages } from '../../../api/image/getImages.js'
export default {
  name: 'imagesList',
  data () {
    return {
      radio: '全部',
      url: '',
      fit: 'cover',
      images: [],
      dialogVisible: false,
      currentPage: 1,
      totalcount: 0,
      loading: false,
      selected: null,
      selectedUrl: ''
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
  methods: {
    getAllImages () {
      getImages({ per_page: 12 }).then(res => {
        this.images = res.data.data.results
        this.totalcount = res.data.data.total_count
      })
        .catch(err => {
          console.log(err)
        })
    },
    getCollectImages () {
      getImages({ collect: true, per_page: 12 }).then(res => {
        this.images = res.data.data.results
        this.totalcount = res.data.data.total_count
      })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
</script>

<style scoped="scoped">
 .selected {
  border: 3px dashed red;
}
</style>
