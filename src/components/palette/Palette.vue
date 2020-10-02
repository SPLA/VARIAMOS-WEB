<template>
  <div>  
      <paletteItem v-for="item in items" :label="item.label" :image="item.image" />  
  </div>
</template>

<script>
import paletteItem from "./PaletteItem"

export default {
  name: "palette",
  props: {
    name: String,
    label: String,
    items: [],
  },
  components: {
    paletteItem
  },
  data() {
    return {
      label: props.label,
      items: props.items,
    };
  },
  methods: {
    test(img) {
      this.$refs.putImageHere.appendChild(img);
    },
    test2(){
        alert("hola mundo");
    }
  },
};
</script>
