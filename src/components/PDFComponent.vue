<template>
   <div>
     <VueHtml2pdf
        :show-layout="false"
        :float-layout="true"
        :enable-download="true"
        :preview-modal="true"
        :paginate-elements-by-height="1400"
        filename="myPDF"
        :pdf-quality="2"
        :manual-pagination="false"
        pdf-format="a4"
        pdf-orientation="landscape"
        pdf-content-width="800px"
        ref="html2Pdf"
    >
        <section slot="pdf-content">
            <h2>HGOlasdas</h2>
        </section>
    </VueHtml2pdf>
   </div>
</template>

<script>

 import { Global } from "../Global";
import axios from "axios";
export default { 
    components: {
      
    },
      data() {
    return {
      listado: '',
    };
  },
    methods: { 
         returnImgProfile(img) {
      return "data:image/png;base64," + img;
    },
        generateReport () {
            this.$refs.html2Pdf.generatePdf()
        },
        cargarLista(){
                 let config = {
        headers: {
          "Content-Type": "application/json",
          token: Global.token,
        },
      };
      axios
        .get(Global.urlSitio + "registro-clase?idClase=" + this.$route.params.idClase, config)
        .then((res) => {
          if (res.status == 200) {
            this.listado= res.data;
          }
        });
            
        }
    },
}
</script>