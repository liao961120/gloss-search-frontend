<template>
    <div>
        <span class="gloss-src src-num">{{ gloss.num }}</span>
        <v-tooltip bottom color="rgba(255, 115, 133, 0.85)">
            <template v-slot:activator="{ on, attrs }">
                <span class="gloss-src src-doc" v-bind="attrs" v-on="on">{{ gloss.file }}</span>
            </template>
            <span class="meta-modified" v-if="gloss.meta.modified">
                <strong>{{ gloss.meta.modified }}</strong>
            </span><br>
            <span class="meta-speaker" v-if="gloss.meta.speaker">
                <strong>{{ gloss.meta.speaker }}</strong>
            </span><br>
            <span class="meta-transcriber" v-if="gloss.meta.transcriber">
                <strong>{{ gloss.meta.transcriber }}</strong>
            </span>
        </v-tooltip>        
 
        <div class="example gloss--glossed">
            <p v-if="gloss.ori.length > 0" class="gloss__line--original gloss__line gloss__line--0">
                <span v-html="ori_highlighted"></span>
            </p>

            <!-- Glossed Lines -->
            <div class="gloss__words">
                <div
                    class="gloss__word"
                    v-for="(tup, idx) in gloss_hightlighted"
                    :key="idx + Math.random()"
                >
                    <p class="gloss__line gloss__line--1">
                        <span v-html="tup[0]"></span>
                    </p>
                    <p class="gloss__line gloss__line--2">
                        <span v-html="tup[1]"></span>
                    </p>
                    <p class="gloss__line gloss__line--3">
                        <span v-html="tup[2]"></span>
                    </p>
                </div>
            </div>

            <!-- Free Lines -->
            <p
                v-for="(line, i) in free_highlighted"
                :key="i + Math.random()"
                :class="`gloss__line--free gloss__line gloss__line--${i + 4}`"
            >
                <span v-html="line"></span>
            </p>

            <!-- Audio -->
            <audio controls v-if="gloss.meta.audio != ''">
                <source :src="gloss.meta.audio" type="audio/mpeg">
                Your browser does not support the audio element.
            </audio>
        </div>

        <v-btn fab x-small dark color="blue-grey lighten-2" v-if="!showplaintext" class="copy-glass" v-on:click="toPlainText(gloss)">
            <v-icon>mdi-pencil</v-icon>
        </v-btn>
        <v-btn fab depressed x-small dark color="blue-grey" v-if="showplaintext" class="copy-glass" v-on:click="showplaintext = false">
            <v-icon>mdi-eye-off-outline</v-icon>
        </v-btn>
        <template v-if="showplaintext">
            <v-textarea 
                v-model="plain_text_gloss" 
                auto-grow 
                outlined 
                autofocus
                class="grey--text text-body-2 pa-0 ma-0 monofont"
                background-color="white"
            ></v-textarea>
        </template>
    </div>
</template>

<script>
import { Highlight } from "@/helpers.js";

export default {
    computed: {
        ori_highlighted() {
            if (this.query.type == "gloss")
                return this.gloss.ori
                    .map(tk =>
                        Highlight.highlight(
                            tk,
                            this.query.query,
                            this.query.regex
                        )
                    )
                    .join(" ");
            else if (this.query.type == "ori")
                return Highlight.highlight(
                    this.gloss.ori.join(" "),
                    this.query.query,
                    this.query.regex
                );
            else return this.gloss.ori.join(" ");
        },

        gloss_hightlighted() {
            if (this.query.type == "gloss")
                return this.gloss.gloss.map(tup => [
                    Highlight.highlight(
                        tup[0],
                        this.query.query,
                        this.query.regex
                    ),
                    Highlight.highlight(
                        tup[1],
                        this.query.query,
                        this.query.regex
                    ),
                    Highlight.highlight(
                        tup[2],
                        this.query.query,
                        this.query.regex
                    )
                ]);
            else return this.gloss.gloss;
        },

        free_highlighted() {
            // Check search type
            if (this.query.type == "free")
                return this.gloss.free.map(sent =>
                    Highlight.highlight(
                        sent,
                        this.query.query,
                        this.query.regex
                    )
                );
            else return this.gloss.free;
        }
    },
    methods: {
        toPlainText(gloss) {
            const ori =
                gloss.ori.length > 0 ? gloss.ori.join(" ") + "\n\n" : "";
            const ori_align =
                gloss.gloss.length > 0
                    ? gloss.gloss.map(x => x[0]).join("\t") + "\n"
                    : "";
            const eng_align =
                gloss.gloss.length > 0
                    ? gloss.gloss.map(x => x[1]).join("\t") + "\n"
                    : "";
            const ch_align =
                gloss.gloss.length > 0
                    ? gloss.gloss.map(x => x[2]).join("\t") + "\n\n"
                    : "";
            const en_free = gloss.free[0] ? gloss.free[0] + "\n" : "";
            const ch_free = gloss.free[1] ? gloss.free[1] : "";

            this.plain_text_gloss = `${ori}${ori_align}${eng_align}${ch_align}${en_free}${ch_free}`;
            this.showplaintext = true;
        }
    },
    filters: {},
    props: ["gloss", "query", "showplaintext"],
    data() {
        return {
            plain_text_gloss: "",
            /* See https://yongfu.name/gloss-search/2020_Budai_Rukai/data.json for data format*/
        };
    }
};
</script>



<style scoped>
.meta-speaker::before {
    content: "Speaker: "
}
.meta-modified::before {
    content: "Modified: "
}
.meta-transcriber::before {
    content: "Transcriber: "
}
.meta-modified::before, 
.meta-speaker::before,
.meta-transcriber::before {
    display: inline-block;
    min-width: 5.7em;
    color:rgba(255, 255, 255, 0.88);
}
span.gloss-src {
    font-size: 0.75em;
}
span.src-num::after {
    content: ".";
}
span.src-doc {
    background: rgba(53, 53, 53, 0.664);
    color: white;
    border-radius: 8px;
    padding: 2px 5px;
    float: right;
    font-family: "Monaco", "Consolas", "Courier New", Courier, monospace;
    font-size: 0.63em;
}

.gloss--glossed:after {
    clear: left;
    content: "";
    display: block;
}

ul.gloss--glossed,
ol.gloss--glossed {
    padding-left: 0;
}

ul.gloss--glossed li,
ol.gloss--glossed li {
    list-style-type: none;
}

.gloss__abbr {
    font-variant: small-caps;
    font-variant-numeric: oldstyle-nums;
    text-transform: lowercase;
}

.gloss__word {
    float: left;
    margin-bottom: 1em;
    margin-right: 1em;
}

.gloss__word p {
    margin: 0;
}

.gloss--no-space .gloss__word {
    margin-right: 0;
}

.gloss--no-space .gloss__word.gloss__word--spacer {
    margin-right: 1.5em;
}

.gloss__words:first-child,
.gloss--glossed li:first-child {
    margin-top: 1em;
}

.gloss--glossed li:last-child {
    margin-bottom: 1em;
}

.gloss__word .gloss__line:first-child {
    font-style: italic;
}

.gloss__line--original {
    font-weight: bold;
    font-style: italic;
    word-spacing: 0.3em;
    font-family: "Times New Roman", Times, serif;
    margin-bottom: 0.6em;
}

.gloss__line--free,
.gloss__line--no-align {
    clear: left;
    margin: 0 0;
    font-family: "Times New Roman", Times, serif;
    font-size: 0.78em;
}

.gloss__line--hidden {
    display: none;
}

.gloss__line--1 {
    font-family: "Times New Roman", Times, serif;
}
.gloss__line--2 {
    font-family: "Times New Roman", Times, serif;
    font-size: 0.85em;
}
.gloss__line--3 {
    font-family: "Times New Roman", Times, serif;
    font-size: 0.85em;
}

.plain-text-gloss {
    display: block;
    width: 80%;
}
audio::-webkit-media-controls-panel, video::-webkit-media-controls-panel {
    background-color: rgba(204, 204, 204, 0.781);
    width: 35%;
}
</style>