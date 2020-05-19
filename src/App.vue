<template>
    <div id="app">
        <!-- <Search /> -->
        <keep-alive>
            <router-view></router-view>
        </keep-alive>

        <a id="to-top" onclick="document.documentElement.scrollTop = 0;">▲</a>
        <a id="to-bottom" onclick="window.scrollTo(0, document.body.scrollHeight);">▼</a>
    </div>
</template>

<script>
//import Search from "./components/search.vue";

export default {
    name: "App",
    components: {
        //Search,
    },
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
a#to-top,
a#to-bottom {
    position: fixed;
    right: 0.6%;
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
.router {
    position: fixed;
    right: 0.6%;
    top: 1%;
    font-size: 0.8em;
    color: blue;
    font-weight: bold;
    text-decoration: none;
    color: #d96900;
    z-index: 10;
}
.router:hover {
    font-size: 0.83em;
}
@media (max-width: 600px) {
    .container {
        width: 100%;
        margin: 5px auto;
    }
    .header {
        position: fixed;
        margin: 0;
        padding: 20px 0;
        height: 95px;
        width: 100%;
        min-width: 850px;
        top: 0;
        background: rgba(255, 255, 255, 0.965);
    }
    .keyword {
        display: inline-block;
        height: 70px;
        width: 30%;
        margin: 0;
        padding: 0;
        text-align: left;
    }
    .setting {
        display: inline-block;
        height: 80px;
        width: 70%;
        margin: 0;
        padding: 0;
        list-style-type: none;
        text-align: left;
    }
    .setting > li {
        /*font-size: 10px;*/
        margin-left: 0;
        padding-left: 0;
    }
}

@media (min-width: 601px) and (max-width: 900px) {
    .container {
        width: 95%;
        margin: 10px auto;
    }
    .keyword {
        display: inline-block;
        height: 70px;
        width: 45%;
        margin: 0;
        padding: 0;
        text-align: left;
    }
    .header {
        position: fixed;
        margin: 0;
        padding: 20px 0;
        height: 95px;
        width: 100%;
        min-width: 800px;
        top: 0;
        background: rgba(255, 255, 255, 0.965);
    }
    .setting {
        display: inline-block;
        height: 80px;
        width: 55%;
        margin: 0;
        padding: 0;
        list-style-type: none;
        text-align: left;
    }
    .setting > li {
        /*font-size: 10px;*/
        margin-left: 0;
        padding-left: 0;
    }
}
</style>
