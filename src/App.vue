<template>
    <div id="app">
        <Leipzig />
        <Search />
        <modal name="trigger-build" :width="350" :height="200" class="modal">
            <div>
                <h3>Request Data Update</h3>
                <input type="password" v-model="build_psswd" placeholder="password"/>
                <button v-on:click="triggerBuild">Request</button>
            </div>
            <div class="response" v-if="response != ''">  
                <p v-if="response.status == 202">
                    Success! <br> 
                    Processing data now, query new data 3 minutes later!
                </p>
                <p v-else>
                    Error {{ response.status }}! <br>
                    Check your password or try again!
                </p>
            </div>
        </modal>
        <img v-on:click="showModal" id="travis-build-btn" alt="Update data" src="./assets/travis.png">
    </div>
</template>

<script>
import Search from "./components/search.vue";
import Leipzig from "./components/Leipzig.vue";

export default {
    name: "App",
    components: {
        Search,
        Leipzig
    },
    data() {
        return {
            build_token:
                "U2FsdGVkX186rIUOLx3trIsnkmYleS4UDoNUpf4nMbeGYW1V/tcNO2OjXoxNO2Vj",
            build_psswd: "",
            response: "",
        };
    },
    methods: {
        showModal: function() {
            this.$modal.show('trigger-build');
            this.response = '';
            this.build_psswd = '';
        },
        triggerBuild: function() {
            const url =
                "https://api.travis-ci.org/repo/liao961120%2Fgloss-search/requests";
            const body = {
                request: {
                    branch: "master",
                    message: "Trigger build from glosss.yongfu.name"
                }
            };
            const decryptedText = this.CryptoJS.AES.decrypt(this.build_token,this.build_psswd).toString(this.CryptoJS.enc.Utf8);
            const header = {
                "Content-Type": "application/json",
                Accept: "application/json",
                "Travis-API-Version": "3",
                Authorization: `token ${decryptedText}`
            };

            this.$http
                .post(`${url}`, body, { headers: header })
                .then(response => {
                    this.response = response;
                }, response => {
                    this.response = response;
                });
        }
    },
    watch: {
        build_psswd: function() {
            this.response = '';
        }
    }
};
</script>

<style>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
}
span.matchedtoken {
    background: rgba(255, 255, 0, 0.582);
    /* padding: 0.08em 0.1em; */
    /* border-radius: 6px; */
}
.gloss__line--free span.matchedtoken {
    background: rgba(136, 255, 0, 0.561);
}
html {
    scroll-behavior: smooth !important;
}
.modal > div {
    text-align: left;
    padding: 0 25px;
}
.modal input, .modal button {
    display: inline-block;
}
.modal input {
    width: 40%;
    padding-left: 0.3em;
}
.modal button {
    width: 4.8em;
    margin-left: 15px;
}
.response {
    margin-top: 35px;
    font-size: 0.8em;
}
#travis-build-btn {
    position: fixed;
    left: 1%;
    bottom: 1%;
    height: 1em;
}
#travis-build-btn:hover {
    cursor: pointer;
    height: 1.08em;
}
</style>
