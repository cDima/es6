var calls = 0;
var cache = {};
function splitGame(arr, start, end){
    if (start === end) return 0;
    if (start > end) return -1000;
    
    if (cache[start + "-" + end] > 0) return cache[start + "-" + end];
    if (cache[arr.slice(start,end)] > 0) return cache[arr.slice(start,end)];
    calls++;
    
    log('splitGame('+start+','+end+')');//; arr:' + arr.slice(start, end));
    // start = 0; end = length (needs - 1)
    
    let left = 0, right = 0;
    
    for(let i = start; i < end; i++){
        right += arr[i];
    } 
    
    if (right == 1) return 0;
    log(' sum=' + right);
    
    let maxLvl = 0;
    for(let i = start; i + 1 < end; i++){
        left += arr[i];
        right -= arr[i];
        if (right < left) break;
        //log(' left?=right: ' + left + '?=' + right);
        if (left === right){
            log(' left==right:' + left + ' i:' + i);// + ' arr:' + arr.slice(start, end) + ' start:' + start + ' end:' + end);
            let levelsLeft = splitGame(arr, start, i+1);
            let levelsRight = splitGame(arr, i+1, end);
            let m = 0;
            if (levelsLeft != -1) {
                m = levelsLeft;
            }
            if (levelsRight != -1 && levelsRight > levelsLeft) {
                m = levelsRight;
            }
            if (m >= 0 && maxLvl < m + 1) {
                maxLvl = Math.max(m + 1, maxLvl);
                if (maxLvl == (end - start)/2) return maxLvl;
            }
        }
    }
    log(' returning maxLvl:' + maxLvl);
    cache[start + "-" + end] = maxLvl;
    cache[arr.slice(start,end)] = maxLvl;
    return maxLvl;
}
function log(s){
    console.log(s);
}
function processData(input) {
    //Enter your code here
    let ins = input.split('\n');
    let n = Number.parseInt(ins[0]);
    for(let i = 0; i < n; i++){
        let arr = ins[(i*2)+2].split(' ').map(Number);
        cache = {};
        let ans = splitGame(arr, 0, arr.length);
        console.log(ans);
        log('in calls: ' + calls);
    }
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