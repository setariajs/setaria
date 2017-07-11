<template>
  <div>
    <one-swipe :auto="4000" style="height:100px;">
      <one-swipe-item style="background-color:red;">1</one-swipe-item>
      <one-swipe-item style="background-color:blue;">2</one-swipe-item>
      <one-swipe-item style="background-color:gray;">3</one-swipe-item>
    </one-swipe>
    <div class="gutter">
      <one-button type="primary" @click="showIndicator">显示加载框(2s后关闭)</one-button>
    </div>
    <div class="gutter">
      <one-button type="primary" @click="callResource">调用服务</one-button>
      <one-cell title="结果"></one-cell>
      <one-cell>
        {{ serviceOutput }}
      </one-cell>
    </div>
  </div>
</template>
<style scoped>
  .gutter {
    margin-top: 10px;
  }
</style>
<script>
  import { LoadingIndicator } from '@/component/ui';
  import SampleResource from '@/model/resource/SampleResource';

  export default {
    data() {
      return {
        serviceOutput: '',
      };
    },
    methods: {
      showIndicator() {
        LoadingIndicator.show();
        setTimeout(() => {
          LoadingIndicator.hide();
        }, 2000);
      },
      callResource() {
        SampleResource.getSampleData('id1', 'type1').then((res) => {
          this.serviceOutput = JSON.stringify(res);
        });
      },
    },
  };
</script>
