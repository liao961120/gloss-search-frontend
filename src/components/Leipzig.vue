<template>
    <div>
        <span class="gloss-src src-num">{{ gloss.num }}</span> 
        <span class="gloss-src src-doc">{{ gloss.file }}</span>
        <div class="example gloss--glossed">
            
            <p v-if="gloss.ori.length > 0" class="gloss__line--original gloss__line gloss__line--0">
                <span v-html="ori_highlighted"></span>
            </p>

            <!-- Glossed Lines -->
            <div class="gloss__words">
                <div class="gloss__word" v-for="(tup, idx) in gloss_hightlighted" :key="idx + Math.random()">
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
            <p v-for="(line, i) in free_highlighted" :key="i + Math.random()" :class="`gloss__line--free gloss__line gloss__line--${i + 4}`">
                <span v-html="line"></span>
            </p>

        </div>
    </div>
</template>

<script>
export default {
    computed: {
        ori_highlighted() {
            function myReplace(str, group1) {
                return "<span class='matchedtoken'>" + group1 + "</span>";
            }
            function highlight(tk, query, isRegex) {
                var query_arr = query.split(',').map(x => x.trim());
                
                // RegEx search
                if (isRegex) {
                    for (var i=0; i<query_arr.length; i++) {
                        var regex = RegExp(`(${query_arr[i]})`, "g");
                        if (regex.test(tk)) {
                            //tk = `<span class='matchedtoken'>${tk}</span>`
                            tk = tk.replace(regex, myReplace);
                            break
                        }
                    }

                // Exact search
                } else {
                    for (var j=0; j<query_arr.length; j++) {
                        if (tk.includes(query_arr[j])) {
                            var regex2 = RegExp(`(${query_arr[j]})`, "g");
                            tk = tk.replace(regex2, myReplace);
                            break
                        }
                    }
                }

                return tk
            }

            if (this.query.type == 'gloss')
                return this.gloss.ori.map(tk => highlight(tk, this.query.query, this.query.regex)).join(' ')
            else
                return this.gloss.ori.join(' ')
        },

        gloss_hightlighted() {
            function myReplace(str, group1) {
                return "<span class='matchedtoken'>" + group1 + "</span>";
            }
            function highlight(tk, query, isRegex) {
                var query_arr = query.split(',').map(x => x.trim());
                
                // RegEx search
                if (isRegex) {
                    for (var i=0; i<query_arr.length; i++) {
                        var regex = RegExp(`(${query_arr[i]})`, "g");
                        if (regex.test(tk)) {
                            //tk = `<span class='matchedtoken'>${tk}</span>`
                            tk = tk.replace(regex, myReplace);
                            break
                        }
                    }

                // Exact search
                } else {
                    for (var j=0; j<query_arr.length; j++) {
                        if (tk.includes(query_arr[j])) {
                            var regex2 = RegExp(`(${query_arr[j]})`, "g");
                            tk = tk.replace(regex2, myReplace);
                            break
                        }
                    }
                }

                return tk
            }

            if (this.query.type == 'gloss')
                return this.gloss.gloss.map(tup => [
                        highlight(tup[0], this.query.query, this.query.regex), 
                        highlight(tup[1], this.query.query, this.query.regex), 
                        highlight(tup[2], this.query.query, this.query.regex)
                        ]
                    )
            else
                return this.gloss.gloss
        },

        free_highlighted() {

            function myReplace(str, group1) {
                return "<span class='matchedfree'>" + group1 + "</span>";
            }

            function highlight(tk, query) {
                var query_arr = query.split(',').map(x => x.trim());

                // Exact search
                for (var j=0; j<query_arr.length; j++) {
                    if (tk.includes(query_arr[j])) {
                        var regex2 = RegExp(`(${query_arr[j]})`, "g");
                        tk = tk.replace(regex2, myReplace);
                    }
                }
                return tk
            }

            // Check search type
            if (this.query.type == 'free')
                return this.gloss.free.map(sent => 
                        highlight(sent, this.query.query, this.query.regex)
                    )
            else
                return this.gloss.free
        }
    },
    methods: {},
    filters: {

    },
    props: ["gloss", "query"],
    data() {
        return {
        /*
        gloss: {
            'file': '20200325.docx',
            'num': 1,
            'ori': ['yakay', 'ku', 'tatulru', 'ku', 'ababay/sauvalay', 'ku', 'agili'],
            'gloss': [
                ('yakay', 'have', '有'),
                ('ku', 'three', '3'),
                ('tatulru', 'female/male', '女性/男性'),
                ('(ku', 'yonger_brother/sister-1SG.POSS', '弟妹-我的.第一人稱單數.所有格'),
                ('ababay/sauvalay)', '_', '_'),
                ('ku', '_', '_'),
                ('agi-li', '_', '_')],
            'free': [
                '#e I have 3 younger brother/sister',
                '#c 我有 3 個弟弟/妹妹',
                '#n  yakay\tku 可省略']
            }
        */

            abbr: {
                ___: "placeholder",
                1: "first person",
                2: "second person",
                3: "third person",
                "1SG": "first person singular",
                "2SG": "second person singular",
                "3SG": "third person singular",
                "1PL": "first person plural",
                "2PL": "second person plural",
                "3PL": "third person plural",
                A: "agent-like argument of canonical transitive verb",
                ABL: "ablative",
                ABS: "absolutive",
                ACC: "accusative",
                ADJ: "adjective",
                ADV: "adverb(ial)",
                AGR: "agreement",
                ALL: "allative",
                ANTIP: "antipassive",
                APPL: "applicative",
                ART: "article",
                AUX: "auxiliary",
                BEN: "benefactive",
                CAUS: "causative",
                CLF: "classifier",
                COM: "comitative",
                COMP: "complementizer",
                COMPL: "completive",
                COND: "conditional",
                COP: "copula",
                CVB: "converb",
                DAT: "dative",
                DECL: "declarative",
                DEF: "definite",
                DEM: "demonstrative",
                DET: "determiner",
                DIST: "distal",
                DISTR: "distributive",
                DU: "dual",
                DUR: "durative",
                ERG: "ergative",
                EXCL: "exclusive",
                F: "feminine",
                FOC: "focus",
                FUT: "future",
                GEN: "genitive",
                IMP: "imperative",
                INCL: "inclusive",
                IND: "indicative",
                INDF: "indefinite",
                INF: "infinitive",
                INS: "instrumental",
                INTR: "intransitive",
                IPFV: "imperfective",
                IRR: "irrealis",
                LOC: "locative",
                M: "masculine",
                N: "neuter",
                NEG: "negation / negative",
                NMLZ: "nominalizer / nominalization",
                NOM: "nominative",
                OBJ: "object",
                OBL: "oblique",
                P: "patient-like argument of canonical transitive verb",
                PASS: "passive",
                PFV: "perfective",
                PL: "plural",
                POSS: "possessive",
                PRED: "predicative",
                PRF: "perfect",
                PRS: "present",
                PROG: "progressive",
                PROH: "prohibitive",
                PROX: "proximal / proximate",
                PST: "past",
                PTCP: "participle",
                PURP: "purposive",
                Q: "question particle / marker",
                QUOT: "quotative",
                RECP: "reciprocal",
                REFL: "reflexive",
                REL: "relative",
                RES: "resultative",
                S: "single argument of canonical intransitive verb",
                SBJ: "subject",
                SBJV: "subjunctive",
                SG: "singular",
                TOP: "topic",
                TR: "transitive",
                VOC: "vocative"
            }
        };
    }
};
</script>



<style scoped>
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
    font-family: 'Monaco', 'Consolas', 'Courier New', Courier, monospace;
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
    font-family: 'Times New Roman', Times, serif;
    margin-bottom: 0.6em;
}

.gloss__line--free,
.gloss__line--no-align {
    clear: left;
    margin: 0 0;
    font-family: 'Times New Roman', Times, serif;
    font-size: 0.78em;
}

.gloss__line--hidden {
    display: none;
}

.gloss__line--1 {
    font-family: 'Times New Roman', Times, serif;
}
.gloss__line--2 {
    font-family: 'Times New Roman', Times, serif;
    font-size: 0.85em;
}
.gloss__line--3 {
    font-family: 'Times New Roman', Times, serif;
    font-size: 0.85em;
}
</style>