Vue.component('catnavi', {
    template: "#catalog-navigation",
    data: function(){
        return {
            catalogAllData: [],
            catalogStructure: [],
            selectedList: "",
            searchStr:"",
            commandID: 'getCatalogAction',

            catalogName: 'Прайс-лист',
            mobileMenu:false,
            mobileMenuShow:false,
            linc: 'http://dm-company.ru/netlab/service.php'
        }
    },

    created: function() { 
        let token = getCookie('nltoken'); 

        if (token != undefined)
        {
            axios.get(this.linc,{
                params: {
                token:token,
                catalogName:this.catalogName,
                commandId:this.commandID
                }
            })
            .then((response) => {
                
                
                catalogAllData = response.data.catalogResponse.data.category;

                for (i = 0; i<catalogAllData.length; i++){
                    if (catalogAllData[i].parentId == "0"){
                        var top = {};
                        top.id = catalogAllData[i].id;
                        top.name = catalogAllData[i].name;
                        top.active = false;
                        top.subcat = [];
                        
                        for (j = 0; j<catalogAllData.length; j++){
                            if (catalogAllData[j].parentId == catalogAllData[i].id){
                                sub = {}; 
                                sub.id = catalogAllData[j].id;
                                sub.name = catalogAllData[j].name;
                                sub.active = false;
                                sub.subcat = [];

                                for (k = 0; k<catalogAllData.length; k++){
                                    if (catalogAllData[k].parentId == catalogAllData[j].id){
                                        subsub = {}; 
                                        subsub.id = catalogAllData[k].id;
                                        subsub.name = catalogAllData[k].name;
                                        subsub.active = false;
                                        sub.subcat.push(subsub);    
                                    }
                                    
                                }

                                top.subcat.push(sub);    
                            }
                            
                        }
                        this.catalogStructure.push(top);

                    } 
                }
                
            })
        }

        eventBus.$on("resize-app", (width, height)=>{ 
            
            if (width<600) {
                this.mobileMenu = true;
                this.mobileMenuShow = false;
            } else {
                this.mobileMenu = false;
                this.mobileMenuShow = false;
            }
        });

        eventBus.$on("todgle-mobile-menu", (tg)=>{ 
            
            this.mobileMenuShow = tg;
            
        });
    },

    methods:{
        openSub(elemIndex,elemIndexSub){  
           
            
            if (elemIndexSub == -1)
            {   
                this.catalogStructure[elemIndex].active = !this.catalogStructure[elemIndex].active;
            } else {
                this.catalogStructure[elemIndex].active = true;
                this.catalogStructure[elemIndex].subcat[elemIndexSub].active = !this.catalogStructure[elemIndex].subcat[elemIndexSub].active;        
            }
        },

        selectList(cat1,cat2, elemName, elemId){   
            
            for (i = 0; i<this.catalogStructure.length; i++)
                    for (j = 0; j<this.catalogStructure[i].subcat.length; j++)
                            for (k = 0; k<this.catalogStructure[i].subcat[j].subcat.length; k++)
                                if (this.catalogStructure[i].subcat[j].subcat[k].name == elemName){
                                    this.catalogStructure[i].subcat[j].subcat[k].active = true;    
                                } else {
                                    this.catalogStructure[i].subcat[j].subcat[k].active = false;
                                }
                                
                            
            selectedList = elemName;

            eventBus.$emit("list-select",elemName, this.catalogName, elemId);
            
            if (this.mobileMenu)
                eventBus.$emit("close-mob-menu");
        },

        searchSend(){
            if (this.searchStr != ""){
                
                let searchStrSep = this.searchStr.split(' ');

                let searchStrReal = "";
                for (i = 0; i<searchStrSep.length; i++)
                {
                    searchStrReal += searchStrSep[i].trim();
                    if (searchStrSep[i] == "") continue;
                    if (i+1 < searchStrSep.length) 
                    searchStrReal += ":";
                }

                eventBus.$emit("do-search", searchStrReal);
            } 
        }
    }
});