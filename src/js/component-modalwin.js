
Vue.component('modalwin', {
    template: '#modal-win',
    data: function(){
        return{

            options: {
                items: 5,
                margin: 20,
                nav: true,
                dots: true,
                loop: true,
                timing: 'cubic-bezier(0, 0.72, 0.64, 1.06)',
                offset: 1,
                prevNav: 'Туда',
                nextNav: 'Сюда',
                sibling: true,
                responsive : {
                    0: {
                        items: 1
                    },
                    768: {
                        items: 3
                    },
                    999: {
                        items: 5
                    }
                }
            },

            imgDataNew: ["img/galery/1.jpg","img/galery/2.jpg"],
            imgData: ["<img src = 'img/galery/1.jpg'/>","<img src = 'img/galery/1.jpg'/>"],
            tovarInfo:{},  
            showed: false           
        }
    },

    created: function() {
        eventBus.$on("show-tovar-info", (tovarElem, imgList)=>{
            this.tovarInfo = tovarElem;
        
            //let dataImgTmp = [];
           
            let lastCount = this.imgData.length;

            for (var item in imgList) {
                this.imgData.push('<img src = "'+imgList[item].properties.Url.replace("&91","&100189258")+'"/>');
            }



             for (i = 0; i < lastCount; i++) {
                 this.imgData.shift();
            }
             

            if (this.imgData.length == 1)
            {
                this.imgData.push(this.imgData[0]);
            }
            //this.imgData = dataImgTmp;

            this.showWin();
        });
    },


    methods: {
        showWin(){this.showed = true},
        hideWin(){ this.showed = false}
    }

});