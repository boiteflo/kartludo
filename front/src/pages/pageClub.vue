<template>
    <div>
        <img class="w100p" src="https://i.ytimg.com/vi/oKwnCSYZKVQ/maxresdefault.jpg"/>
        <h1 style="margin-top:-10px">CLUB Yu-Gi-Oh! (Page en cours de création)</h1>
        <h2>DECKS DE ZOULOUX</h2>
        <div v-for="level in [1,2,3]" :key="level">
            <div class="p5px bg">Niveau {{level}}</div>
            <div class="flex-wrap flex-space-around p5px bg2">
                <div v-for="deck in decks.filter(x=> x.Level === level && !x.Author)" v-bind:key="'deck' + deck.Id" style="position:relative">
                <iconDeck :deck="deck" 
                    v-on:select="selectDeck(deck)" 
                    :rarity="sortByRarity">
                </iconDeck>
                </div>
            </div>
        </div>
        <h2>EQUILIBRAGE PAR LA COMMUNAUTÉ</h2>
        <p class="m5px">Afin de garantir l'amusement d'un duel, il est essentiel que les participants utilisent des decks de niveau similaire. Cependant, la situation actuelle est marquée par la prédominance de certains decks au sein du club, ce qui déséquilibre le format. Pour rétablir l'équilibre, nous pourrions envisager des ajustements tels qu'un renforcement pour Joey et, en revanche, une diminution de puissance pour les bêtes cristalines. Vous pouvez proposer ci-dessous vos decks avec le style Club Yu-Gi-Oh!.</p>
        <div v-for="level in [1,2,3]" :key="level">
            <div class="p5px bg">Niveau {{level}}</div>
            <div class="flex-wrap flex-space-around p5px bg2">
                <div v-for="deck in decks.filter(x=> x.Level === level && x.Author)" v-bind:key="'deck' + deck.Id" style="position:relative">
                <iconDeck :deck="deck" 
                    v-on:select="selectDeck(deck)" 
                    :rarity="sortByRarity">
                </iconDeck>
                </div>
            </div>
        </div>
        <v-btn class="m5px bg">Ajouter un deck du style Zouloux Club Yu-Gi-Oh!</v-btn>
    </div>
</template>


<script>
import iconDeck from '../components/iconDeck';

export default {
  name: 'pageClub',
  components: {iconDeck},
  data: () => ({
    decks: [
        {Title:'YUGI B.V.', MainCardImage:'https://s3.duellinksmeta.com/cards/60c2b3aaa0e24f2d54a51943_w420.webp', Level:1},
        {Title:'KAIBA  B.V.', MainCardImage:'https://s3.duellinksmeta.com/cards/60c2b3aba0e24f2d54a52f24_w420.webp', Level:1},
        {Title:'JOEY B.V.', MainCardImage:'https://s3.duellinksmeta.com/cards/60c2b3aba0e24f2d54a527c4_w420.webp', Level:1},
        {Title:'EXODIA', MainCardImage:'https://images.ygoprodeck.com/images/cards/33396948.jpg', Level:1},
        {Title:'ZOMBIE', MainCardImage:'https://s3.duellinksmeta.com/cards/60c2b3aca0e24f2d54a53ccd_w420.webp', Level:2},
        {Title:'GUERRIER EQUIPEMENT', MainCardImage:'https://s3.duellinksmeta.com/cards/60c2b3aba0e24f2d54a52b89_w420.webp', Level:2},
        {Title:'HARPIE', MainCardImage:'https://s3.duellinksmeta.com/cards/60c2b3aba0e24f2d54a52590_w420.webp', Level:2},
        {Title:'HORUS', MainCardImage:'https://s3.duellinksmeta.com/cards/60c2b3aba0e24f2d54a52660_w420.webp', Level:3},
        {Title:'CYBER DRAGON', MainCardImage:'https://s3.duellinksmeta.com/cards/60c2b3aaa0e24f2d54a51ade_w420.webp', Level:3},
        {Title:'KAIBA', MainCardImage:'https://s3.duellinksmeta.com/cards/60c2b3a9a0e24f2d54a51794_w420.webp', Author:'FlorentOutan', Level:3},
    ]
  })
};
</script>
