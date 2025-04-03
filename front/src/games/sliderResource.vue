<template>
    <div>
        <span class="absolute" style="width:90px;">
            {{ label }}
        </span>
        <v-slider hide-details class="absolute w100p h100p text-center" readonly max="12" style="left:95px" min="0"
            track-color="transparent" color="#546E7A" :value="valuemax" thumb-label="always">
            <template v-slot:thumb-label="">
                <span class="">max</span>
            </template>
        </v-slider>
        <v-slider v-if="value2 > 0" hide-details class="absolute w100p h100p" readonly max="12" style="left:95px"
            min="0" track-color="red" color="blue" :value="value1" thumb-label="always">
            <template v-slot:thumb-label="">
                <span class="colorBlack">
                    {{ value2 }} ex
                </span>
            </template>
        </v-slider>
        <v-slider hide-details class="absolute w100p h100p" readonly max="12" min="0"
            :track-color="value2 > 0 ? 'transparent' : 'red'" style="left:95px" color="yellow" :value="value1 - value2"
            thumb-label="always">
            <template v-slot:thumb-label="props">
                <span class="colorBlack">
                    {{ props.value }}
                </span>
            </template>
        </v-slider>
    </div>
</template>

<script>
export default {
    name: 'slider-resource',
    props: ['label', 'value1', 'value2', 'valuemax']
}
</script>