<template>
    <div>
        <div class="flex m5px" style="justify-content:center">  
          <a href="https://www.duelingbook.com/deck?id=13483731">
            <v-btn class="m5px">
                <v-icon>mdi-cancel</v-icon>
                <span class="mr-2">Cartes Interdites</span>
            </v-btn>
          </a>
          <a href="https://www.duelingbook.com/deck?id=13483763">
            <v-btn class="m5px">
                <v-icon>mdi-alert</v-icon>
                <span class="mr-2">Cartes Limités</span>
            </v-btn>
          </a>
          <a href="https://www.duelingbook.com/deck?id=13483774">
            <v-btn class="m5px">
                <v-icon>mdi-star</v-icon>
                <span class="mr-2">Cartes Joker 1</span>
            </v-btn>
          </a>
          <a href="https://www.duelingbook.com/deck?id=13483808">
            <v-btn class="m5px">
                <v-icon>mdi-star</v-icon>
                <span class="mr-2">Cartes Joker 2</span>
            </v-btn>
          </a>
        </div>
        <v-img
          :src="require('../assets/rules.jpg')"
        />
        <v-card>
          <v-card-title>Remerciement</v-card-title>
          <v-card-text>Ce format/concept/ban list a été inventé par Zouloux (07/2023). Le Site Web a été créé par FlorentOutan. (Contactez moi sur le discord). Avec la participation de Aelle et Lockai. Utilisation de la base de données : https://db.ygoprodeck.com.</v-card-text>
        </v-card>
          
    </div>
</template>


<script>
export default {
  name: 'pageDeck'
};
</script>
