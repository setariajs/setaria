<template>
  <div>
    JSSdkDemo<br/>
    {{ url }}<br/>
    {{ error }}
    <input type="button" value="获取权限" @click="doConfig">
    <input type="button" value="拍照" @click="doChooseImage">
    <img :src="uploadImage"/>
    <br/>
    <input type="button" value="跳转至上页" @click="naviToLogin">
    <input type="button" value="返回上页" @click="backToLogin">
    <input type="button" value="关闭窗口" @click="doClose">
  </div>
</template>
<script>
  import Util from '@/model/Util';

  const wx = require('weixin-js-sdk');

  export default {
    data() {
      return {
        url: window.location.href,
        error: null,
        uploadImage: null,
      };
    },
    created() {
      console.log('JSSdkDemo Created');
    },
    methods: {
      doConfig() {
        this.$service.call('authJsSdk', {
          currentUrl: window.location.href.replace(window.location.hash, ''),
        }).then((res) => {
          wx.config({
            debug: true,
            appId: res.appId,
            timestamp: res.timestamp,
            nonceStr: res.nonceStr,
            signature: res.signature,
            jsApiList: ['chooseImage', 'getNetworkType'],
          });
          wx.ready(() => {
            console.log('config success');
          });
          wx.error((errorObject) => {
            this.error = JSON.stringify(errorObject);
          });
        });
      },
      doChooseImage() {
        wx.chooseImage({
          count: 1, // 默认9
          sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
          sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
          success(res) {
            const localIds = res.localIds;
            if (!Util.isArray(localIds) && localIds.length > 0) {
              this.uploadImage = localIds[0];
            }
            console.log(localIds);
          },
        });
      },
      naviToLogin() {
        this.$navi.to('Login');
      },
      backToLogin() {
        this.$navi.back();
      },
      doClose() {
        wx.closeWindow();
      },
    },
  };
</script>
