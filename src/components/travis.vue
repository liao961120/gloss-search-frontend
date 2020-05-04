<template>
    <div>
        <modal name="trigger-build" :width="350" :height="210" class="modal">
            <div>
                <h3>Request Data Update</h3>
                <input type="password" v-model="build_psswd" placeholder="password"/>
                <button v-on:click="triggerBuild">Request</button>
            </div>
            <div class="response">
                <template v-if="response != ''">
                    <p class="status" v-if="response.status == 202">
                    <!-- <p> -->
                        <b>Success</b>! <br> 
                        Processing data, wait 3 minutes! <br>
                    </p>
                    <p class="status" v-else>
                        <b style="color:red;">Error {{ response.status }}</b>! <br>
                        Check password and try again!
                    </p>
                </template>
            </div>
            <span class="info">Check 
                <a href="https://yongfu.name/gloss-search/2020_Budai_Rukai.log" class="log" target="_blank">log</a>
                if some of your glosses are missing
            </span>
        </modal>
        <img v-on:click="showModal" id="travis-build-btn" alt="Update data" src="@/assets/travis.png">
    </div>
</template>

<script>
export default {
    data() {
        return {
            build_token:
                "U2FsdGVkX186rIUOLx3trIsnkmYleS4UDoNUpf4nMbeGYW1V/tcNO2OjXoxNO2Vj",
            build_psswd: "",
            response: ""
        };
    },
    methods: {
        showModal: function() {
            this.$modal.show("trigger-build");
            this.response = "";
            this.build_psswd = "";
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
            const decryptedText = this.CryptoJS.AES.decrypt(
                this.build_token,
                this.build_psswd
            ).toString(this.CryptoJS.enc.Utf8);
            const header = {
                "Content-Type": "application/json",
                Accept: "application/json",
                "Travis-API-Version": "3",
                Authorization: `token ${decryptedText}`
            };

            this.$http.post(`${url}`, body, { headers: header }).then(
                response => {
                    this.response = response;
                },
                response => {
                    this.response = response;
                }
            );
        }
    },
    watch: {
        build_psswd: function() {
            this.response = "";
        }
    }
};
</script>

<style scoped>
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
    margin-top: 1.5em;
    margin-bottom: 0;
    padding-bottom: 0;
    font-size: 0.8em;
    min-height: 3.5em;
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
.info {
    /* display: inline-block; */
    float: right;
    text-align: right;
    font-size: 0.58em;
    color: grey;
    padding-top: 1em;
    padding-right: 0.5em;
}
.log:hover {
    font-weight: bold;
    text-decoration: none;
}
.status {
    width: 70%;
    padding: 6px 1%;
    margin: 0 14.5%;
    border: 1.2px solid rgba(128, 128, 128, 0.226);
    border-radius: 5px;
}
</style>