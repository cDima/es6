//console.log("MinHeap tests");

function log(text, style = 'color: #000'){
    console.log('%c ' + text, style);
    document.writeln(`<div style="${style}">${text}</div>`);
}

class MinHeap{
    constructor(arr, debugging=false){
        this.debugging = debugging;
        if(arr) { 
            this.size = arr.length; 
            this.arr = arr;
        } else {
            this.size = 0;
            this.arr = new Array(2);
            this.arr.fill( 0);
        }
    }
    get length() {
        return this.size;
    }
    arrLength() {
        return this.arr.length;
    }
    add(i){
        this.ensureExtraSpace();
        this.debug('adding ' + i);
        if (i.constructor === Array) {
            for(let z of i){
                this.add(z);
            }
        } else {
            this.arr[this.size] = i;
            this.size++;
            this.heapifyUp();
        }
        return i;
    }
    ensureExtraSpace(){
        if (this.arr.length === this.size) {
            // at capacity, should enlarge array twice
            let newArr = new Array(this.size*2);
            for(let i = 0; i < this.arr.length; i++){
                newArr[i] = this.arr[i];
            }
            this.arr = newArr;
            this.arr.fill(0, this.size)
        }
    }
    toString() {
        let s = '';
        for(let k of this.arr) {
            s += k + ',';
        }
        s = s.substr(0, s.length - 1);
        return `size=${this.size}, arrlen=${this.arr.length}, [${s}]`;
    }
    print(){
        this.debug(this.toString() + ';' + this.printTree());
    }
    printTree(){
        let s = '';
        for(let i = 0; i < (this.size - 1) / 2; i++){
            s += ` (${this.arr[i]} < ${this.leftChild(i)}${this.hasRightChild(i) ? ',' + this.rightChild(i) : ''})`;
        }
        return s;
    }
    getLeftChildIndex(parentIndex) {
        return parentIndex * 2 + 1; // 0-> 1; 3 -> 7; 2 -> 5; 
    }
    getRightChildIndex(parentIndex){
        return parentIndex * 2 + 2; // 0 -> 2; 2 -> 6; 5 -> 12;
    }
    getParentIndex(childIndex) {
        if (childIndex === 0) throw new RangeError("childIndex needs to be more than 0");
        return Math.floor((childIndex - 1) / 2); // 9 -> 4; 10 -> 4;
    }
    hasLeftChild(index){
        return  this.getLeftChildIndex(index) < this.size;
    }
    hasRightChild(index){
        return  this.getRightChildIndex(index) < this.size;
    }
    hasParent(index){
        return  this.getParentIndex(index) >= 0;
    }
    leftChild(index){
        if (!this.hasLeftChild(index)) throw new RangeError(`"left child of ${index} doesn't exist`); 
        return this.arr[this.getLeftChildIndex(index)];
    }
    rightChild(index){
        if (!this.hasRightChild(index)) throw new RangeError(`right child of ${index} doesn't exist`); 
        return this.arr[this.getRightChildIndex(index)];
    }
    parent(index){
        if (!this.hasParent(index)) throw new RangeError(`parent pf ${index} doesn't exist`); 
        return this.arr[this.getParentIndex(index)];
    }
    peek() {
        if (this.size == 0) throw RangeError("size is 0");
        return this.arr[0];
    }
    pull(){
        if(this.size == 0) throw RangeError("size == 0");
        var item = this.arr[0];
        this.debug('pull item: ' + item);
        this.arr[0] = this.arr[this.size - 1];
        this.arr[this.size - 1] = 0;
        this.size--;
        this.heapifyDown();
        return item;
    }
    remove(n) { // o(n) -> binary search o(log n)
        if (this.arr[0] == n) {
            this.pull(); // remove element;
            return;
        }
        if (this.arr[this.size - 1] == n) {
            this.arr[this.size - 1] = 0;
            this.size--;
            return;
        }
        for(let i = 1; i < this.size - 1; i++){
            if (this.arr[i] == n) {
                // replace element with farthest right node on lower level, if not last.
                // sift up if replacement node is smaller than n, else down;
                this.debug(`replacing element [${i}]=${n} with [${this.size - 1}]=${this.arr[this.size - 1]}`);
                this.arr[i] = this.arr[this.size - 1];
                this.arr[this.size - 1] = 0;
                this.size--;
                if (this.arr[i] <= n) this.heapifyUp(i);
                else this.heapifyDown();
                return;
            }
        }
        throw new RangeError("can't remove non-existent element " + n);
    }
    replace(i){ // o(log-n)
        if(this.size == 0) throw RangeError("size == 0");
        var item = this.arr[0];
        this.debug('replace item: ' + item);
        this.arr[0] = i;
        this.heapifyDown();
        return item;
    }
    swap(index1, index2){
        this.debug(`swapped arr[${index1}]=${this.arr[index1]} with arr[${index2}]=${this.arr[index2]}`);
        let temp = this.arr[index1];
        this.arr[index1] = this.arr[index2];
        this.arr[index2] = temp;
    }
    heapifyUp(fromIndex = this.size - 1){
        if (fromIndex == 0) return; // already balanced if single element;
        this.debug("heapifyUp for arr[" + fromIndex + "]=" + this.arr[fromIndex] + ", parent [" + this.getParentIndex(fromIndex) + "]=" + this.parent(fromIndex));
        if (this.arr[fromIndex] < this.parent(fromIndex)) {
            let parentIndex = this.getParentIndex(fromIndex);
            this.swap(fromIndex, parentIndex);
            this.heapifyUp(parentIndex);
        }
    }
    heapifyDown(fromIndex = 0){
        if (fromIndex == this.size - 1) return; // can't go lower than last element
        this.debug(`heapifyDown arr[${fromIndex}]=${this.arr[fromIndex]}`);
        let item = this.arr[fromIndex]; 
        if(this.hasLeftChild(fromIndex)){
            let smallerChildIndex = this.getLeftChildIndex(fromIndex);
            if (this.hasRightChild(fromIndex) && this.rightChild(fromIndex) < this.leftChild(fromIndex)){
                // right is smaller, use it
                smallerChildIndex = this.getRightChildIndex(fromIndex);
            }
            if(this.arr[smallerChildIndex] < item) {
                this.swap(fromIndex, smallerChildIndex);
                this.heapifyDown(smallerChildIndex);
            }
        }
    }
    debug(s){
        if (this.debugging) log('  ' + s, 'color: #aaa');
    }
}

class MaxHeap extends MinHeap {
    add(i) {
        return -super.add(-i);
    }
    pull(){
        return -super.pull();
    }
    peek(){
        return -super.peek();
    }
    remove(i){
        return -super.remove(-i);
    }
    replace(i){
        return -super.replace(-i);
    }
}

/*
const m = new MinHeap();
const max = new MaxHeap();

m.print();
m.add(15);
m.add(7);
m.add([8,9,10]);
m.add([20,2, 5, 6]);
m.print();
log(m.pull());
m.print();
log(m.pull());
log(m.pull());
log(m.pull());
m.print();

log([m.pull(),m.pull(),m.pull(),m.pull(),m.pull()]);
log(m.length);


max.add(5);
max.add(4);
max.add(6);
max.add(3);
max.add(7);
max.add(5);
max.add(10);
max.replace(11);
log(max.length);
log([max.pull(),max.pull(),max.pull(),max.pull(),max.pull(),max.pull(),max.pull()]);
*/

let  a = [1,2,3,4,5,6,7,8,9,10];
let answer = [1.0,1.5,2.0,2.5,3.0,3.5,4.0,4.5,5.0,5.5];

a = [1,1,3,6];
answer = [1,1,1,3.5];

// find median out of sequence:

// 1. place maxheap, rebalance = o(log n);
// 2. rebalance = if first is larger by 2, pop from it into second

class MedianFinder {
    constructor(debugging = false) {
        this.debugging = debugging;
        this.leftHalf = new MaxHeap([], debugging);
        this.rightHalf = new MinHeap([], debugging);
    }
    add(i) { // O(log n);
        // need to have both halves balanced, with left maybe 1 larger;
        // need to ensure left half is smaller than i if inseating to it
        // need to ensure i is larger than smallest right half peek if inserting
        this.debug('MedianFinder: adding i=' + i);
        if (this.leftHalf.length === 0 
            || i <= this.leftHalf.peek()) {
            this.leftHalf.add(i);
        } else { // larger than left half's max - goes to right
            this.rightHalf.add(i);
        }
        this.rebalance();
    }
    rebalance(){
        //this.debug('MedianFinder: rebalancing ' + this.leftHalf.length  + "," + this.rightHalf.length);
        if (this.leftHalf.length < this.rightHalf.length) { // strictly
            this.leftHalf.add(this.rightHalf.pull());
        } else if (this.leftHalf.length - 1 > this.rightHalf.length) {
            this.rightHalf.add(this.leftHalf.pull());
        }
        this.debug('MedianFinder: rebalanced ' + this.leftHalf.length  + "," + this.rightHalf.length + ". "
            + this.leftHalf.printTree()  + "," + this.rightHalf.printTree());
    }
    remove(i){
        this.debug('removing ' + i);
        if (this.leftHalf.length > 0 && this.leftHalf.peek() >= i) {
            this.leftHalf.remove(i);
        } else {
            this.rightHalf.remove(i);
        }
        this.rebalance();
    }
    median() {
        if (this.leftHalf.length == 0) throw RangeError("size == 0");
        if (this.leftHalf.length !== this.rightHalf.length) {
            this.debug('odd number - ' + this.leftHalf.peek());
            return this.leftHalf.peek();
        } 
        let m = (this.leftHalf.peek() + this.rightHalf.peek()) / 2;
        this.debug(`((${this.leftHalf.peek()}+${this.rightHalf.peek()})/2)=${m}`);
        return m;
    }
    debug (s) {
        if(this.debugging) log(' ' + s);
    }
    print(){
        this.leftHalf.print();
        this.rightHalf.print();
    }
}

function oneDecimal(m){
    return parseFloat(Math.round(m * 100) / 100).toFixed(1);
}

function findMedianFromSequence(a){
    var medianFinder = new MedianFinder(true);
    for(let i = 0; i < a.length; i++){
        medianFinder.add(a[i]);
        let m = medianFinder.median();
        //console.log(oneDecimal(m));
        log(oneDecimal(m) + "===" + oneDecimal(answer[i]));
    }
}

//a = [94455,20555,20535,53125,73634,148,63772];
//answer = [94455.0,57505.0,20555.0,36840.0,53125.0,36840.0,53125.0];
//a = [4,3,2,1];
//answer = [4,3.5,3,2.5];

//findMedianFromSequence(a); // o(n * log-n)

//parseFloat(Math.round(m * 10) / 10).toFixed(1)

/*
let minh = new MinHeap([], true);
minh.add(2);
minh.add(5);
minh.add(12);
minh.add(1);
minh.add(3);
minh.print();
minh.remove(12);
minh.print();
minh.remove(1);
minh.print();
minh.remove(2);
minh.print();
minh.remove(5);
minh.print();
*/

let z = `9 5
2 3 4 2 3 6 8 4 5`;
z = `5 4
1 2 3 4 4`;

class CountingSort {
    constructor(max = 200, size = 0){
        this.max = max;
        this.size = size;
        this.data = new Array(max);
        this.data.fill(0);
    }
    add(i){
        this.data[i]++;
        this.size++;
    }
    remove(i){
        this.data[i]--;
        this.size--;
    }
    median (){
        let answer = 0.0;
        let nth = 1 + Math.floor(this.size / 2);
        let isEven = this.size % 2 == 0;
        if (isEven) nth--;

        let freq = 0;
        for(let i = 0; i < this.max; i++){
            freq += this.data[i] || 0;
            if (nth <= freq) {
                if(!isEven) return i;
                else {
                    answer = i;
                    nth++;
                    while(freq < nth){
                        freq += this.data[++i];
                    } 
                    answer += i;
                    //log("found second ith = answer=" + answer);
                    return (answer / 2); 
                }
            }
        }
        throw new Error("did not find median, size=" + this.size);
    }
}

var c = new CountingSort(200);
c.add(1);
log(c.median());
c.add(2);
log(c.median());
c.add(3);
log(c.median());
c.add(4);
log(c.median());
c.add(4);
log(c.median());


class FraudulentAlerts {
    constructor(n, arr){
        this.n = n;
        this.arr = arr;
    }
    countAlerts(){
        let c = new CountingSort(200);
        let answer = 0;
        for(let i = 0; i < this.n; i++){
            c.add(this.arr[i]); // o(log n);
        }
        for(let i = this.n; i < this.arr.length; i++){
            let median = c.median(); 
            if ((median * 2) <= this.arr[i]) answer++;
            //console.log(median + ",answer=" + answer);
            //this.debug('calling remove:' + this.arr[i - 1]);
            c.remove(this.arr[i - this.n]);
            c.add(this.arr[i]);
        }
        return answer;
    }
}

// function log(s) { console.log(s); }

function fraudulentAlertsInput(input){
    var ins = input.split('\n');
    var n = ins[0].split(' ')[1];
    var arr = ins[1].split(' ').map(Number);
    var f = new FraudulentAlerts(n, arr);
    console.log(f.countAlerts());
} 
