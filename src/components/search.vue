<template>
    <div>
        <div class="results">
            <template v-if="database == 0">
                <template v-for="(res, i) in filtered_results">
                    <Leipzig v-bind:gloss="res" v-bind:query="query" :key="i" />
                </template>
            </template>
            <template v-else>
                <template v-for="(res, i) in vue_seach_results">
                    <Leipzig v-bind:gloss="res" v-bind:query="query" v-bind:showplaintext="false" :key="i" />
                </template>
            </template>
        </div>
        <Travis v-if="database == 1"/>

        <!-- Top Menu bar -->
        <v-app-bar app color="blue-grey lighten-4" min-width="330">
            <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
            <v-row justify="center" align="center">
                <v-col>
                    <v-text-field
                        spellcheck="false"
                        placeholder="Search patterns"
                        :value="query_lazy"
                        @change="v => query_lazy = v"
                        outlined
                        dense
                        class="mt-6"
                    />
                </v-col>

                <v-col>
                    <v-text-field
                        spellcheck="false"
                        placeholder="docx filter"
                        v-model.lazy="docfilter"
                        outlined
                        dense
                        class="mt-6"
                    />
                </v-col>

                <v-spacer class="d-none d-md-flex mr-5"></v-spacer>

                <v-col class="d-none d-sm-flex">
                    <v-select
                        :items="querytypes"
                        v-model="query.type"
                        dense
                        class="mt-6 px-0"
                        outlined
                        label="Search Mode"
                    ></v-select>
                </v-col>

                <v-col class="d-none d-sm-flex mr-3" sm="2" lg="1">
                    <v-switch
                        v-model="query.regex"
                        value="1"
                        :true-value="1"
                        :false-value="0"
                        :label="(query.regex == '1' ? 'RegEx' : 'Exact')"
                        inset dense
                        class="mt-4" color="success"
                    ></v-switch>
                </v-col>

                <v-col class="mr-5 pr-5" cols="1">
                    <template v-if="database == 0">
                        <v-btn small fab v-on:click="searchGloss">
                            <v-badge
                                v-if="results.length > 0"
                                color="green"
                                :content="results.length"
                            >
                                <v-icon>mdi-magnify</v-icon>
                            </v-badge>
                            <v-icon v-else>mdi-magnify</v-icon>
                        </v-btn>
                    </template>
                    <template v-else>
                        <v-btn small fab>
                            <v-badge
                                v-if="vue_seach_results.length > 0"
                                color="green"
                                :content="vue_seach_results.length"
                            >
                                <v-icon>mdi-magnify</v-icon>
                            </v-badge>
                            <v-icon v-else>mdi-magnify</v-icon>
                        </v-btn>
                    </template>
                </v-col>
            </v-row>
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

                <v-divider></v-divider>
                <v-subheader class="pb-0 mb-0">Data</v-subheader>

                <v-list-item link v-on:click="showTravisModal">
                    <v-list-item-action>
                        <v-icon>mdi-update</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title>Data Update</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>

                <v-list-item>
                    <v-list-item-action>
                        <v-icon>mdi-database-sync</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-select
                            :items="databases"
                            v-model="database"
                            outlined
                            dense
                            class="mt-6 px-0"
                            label="Database"
                        ></v-select>
                    </v-list-item-content>
                </v-list-item>

                <v-divider></v-divider>
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
import Leipzig from "@/components/Leipzig.vue";
import Travis from "@/components/travis.vue";
// @ is an alias to /src

export default {
    name: "gloss-search",
    components: {
        Leipzig,
        Travis
    },
    data() {
        return {
            travis: false,
            drawer: null,
            databases: [
                {
                    text: "霧台魯凱 (2020)",
                    value: "https://yongfu.name/gloss-search/2020_Budai_Rukai/data.json",
                },
                {
                    text: "Local",
                    value: 0  // Must be set to 0 for Vue logic
                }
            ],
            querytypes: [
                {
                    text: "Original",
                    value: "ori"
                },
                {
                    text: "Gloss",
                    value: "gloss"
                },
                {
                    text: "Notes",
                    value: "free"
                }
            ],
            query: {
                query: "",
                regex: 1,
                type: "gloss"
            },
            database: "https://yongfu.name/gloss-search/2020_Budai_Rukai/data.json",
            results: [],
            docfilter: ""
        };
    },
    computed: {
        query_lazy: {
            get() {
                return this.query.query;
            },
            set(v) {
                this.query.query = v;
            }
        },
        filtered_results: function() {
            if (this.docfilter == "") return this.results;
            var doc_pat = RegExp(`${this.docfilter}`);

            if (this.results.length > 0)
                return this.results.filter(gloss => {
                    return doc_pat.test(gloss.file);
                });
            else return this.results;
        },

        vue_seach_results: function() {
            if (this.query.query.trim() == "") return []; //this.results; //

            const results = this.filtered_results;
            const search_pats = this.query.query.trim().split(/\s*,\s*/);
            const search_pats_regex = search_pats.map(x => RegExp(x));

            var search_results = [];
            for (var i = 0; i < results.length; i++) {
                // Gloss line contents
                var gloss_content = [
                    ...new Set(
                        results[i].gloss.flat().concat(results[i].ori.flat())
                    )
                ]; // an array
                var ori_str = results[i].ori.join(" ");

                // Search Ori (full line Regex match)
                if (this.query.type == "ori") {
                    // Exact search
                    if (this.query.regex == 0) {
                        if (ori_str.includes(search_pats[0]))
                            search_results.push(results[i]);
                    }
                    // Regex search
                    else {
                        if (search_pats_regex[0].test(ori_str))
                            search_results.push(results[i]);
                    }

                    // Seach Gloss
                } else if (this.query.type == "gloss") {
                    var matchNum = 0;
                    for (let j = 0; j < search_pats.length; j++) {
                        // Exact search
                        if (this.query.regex == 0) {
                            let isMatch = gloss_content.some(
                                tk => tk == search_pats[j]
                            );
                            if (isMatch) matchNum++;
                            // Regex search
                        } else {
                            let isMatch = gloss_content.some(tk =>
                                search_pats_regex[j].test(tk)
                            );
                            if (isMatch) matchNum++;
                        }
                    }
                    if (matchNum == search_pats.length)
                        search_results.push(results[i]);

                    // Search Notes
                } else {
                    // Free line contents
                    var free_content = results[i].free.join(" "); // a string

                    // Exact search
                    if (this.query.regex == 0) {
                        if (
                            search_pats.every(pat => free_content.includes(pat))
                        )
                            search_results.push(results[i]);
                        // Regex search
                    } else {
                        if (
                            search_pats_regex.every(pat =>
                                pat.test(free_content)
                            )
                        )
                            search_results.push(results[i]);
                    }
                }
            }

            return search_results;
        }
    },
    created: function() {
        this.$http.get(this.database).then(function(data) {
            this.results = data.body;
        });
    },
    watch: {
        database: function() {
            if (this.database != 0) {
                this.$http.get(this.database).then(function(data) {
                    this.results = data.body;
                });
            } else {
                this.results = [];
            }
        }
    },
    methods: {
        searchGloss: function() {
            const url = `http://localhost:1420/query?query=${this.query.query}&regex=${this.query.regex}&type=${this.query.type}`;
            //clean up
            this.$http.get(url).then(function(data) {
                this.results = data.body;
                //this.files = [...new Set(data.body.map(x => x.file))];
            });
        },
        showTravisModal: function() {
            this.$modal.show("trigger-build");
        },
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.left {
    text-align: right;
}
.right {
    text-align: left;
}
.results {
    /* margin-top: 175px; */
    width: 100%;
    text-align: left;
    font-size: 1.18em;
}

.results > div {
    padding: 0.5em;
    border-radius: 10px;
    margin-bottom: 1em;
}

.results > div:nth-child(2n + 1) {
    background: rgba(197, 197, 197, 0.212);
    border: solid 2px white;
}
.results > div:nth-child(2n + 1):hover {
    background: rgba(223, 223, 223, 0.3);
    border: solid 2px rgba(197, 197, 197, 0.63);
}
.results > div:nth-child(2n) {
    border: solid 2px rgba(211, 211, 211, 0.452);
}
.results > div:nth-child(2n):hover {
    background: rgba(230, 230, 230, 0.171);
    border: solid 2px rgba(197, 197, 197, 0.63);
}
</style>
