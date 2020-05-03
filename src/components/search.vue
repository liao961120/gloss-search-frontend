<template>
    <div class="container">
        <div class="header">
            <div class="query">
                <div class="keyword">
                    <template v-if="database == 0">
                        <input
                            type="text"
                            spellcheck="false"
                            placeholder="ka,ki"
                            v-model.lazy="query.query"
                        />
                        <button v-on:click="searchGloss" id="search">Search</button>
                    </template>
                    <template v-else>
                        <input
                            type="text"
                            spellcheck="false"
                            placeholder="ka,ki"
                            v-model.lazy="query.query"
                        />
                        <button class="search-btn">Search</button>
                    </template>

                    <ul class="setting database">
                        <li>
                            <input
                                type="radio"
                                name="webdb"
                                id="webdb"
                                value="0"
                                v-model="database"
                            />
                            <label for="male">Local</label>
                            <input
                                type="radio"
                                name="webdb"
                                id="webdb"
                                value="1"
                                v-model="database"
                            />
                            <label for="male">Web</label>
                        </li>
                    </ul>
                </div>
                <ul class="setting">
                    <li>
                        <input
                            type="radio"
                            name="search-type"
                            id="glossSearch"
                            value="gloss"
                            v-model="query.type"
                        />
                        <label for="male">Gloss</label>
                        <input
                            type="radio"
                            name="search-type"
                            id="glossSearch"
                            value="free"
                            v-model="query.type"
                        />
                        <label for="regex">Notes</label>
                    </li>
                    <li>
                        <input
                            type="radio"
                            name="regex"
                            id="exactSearch"
                            value="0"
                            v-model="query.regex"
                        />
                        <label for="regex">Exact</label>
                        <input
                            type="radio"
                            name="regex"
                            id="regexSearch"
                            value="1"
                            v-model="query.regex"
                        />
                        <label for="male">RegEx</label>
                    </li>
                    <li class="docfilter">
                        <input
                            type="text"
                            spellcheck="false"
                            placeholder="docx filter (filename regex pattern)"
                            v-model.lazy="docfilter"
                        />
                    </li>
                </ul>
            </div>
            <div class="info">
                <span v-if="database == 0" class="num-of-results">{{ this.results.length }}</span>
                <span v-else class="num-of-results">{{ this.vue_seach_results.length }}</span>
            </div>
        </div>

        <div class="results">
            <template v-if="database == 0">
                <template v-for="(res, i) in filtered_results">
                    <Leipzig v-bind:gloss="res" v-bind:query="query" :key="i" />
                </template>
            </template>
            <template v-else>
                <template v-for="(res, i) in vue_seach_results">
                    <Leipzig v-bind:gloss="res" v-bind:query="query" :key="i" />
                </template>
            </template>
        </div>

        <a id="to-top" onclick="document.documentElement.scrollTop = 0;">▲</a>
        <a id="to-bottom" onclick="window.scrollTo(0, document.body.scrollHeight);">▼</a>
    </div>
</template>

<script>
import Leipzig from "@/components/Leipzig.vue";
// @ is an alias to /src


export default {
    name: "gloss-search",
    components: {
        Leipzig
    },
    data() {
        return {
            query: {
                query: "",
                regex: 1,
                type: 'gloss',
            },
            database: 1,
            results: [],
            docfilter: '',
            webdb_url: 'https://yongfu.name/gloss-search/2020_Budai_Rukai/data.json',
        };
    },
    computed: {
        filtered_results: function() {
            if (this.docfilter == '') return this.results 
            var doc_pat = RegExp(`${this.docfilter}`);

            if (this.results.length > 0)
                return this.results.filter(gloss => {
                    return doc_pat.test(gloss.file);
                })
            else 
                return this.results
        },


        vue_seach_results: function() {
            if (this.query.query.trim() == '') return []; //this.results; //

            const results = this.filtered_results;
            const search_pats = this.query.query.trim().split(/\s*,\s*/);
            const search_pats_regex = search_pats.map(x => RegExp(x));

            var search_results = [];
            for (var i=0; i<results.length; i++) {
                // Gloss line contents
                var gloss_content = [ ...new Set(results[i].gloss.flat().concat(results[i].ori.flat())) ];  // an array

                // Seach Gloss
                if (this.query.type == "gloss") {
                    
                    var matchNum = 0;
                    for (let j=0; j<search_pats.length; j++) {
                        
                        // Exact search
                        if (this.query.regex == 0) {
                            let isMatch = gloss_content.some(tk => tk == search_pats[j]);
                            if (isMatch) matchNum++;
                        // Regex search
                        } else {
                            let isMatch = gloss_content.some(tk => search_pats_regex[j].test(tk));
                            if (isMatch) matchNum++;
                        }
                    }
                    if (matchNum == search_pats.length)
                        search_results.push(results[i]);

                // Search Notes
                } else {
                    // Free line contents
                    var free_content = results[i].free.join(' ');  // a string
                    
                    // Exact search
                    if (this.query.regex == 0) {
                        if (search_pats.every(pat => free_content.includes(pat)))
                            search_results.push(results[i]);
                    // Regex search
                    } else {
                        if (search_pats_regex.every(pat => pat.test(free_content)))
                            search_results.push(results[i]);
                    }
                }
            }

            return search_results
        }
    },
    created: function () {
        this.$http.get(this.webdb_url).then(function(data) {
            this.results = data.body;
        });
    },
    watch: {
        database: function () {
            if (this.database == 1) {
                this.$http.get(this.webdb_url).then(function(data) {
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
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.container {
    width: 90%;
    margin: 30px auto;
}
.header {
    position: fixed;
    margin: 0;
    padding: 20px 0;
    height: 95px;
    width: 90%;
    min-width: 900px;
    top: 0;
    background: rgba(255, 255, 255, 0.965);
}
.query {
    position: relative;
    display: block;
    width: 100%;
    margin-bottom: 0px;
}

.database.setting > li {
    display: inline-block;
    padding: 5px;
    margin: 3px;
    width: 100%;
    font-size: 10px;
}
.database.setting > li > input {
    display: inline-block;
    padding: 0;
    width: 2.5em;
}
.keyword {
    display: inline-block;
    height: 70px;
    width: 64%;
    margin: 0;
    padding: 0;
    text-align: left;
}
.setting {
    display: inline-block;
    height: 80px;
    width: 36%;
    margin: 0;
    padding: 0;
    list-style-type: none;
}
.keyword input,
.keyword button {
    width: 90%;
    margin: 3px;
    padding: 0.45em;
    font-size: 11px;
    font-family: Monaco, "Courier New", Courier, monospace;
}
.keyword input {
    margin: 0;
}
button#search,
button.search-btn {
    margin: 5px auto;
    width: 30%;
    padding: 5px;
}
.setting li {
    display: inline-block;
    padding: 5px;
    margin: 3px;
    width: 45%;
    font-size: 12px;
}
.setting input[type="number"] {
    padding: 0;
    width: 2.5em;
}
li.docfilter {
    width: 70%;
}
li.docfilter > input {
    display: inline-block;
    width: 100%;
    margin: 0;
    padding: 0.1em;
    font-size: 0.9em;
    font-family: Monaco, "Courier New", Courier, monospace;
}
.kwic span {
    display: inline-block;
    width: 40%;
    height: 1.5em;
    /* border: 1px solid black; */
    font-size: 0.78em;
    margin: 3px auto;
    padding: 0.1em;
}
.left {
    text-align: right;
}
.right {
    text-align: left;
}
.results {
    margin-top: 175px;
    text-align: left;
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


.kwic::before {
    counter-increment: num;
    content: counter(num) " ";
    color: gray;
    font-size: 0.7em;
}
.info {
    text-align: left;
}
.info span,
.info button {
    display: inline-block;
    margin: 5px 1.2em 5px 0;
    padding: 6px;
    line-height: 0.75em;
}
.info span.num-of-results {
    width: 15em;
    font-size: 0.7em;

    /* text-align: left; */
}
.num-of-results:before {
    content: "總筆數：";
}

button {
    background: rgb(87, 87, 87);
    color: rgb(236, 236, 236);
    padding: 4px;
    margin: 5px;
    border: none;
}
button:hover {
    background: rgb(66, 66, 66);
    color: white;
}
button:active {
    transform: translateY(1px);
}
button:disabled {
    background: rgb(136, 136, 136);
    color: rgb(236, 236, 236);
}

a#to-top,
a#to-bottom {
    position: fixed;
    right: 1%;
    background: rgb(121, 121, 121);
    color: rgb(245, 245, 245);
    font-size: 19px;
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
