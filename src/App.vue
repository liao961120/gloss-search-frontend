<template>
  <v-app id="inspire">

    <v-main>
      <v-container
        class="fill-height"
        fluid
      >
        <v-row
          align="center"
          class="mx-7 pa-0 full-width"
        >
            <keep-alive>
              <router-view></router-view>
            </keep-alive>
        </v-row>
      </v-container>
    </v-main>
    
    

        <a id="to-top" onclick="document.documentElement.scrollTop = 0;">▲</a>
        <a id="to-bottom" onclick="window.scrollTo(0, document.body.scrollHeight);">▼</a>
  </v-app>
</template>

<script>
  export default {
    props: {
      source: String,
    },
    data: () => ({
      drawer: null,
    }),
  }
</script>

<style>
html { overflow-y: scroll }
textarea {
    font-family: 'Monaco', 'Courier New', Courier, monospace !important;
}
a#to-top,
a#to-bottom {
    position: fixed;
    right: 0.6%;
    background: rgb(121, 121, 121);
    color: rgb(245, 245, 245);
    font-size: 19px;
    z-index: 10;
}
a#to-top:hover,
a#to-bottom:hover {
    background: rgb(88, 88, 88);
    color: white;
    font-size: 20px;
    cursor: pointer;
    user-select: none;
}
a#to-top {
    bottom: 40px;
}
a#to-bottom {
    bottom: 15px;
}
</style>