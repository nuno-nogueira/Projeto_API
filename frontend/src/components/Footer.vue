<template>
    <footer class="footer">
        <div>
            <img src="@/assets/icons/logo_full.svg" alt="logo">
            <p>Sed ut perspiciatis undmnis is iste natus error sit amet voluptatem totam rem aperiam.</p>
            <div>
                <!-- <img src="@/assets/icons/telephone.svg" alt="telephone"> -->
                <p>+351 900 000 000</p>
            </div>
        </div>
        <div class="footer-center">
            <div class="footer-links">
                <a href="">Mapa</a>
                <a href="">Recolha</a>
            </div>
            <div class="footer-links">
                <a href="">Contactos</a>
                <a href="">Sobre nós</a>
            </div>
        </div>
        <div>
            <h3>Segue-nos em</h3>
            <img src="@/assets/icons/sns.svg" alt="sns">
        </div>
    </footer>
</template>
<script>
    export default {
        name: 'Footer',

    }
</script>
<style scoped>
    .footer {
        background-color: var(--color-Pakistan-green);
        width: 100vw;
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 200px;
        padding: 100px;
        align-items: center;
        color: var(--color-White);
    }
    .footer-links {
        margin-left: 10px;
        display: flex;
        flex-direction: column;
        
    }
    .footer-links > a {
        margin-bottom: 20px;
        width: 100px;
        padding: 8px;
        color:var( --color-White);
    }
    .footer-center {
        display: flex;
    }
    img {
        width: 150px;
        height: 70px;
    }
</style>