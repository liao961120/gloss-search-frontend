<template>
    <div class="outer">
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
        </div>

        <!-- Top Menu bar -->
        <v-app-bar app color="blue-grey lighten-4" min-width="330">
            <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
            <v-container>
                <v-alert v-if="webdb_url == ''" type="info" dense class="mt-3">
                    Please select a <strong>database</strong> on the left panel
                </v-alert>
                <v-row v-else justify="center" align="center">
                    <v-col cols="8" align-self="center">
                        <v-text-field
                            spellcheck="false"
                            placeholder="Enter anything (words, definitions, or translations)"
                            :value="search_lazy"
                            @change="v => search_lazy = v"
                            outlined
                            dense
                            class="mt-6"
                        />
                    </v-col>
                    <v-col>
                        <v-btn small fab right>
                            <v-icon>mdi-magnify</v-icon>
                        </v-btn>
                    </v-col>
                </v-row>
            </v-container>
        </v-app-bar>

        <!-- Left drawer -->
        <v-navigation-drawer width="268" v-model="drawer" app>
            <v-list dense>

                <v-list-item two-line class="mb-2">
                    <v-list-item-avatar>
                        <img src="https://rlads2019.github.io/14/ntugil.png">
                    </v-list-item-avatar>

                    <v-list-item-content>
                    <v-list-item-title>Gloss Search</v-list-item-title>
                    <v-list-item-subtitle class="text-overline">南島語料搜尋</v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>
                <v-divider></v-divider>

                <v-list-item link router to="/">
                    <v-list-item-action>
                        <v-icon>mdi-magnify</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title>Search</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>

                <v-list-item link router to="/lexicon">
                    <v-list-item-action>
                        <v-icon>mdi-translate</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title>Lexicon</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>

                <v-list-item href="" target="_blank" >
                    <v-list-item-action>
                        <v-icon>mdi-text-box-multiple</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title>User Guide</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>

                <v-list-item>
                    <v-list-item-action>
                        <v-icon>mdi-database-sync</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-select
                            :items="databases"
                            v-model="webdb_url"
                            outlined
                            dense
                            class="mt-6 px-0"
                            label="Database"
                        ></v-select>
                    </v-list-item-content>
                </v-list-item>
            </v-list>

        <v-footer absolute color="transparent" height="35" class="py-0">
            <v-col
                class="text-center text-caption text--secondary"
                cols="12"
            >
                Maintained by
                <a href="https://yongfu.name" target="_blank" class="blue-grey--text text-decoration-none font-weight-medium">
                    Yongfu Liao
                </a>
            </v-col>
        </v-footer>

        </v-navigation-drawer>

    </div>
</template>

<script>
    export default {
        data() {
            return {
                search: '',
                words: [],
                webdb_url: '',
                drawer: null,
                databases: [
                    {
                        text: "霧台魯凱 (2020)",
                        value: "https://yongfu.name/gloss-search/2020_Budai_Rukai/glossary.json"
                    }],
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
            },
            search_lazy: {
                get() {
                    return this.search;
                },
                set(v) {
                    this.search = v;
                }
            },
        },
        watch: {
            webdb_url: function() {
                this.$http.get(this.webdb_url).then(function(data) {
                    this.words = data.body;
                });
            }
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