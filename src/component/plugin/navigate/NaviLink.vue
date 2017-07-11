<template>
  <router-link :to="naviTo" :replace="replace" :append="append"
    :tag="tag" :activeClass="activeClass" :exact="exact" :events="events">
    <slot></slot>
  </router-link>
</template>
<script>
  const DIRECTION_FLAG = '$$direction';

  export default {
    name: 'NaviLink',
    props: {
      to: {
        type: [String, Object],
        required: true,
      },
      replace: {
        type: Boolean,
        default: false,
      },
      append: {
        type: Boolean,
        default: false,
      },
      tag: {
        type: String,
        default: 'a',
      },
      activeClass: {
        type: String,
        default: 'router-link-active',
      },
      exact: {
        type: Boolean,
        default: false,
      },
      events: {
        default: 'click',
      },
    },
    computed: {
      naviTo() {
        let ret = this.to;
        if (ret instanceof Object) {
          if (ret.params) {
            ret.params[DIRECTION_FLAG] = 'forward';
          } else {
            ret.params = {};
            ret.params[DIRECTION_FLAG] = 'forward';
          }
        } else {
          ret = {
            path: ret,
          };
          ret.params = {};
          ret.params[DIRECTION_FLAG] = 'forward';
        }
        console.log(ret);
        return ret;
      },
    },
  };
</script>
