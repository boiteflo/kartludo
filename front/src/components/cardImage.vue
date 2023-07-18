<template>
    <div class="m5px" style="position:relative">
        <div style="position:absolute; top:-5px; right:-5px;">
            <div class="">
                <div v-if="!badgeoff && card.Limit" class="s25" style="color:red; text-align:center; font-style:bold; border-radius:15px; background:black; outline: 5px solid red">
                    {{card.Limit}}
                </div>
                <div v-for="friend in card.LimitFriendsCards" v-bind:key="card.Id + 'Sub' + friend.Id + friend.RefId">
                    <img class="w25" :src="friend.Image" style="outline: 2px solid red; margin-top:8px" />
                </div>
            </div>
        </div>
        <img class="w150" :src="card.Image"/>
    </div>
</template>

<script>
  export default {
    name: 'card-image',
    props: ['card', 'badgeoff']
  }
</script>
