export class OrderHelper implements Object {

  static _orderByComparator(a:any, b:any):number{

    if((isNaN(parseFloat(a)) || !isFinite(a)) || (isNaN(parseFloat(b)) || !isFinite(b))){
      //Isn't a number so lowercase the string to properly compare
      if(a.toLowerCase() < b.toLowerCase()) return -1;
      if(a.toLowerCase() > b.toLowerCase()) return 1;
    }
    else{
      //Parse strings as numbers to compare properly
      if(parseFloat(a) < parseFloat(b)) return -1;
      if(parseFloat(a) > parseFloat(b)) return 1;
    }

    return 0; //equal each other
  }

  static order(input:any, config, reverse): any{
    var propertyToCheck:string = !Array.isArray(config) ? config : config[0];

    //Basic array
    if(!propertyToCheck || propertyToCheck == '-' || propertyToCheck == '+'){
      return reverse ? input.sort() : input.sort().reverse();
    } else {
      var property:string = propertyToCheck.substr(0, 1) == '+' || propertyToCheck.substr(0, 1) == '-'
       ? propertyToCheck.substr(1)
       : propertyToCheck;

      return input.sort(function(a:any,b:any){
        return reverse
            ? OrderHelper._orderByComparator(a[property], b[property])
            : -OrderHelper._orderByComparator(a[property], b[property]);
      });
    }
  }
}
