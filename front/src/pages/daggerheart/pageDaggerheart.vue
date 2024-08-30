<template>
    <div class="bg2 h100p">
        <menu-bar-daggerheart>
        </menu-bar-daggerheart>
        <h1>Daggerheart</h1>
        <div class="p5px bg">
            <p class="m5px">
                Daggerheart est un jeu de rôle collaboratif se déroulant dans un monde de haute fantaisie ; un lieu de
                magie incroyable et d'aventures périlleuses. Au cours d'une campagne, vous pourriez vous retrouver à
                côtoyer des nobles pour tenter de stopper un complot d'assassinat, à explorer un ancien donjon pour
                empêcher une puissante créature de s'échapper et de libérer son pouvoir, à naviguer à travers un vaste
                océan pour affronter un terrifiant monstre marin, ou à protéger un précieux artefact pour qu'il ne tombe
                pas entre les mains d'un ennemi dangereux. Peu importe l'aventure que votre groupe choisit
                d'entreprendre, Daggerheart fournit les outils nécessaires pour raconter une histoire à la fois
                émouvante et épique.
            </p>
        </div>

        <div class="flex flex-responsive flex-space-around m5px">
            <router-link to="/character">
                <button-big 
                    text="Créer un personnage"
                    :image="require('@/assets/Daggerheart/other/character.png')">
                </button-big>
            </router-link>
            <router-link to="/cards">
                <button-big 
                    text="Voir toutes les cartes"
                    :image="require('@/assets/Daggerheart/other/cards.png')">
                </button-big>
            </router-link>
            <router-link to="/template">
                <button-big 
                    text="Créer des cartes"
                    :image="require('@/assets/Daggerheart/other/multipleCards.png')">
                </button-big>
            </router-link>
            <router-link to="/fight">
                <button-big 
                    text="Simuler un combat"
                    :image="require('@/assets/Daggerheart/other/fight.png')">
                </button-big>
            </router-link>
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
import buttonBig from '../../components/buttonBig';

  export default {
  name: 'pageDaggerheart',
  components: {menuBarDaggerheart, buttonBig},
  data: () => ({ }),
  mounted(){},
  methods: { }
  };
  </script>