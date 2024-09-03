<template>

  <v-card>
    <v-card-title class="bg2">
      {{title}}
      <v-spacer></v-spacer>
      <v-text-field v-model="search" label="Recherche" single-line hide-details></v-text-field>
    </v-card-title>
    <v-data-table :headers="headers" :items="items" item-value="id" v-model="selectedItems"
      :search="search" :items-per-page="55" hide-default-footer>
      <template v-slot:item="{ item }">
        <tr @click="toggleSelect(item)" :class="{ 'selected-row': isSelected(item) }">
          <td v-for="(obj, index) in headers" :key="'property' + index" v-html="item[obj.value]"
            :style="{ color: getColor(index, item.id) }">
          </td>
        </tr>
      </template>
    </v-data-table>
  </v-card>
</template>

<style>
.v-label theme--light{color:white;}
</style>

<script>
export default {
  name: 'data-table-selection',
  props: ['headers', 'items', 'highlights', 'title'],
  data() {
    return {
      selectedItems: [],
      search: '',
    };
  },
  methods: {
    isSelected(item) {
      return this.selectedItems.includes(item);
    },
    getColor(index, value) {
      return index == 0 && this.highlights && this.highlights.includes(value) ? '#FF8F00' : '';
    },
    toggleSelect(item) {
      const index = this.selectedItems.indexOf(item);
      if (index > -1) {
        this.selectedItems.splice(index, 1);
      } else {
        this.selectedItems.push(item);
      }
      this.$emit('onSelectionChange', { item, isAdd: index > -1 });
    }
  }
};
</script>

<style scoped>
.selected-row {
  background-color: #FFF59D !important;

}
</style>