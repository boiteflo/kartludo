<template>
    <header-yugioh>
        <div style="color:white">
            <h1>Créer un nouveau format</h1>
            <div class="flex flex-wrap">
                <v-text-field class="m5px" hide-details label="Titre" v-model="format.Title">
                </v-text-field>
                <v-text-field class="m5px" hide-details label="Auteur(s)" v-model="format.Author">
                </v-text-field>
                <v-text-field class="m5px" hide-details label="Carte d'illustration (EN)" v-model="format.MainCard">
                </v-text-field>
            </div>
            <v-btn class="m5px" @click="showDetails = !showDetails">
                {{ showDetails ? 'Cacher ' : 'Afficher ' }} le détails du format
            </v-btn>
            <v-expand-transition>
                <div v-show="showDetails" class="flex flex-column bg2">
                    <div class="m5px">Cartes Bannies :</div>
                    <v-textarea solo class="m5px" hide-details readonly :value="format.Limit0">
                    </v-textarea>
                    <div class="m5px">Cartes Limitées :</div>
                    <v-textarea solo class="m5px" hide-details readonly :value="format.Limit1">
                    </v-textarea>
                    <div class="m5px">Groupe de limitation :</div>
                    <v-textarea solo class="m5px" hide-details readonly
                        :value="format.Limit1Groups.split('|').join('\n')">
                    </v-textarea>
                    <div class="m5px">Joker :</div>
                    <v-textarea solo class="m5px" hide-details readonly :value="format.Joker">
                    </v-textarea>
                    <div class="m5px">Bonus:</div>
                    <v-textarea solo class="m5px" hide-details readonly :value="format.Bonus">
                    </v-textarea>
                </div>
            </v-expand-transition>
            <div class="flex flex-reverse">
                <v-btn :disabled="!isValid()" class="m5px bg" @click="insert">
                    Ajouter ce format
                </v-btn>
            </div>
        </div>
    </header-yugioh>
</template>


<script>
import { store } from '../../data/store.js'

import headerYugioh from '../../components/headerYugioh';
import ServiceBack from '../../services/serviceBack.js'

export default {
    name: 'pageDeck',
    components: {headerYugioh},
    data: () => ({
        store: store,
        format: store.formats[store.formats.length - 1],
        showDetails: false
    }),
    async mounted() {
        this.format.Title = '';
    },
    methods: {
        isValid() {
            return this.format.Title && this.format.Title.length > 1 && this.format.Title !== 'Test'
                && this.format.Author && this.format.Author.length > 0
                && this.format.MainCard && this.format.MainCard.length > 0;
        },
        insert() {
            ServiceBack.insert('format', this.format).then(() =>
                window.location.href = '/success/text=Le%20format%20a%20ete%20sauvegarde'
            );
        }
    }
};
</script>
