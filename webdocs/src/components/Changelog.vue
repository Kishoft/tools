<template>
  <fieldset>
    <legend>{{ timestamp }}</legend>
    <ul>
        <slot></slot>
    </ul>
  </fieldset>
</template>

<script>
export default {
  props: {
    timestamp: {
      type: String,
      required: true
    }
  }
}
</script>

<style>
</style>
