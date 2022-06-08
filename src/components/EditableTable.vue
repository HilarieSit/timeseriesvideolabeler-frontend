<template>
    <article>
        <b-table class="b-table table-dark table-striped" :items="tableItems" :fields="fields" fixed>
            <template v-for="(field, index) in fields" #[`cell(${field.key})`]="data">
                <b-form-input v-if="field.type === 'text' && tableItems[data.index].isEdit" :key="index" :value="tableItems[data.index][field.key]" @input="(value) => inputHandler(value, data.index, field.key)"></b-form-input>
                <div :key="index" v-else-if="field.type === 'edit'">
                    <b-button class="btn btn-info" @click="editRowHandler(data)">
                        <span v-if="!tableItems[data.index].isEdit">Edit</span>
                        <span v-else>Done</span>
                    </b-button>
                    <b-button class="delete-button" variant="danger" @click="removeRowHandler(data.index)">Remove</b-button>
                </div>
                <b-form-input v-else-if="field.type && tableItems[data.index].isEdit" :key="index" :type="field.type" :value="tableItems[data.index][field.key]" @blur="(e) => inputHandler(e.target.value, data.index, field.key)"></b-form-input>
                <span :key="index" v-else>{{data.tableItems}}</span>
            </template>
        </b-table>
    </article>
</template>

<script>
export default {
  name: "EditableTable",
  components: {},
  props: {
    value: Array,
    fields: Array
  },
  mounted(){
    console.log(this.value[0])
  },
  data() {
    return {
      tableItems: this.value.map(item => ({...item, isEdit: false, isSelected: false}))
    }
  },
  methods: {
        inputHandler(value, index, key) {
            this.tableItems[index][key] = value;
            this.$set(this.tableItems, index, this.tableItems[index]);
            this.$emit("input", this.tableItems);
        },
        editRowHandler(data) {
            this.tableItems[data.index].isEdit = !this.tableItems[data.index].isEdit;
            },
        removeRowHandler(index) {
            this.tableItems = this.tableItems.filter((item, i) => i !== index);
            this.$emit('input', this.tableItems);
            },
        selectRowHandler(data) {
            this.tableItems[data.index].isSelected = !this.tableItems[data.index].isSelected;
            }
    }
};
</script>

<style>
    .action-container {
        margin-bottom: 10px;
    }
    .action-container button {
        margin-right: 5px;
    }
    .delete-button {
        margin-left: 5px;
    }
</style>