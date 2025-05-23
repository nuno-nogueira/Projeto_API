<template>
    <div>
        <h1>Teste</h1>

        <div v-if="user">
        <p><strong>ID:</strong> {{ user.user_id }}</p>
        <p><strong>Nome:</strong> {{ user.name }}</p>
        <p><strong>Email:</strong> {{ user.email }}</p>
        <p><strong>Telefone:</strong> {{ user.phone_number }}</p>
        <p><strong>Ponto de Recolha:</strong>
            {{ user.collection_point?.street_name }} —
            {{ user.collection_point?.postal_code }},
            {{ user.collection_point?.door_number }}
        </p>
        </div>
        <div v-else>
            <p>Nenhum utilizador encontrado :(</p>
        </div>

    </div>
</template>

<script>
import Users from '@/api/users';

    export default {
        props: ['userId'],
        name: 'ProfileView',

        data() {
            return {
                user: null,
            }
        },

        async created() {
            const res = await Users.getUserProfile(this.userId);
            this.user = res.data;
        },
    }
</script>

<style lang="scss" scoped>
p{
    color: black;
}
</style>