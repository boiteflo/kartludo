<template>
    <div>
        <h1>Les Salons</h1>

        <!-- Salons -->
        <div class="flex-wrap p5px bg" style="top:0px; right:0px">
          <v-btn text @click="selectSalon('help')" :class="{bgWhite:salon=='help', bg2:salon!='help', m5px:true}">
            <v-icon>mdi-help</v-icon> Aide
          </v-btn>
          <v-btn text @click="selectSalon('Temp')" :class="{bgWhite:salon=='Temp', bg2:salon!='Temp', m5px:true}">
            <v-icon>mdi-cube</v-icon> Salon Temporaire
          </v-btn>
          <v-btn v-for="fight in fights" :key="'Salon' + fight.id" text @click="selectSalon(fight.id)" 
            :class="{bgWhite:salon==fight.id, bg2:salon!=fight.id, m5px:true}">
            <v-icon>mdi-cube</v-icon> Salon {{ fight.id+1 }}
          </v-btn>
        </div>
       
        <div v-if="salon == 'help'">
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
            -- aziel pv:20 shield:30
            </pre>
          <br>
          
          <h1>Exemple Pathfinder 2</h1>
          <pre>
            <b>Aziel Niveau 4</b>
            Il a 39PV, une classe d'armure de 20, des jets de sauvegardes réflexes: +9, vigueur +8, volonté +12 et un bouclier ayant 32pv
            Il attaque avec un javelot boomerang qui inflige 2d6+1 dégats avec une première attaque a +9, une seconde a +4 et une dernière a -1.
            Il possède un sort d'arc électrique qui impose un jet de réflexe basique DD 19 et inflige 2d4 dégats et un sort de morsure du froid qui impose un jet de vigueur basique DD 19 qui inflige 2d6+3 dégats

            Voici les différentes commandes :
            <b>Définir le personnage</b>
            set aziel pv 39 bouclier 32 ca 20 ref 1d20+9 vig 1d20+8 vol 1d20+12
            
            <b>Effectuer trois attaques le même tour contre un loup. La première a +9, la seconde a +4 et la dernière a -1</b>
            attack loup 1d20+9 ca 2d6+1 pv Javelot 1 
            attack loup 1d20+4 ca 2d6+1 pv Javelot 2
            attack loup 1d20-1 ca 2d6+1 pv Javelot 3

            Remarque : Il est possible d'écrire les trois commandes en une seul ligne avec la virgule en guise de séparateur
            attack loup 1d20+9 ca 2d6+1 pv Javelot 1, attack loup 1d20+4 ca 2d6+1 pv Javelot 2, attack loup 1d20-1 ca 2d6+1 pv Javelot 3
            
            <b>Parer avec son bouclier</b>
            add aziel pv 5 bouclier -5

            <b>Faire une attaque de sort sur le loup</b>
            spell loup 19 ref 2d4 pv Arc électrique 
            spell loup 19 vig 2d6+3 pv Morsure du froid 
            </pre>
          <br>
        </div>
        <div v-else>
          <div class="bg p5px" v-if="salon =='Temp'">Les données de ce salon ne sont pas sauvegardées.</div>

          <!-- Creatures -->
          <div class="flex-wrap p5px bg" style="top:0px; right:0px">
            <v-btn v-for="creature in fight.creatures" :key="'Creature' + creature.name" text class="bg2 m5px">
              {{ toCreatureString(creature) }} 
            </v-btn> 
          </div>
          <br>   
          
          <!-- Historique -->
          <div class="m5px">
              <pre>{{ fight.history }}</pre>
          </div>
          <br>
          
          <!-- Commande -->
          <div style="color:white">
            <div class="flex-wrap p5px" style="top:0px; right:0px">
              <v-btn v-for="com in commands" :key="'Command' + com.id" text @click="selectCommand(com.value)" class="bg2 m5px">
                {{ com.id }}
              </v-btn>
            </div>
              <v-text-field class="flex-grow m5px"
                          hide-details
                          v-model="command"
                          label="Écrire une commande et appuyer sur entrer"
                          @keydown.enter="applyCommand('')">
              </v-text-field>
          </div>
        </div>
    </div>
</template>

<script>
import ServiceFight from '../services/serviceFight'
import ServiceBack from '../services/serviceBack'
//import { io } from "socket.io-client";


export default {
  name: 'pageClub',
  components: {},
  data: () => ({
    command : "",
    history : "",
    fights:null,
    salon:'help',
    fight:null,
    fightTemp: {creatures:[], history:"Start of the channel Temp"},
    commands: [
      {id:'set', value:'set aziel pv 20 shield 32 ca 19 ref 1d20+8 vig 1d20+8 vol 1d20+12'},
      {id:'show', value:'show aziel pv shield'},
      {id:'add', value:'add aziel pv 5 shield -5'},
      {id:'attack', value:'attack aziel 1d20+5 ca 1d8+3 pv Attaque de javelot'},
      {id:'spell', value:'spell aziel 18 ref 3d4 pv Arc électrique'},
    ]
  }),
  mounted(){
    ServiceBack.getAll('fight').then(result => {
      this.fights = result;
    });
    /*
    var socket = io("http://localhost:5000");
    socket.on('connect', function() {
      console.log('connected to server');
    });
    socket.on('disconnect', function() {
      console.log('disconnected from server');
    });
    */
  },
  methods: {
    selectSalon(salonSelected){
      this.salon = salonSelected;
      if(this.salon == 'help')
        return;

      this.fight = this.salon == "Temp" ? this.fightTemp : this.fights[salonSelected];

    },
    applyCommand(commandText){
      const command = commandText ? commandText : this.command;

        if(this.salon == "Temp"){
          const result = ServiceFight.handleAllCommand(command, this.fightTemp.creatures);
          this.fight.history += '\n' + result;
        }
        else{
          ServiceBack.insert('fight', {id:this.fight.id, commands:command}).then(result=> {
            this.fight = result.data;
          });
        }

        this.command= "";
    },
    selectCommand(value){
      this.command += value;
    },
    toCreatureString(creature){
      return creature.name + " " + Object.keys(creature).filter(x=>x!='name').map(x => x + ":" + creature[x]).join(" ");
    }
  }
};
</script>