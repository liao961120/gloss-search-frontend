<template>
    <div class="container">
        <div v-for="(word, i) in words" class="grid-item" :key="i + word">
            <h3>{{ word[0] }}</h3>

            <ul>
                <li class="tooltip" v-for="(sense, j) in Object.keys(word[1])" :key="j + sense">
                    {{ sense }}
                    <span class="tooltiptext">{{ word[1][sense].join('\n') }}</span>
                </li>
            </ul>
        </div>

        <router-link class="router" to="/" title="interlinear gloss">🔍</router-link>
    </div>
        
</template>

<script>
    export default {
        data() {
            return {
                words: [],
                webdb_url: 'https://yongfu.name/gloss-search/2020_Budai_Rukai/glossary.json',
            }
        },
        created: function () {
            this.$http.get(this.webdb_url).then(function(data) {
                this.words = data.body;
            });
        },
    }
</script>

<style scoped>
/* Tooltip container */
.tooltip {
  position: relative;
  /*display: inline-block;*/
}

/* Tooltip text */
.tooltip .tooltiptext {
  visibility: hidden;
  background-color: #595959;
  color: #fff;
  text-align: center;
  padding: 5px 3px;
  border-radius: 6px;
  font-size: 0.75em;
 
  /* Position the tooltip text - see examples below! */
  position: absolute;
  z-index: 1;
}

/* Show the tooltip text when you mouse over the tooltip container */
.tooltip:hover .tooltiptext {
  visibility: visible;
}

ul {
    list-style-type: none;
    padding-left: 0;
    font-size: 0.8em;
}
h3 {
    padding-top: 0;
    margin-top: 0;
}
div.container {
    display: grid;
    grid-template-columns: 33% 33% 33%;
    grid-column-gap: 1%;
    grid-row-gap: 10px;
    width: 95%;
    margin: 10px auto;
    text-align: left;
}
.grid-item {
    /*display: inline-block;*/
    /*width: 35%;*/
    min-height: 125px;
    border: 1.5px solid rgba(100, 100, 100, 0.6);
    border-radius: 7px;
    /*margin: 10px 4%;*/
    padding: 1%;
    /*border: 1px solid;*/
}
.router {
    position: absolute;
    right: 1%;
    top: 1%;
    font-size: 0.8em;
    color: blue;
    font-weight: bold;
    text-decoration: none;
    color: #d96900;
}
.router:hover {
    font-size: 0.83em;
}
</style>