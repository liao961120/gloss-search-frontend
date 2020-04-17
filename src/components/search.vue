<template>
    <div class="container">
        <div class="header">
            <div class="query">
                <div class="keyword">
                    <input
                        type="text"
                        spellcheck="false"
                        placeholder="ka,ki"
                        v-model.lazy="query.query"
                    />
                    <button v-on:click="searchGloss" id="search">Search</button>
                </div>
                <ul class="setting">
                    <li>
                        <input type="radio" name="search-type" id='glossSearch' value="gloss" v-model="query.type"/>
                        <label for="male">Gloss</label>
                        <input type="radio" name="search-type" id="glossSearch" value="free" v-model="query.type"/>
                        <label for="regex">Notes</label>
                    </li>
                    <li>
                        <input type="radio" name="regex" id="exactSearch" value="0" v-model="query.regex"/>
                        <label for="regex">Exact</label>
                        <input type="radio" name="regex" id='regexSearch' value="1" v-model="query.regex"/>
                        <label for="male">RegEx</label>
                    </li>
                    <li class='this-is-placeholder'></li>
                </ul>
            </div>
            <div class="info">
                <span class="num-of-results">{{ this.results.length }}</span>
            </div>
        </div>

        <div class="results">
            <template v-for="(res, i) in results">
                <Leipzig v-bind:gloss="res" v-bind:query="query" :key="i" />
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
                regex: 0,
                type: 'gloss',
            },
            results: []
        };
    },
    methods: {
        searchGloss: function() {
            const url = `http://localhost:1420/query?query=${this.query.query}&regex=${this.query.regex}&type=${this.query.type}`;
            //clean up
            this.$http.get(url).then(function(data) {
                this.results = data.body;
            });
        },
    },
    computed: {
        showResults() {
            return this.results.slice(0, this.showNext.curr);
        },
        kwicStyKeyWidth() {
            return this.results[0].keyword.length * 6;
        },
        kwicStyCtxWidth() {
            return (95 - this.results[0].keyword.length * 6) / 2;
        }
    },
    filters: {
        contextShow: function(lst, tag = false, sep = " ") {
            const lst2 = [];
            lst.forEach(elem => {
                if (tag) lst2.push(elem[0] + "/" + elem[1]);
                else lst2.push(elem[0]);
            });

            return lst2.join(sep);
        }
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
    height: 100px;
    width: 90%;
    min-width: 900px;
    top: 0;
    background: white;
}
.query {
    position: relative;
    display: block;
    width: 100%;
    margin-bottom: 0px;
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
button#search {
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
    background:rgba(197, 197, 197, 0.212);
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
button:hover{
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

a#to-top, a#to-bottom {
    position: fixed;
    right: 1%;
    background: rgb(121, 121, 121);
    color: rgb(245, 245, 245);
    font-size: 19px;
}
a#to-top:hover, a#to-bottom:hover {
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
