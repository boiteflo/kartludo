<template>
    <card-medium :background="require('@/assets/Daggerheart/template/CardCharacter.png')" 
        :image="character.image"
        :class="{ cursorPointer: true, m5px: true }" 
        @click="$emit('click', character)"
        :image_position="image_position">
        <div class="text textCenter rl5px colorWhite" style="top:198px"><b>{{ character.class.name }}</b></div>
        <div class="text textCenter rl5px"
            style="top:216px; font-size: 28px; font-weight: bold; text-transform: capitalize;"><b>{{ character.name
                }}</b></div>
        <div class="text" style="top: 15px; left: 27px; font-size:20px">
            {{ character.agilite  }}<br>
            {{ character.force  }}<br>
            {{ character.finesse  }}<br>
            {{ character.instinct  }}<br>
            {{ character.presence  }}<br>
            {{ character.savoir  }}<br>
        </div>
        <div class="text l5px" style="top:248px; font-size: 20px;">
            <p class="textCenter rl5px">
                {{ camelCase(character.ancestry.name) }}  {{ character.community.name }}
                <br>
                {{ getSubClassName(character.subclass.name) }}
                <br>
                <table style="width:335px">
                    <tr>
                        <td style="text-align: center;"><b>Evasion</b> {{ character.class.evasion  }} </td>
                        <td style="text-align: center;"> <b>Seuils</b> {{ character.class.seuilMajeur  }}/{{ character.class.seuilSevere  }}</td>
                    </tr>
                    <tr>
                        <td colspan="4"><b>Domains</b> {{ character.class.domains }}</td>
                    </tr>
                    <tr>
                        <td colspan="4"> <b>Expériences</b><br> {{ character.experience1 }} <br>{{ character.experience2 }}</td>
                    </tr>
                </table>
            </p>
        </div>
    </card-medium>
</template>


<script>
import cardMedium from './cardMedium';

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
