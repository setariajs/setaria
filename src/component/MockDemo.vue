<template>
  <div>
    <one-field label="服务ID" v-model="serviceId"></one-field>
    <one-field label="服务参数" v-model="params"></one-field>
    <one-button type="primary" @click="doCallService" :disabled="isDisabled">调用服务</one-button>
    <one-cell title="结果"></one-cell>
    <one-cell>
      {{ result }}
    </one-cell>
  </div>
</template>
<script>
  import UmeHttp from '@/model/UmeHttp';
  import Util from '@/model/Util';

  export default {
    data() {
      return {
        serviceId: '',
        params: '',
        result: '',
      };
    },
    computed: {
      isDisabled() {
        return Util.isEmpty(this.serviceId) || Util.isEmpty(this.params);
      },
    },
    methods: {
      doCallService() {
        UmeHttp.invoke(`sample/${this.serviceId}`, JSON.parse(this.params))
          .then((res) => {
            this.result = JSON.stringify(res);
          });
      },
    },
  };
</script>
