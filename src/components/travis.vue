<template>
    <div>
        <modal 
            name="trigger-build" 
            :width="400" 
            :height="260" 
            class="modal-travis"
            @before-open="beforeOpen"
        >
            <div class="header-travis">
                <p class="text-h5 font-weight-black mt-3">Request Data Update</p>
                <v-row align-content="center" justify="center" class="mb-0 pb-0">
                    <v-col cols="7" class="pb-0">
                        <v-text-field 
                            v-model="build_psswd" 
                            placeholder="password"
                            :append-icon="showpassword ? 'mdi-eye' : 'mdi-eye-off'"
                            :type="showpassword ? 'text' : 'password'"
                            @click:append="showpassword = !showpassword"
                            outlined
                            dense
                        />
                    </v-col>
                    <v-col cols="3" class="pb-0">
                        <v-btn small dark class="px-10 my-1 ml-0" v-on:click="triggerBuild">Request</v-btn>
                    </v-col>
                </v-row>
                
            </div>
            <div class="response">
                <template v-if="response != ''">
                    <p class="status" v-if="response.status == 202">
                        <b style="color:blue;">Success</b>! <br> 
                        Processing, wait 3 minutes! <br>
                    </p>
                    <p class="status" v-else>
                        <b style="color:red;">Error {{ response.status }}</b>! <br>
                        Check password and try again!
                    </p>
                </template>
            </div>
            <span class="info-log ">Check 
                <a href="https://yongfu.name/gloss-search/2020_Budai_Rukai.log" class="log" target="_blank">log</a>
                if some of your glosses are missing
            </span>
        </modal>
        <!-- <img v-on:click="showTravisModal" id="travis-build-btn" alt="Update data" src="@/assets/travis.png"> -->
    </div>
</template>

<script>
export default {
    data() {
        return {
            build_token:
                "U2FsdGVkX186rIUOLx3trIsnkmYleS4UDoNUpf4nMbeGYW1V/tcNO2OjXoxNO2Vj",
            build_psswd: "",
            showpassword: false,
            response: "",
        };
    },
    methods: {
        beforeOpen: function() {
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
.header-travis {
    width: 85%;
    margin: auto;
    padding: auto;
    text-align: center;
}
.header-travis > h3 {
    margin-bottom: 10px;
}
.modal-travis input, .modal-travis button {
    display: inline-block;
}
.modal-travis input {
    width: 40%;
    padding-left: 0.3em;
}
.modal-travis button {
    width: 4.8em;
    margin-left: 15px;
}
.modal-travis .response {
    text-align: center;
    margin-bottom: 0;
    font-size: 1em;
    min-height: 85px;
}
#travis-build-btn {
    position: fixed;
    left: 1%;
    bottom: 1%;
    height: 1em;
    z-index: 10;
}
#travis-build-btn:hover {
    cursor: pointer;
    height: 1.08em;
}
.modal-travis .info-log {
    position: absolute;
    display: block;
    right: 1.7%;
    bottom: 1.4%;
    font-size: 0.58em;
    color: grey;
}
.modal-travis .log:hover {
    font-weight: bold;
    text-decoration: none;
}

.modal-travis .status {
    width: 65%;
    padding: 10px 1%;
    margin: 0 auto;
    border: 1.2px solid rgba(128, 128, 128, 0.226);
    border-radius: 5px;
}
</style>