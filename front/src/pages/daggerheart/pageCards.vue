<template>
    <div v-if="images">
        <menu-bar-daggerheart>
        </menu-bar-daggerheart>
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
        <h1></h1>
        <h2>Autre</h2>
        <div class="flex flex-wrap bg2">
            <img style="width:150px; object-fit:cover" v-for="(image, index) in images.others" :key="'other' + index"
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
import menuBarDaggerheart from '../../components/menuBarDaggerheart';

  export default {
  name: 'pageDaggerheartCards',
  components: {menuBarDaggerheart},
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

    const others = "other/CardAncestry.png,other/CardClass.png,other/CardCommunity.png,other/CardDomain.png,other/cost.webp,ancestry/clank.jpg,ancestry/drakona.jpg,ancestry/dwarf.jpg,ancestry/elf.jpg,ancestry/faerie.jpg,ancestry/faun.jpg,ancestry/firbolg.jpg,ancestry/fungril.jpg,ancestry/galapa.jpg,ancestry/giant.jpg,ancestry/goblin.jpg,ancestry/halfling.jpg,ancestry/human.jpg,ancestry/inferis.jpg,ancestry/katari.jpg,ancestry/orc.jpg,ancestry/ribbet.jpg,ancestry/simiah.jpg,community/highborne.jpg,community/loreborne.jpg,community/orderborne.jpg,community/ridgeborne.jpg,community/seaborne.jpg,community/slyborne.jpg,community/underborne.jpg,community/wanderborne.jpg,community/wildborne.jpg,class/bard.jpg,class/druid.jpg,class/guardian.jpg,class/ranger.jpg,class/rogue.jpg,class/seraph.jpg,class/sorcerer.jpg,class/warrior.jpg,class/wizard.jpg,class/bard-banner.webp,class/druid-banner.webp,class/guardian-banner.webp,class/ranger-banner.webp,class/rogue-banner.webp,class/seraph-banner.webp,class/sorcerer-banner.webp,class/warrior-banner.webp,class/wizard-banner.webp,domain/banner-arcana.webp,domain/banner-blade.webp,domain/banner-bone.webp,domain/banner-codex.webp,domain/banner-grace.webp,domain/banner-midnight.webp,domain/banner-sage.webp,domain/banner-splendor.webp,domain/banner-valor.webp,domain/banner-empty.png,domain/logo-arcana.webp,domain/logo-blade.webp,domain/logo-bone.webp,domain/logo-codex.webp,domain/logo-grace.webp,domain/logo-midnight.webp,domain/logo-sage.webp,domain/logo-splendor.webp,domain/logo-valor.webp,domain/arcana.jpg,domain/blade.jpg,domain/bone.jpg,domain/codex.jpg,domain/grace.jpg,domain/midnight.jpg,domain/sage.jpg,domain/splendor.jpg,domain/valor.jpg"
        .split(',').map(x=> require('@/assets/Daggerheart/' + x ));
    
    this.images = {ascendences, communautes, classes, sousClasses, domaines, others };
  },
  methods: {
    AddCards(){alert("Ce service n'est pas encore disponible.");}
  }
  };
  </script>