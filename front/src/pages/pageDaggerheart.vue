<template>
    <div v-if="images">
        <h1>Daggerheart</h1>
        <div class="flex flex-wrap p5px bg">
            <v-btn class="bg2 s40 m5px" @click="AddCards">
                <v-icon> mdi-add</v-icon> Créer un personnage
            </v-btn>
            <v-btn class="bg2 s40 m5px" @click="AddCards">
                <v-icon> mdi-add</v-icon> Créer des cartes
            </v-btn>
        </div>
        <div class="p5px bg">
            <p class="m5px">
                Daggerheart est un jeu de rôle collaboratif se déroulant dans un monde de haute fantaisie ; un lieu de magie incroyable et d'aventures périlleuses. Au cours d'une campagne, vous pourriez vous retrouver à côtoyer des nobles pour tenter de stopper un complot d'assassinat, à explorer un ancien donjon pour empêcher une puissante créature de s'échapper et de libérer son pouvoir, à naviguer à travers un vaste océan pour affronter un terrifiant monstre marin, ou à protéger un précieux artefact pour qu'il ne tombe pas entre les mains d'un ennemi dangereux. Peu importe l'aventure que votre groupe choisit d'entreprendre, Daggerheart fournit les outils nécessaires pour raconter une histoire à la fois émouvante et épique.
                <br>
                <br>
                Remarques de FlorentOutan :
                <br>
                Vous trouverez ci-dessous une partie des cartes utilisées dans le système DaggerHeart, traduites en
                français. Je tiens à remercier Gillus et ChatGPT pour leur contribution à ces traductions. <br>Veuillez
                noter que je n'ai pas les droits pour afficher ces images. Si un détenteur de droits souhaite que ces
                images soient supprimées, merci de me le faire savoir par e-mail à l'adresse suivante :
                boiteflo@gmail.com.<br>
            </p>
        </div>
        <h2>Les Ascendences</h2>
        <div class="flex flex-wrap">
            <img style="width:340px" v-for="(image, index) in images.ascendences" :key="'ascendance' + index"
                :src="image" />
        </div>
        <h1></h1>
        <h2>Les Communautés</h2>
        <div class="flex flex-wrap">
            <img style="width:340px" v-for="(image, index) in images.communautes" :key="'communaute' + index"
                :src="image" />
        </div>
        <h1></h1>
        <h2>Les Classes</h2>
        <div class="flex flex-wrap">
            <img style="width:340px" v-for="(image, index) in images.classes" :key="'classe' + index" :src="image" />
        </div>
        <h1></h1>
        <h2>Les Sous Classes</h2>
        <div class="flex flex-wrap">
            <img style="width:340px" v-for="(image, index) in images.sousClasses" :key="'communaute' + index"
                :src="image" />
        </div>
        <h1></h1>
        <h2>Les Domaines</h2>
        <div class="flex flex-wrap">
            <img style="width:340px" v-for="(image, index) in images.domaines" :key="'communaute' + index"
                :src="image" />
        </div>
    </div>
</template>
<script>
export default {
    name: 'StyledComponent'
}
</script>

<script>
  export default {
  name: 'pageDaggerheart',
  components: {},
  data: () => ({
    images: null,
  }),
  mounted(){
    const ascendences = "clank,croa,drakona,elfe,faune,firbolg,fungil,fée,galapa,geant,gobelin,halfelin,humain,infernis,katari,nain,orc,simia"
        .split(',').map(x=> require('@/assets/Daggerheart/Cartes/Ascendances/' + x +'.png'));

    const communautes = "basFonds,cotiere,erudit,montagnarde,noble,nomade,ordre,sauvage,souterraine"
        .split(',').map(x=> require('@/assets/Daggerheart/Cartes/Communautes/' + x +'.png'));
    
    const classesNames = "barde,druide,gardien,guerrier,magicien,rodeur,roublard,seraphin,sorcier".split(",");
    let classes = [];
    classesNames.forEach(x => {
        classes.push(require('@/assets/Daggerheart/Cartes/ClassesExplications/' + x +'.png'));
        classes.push(require('@/assets/Daggerheart/Cartes/Classes/' + x +'.png'));
    });
    const sousClasses = "BardeBeauParleur,BardeTroubadour,DruideGardienDesElements,DruideGardienDuRenouveau,GardienFidele,GardienVengeur,GuerrierBraveParmiLesBraves,GuerrierTueurDeMonstres,MagicienEcoleDeLaConnaissance,MagicienEcoleDeLaGuerre,RodeurMaitreDesBetes,RodeurPisteur,RoublardMarcheurDesOmbres,RoublardSyndicat,SeraphinPorteurDeFoi,SeraphinSentinelleAilee,SorcierOrigineElementaire,SorcierOriginePrimordiale"
        .split(',').map(x=> require('@/assets/Daggerheart/Cartes/SousClasses/' + x +'.png'));

    const domaines = "ArcaneLibererLeChaos,ArcaneMarcheSurLesMurs,ArcaneOeilFlottant,ArcanePoigneeDeBraise,ArcaneRuneDeProtection,CodexLivreDAva,CodexLivreDeStil,CodexLivreDeVagras,CodexLivreDIlliat,CodexLivreDTyfar,GraceDetecteurDeMensonge,GraceDiscoursInspirant,GraceEnvoutement,GraceFauteurDeTrouble,GraceMenteurHabile,LameFraterniteDeSoldats,LameIntrepide,LamePerfectionniste,LameRiposte,LameTourbillon,ManoeuvreApprocheStrategique,ManoeuvreEvasion,ManoeuvreFerocite,ManoeuvreJeLeVoisVenir,ManoeuvreMouvementsHabiles,NuitDeguisementIncroyable,NuitEspritDeMinuit,NuitLiensDombre,NuitPluieDeLames,NuitTireLaine,SagesseConjurationDEssaim,SagesseEnchevetrementSournois,SagesseEspritFamilier,SagesseLanguageDeLaNature,SagesseTraqueurExpert,SplendeurContactAppaisant,SplendeurDerniereParoles,SplendeurLumiereFoudroyante,SplendeurMainsGuerisseuses,SplendeurSoutien,ValeurANu,ValeurFrappePuissante,ValeurJeSuisVotreBouclier,ValeurPoussePuissante,ValeurPresenceIntimidante"
        .split(',').map(x=> require('@/assets/Daggerheart/Cartes/Domaines/' + x +'.png'));
    
    this.images = {ascendences, communautes, classes, sousClasses, domaines };
  },
  methods: {
    AddCards(){alert("Ce service n'est pas encore disponible.");}
  }
  };
  </script>