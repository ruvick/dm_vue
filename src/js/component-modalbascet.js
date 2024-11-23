Vue.component('modalbascet', {
    template: '#modal-win-bscet',
    data: function(){
        return{
            bascet: [],
            bascetCount:0,
            bascetSumm:0,
            bascetSummBax:0,
            showed: false,
            showTovarloader:false,
            commandID: 'createReserve',
            linc: 'http://dm-company.ru/netlab/service.php'          
        }
    },

    created: function() {
        this.bascet = JSON.parse(localStorage.getItem("bascet"));
        if (this.bascet == null) this.bascet =  [];
        
        this.bascetCount = localStorage.getItem("bascetCount");
        this.bascetSumm = localStorage.getItem("bascetSumm");
        this.bascetSummBax = localStorage.getItem("bascetSummBax");

        eventBus.$on("show-bascet", ()=>{
            
            if (localStorage.getItem("bascet") != null)
            {    
                this.bascetInfo = JSON.parse(localStorage.getItem("bascet"));
                this.bascetCount = localStorage.getItem("bascetCount");
            }

            this.showWin();
        });

        eventBus.$on("add-tovar-to-bascet", (element)=>{
            this.addToBascet(element);
        });

        
    },

    watch: {
        bascet: function (val) {
            this.recalcBascet();
        }
    },

    methods: {
        showWin(){this.showed = true},
        hideWin(){ this.showed = false},
        
        createReserv() {
            
            let token = getCookie('nltoken'); 
            
            let goodsList = "";
            for (i = 0; i<this.bascet.length; i++) {
                goodsList += this.bascet[i].id+","+this.bascet[i].count+";"
                
            }

            let now =  new Date();
            let datStrFormat = now.getFullYear();
            console.log(datStrFormat);
            datStrFormat += ((Number(now.getMonth()+1) < 10)?"0"+Number(now.getMonth()+1):Number(now.getMonth()+1)).toString();
            console.log(datStrFormat);
            datStrFormat += ((now.getDate() < 10)?"0"+now.getDate():now.getDate()).toString();
            
            console.log(datStrFormat);

            this.showTovarloader = true;
            axios.get(this.linc,{
                params: {
                token:token,
                commandId:this.commandID,
                organizationId: localStorage.getItem("companyId"),
                date: datStrFormat,
                goodsString: goodsList,
                reservePrice: "0",
                comment:localStorage.getItem("companyLogin"),
                allBascet:JSON.stringify(this.bascet),
                userLogin: localStorage.getItem("companyLogin"),
                summ:this.bascetSumm,
                summBax:this.bascetSummBax,
                }
            })
            .then((response) => {
                if ((response != undefined)&&(response.status == 200))   
                {
                    this.showTovarloader = false;
                    this.clearBascet();
                     console.log(response.data.documentResponse);
                    alert("Резерв "+response.data.documentResponse.data.properties.id+" оформлен подробнее в разделе 'Документы'.");
                    // alert(response.data.documentResponse.status.message+ " № документа - "+response.data.documentResponse.data.id);
                    
                }   
            });
        },

        clearBascet() {
            this.bascetSumm = 0;
            this.bascetSummBax = 0;
            this.bascetCount = 0;
            this.bascet = [];

            localStorage.removeItem("bascet");
            localStorage.removeItem("bascetCount");
            localStorage.removeItem("bascetSumm");
            localStorage.removeItem("bascetSummBax");

            this.hideWin();
        },

        recalcBascet() {
            this.bascetSumm = 0;
            this.bascetSummBax = 0;
            this.bascetCount = 0;
            for (i = 0; i<this.bascet.length; i++) {
                
                this.bascet[i].subTotal = parseFloat((Number(this.bascet[i].count) * parseFloat(this.bascet[i].price)).toFixed(2));
                this.bascet[i].subTotalBax = parseFloat((Number(this.bascet[i].count) * parseFloat(this.bascet[i].priceBax)).toFixed(2));

                this.bascetSumm += parseFloat(this.bascet[i].subTotal);
                this.bascetSummBax +=  parseFloat(this.bascet[i].subTotalBax);
                
                this.bascetCount+=Number(this.bascet[i].count);

                if (this.bascet[i].count == 0) this.bascet.splice(i, 1);
            }

            this.bascetSumm = parseFloat(this.bascetSumm.toFixed(2));
            this.bascetSummBax =  parseFloat(this.bascetSummBax.toFixed(2));

            localStorage.setItem("bascet", JSON.stringify(this.bascet));
            localStorage.setItem("bascetCount", this.bascetCount);
            localStorage.setItem("bascetSumm", this.bascetSumm);
            localStorage.setItem("bascetSummBax", this.bascetSummBax);

            eventBus.$emit("update-bascet-count", this.bascetCount);
        },

        addToBascet(element) {
            
            
            let addet = true;
            for (i = 0; i<this.bascet.length; i++) {
                if (this.bascet[i].id == element.id)
                    {
                        this.bascet[i].count++;
                        addet = false;
                        break;
                    }
            }
            

            if (addet) {
                this.bascet.push(element);
            }

            this.recalcBascet();

        }

    }
});