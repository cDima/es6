function processData(blob) {
    //Enter your code here
    let input = blob.split('\n');
    let nmk = input[0].split(' ');
    
    let n = nmk[0],  
        m = nmk[1], 
        k = nmk[2];
        
    let rows = new Map();
    
    for(let i = 0; i < k; i++){
        let trainline = input[i+1].split(' ');
        let r = (trainline[0] - 1), 
            c1 = Number.parseInt(trainline[1]) - 1, 
            c2 = Number.parseInt(trainline[2]);
        if (m < c2) c2 = m;
        log('n='+ n + ' r=' + r);
        if(n < r) break;
        
        if(!rows.has(r)) {
            rows.set(r, []);
        }
        rows.get(r).push({c1: c1, c2: c2});
    }
    
    let answer = n*m;
    log('rows first: ' + rows);
    // for each row, figure out mix of overlap 
    for(let [r, trains] of rows){ // O(n...)    
        log(trains);
        for(let t1 = 0; t1 < trains.length - 1; t1++){
            for(let t2 = t1 + 1; t2 < trains.length; t2++){ // O(k!)
                
                let firstTrain = trains[t1].c1 < trains[t2].c1 ? trains[t1] : trains[t2];
                let secondTrain = firstTrain === trains[t1] ? trains[t2] : trains[t1]; 
                log('t1:' + t1+ ' t2:' + t2 + ' first train: ' + firstTrain.c1 + ', second: ' + secondTrain.c1);
                
                if(secondTrain.c1 < firstTrain.c2) {
                    log('shrinking second train to start at ' +  firstTrain.c2);
                    secondTrain.c1 = firstTrain.c2;
                }
            }
        }
        log(trains);
        let trainLength = 0;
        for(let t of trains){
            log('t:' + t + ' c1: ' + t.c1 + ' c2: ' + t.c2);
            if(t.c1 <= t.c2) {
                trainLength += t.c2 - t.c1;
            }
        }
        answer -= trainLength;
        log('trainLength: ' + trainLength);
    }
    for(let [r, trains] of rows){ // O(n...)    
        log(trains);
    }
    console.log(answer);
} 

function log(s) { 
    //console.log(s); 
}

process.stdin.resume();
process.stdin.setEncoding("ascii");
_input = "";
process.stdin.on("data", function (input) {
    _input += input;
});

process.stdin.on("end", function () {
   processData(_input);
});
