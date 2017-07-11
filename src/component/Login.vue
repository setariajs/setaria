<template>
  <div>
    你已登录 {{ currentCount }} 次。
    <input type="button" @click="doLogin" value="登录"/>
    <br/>
    用户昵称: {{ user.nickname }}
    <br/>
    <img :src="user.headimgurl">
    <input type="button" @click="doForward" value="JSSDK Demo"/>
  </div>
</template>
<style scoped>
</style>
<script>
  import UmeHttp from '@/model/UmeHttp';
  import Util from '@/model/Util';

  export default {
    data() {
      return {
        currentCount: 0,
        user: {},
      };
    },
    created() {
      let i = window.localStorage.getItem('index');
      if (!i) {
        i = 0;
      } else {
        i = parseInt(i, 10);
      }
      this.currentCount = i + 1;
      window.localStorage.setItem('index', this.currentCount);
    },
    methods: {
      doLogin() {
        const code = Util.getUrlParameter('code');
        UmeHttp.invoke('wechat/login', {
          code,
        }).then((res) => {
          this.user = res;
        });
      },
      doForward() {
        this.$navi.to('JSSdkDemo', { id: 'id1' });
      },
    },
  };
</script>
