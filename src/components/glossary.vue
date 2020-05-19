<template>
    <div class="outer">
        <div class="search-box">
            <input
                class="word-filter"
                type="text"
                spellcheck="false"
                placeholder="Enter anything (words, definitions, or translations)"
                v-model="search"
            />
        </div>
        <div class="grid">
            <div v-for="(word, i) in filtered_words" class="grid-item" :key="i + word">
                <h3>{{ word[0] }}</h3>

                <ul>
                    <li class="tooltip" v-for="(sense, j) in Object.keys(word[1])" :key="j + sense">
                        {{ sense }}
                        <span class="tooltiptext" v-html="word[1][sense].join('<br>')"></span>
                    </li>
                </ul>
            </div>
            <router-link class="router" to="/" title="interlinear gloss">🔍</router-link> 
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                search: '',
                words: [],
                webdb_url: 'https://yongfu.name/gloss-search/2020_Budai_Rukai/glossary.json',
            }
        },
        computed: {
            filtered_words: function() {
                if (this.search == '') return this.words 
                var pat = RegExp(`${this.search}`);

                if (this.words.length > 0)
                    return this.words.filter(word => {
                        return word[2].some( tk => pat.test(tk) );
                    })
                else 
                    return this.words
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
.search-box {
    position: fixed;
    width: 100%;
    top: 0;
    left: 0;
    height: 30px;
    padding: 15px 0;
    margin: 0;
    background-color: rgba(255, 255, 255, 0.898);
    z-index: 2;
}
input.word-filter {
    position: relative;
    display: inline-block;
    width: 91%;
    max-width: 500px;
    font-size: 0.75em;
    padding-left: 0.1em;
    font-family: Monaco, "Courier New", Courier, monospace;
}

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
  padding: 5px 6px;
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
div.outer {
    max-width: 100% !important;
    overflow-x: hidden !important;
}
div.grid {
    display: grid;
    grid-template-columns: 33% 33% 33%;
    grid-column-gap: 1%;
    grid-row-gap: 10px;
    width: 90%;
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
</style>