<template>
    <div>
        <h1>Les Combats</h1>
        <div class="m5px">
            <pre>{{ history }}</pre>
        </div>
        <br>
       
        <div style="color:white">
            <v-text-field class="flex-grow m5px"
                        hide-details
                        v-model="command"
                        label="Écrire une commande et appuyer sur entrer"
                        @keydown.enter="applyCommand">
            </v-text-field>
        </div>
        <h1>Les Commandes</h1>
        <pre>
        Une valeur peut être un nombre (exemple: 12) ou un texte sans espace (TresGros) ou une formule (1d20+5*8/3-4)

        <b>Définir un personnage en lui donnant un nom et des valeurs.</b>
        <b>set</b> (nom du personnage) (propriété 1) (valeur 1) (propriété 2) (valeur 2) ...
        set aziel pv 20 shield 32 ca 19 ref 1d20+8 vig 1d20+8 vol 1d20+12 
        -- aziel have been updated

        <b>Attaquer un personnage</b>
        <b>attack</b> (nom de la victime) (formule pour toucher) (propriété de défense de la victime) (formule de dégat) (propriété de vie) (nom de l'attaque)
        attack aziel 1d20+5 ca 1d8+3 pv Attaque de javelot 
        -- Attack:1d20(15)+5=20 vs ca:19 ### the attack succeeded Damages:1d8(4)+3=7 aziel pv:20-7=13 ###
        
        <b>Attaquer un personnage avec un sort de défense</b>
        <b>spell</b> (nom de la victime) (DD pour toucher) (propriété de défense de la victime) (formule de dégat) (propriété de vie) (nom de l'attaque)
        spell aziel 18 ref 3d4 pv Arc électrique 
        -- Attack:18 vs ref:1d20(16)+8=24 ### The attack partially fails.  Damages:3d4(6)/2=3 aziel pv:13-3=10 ###
        
        <b>Augmenter la valeur de propriétés</b>
        <b>add</b> (nom du personnage) (propriété 1) (valeur 1) (propriété 2) (valeur 2) ...
        add aziel pv 10 shield -2 
        -- aziel pv 10+10=20 shield 32-2=30
        
        <b>Montrer les valeurs d'un personnage</b>
        <b>show</b> (nom du personnage) (propriété 1) (propriété 2) ...
        show aziel pv shield 
        -- aziel pv:20 shield:30</pre>
        <br>
    </div>
</template>


<script>
import ServiceFight from '../services/serviceFight'
import ServiceBack from '../services/serviceBack'

export default {
  name: 'pageClub',
  components: {},
  data: () => ({
    command : "",
    history : ""
  }),
  mounted(){
    ServiceBack.getAll('fight').then(result => {
      this.history = result;
    });
  },
  methods: {
    applyCommand(){
        const result = ServiceFight.handleAllCommand(this.command);
        this.history += '\n' + result;
        ServiceBack.insert('fight', {message:result});
    }
  }
};
</script>