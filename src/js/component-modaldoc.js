Vue.component('modaldoc', {
    template: '#modal-win-documents',
    data: function(){
        return{  
            showed: false,
            documentList: [],
            showLoad:false,
            deleteElemStop:false,
            commandID: 'listDocuments',
            commandDellID: 'deleteAction',
            commandPositionID: 'readAction',
            linc: 'http://dm-company.ru/netlab/service.php'           
        }
    },

    created: function() {
        eventBus.$on("show-document", (tovarElem, imgList)=>{
            this.showWin();
            let token = getCookie('nltoken'); 
            this.showLoad = true;
            
            let now =  new Date();
            now.setMonth(now.getMonth() - 12);
            let beginDate = now.getFullYear();
            beginDate += ((Number(now.getMonth()+1) < 10)?"0"+Number(now.getMonth()+1):Number(now.getMonth()+1)).toString();
            beginDate += ((now.getDate() < 10)?"0"+now.getDate():now.getDate()).toString();

            now =  new Date();
            let endDate = now.getFullYear();
            endDate += ((Number(now.getMonth()+1) < 10)?"0"+Number(now.getMonth()+1):Number(now.getMonth()+1)).toString();
            endDate += ((now.getDate() < 10)?"0"+now.getDate():now.getDate()).toString();

            
            axios.get(this.linc,{
                params: {
                token:token,
                commandId:this.commandID,
                beginDate:beginDate,
                endDate:endDate,
                documentTypeId:0
                }
            }) .then((response) => {
        
            if (response.data == null) {
                alert("Не удалось получить данные"); 
                return;
            }    
            
            

            if (response.data.documentsResponse.data.documents != null){
                for (i = 0; i <response.data.documentsResponse.data.documents.length; i++ ) 
                {
                    response.data.documentsResponse.data.documents[i]["showGoods"] = false;
                    response.data.documentsResponse.data.documents[i]["showCircle"] = false;
                    
                    response.data.documentsResponse.data.documents[i].properties.summa = "Расчетать...";
                }

                this.documentList = response.data.documentsResponse.data.documents;
                
            }

            console.log(response);
            console.log(this.documentList);
            this.showLoad = false;

            });
        });
    },


    methods: {
        showWin(){this.showed = true},
        hideWin(){ this.showed = false},

        dellReserv(documentId) {
            let token = getCookie('nltoken');
            this.deleteElemStop =true;
            axios.get(this.linc,{
                params: {
                token:token,
                commandId:this.commandDellID,
                documentId:documentId,
                documentTypeId:0
                }
            }) .then((response) => {
                console.log(response.data);
                for (i = 0; i <this.documentList.length; i++ ) {
                    if (this.documentList[i].id == documentId)
                    {
                        this.documentList.splice(i, 1);
                        this.deleteElemStop =false;
                        break;
                    }
                }
            });
        },

        reservPosition(item,index) {
            let token = getCookie('nltoken'); 

            this.documentList[index].goods = [];
            this.documentList[index].showCircle = true;

            axios.get(this.linc,{
                params: {
                token:token,
                commandId:this.commandPositionID,
                documentId:item.id
                }
            }) .then((response) => {
                for (i = 0; i <this.documentList.length; i++ ) {
                    if (this.documentList[i].id == response.data.documentResponse.data.id)
                        {
                            this.documentList[i].goods = response.data.documentResponse.data.goods;
                            this.documentList[i].showGoods = !this.documentList[i].showGoods;

                            console.log(this.documentList[i]);
                            this.documentList[i].properties.summa = 0;
                            for (j = 0; j <this.documentList[i].goods.length; j++ ) 
                            {
                                this.documentList[i].goods[j].properties.summa =  priceCalc(this.documentList[i].goods[j].properties.summa);  
                                this.documentList[i].properties.summa += parseFloat(this.documentList[i].goods[j].properties.summa);
                            }
                            
                            
                        }
                    this.documentList[index].showCircle = false;
                }
            });

        }
    }
});