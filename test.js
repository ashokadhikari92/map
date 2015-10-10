/**
 * Created by silentflutes on 10/10/2015.
 */

var sum=0;
var districtArray=[1,2,3,4,5];

function getSum(){

    for(var district=0;district<districtArray.length;district++) {

            sum += parseInt(districtArray[district]);

    }
}
getSum();
console.log(sum);