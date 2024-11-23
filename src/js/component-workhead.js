Vue.component('workhead', {
    template: '#workhead-template',
    data: function(){
        return{
            companyLogin:'',
            companyName:'',
            companyId:'',
            baxKurs:0,
            bascetCount:0,
            mobileBurgerShow:false,
            mobileMenuShow:false,
            commandID: 'getOrganizationsAction',
            commandIDkurs: 'getInfoAction',
            linc: 'http://dm-company.ru/netlab/service.php'            
        }
    },
    
    created: function() {

        let token = getCookie('nltoken'); 

        eventBus.$on("update-bascet-count", (count)=>{ 
            this.bascetCount = count;  
        });

        eventBus.$on("close-mob-menu", ()=>{ 
            this.todgleMobileMenu();  
        });

        eventBus.$on("resize-app", (width, height)=>{ 
            
            if (width<600) {
                this.mobileBurgerShow = true;
            } else {
                this.mobileBurgerShow = false;
            }
        });

        this.bascetCount = (localStorage.getItem("bascetCount") != null)?localStorage.getItem("bascetCount"):0;
        
        this.baxKurs = localStorage.getItem("baxKurs");

        if (token == undefined) document.location.href = "index.html";
        
        this.companyLogin = localStorage.getItem("companyLogin");

        if (localStorage.getItem("companyName") == undefined)
        {

            
            axios.get(this.linc,{
                params: {
                token:token,
                commandId:this.commandID
                }
            })
            .then((response) => {
                    
                    
                    for (i = 0; i<response.data.entityListResponse.data.items.length; i++ )
                    {
                        if (response.data.entityListResponse.data.items[i].properties.название == "Оргсервис") {
                            (response.data.entityListResponse.data.items[i].properties);
                            
                            this.companyId = response.data.entityListResponse.data.items[i].properties.id;
                            localStorage.setItem("companyId", response.data.entityListResponse.data.items[i].properties.id);
                            
                            this.companyName = response.data.entityListResponse.data.items[i].properties.название;
                            localStorage.setItem("companyName", response.data.entityListResponse.data.items[i].properties.название);
                        }
                    }


                    axios.get(this.linc,{
                        params: {
                        token:token,
                        commandId:this.commandIDkurs
                        }
                    })
                    .then((response) => {
                        let baxKurs = parseFloat(response.data.entityListResponse.data.items[0].properties.usdRateNonCash);
                        baxKurs = Math.floor(baxKurs * 100 ) / 100;
                        this.baxKurs = baxKurs;
                        localStorage.setItem("baxKurs", baxKurs);
                         (response.data.entityListResponse.data.items[0].properties.usdRateNonCash);   
                    });
            })
        } 
    },

    methods: {
        relogin(){
            localStorage.removeItem("companyId");
            localStorage.removeItem("companyName");
            localStorage.removeItem("companyLogin");
            localStorage.removeItem("baxKurs");
            localStorage.removeItem("bascet");
            localStorage.removeItem("bascetCount");
            localStorage.removeItem("bascetSumm");
            localStorage.removeItem("bascetSummBax");
            localStorage.removeItem("companyPriceColl");
            localStorage.removeItem("companyPriceGrad");
            localStorage.removeItem("token");
            document.cookie = "nltoken=0; max-age=0";                   
            document.location.href = "index.html";
        },

        openDoc(){
            eventBus.$emit("show-document");
        },

        showBascet() {
            eventBus.$emit("show-bascet");
        },

        todgleMobileMenu() {
            this.mobileMenuShow = !this.mobileMenuShow;
            eventBus.$emit("todgle-mobile-menu", this.mobileMenuShow);
        }
    }
});