// возвращает куки с указанным name,
// или undefined, если ничего не найдено
function getCookie(name) {
  let matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

function imgFilterById(arr, id) {
  return arr.filter(function(item, i, arr) {
      return (item.id == id);
  });
};

function priceCalc(priceStart) {
  let priceGrad = JSON.parse(localStorage.getItem("companyPriceGrad"));
  let priceUp = 1;
  priceGrad.forEach(function(item, i, arr) {

    if (item.price <= parseFloat(priceStart))
        {
          priceUp = item.priceupp;
          
        }
        else 
          return false; 
   });
   
    // for (j = 0; j<priceGrad.length; j++) {
    //   if (priceGrad[j].price <= parseFloat(priceStart))
    //     priceUp = priceGrad[j].priceupp;
    //   else 
    //     break;
   //}

  calcedPrice = Math.floor(parseFloat(priceStart)*parseFloat(priceUp) * 100 ) / 100;  
  return calcedPrice;
}
