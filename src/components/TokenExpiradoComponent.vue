<template>
  <div >

  </div>
</template>
<script>



export default {

  components: {

  },
  data() {
    return {
    };
  },
  mounted() {
      this.expiredToken()
  },
  methods: {
    expiredToken() {
      let timerInterval;
      this.$swal.fire({
        title: "Saliendo ...",
        html: "Parece que tu sesion ha finalizado !",
        timer: 2000,
        timerProgressBar: true,
        didOpen: () => {
          this.$swal.showLoading();
          const b = this.$swal.getHtmlContainer().querySelector("b");
          timerInterval = setInterval(() => {
            b.textContent = this.$swal.getTimerLeft();
          }, 100);
        },
        willClose: () => {
          clearInterval(timerInterval);
        },
      });
      localStorage.clear();
      this.$router.push("/login");
    },
  },
};
</script>