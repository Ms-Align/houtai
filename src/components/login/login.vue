<template>
    <div id="login">
      <el-form class='loginForm' ref='form' :model='form' :rules = 'rules'>
        <el-form-item prop="mobile" label="用户名">
          <el-input v-model="form.mobile" placeholder='请输入手机号'></el-input>
        </el-form-item>
        <el-form-item prop="code" label="密码">
          <el-input  v-model="form.code" placeholder='请输入密码'></el-input>
        </el-form-item>
        <el-checkbox v-model="checked">我已同意相关用户协议</el-checkbox>
        <el-button type="primary" @click='login' v-loading.body = "loading" class='loginButton' plain>登录</el-button>
      </el-form>
    </div>
</template>

<script>
import { login } from '../../api/user.js'
export default {
  name: 'login',
  data () {
    return {
      form: {
        mobile: null,
        code: null
      },
      checked: false,
      loading: false,
      rules: {
        mobile: [{ required: true, message: '手机号不能为空', trigger: 'blur' }, { min: 3, max: 15, message: '手机号格式错误', trigger: 'blur' }],
        code: [{ required: true, message: '密码不能为空', trigger: 'blur' }]
      }
    }
  },
  methods: {
    login () {
      if (this.checked) {
        // 手动验证
        this.$refs.form.validate((res, err) => {
          if (res) {
            this.loading = true
            login(this.form).then(result => { this.loading = false; this.$message({ message: '登录成功', type: 'success' }); window.localStorage.setItem('user', JSON.stringify(result.data.data)); this.$router.push({ name: 'home' }) }).catch(err => { console.log(err); this.loading = false; this.$message(err.message === 'Network Error' ? { message: '请检查网络连接', type: 'error' } : { message: '用户名或密码错误', type: 'error' }) })
            // 将登录‘令牌存入本地存储’
          }
          // err返回一个数组，为未通过验证的字段
        })
      } else {
        this.$message({ message: '请勾选用户协议', type: 'warning' })
      }
    }
  }
}
</script>

<style scoped="scoped">
  #login{
      position: fixed;
      justify-content: center;
      align-items: center;
      left: 0;right: 0;top: 0;bottom: 0;display: flex;background: url(雷电芽衣.jpg) no-repeat;background-size: cover;
  }
  .loginForm{background-color: rgba(255,255,255,.5);padding: 50px;}
  .loginButton{width: 100%;margin-top: 10px;}
</style>
