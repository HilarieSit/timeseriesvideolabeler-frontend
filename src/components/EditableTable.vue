<template>
    <div class="table-responsive">
        <b-table class="b-table table-dark table-striped table-bordered" :items="tablestates" :fields="fields" fixed>
            <template v-for="field in editableFields" v-slot:[`cell(${field.key})`]="{ item }">
                <b-input @blur="onBlur(item.id, $event)" v-model="item[field.key]" v-bind:key="field.key" v-if="field.type === 'text'"/>
                <div v-bind:key="field.key" v-if="field.type === 'edit'">
                    <b-button class="delete-button" variant="danger" @click="deleteState(item.id)">Remove</b-button>
                </div>
            </template>
        </b-table>
      </div>
</template>

<script>
export default {
  name: "EditableTable",
  components: {},
  props: {
    states: Array
  },
  computed: {
    editableFields() {
      return this.fields.filter(field => (field.editable || field.type == "edit"))
    }
  },
  data(){
      return {
          fields: [
        {
          key: "start",
          label: "Start Time",
          type: "text",
          editable: false,
          class: "ub-col",
        },
        {
          key: "end",
          label: "End Time",
          type: "text",
          editable: false,
          class: "ub-col",
        },
        {
          key: "frames",
          label: "Frames",
          type: "text",
          editable: false,
          class: "ub-col",
        },
        {
          key: "name",
          label: "Label",
          type: "text",
          editable: true,
          class: "name-col",
        },
        { 
          key: "edit", 
          label: "",
          type: "edit", 
          class: "del-col",}
      ],
      tablestates: []
    };
  },
  watch: { 
    states: function(newVal) {
      this.tablestates = newVal;
    },
  },
  methods: {
    deleteState(index) {
        this.$emit('deleteState', index);
    },
    onBlur(id, event){
        this.$emit('editState', {
            id: id,
            value: event.target.value
        });
    }
  }
};
</script>

<style>
</style>