var eventBus = new Vue();


var mainApp = new Vue({
    el:"#workPanelApp",
    
    data:{
        selectList: "tt"            
    },
    
    mounted: function() {
        window.addEventListener('resize', this.resizeApp);
        window.addEventListener('focus', this.autorelogin);
        this.resizeApp();
    },

    methods:{
        autorelogin() {
            let token = getCookie('nltoken');
            if (token == undefined) document.location.href = "index.html"; 
        },

        resizeApp() {
            eventBus.$emit("resize-app",window.innerWidth, window.innerHeight);   
        },

        getTovar: function(tovarName){ 
            
            this.selectList = tovarName;
            
        }
    }
});