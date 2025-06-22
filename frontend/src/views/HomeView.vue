<template>
   <div class="carousel-container" cycle show-arrows="hover" interval="1000">
      <v-carousel class="carousel" height="400" cycle interval="6000" show-arrows="hover">
          <v-carousel-item :src="img2" cover></v-carousel-item>
          <v-carousel-item :src="img1" cover></v-carousel-item>
          <v-carousel-item :src="img3" cover></v-carousel-item>
      </v-carousel>
      <div class="overlay"></div>
      <div class="content-overlay">
          <h1>Ajude a tornar a sua cidade mais limpa</h1>
          <p>Mantenha a cidade livre de lixo: pequenos gestos diários fazem toda a diferença!</p>
          <v-btn color="#09A129">Saber mais</v-btn>
      </div>
  </div>
  <section class="statistics">
    <div>
      <h2 class="title">46%</h2>
      <p>Percentagem de resíduos recicláveis (azul, amarelo, verde) em relação ao total de resíduos produzidos.</p>
    </div>
    <div>
      <h2 class="title">41%</h2>
      <p>Resíduos não reciclados enviados para incineração ou tratamento indiferenciado.</p>
    </div>
    <div>
      <h2 class="title">115kg/hab.ano</h2>
      <p>Volume total de resíduos (todos os tipos) recolhidos, dividido pelo número de habitantes.</p>
    </div>
  </section>
  <section>
    <div class="news">
      <div class="news-container1">
        <div>
          <h2>Notícias e Artigos</h2>
          <img src="@/assets/images/carousel_2.webp" class="news-container1-image" alt="image">
        </div>
        <p>6 maio 2024</p>
        <h3 class="title">Lorem ipsum dolor sit amet</h3>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, sapien nec tincidunt fringilla, lacus erat suscipit enim, non vulputate nulla lorem ac nisi. Nulla facilisi. Suspendisse potenti.</p>
      </div>
      <div class="news-container2">
        <div class="news-container-content">
          <img class="news-image" src="@/assets/images/carousel_1.webp" alt="news">
          <div>
            <p>6 maio 2024</p>
            <h4 class="title">Lorem ipsum dolor sit amet Nulla facilisi. Suspendisse potenti</h4>
          </div>
        </div>
        <div class="news-container-content">
          <img class="news-image" src="@/assets/images/carousel_3.webp" alt="news">
          <div>
            <p>6 maio 2024</p>
            <h4 class="title">Lorem ipsum dolor sit amet Nulla facilisi. Suspendisse potenti</h4>
          </div>
        </div>
        <div class="news-container-content">
          <img class="news-image" src="@/assets/images/carousel_1.webp" alt="news">
          <div>
            <p>6 maio 2024</p>
            <h4 class="title">Lorem ipsum dolor sit amet Nulla facilisi. Suspendisse potenti</h4>
          </div>
        </div>
      </div>
    </div>
  </section>
  <section class="service">
      <div class="service-content">
          <h3>Aderir ao serviço</h3>
          <h2>Recolha Porta-a-Porta</h2>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, sapien nec tincidunt.</p>
          <v-btn color="#09A129">Aderir agora</v-btn>
      </div>
  </section>
</template>
<script setup>
import img1 from '@/assets/images/carousel_2.webp'
import img2 from '@/assets/images/carousel_1.webp'
import img3 from '@/assets/images/carousel_3.webp'
</script>
<style scoped>
  .service {
      height: 60vh;
      width: 100vw;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #f3f3f3;
      text-align: center;
      color: #09A129;
  }
  .service-content {
      max-width: 600px;
  }
  .service-content > h2{
      color: #043601;
      padding-top: 15px;
  }
  .service-content > p{
      color: #043601;
      padding-bottom: 25px;
  }
  .carousel-container {
      position: relative; 
             color: var(--color-White);
  }
  .carousel {
      width: 100vw;
      height: 100vh !important;
  }
  .overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100%;
      background-color: rgba(3, 54, 24, 0.6);
      z-index: 1;
      pointer-events: none;
  }
  .content-overlay {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: "white";
      text-align: center;
      z-index: 2;
  }
  .statistics {
      display: flex;
      justify-content: space-around;
      align-items: center;
      padding: 50px;
      width: 100vw;
      background-color: #09A129;
       color: var(--color-White);
  }
  .statistics > div {
      padding: 20px 80px;
  }
  .news {
      display: flex;
      justify-content: center;
      gap: 180px;
      flex-wrap: wrap;
      margin: 50px 0;
      color: #043601;
      width: 100vw;
  }
    .news-image {
      width: 200px;
      height: 150px;
  }
  .news-container1 {
      width: 500px;
  }
  .news-container1-image {
      width: 600px;
      height: 360px;
  }
  .news-container2 {
      margin-top: 50px;
  }
  .news-container-content {
      display: flex;
      width: 400px;
  }
  .news-container-content > div {
    margin-left: 20px;
  }
  .news-container2 > div{
      margin-bottom: 20px;
  } 
  h2 {
    margin-bottom: 15px;
  }
  .title {
    font-weight: 600;
  }
</style>