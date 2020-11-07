<template>
    <div v-scroll="handleScroll">
        <div class="results" :key="search_results_key">
            <template v-if="database == 0">
                <template v-for="(res, i) in filtered_results">
                    <Leipzig v-bind:gloss="res" v-bind:query="query" :key="i" />
                </template>
            </template>
            <template v-else>
                <template v-for="(res, i) in vue_seach_results_lazy">
                    <Leipzig v-bind:gloss="res" v-bind:query="query" v-bind:showplaintext="false" :key="i" />
                </template>
            </template>
        </div>
        <v-btn v-if="infscroll > 60" @click="infscroll += 15;" :disabled="vue_seach_results.length <= infscroll" x-small>Show More</v-btn>
        <Travis/>

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
                        :value="docfilter_lazy"
                        @change="v => docfilter_lazy = v"
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

                <v-col class="mr-7 pr-5" cols="1">
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
                                offset-x="8"
                                offset-y="8"
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

        <!-- Bottom Menu bar for mobile -->
        <v-bottom-navigation app grow height="54" color="blue-grey lighten-4" class="d-flex d-sm-none">
            <span class="ml-0 mr-8" style="width:32%">
                <v-select
                    :items="querytypes"
                    v-model="query.type"
                    dense
                    outlined
                    label="Search Mode"
                    class="mt-2 mx-0"
                ></v-select>
            </span>
            <span class="mr-0" style="width:32%">
                <v-switch
                    v-model="query.regex"
                    value="1"
                    :true-value="1"
                    :false-value="0"
                    :label="(query.regex == '1' ? 'RegEx' : 'Exact')"
                    inset dense
                    color="success"
                    class="mt-3"
                ></v-switch>
            </span>
            <span></span>
        </v-bottom-navigation>

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

                <v-divider></v-divider>
                <v-subheader class="pb-0 mb-0">Gloss Data</v-subheader>

                <v-list-item link v-on:click="showTravisModal">
                    <v-list-item-action>
                        <v-icon >mdi-update</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title>Data Update</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>

                <v-list-item>
                    <v-list-item-action>
                        <v-icon class="mb-6">mdi-database</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-select
                            :items="databases"
                            v-model="database"
                            outlined
                            dense
                            class="ma-0"
                            label="Database"
                        ></v-select>
                    </v-list-item-content>
                </v-list-item>

                <v-divider></v-divider>
                <v-subheader class="pb-0 mb-0">External Links</v-subheader>

                <v-list-item href="https://yongfu.name/docs-gloss-search" target="_blank" >
                    <v-list-item-action>
                        <v-icon>mdi-text-box-multiple</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title>User Guide</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>

                <v-list-item href="https://yongfu.name/gloss-search/2020_Budai_Rukai.log" target="_blank">
                    <v-list-item-action>
                        <v-icon>mdi-alert-decagram-outline</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title>Format Check</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>

                <v-divider></v-divider>
            </v-list>

            <!-- Footer -->
            <v-footer fixed color="blue-grey lighten-5" height="37.5">
                <v-row class="mt-n4">
                    <v-col cols="4">
                        <v-btn icon color="light-green darken-2" href="https://github.com/liao961120/gloss-search/" target="_blank">
                            <v-icon>mdi-github</v-icon>
                        </v-btn>
                    </v-col>

                    <v-col cols="4">
                        <v-btn icon color="deep-orange lighten-2" href="mailto:liao961120@gmail.com" target="_blank">
                            <v-icon>mdi-email-outline</v-icon>
                        </v-btn>
                    </v-col>

                    <v-col cols="4">
                        <v-btn icon  href="https://yongfu.name"  target="_blank" color="pink">
                            <v-avatar size="22">
                                <img src="https://img.yongfu.name/icon/me-blackwhite.svg" alt="Yongfu">
                            </v-avatar>
                        </v-btn>
                    </v-col>
                </v-row>
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
            search_results_key: 0,
            drawer: null,
            databases: [
                {
                    text: "Kanakanavu",
                    value: "https://yongfu.name/temp-data/kanakanavu.json"
                },
                {
                    text: "Seediq",
                    value: "https://yongfu.name/glossParser/seediq-long-text.json"
                },
                {
                    text: "Long Texts",
                    value: "https://yongfu.name/glossParser/all_lang-long-text.json"
                },
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
            database: "https://yongfu.name/temp-data/kanakanavu.json", //"https://yongfu.name/gloss-search/2020_Budai_Rukai/data.json",
            results: [],
            docfilter: "",
            infscroll: 15,
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
        docfilter_lazy: {
            get() {
                return this.docfilter;
            },
            set(v) {
                this.docfilter = v;
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
            // Check regex validity
            if (this.query.regex == 1) {
                try {new RegExp(this.query.query.trim());}
                catch(e) {return []}
            }

            const results = this.filtered_results;
            var search_pats = this.query.query.trim().split(/\s*&&\s*/);
            if (this.query.regex == 1) {
                search_pats = search_pats.map(x => RegExp(x));
            }

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
                        if (search_pats[0].test(ori_str))
                            search_results.push(results[i]);
                    }

                // Seach Gloss
                } else if (this.query.type == "gloss") {
                    var matchNum = 0;
                    for (let j = 0; j < search_pats.length; j++) {
                        // Exact search
                        if (this.query.regex == 0) {
                            let isMatch = gloss_content.some(
                                //tk => tk == search_pats[j]
                                tk => tk.includes(search_pats[j])
                            );
                            if (isMatch) matchNum++;
                        // Regex search
                        } else {
                            let isMatch = gloss_content.some(tk =>
                                search_pats[j].test(tk)
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
                            search_pats.every(pat =>
                                pat.test(free_content)
                            )
                        )
                            search_results.push(results[i]);
                    }
                }
            }

            return search_results;
        },

        vue_seach_results_lazy: function() {
            return this.vue_seach_results.slice(0, this.infscroll);
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
        },
        "query.query": function() {
            this.forceReload();
            this.infscroll = 15;
            document.documentElement.scrollTop = 0;
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

        handleScroll: function() {
            if (this.vue_seach_results_lazy.length < this.vue_seach_results.length) {
                if ((window.innerHeight + window.scrollY + 100) >= document.body.offsetHeight)
                    this.infscroll += 30;
            }
        },

        forceReload: function() {
            this.search_results_key += 1;
        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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
