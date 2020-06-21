<template>
    <v-app id="inspire">
        <v-main>
            <v-container class="fill-height" fluid>
                <v-row align="center" class="mx-7 pa-0 full-width">
                    <keep-alive>
                        <router-view></router-view>
                    </keep-alive>
                </v-row>
            </v-container>
        </v-main>

      <!-- Scroll to Top/Bottom -->
      <v-speed-dial v-model="nav" fixed bottom right>
        <template v-slot:activator>
          <v-btn v-model="nav" color="blue-grey" dark fab x-small>
            <v-icon v-if="nav">mdi-close</v-icon>
            <v-icon v-else>mdi-unfold-more-horizontal</v-icon>
          </v-btn>
        </template>
          <v-btn color="pink" dark small fab onclick="window.scrollTo(0, document.body.scrollHeight);">
              <v-icon>mdi-chevron-down</v-icon>
          </v-btn>
          <v-btn color="pink" dark small fab onclick="document.documentElement.scrollTop = 0;">
              <v-icon>mdi-chevron-up</v-icon>
          </v-btn>
      </v-speed-dial>
    </v-app>
</template>

<script>
export default {
    props: {
        source: String
    },
    data: () => ({
        drawer: null,
        nav: false,
    })
};
</script>

<style>
html {
    overflow-y: scroll;
    scroll-behavior: smooth !important;
}
textarea {
    font-family: "Monaco", "Courier New", Courier, monospace !important;
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