<template>
  <div>
    <one-tab-container v-model="category">
      <one-tab-container-item id="componentDemo">
        <component-demo></component-demo>
      </one-tab-container-item>
      <one-tab-container-item id="wechatDemo">
        <wechat-demo></wechat-demo>
      </one-tab-container-item>
      <one-tab-container-item id="mockDemo">
        <mock-demo></mock-demo>
      </one-tab-container-item>
    </one-tab-container>
    <one-tabbar v-model="category">
      <one-tab-item id="componentDemo">
        <span class="tab-category">组件Demo</span>
      </one-tab-item>
      <one-tab-item id="wechatDemo">
        <span class="tab-category">微信Demo</span>
      </one-tab-item>
      <one-tab-item id="mockDemo">
        <span class="tab-category">Mock Demo</span>
      </one-tab-item>
    </one-tabbar>
  </div>
</template>
<style>
  .tab-category {
    height: 30px;
  }
</style>
<script>
  import ComponentDemo from '@/component/ComponentDemo';
  import MockDemo from '@/component/MockDemo';
  import WechatDemo from '@/component/WechatDemo';

  export default {
    data() {
      return {
        category: 'componentDemo',
      };
    },
    components: {
      ComponentDemo,
      MockDemo,
      WechatDemo,
    },
  };
</script>
