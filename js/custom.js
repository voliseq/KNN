/**
 * Created by Maciej on 2017-03-06.
 */

(function(){
    function KNN(data, k){
        var results = [],
            result = {},
            classAmounts = countClassAmount(data),
            finalClass,
            positiveResults = 0;
        giveId(data);
        data.map(function(refElem, index){
            var countResults = {};
            results[index] = [];
            data.map(function(elem){
                if(elem.id != refElem.id){
                    var distance = 0;
                    for (var property in elem) {
                        if (refElem.hasOwnProperty(property) && property != "Class" && property != "id") {
                            distance += Math.pow(elem[property] - refElem[property],2);
                        }
                    }
                    distance = Math.pow(distance, 1/2);
                    result = {distance: distance, "Class": elem["Class"]};
                    results[index].push(result);
                }
            });
            results[index].sort(function(a,b){
                return(a.distance - b.distance);
            });
            results[index] = results[index].splice(0, k);
            for(property in classAmounts){
                countResults[property] = 0;
            }
            results[index].map(function(elem){
                countResults[elem["Class"]] += 1/(Math.pow(elem.distance,1/4) * classAmounts[elem["Class"]]);
            });
            refElem.countResults = countResults;
            finalClass = Object.keys(countResults).reduce(function(a, b){ return countResults[a] > countResults[b] ? a : b });
            refElem.finalClass = finalClass;
            if(refElem["Class"] == refElem.finalClass) positiveResults++;



        });

        console.log((positiveResults / data.length) * 100 + "%");

    }

    function countClassAmount(data){
        var occurences = {};
        data.map(function(elem){
            if(occurences[elem["Class"]]){
                occurences[elem["Class"]]++;
            }else{
                occurences[elem["Class"]] = 1;
            }
        });
        return occurences;
    }

    function giveId(data) {
        data.map(function (elem, index) {
            elem.id = index;
        })
    }

    function printResults(data){
        var table = document.getElementById("table");
        for(var i = 0; i < data.length; i++){
            var row = table.insertRow(i+1);
            if(data[i]["Class"] != data[i]["finalClass"]){
                row.className = "error";
            }
            var cell1 = row.insertCell(0);
            var cell2 = row.insertCell(1);
            var cell3 = row.insertCell(2);
            var cell4 = row.insertCell(3);

            cell1.innerHTML = data[i].id;
            cell2.innerHTML = data[i]["Class"];
            var votes = '';
            for(property in data[i].countResults){
                votes += property;
                votes += " : ";
                votes += data[i].countResults[property].toFixed(2);
                votes += "<br>";
            };
            cell3.innerHTML = votes;
            cell4.innerHTML = data[i]["finalClass"];
        }
    }
    KNN(iris, 10);
    printResults(iris);

})();

