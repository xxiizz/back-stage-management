<template>
  <div class="error" @click='toIndex'>
    <img src="../assets/404.gif" alt />
  </div>
</template>

<script>
export default {
    created() {
        this.$message.warning('您好像去火星了,点击飞碟返回地球')
    },
    methods: {
        toIndex(){
            this.$router.push('/index')
        }
    },
};
</script>

<style lang="less" scoped>
.error {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  img{
      width: 100%;
      height: 100%;
  }
}
</style>
