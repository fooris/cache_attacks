/*
 *
 * 
 * 
*/
const sizeLLC = 3 * 1024 * 1024;     //LLC size in B
const sizeEvictionBuffer = 4 * 1024 * 1024;
const nrLinesPerSet = 8;       //associativity
const sizeLine = 64;            //in B
const sizePage = 4 * 1024;        //in B
const threshold = 0.005;

var page_aligned = true;

const k = 10000;                    //max. number of repetitions in create_eviction_set

var buffer = new ArrayBuffer(sizeLLC);
var base = new Int32Array(buffer);

var counter = 0;
var evictionSet = new Set();

var output = document.getElementById("output");

function create_eviction_set() {
    console.log("sizeLLC: \t\t" + sizeLLC / (1024 * 1024) + " MB\n" +
        "sizeEvictionBuffer: \t" + sizeEvictionBuffer / (1024 * 1024) + " MB\n" +
        "nrLinesPerSet: \t\t" + nrLinesPerSet + "\n" +
        "sizeLine: \t\t" + sizeLine + " B \n" +
        "sizePage: \t\t" + sizePage / 1024 + "KB \n" +
        "threshold: \t\t" + threshold + "s \n" +
        "max Iterations k: \t" + k + "\n" +
        "page-aligned? \t\t" + page_aligned + "\n------------------");

    var x = 0;
    var i;

    /*------------ init S ------------*/
    console.log("initializing S...");
    console.log(sizeEvictionBuffer / (page_aligned ? sizePage : sizeLine));

    var S = new Array(sizeEvictionBuffer / (page_aligned ? sizePage / 4 : sizeLine / 4) - 1);
    for (i = 1; i < S.length; i++) {
        var addr = i * (page_aligned ? sizePage / 4 : sizeLine / 4);
        if (x == addr) {
            i--;
            continue;
        }
        S[i] = (addr);
        base[addr] = 1;
    }
    console.log("shuffling S...");
    S = shuffle(S);
    console.log("Size S: " + S.length);
    console.log("start...");

    /*-----------------  START  -----------------*/
    var j;
    for (j = 0; j < k && S.length > 0; j++) {
        var i;
        /*------------ step a) ------------*/
        for (i = 1; i < S.length; i++) {
            var arbitrary = base[S[i]];
        }
        /*------------ step b) ------------*/
        var t1 = timeAccessVar(x);
        /*------------ step c) ------------*/
        var s = S.pop();    //has to be random?    
        /*------------ step d) ------------*/
        for (i = 1; i < S.length; i++) {
            var arbitrary = base[S[i]];
        }
        /*------------ step e) ------------*/
        var t2 = timeAccessVar(x);
        /*------------ step f) ------------*/
        if (t1 - t2 > threshold) {
            S.unshift(s);
            console.log(counter++ + " Hit: " + s + " Time: " + (t1 - t2));
            evictionSet.add(s);
        }/*  else {
            if (evictionSet.has(s)) {
                //console.log("---" + --counter + " aww shiat: " + s + " Time: " + (t1 - t2));
            }
        } */
    }
    if (S.length != nrLinesPerSet) console.log("FAILURE: " + S.length);
    else {
        console.log("Success " + S.length + " " + evictionSet.size);
        S.forEach(function (s) {
            console.log(s);
        });
    }
    /*-----------------   STOP   -----------------*/
}

/* 
 * access variable at index x of base and return access-time
 */
function timeAccessVar(x) {
    var t1 = performance.now();
    var c = base[x];
    var t2 = performance.now();
    return t2 - t1;

}

/* 
 * credit: https://bost.ocks.org/mike/shuffle/
 */
function shuffle(array) {

    var m = array.length, t, i;

    // While there remain elements to shuffle…
    while (m) {

        // Pick a remaining element…
        i = Math.floor(Math.random() * m--);

        // And swap it with the current element.
        t = array[m];
        array[m] = array[i];
        array[i] = t;
    }

    return array;
}


/*------------ run ------------*/
create_eviction_set();