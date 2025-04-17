<template>
    <div class="bg2 h100p">
        <menu-bar-gundam>
        </menu-bar-gundam>
        <h1>Gundam</h1>
        <div class="p5px bg">
            <p class="m5px">
                Mobile Suit Gundam (機動戦士ガンダム, Kidō senshi Gandamu?), ou plus simplement Gundam (ガンダム?), est une franchise d’animation japonaise créée par Yoshiyuki Tomino et Hajime Yatate pour le studio Sunrise en 1979. Appartenant au genre mecha, elle présente divers éléments classiques de la science-fiction — guerres spatiales, univers scientifiquement avancé — mais innove par sa volonté de réalisme, aussi bien à travers la narration qu’à travers les éléments technologiques. 
            </p>
        </div>

        <div class="flex flex-wrap flex-space-around m5px w100p">
            <a href="https://docs.google.com/presentation/d/13EMZDLqcDxfhsLHIzuKSSBsFIvNwjc2QLpWlew3B8Bk/edit?usp=drive_link">
                <button-big 
                    text="Encyclopédie Gundam"
                    :image="require('@/assets/Gundam/EncyclopedieGundam.png')">
                </button-big>
            </a>
            <router-link to="/gundamTcg">
                <button-big 
                    text="Gundam TCG"
                    :image="require('@/assets/Gundam/CardsGundam.png')">
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
import menuBarGundam from '../../components/menuBarGundam';
import buttonBig from '../../components/buttonBig';

  export default {
  name: 'pageGundamIndex',
  components: {menuBarGundam, buttonBig},
  data: () => ({ }),
  mounted(){},
  methods: { }
  };
  </script>