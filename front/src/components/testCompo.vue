<template>
  <v-data-table
    :headers="headers"
    :items="items"
    item-value="id"
    show-select
    v-model="selectedItems"
  >
    <template v-slot:item="{ item }">
      <tr @click="toggleSelect(item)" :class="{ 'selected-row': isSelected(item) }">
        <td>
          <v-simple-checkbox
            :value="isSelected(item)"
          ></v-simple-checkbox>
        </td>
        <td>{{ item.name }}</td>
        <td>{{ item.age }}</td>
      </tr>
    </template>
  </v-data-table>
</template>

<script>
export default {
  data() {
    return {
      headers: [
        { text: 'Name', value: 'name' },
        { text: 'Age', value: 'age' }
      ],
      items: [
        { id: 1, name: 'John Doe', age: 25 },
        { id: 2, name: 'Jane Smith', age: 30 },
        { id: 3, name: 'Paul Brown', age: 28 }
      ],
      selectedItems: []  // Contient les lignes sélectionnées
    };
  },
  methods: {
    isSelected(item) {
      return this.selectedItems.includes(item);
    },
    toggleSelect(item) {
      const index = this.selectedItems.indexOf(item);
      if (index > -1) {
        this.selectedItems.splice(index, 1);
      } else {
        this.selectedItems.push(item);
      }
    }
  }
};
</script>

<style scoped>
.selected-row {
  background-color: #E0F7FA !important;
  color: #00796B !important;
}
</style>
