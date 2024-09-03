<template>
    <card-medium :background="require('@/assets/Daggerheart/template/CardSousClass.png')" 
        :image="character.image"
        :class="{ cursorPointer: true, m5px: true }" 
        @click="$emit('click', character)"
        :image_position="image_position">
        <div class="text textCenter rl5px colorWhite" style="top:198px"><b>{{ character.class.name }}</b></div>
        <div class="text textCenter rl5px"
            style="top:216px; font-size: 28px; font-weight: bold; text-transform: capitalize;"><b>{{ character.name
                }}</b></div>
        <div class="text l5px" style="top:248px; font-size: 20px;">
            <p class="textCenter rl5px">
                {{ camelCase(character.ancestry.name) }}  {{ character.community.name }}
                <br>
                {{ getSubClassName(character.subclass.name) }}
                <br>
                <table class="w100p">
                    <tr>
                        <td style="text-align: center; min-width: 75px;"> {{ character.agilite  }} </td><td style="text-align: left;"><b>Agilité</b></td>
                        <td style="text-align: center; min-width: 75px;"> {{ character.instinct  }} </td><td style="text-align: left;"><b>Instinct</b></td>
                    </tr>
                    <tr>
                        <td style="text-align: center;"> {{ character.force  }} </td><td style="text-align: left;"><b>Force</b></td>
                        <td style="text-align: center;"> {{ character.presence  }} </td><td style="text-align: left;"><b>Présence</b></td>
                    </tr>
                    <tr>
                        <td style="text-align: center;"> {{ character.finesse  }} </td><td style="text-align: left;"><b>Finesse</b></td>
                        <td style="text-align: center;"> {{ character.savoir  }} </td><td style="text-align: left;"><b>Savoir</b></td>
                    </tr>
                    <tr>
                        <td style="text-align: center;"> {{ character.class.evasion  }} </td><td style="text-align: left;"><b>Evasion</b></td>
                        <td style="text-align: center;"> {{ character.class.seuilMajeur  }}/{{ character.class.seuilSevere  }} </td><td style="text-align: left;"><b>Seuils</b></td>
                    </tr>
                    <tr>
                        <td colspan="4"><b>Domains</b> {{ character.class.domains }}</td>
                    </tr>
                </table>
            </p>
        </div>
    </card-medium>
</template>


<script>
import cardMedium from './cardMedium';
/*
text font-weight:bold font-size:14px top:200px left:120px right:120px text-align:center color:white text-transform:uppercase
text font-weight:bold font-size:20px top:220px left:15px right:15px text-transform:uppercase text-align:center
text color:black font-size:10px top:250px left:15px right:15px
text bottom:5px font-size:11px text-align:center left:15px right:15px font-weight:bold
*/

export default {
    props: ['character', 'image_position'],
    components: { cardMedium },
    methods : {
        camelCase(text){return text[0].toUpperCase() + text.substring(1)},
        getSubClassName(text){
            const uppercaseIndex = text.split("").map((x,i)=> x == x.toUpperCase() ? i : -1).filter(x=> x>0);
            if(uppercaseIndex.length == 1) return text.slice(uppercaseIndex[0]);
            let actual = uppercaseIndex.shift();
            let result = [];
            while(uppercaseIndex.length > 0){
                const nextOne = uppercaseIndex.shift();
                result.push(text.slice(actual, nextOne));
                actual = nextOne;
            }
            result.push(text.slice(actual));
            return result.join(" ");
        }
    }
}
</script>
