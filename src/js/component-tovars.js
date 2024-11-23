Vue.component('tovars', {
    template: "#tovars-input",
    data: function(){
        return {
            listname:"Выберите категорию товара...",
            listid:"",
            catalogName:"",
            categoryGoods:[],
            showLoad:false,
            sort:"ASC",
            showReservOnly:false,
            commandID: 'getCategoryAction',
            commandIDimg: 'goodsImagesByCategoryAction',
            commandIDone: 'getAllGoodsAction',
            commandIDTovImg: 'goodsImagesAction',
            commandSerchID: 'getGoodsSearch',
            linc: 'http://dm-company.ru/netlab/service.php'
        }
    },
    
    created: function() {
        eventBus.$on("do-search", (partNumber)=>{
            let token = getCookie('nltoken'); 
            this.listname = "Поиск: "+partNumber;

            this.showLoad = true;

            this.categoryGoods = [];

            axios.get(this.linc,{
                params: {
                token:token,
                keyword:partNumber,
                commandId:this.commandSerchID
                }
            })
            .then((response) => {
                
                console.log(response);

                if (response.data != " ")
                {
                    var goodsNoImg = response.data.categoryResponse.data.goods;

                    // let priceCell = localStorage.getItem("companyPriceColl");
                    let priceCell = "цена по категории F";
                    if ((priceCell == undefined)||(priceCell == null)) priceCell = "цена по категории N";

                    if (priceCell == "цена по категории A") priceCell = "RRC";
                    if (priceCell == "цена по категории B") priceCell = "PriceB";
                    if (priceCell == "цена по категории C") priceCell = "PriceC";
                    if (priceCell == "цена по категории D") priceCell = "PriceD";
                    if (priceCell == "цена по категории E") priceCell = "PriceE";
                    if (priceCell == "цена по категории F") priceCell = "PriceF";
                    if (priceCell == "цена по категории N") priceCell = "PriceN";


                    for (i = 0; i<goodsNoImg.length; i++)
                    {
                         var pictureUrl = "../img/no-tovar.jpg";
        
                        var rPrice =parseFloat(priceCalc(goodsNoImg[i].properties[priceCell]))*parseFloat(localStorage.getItem("baxKurs"));
        
                        var insclad = Number(goodsNoImg[i].properties["Lobnenskaya"])+
                                    Number(goodsNoImg[i].properties["Kurskaya"])+
                                    Number(goodsNoImg[i].properties["Kaluzhskaya"]);
        
                        this.categoryGoods.push({
                            id:goodsNoImg[i].properties.UID,
                            PN:goodsNoImg[i].properties.ID,
                            name:goodsNoImg[i].properties.Descr,
                            vendor:goodsNoImg[i].properties.производитель,
                            varancy:goodsNoImg[i].properties.Guarantee,
                            tranzitCount:goodsNoImg[i].properties["Transit"],
                            price:priceCalc(goodsNoImg[i].properties[priceCell]),
                            picture:pictureUrl,
                            zakaz:goodsNoImg[i].properties.remoteStock,
                            svobodno:insclad,
                            priceRub: Math.floor(rPrice * 100 ) / 100
                        });
                    
                    

                    
                    
                        // axios.get(this.linc,{
                        //     params: {
                        //         token:token,
                        //         versionId:goodsNoImg[i].properties.ID,
                        //         commandId:this.commandIDTovImg
                        //         }
                        // }) .then((response) => {
                        //     console.log(response);
                        //     var pictureUrl = "../img/no-tovar.jpg";
                        //     //var pictureUrl = ((img[0] != null)&&(img[0].properties.Url  != null))?img[0].properties.Url.replace("&91","&100189258"):"../img/no-tovar.jpg";
            
                        // });
                    
                    }

                    

                }

                this.showLoad = false;
                   
                
            });

        });

        eventBus.$on("list-select", (elemName,catalogName, elementId)=>{
            this.goodsLoad(elemName,catalogName, elementId) 
        });
    },

    watch: {
        showReservOnly: function() {
            this.goodsLoad(this.listname,this.catalogName, this.listid);
        }
    },

    methods:{

        goodsLoad(elemName,catalogName, elementId) {
            this.listname = elemName;
            this.listid = elementId;
            this.catalogName = catalogName;

            let token = getCookie('nltoken'); 
            this.categoryGoods = [];
            this.showLoad = true;
            axios.get(this.linc,{
                params: {
                token:token,
                catalogName:this.catalogName,
                categoryId:this.listid,
                commandId:this.commandID
                }
            })
            .then((response) => {
                
                

                var goodsNoImg = ((response.data.categoryResponse != null)&&(response.data.categoryResponse.data != null))?response.data.categoryResponse.data.goods:[];
                
                
                
                axios.get(this.linc,{
                    params: {
                    token:token,
                    categoryId:this.listid,
                    commandId:this.commandIDimg
                    }
                }) .then((response) => {
                    
                    var img = (response.data.categoryResponse.data != null)?response.data.categoryResponse.data.goods:[];
                    
                    for (i = 0; i<goodsNoImg.length; i++)
                    {

                        var insclad = Number(goodsNoImg[i].properties["количество на Лобненской"])+
                                    Number(goodsNoImg[i].properties["количество на Курской"])+
                                    Number(goodsNoImg[i].properties["количество на Калужской"]);


                        if (this.showReservOnly) 
                            if (insclad <= 0) continue;

                        // let priceCell = localStorage.getItem("companyPriceColl");
                        let priceCell = "цена по категории F";
                        if ((priceCell == undefined)||(priceCell == null)) priceCell = "цена по категории N";
        
                        var tpic = imgFilterById(img, goodsNoImg[i].id);
                        
                        var pictureUrl = ((tpic[0] != null)&&(tpic[0].properties.Image1Url  != null))?tpic[0].properties.Image1Url.replace("&91","&100189258"):"../img/no-tovar.jpg";
        
                        var rPrice =parseFloat(priceCalc(goodsNoImg[i].properties[priceCell]))*parseFloat(localStorage.getItem("baxKurs"));
        
                                
                        this.categoryGoods.push({
                            id:goodsNoImg[i].properties.id,
                            PN:goodsNoImg[i].properties.PN,
                            name:goodsNoImg[i].properties.название,
                            vendor:goodsNoImg[i].properties.производитель,
                            varancy:goodsNoImg[i].properties.гарантия,
                            tranzitCount:goodsNoImg[i].properties["количество в транзите"],
                            price:priceCalc(goodsNoImg[i].properties[priceCell]),
                            picture:pictureUrl,
                            zakaz:goodsNoImg[i].properties["удаленный склад"],
                            svobodno:insclad,
                            priceRub: Math.floor(rPrice * 100 ) / 100
                        });
                    }
        
                    for (i = 0; i<this.categoryGoods.length; i++)
                        for (j = 0; j<this.categoryGoods.length-1; j++)
                        if (this.categoryGoods[j].price<this.categoryGoods[j+1].price) {
                            let tmp = this.categoryGoods[j];
                            this.categoryGoods[j] = this.categoryGoods[j+1];
                            this.categoryGoods[j+1] = tmp;
                        }

                    this.showLoad = false;
                });

                // this.categoryGoods = response.data.categoryResponse.data.goods;
                console.log(this.categoryGoods);
            })
            

        },

        toBascet(tovarId, tovarCount, tovarName, tovarPrice, tovarPriceBax, tovarImg){
           let bascetElement ={
                id:tovarId,
                count:tovarCount,
                name:tovarName,
                price:tovarPrice,
                priceBax:tovarPriceBax,
                subTotal:tovarPrice,
                subTotalBax:tovarPriceBax,
                img:tovarImg
            };
           

            eventBus.$emit("add-tovar-to-bascet", bascetElement);
        },

        getTovarInfo(tovrID){
            console.log(tovrID);
            
            
            let token = getCookie('nltoken'); 

            axios.get(this.linc,{
                params: {
                token:token,
                versionId:tovrID,
                commandId:this.commandIDone
                }
            }) .then((response) => {
                let tovarData = response;
                axios.get(this.linc,{
                    params: {
                    token:token,
                    versionId:tovrID,
                    commandId:this.commandIDTovImg
                    }
                }) .then((response) => {
                    eventBus.$emit("show-tovar-info", tovarData.data.goodsResponse.data.properties, (response.data.entityListResponse.data != null)?response.data.entityListResponse.data.items:[]);
                });
                
            });

        },

        tovarSotring() {
           if (this.categoryGoods.length == 0) return;

          if (this.sort == "ASC") { 
                for (i = 0; i<this.categoryGoods.length; i++)
                    for (j = 0; j<this.categoryGoods.length-1; j++)
                    if (this.categoryGoods[j].price>this.categoryGoods[j+1].price) {
                        let tmp = this.categoryGoods[j];
                        this.categoryGoods[j] = this.categoryGoods[j+1];
                        this.categoryGoods[j+1] = tmp;
                    }
                    this.sort = "DESC" ;
            } else {
                for (i = 0; i<this.categoryGoods.length; i++)
                    for (j = 0; j<this.categoryGoods.length-1; j++)
                    if (this.categoryGoods[j].price<this.categoryGoods[j+1].price) {
                        let tmp = this.categoryGoods[j];
                        this.categoryGoods[j] = this.categoryGoods[j+1];
                        this.categoryGoods[j+1] = tmp;
                    }
                    this.sort = "ASC"; 
            }
        }
    }


});