/* TODO: check if s is put back into S correctly
 *
 *  
 */
const sizeLLC = 3 * 1024 * 1024;     //LLC size in B
const sizeEvictionBuffer = 4 * 1024 * 1024;
const associativity = 8;       //associativity
const sizeLine = 64;            //in B
const sizePage = 4 * 1024;        //in B
const threshold = 0.000002;
const k = 10000;

const debug = false;



function create_eviction_set(variableToAccess) {
    if (variableToAccess == undefined) {
        variableToAccess = 0;
    }
    var evictionBuffer = new ArrayBuffer(sizeEvictionBuffer);
    var probeView = new DataView(evictionBuffer);
    var testView = new DataView(evictionBuffer);
    var found = new Set();
    var missed = new Set();
    var confirmed = new Set();
    var trashed = new Set();
    console.assert(sizeEvictionBuffer % sizePage == 0, "evictionbuffer is not a multiple of page");

    //init evictionBuffer
    for (var i = 0; i < sizeEvictionBuffer; i += 4) {
        probeView.setUint32(i, (i + sizePage) % sizeEvictionBuffer);
    }


    var startAddress = variableToAccess % sizePage;
    var sizeS = sizeEvictionBuffer / sizePage;

    console.log("%cS: " + sizeS, 'color: #000000');
    for (var i = 0; i < k; i++) {

        // Invalidate the cache set
        var currentEntry = startAddress;
        do {
            currentEntry = probeView.getUint32(currentEntry);
        } while (currentEntry != startAddress);
        // Measure access time
        var startTime = window.performance.now(); s
        currentEntry = probeView.getUint32(variableToAccess);
        var endTime = window.performance.now();
        var t1 = endTime - startTime;

        //remove s
        var rand = Math.floor((Math.random() * sizeS) + 1);
        var s = startAddress;

        for (var j = 0; j < rand; j++) {
            currentEntry = s;
            s = probeView.getUint32(currentEntry);
        }
        probeView.setUint32(currentEntry, probeView.getUint32(s));
        var before_s = currentEntry;
        startAddress = before_s;

        // Invalidate the cache set
        var currentEntry = startAddress;
        do {
            currentEntry = probeView.getUint32(currentEntry);
        } while (currentEntry != startAddress);

        // Measure access time
        startTime = window.performance.now();
        currentEntry = probeView.getUint32(variableToAccess);
        endTime = window.performance.now();
        var t2 = endTime - startTime;


        if (t1 - t2 > threshold) {
            probeView.setUint32(before_s, s);
            if (debug) console.log("%c" + i + " Hit " + s + " t: " + (t1 - t2), 'color:green');
            if (found.has(s)) {
                if (debug) console.warn(s + " was confirmed");
                confirmed.add(s);
            } else {
                found.add(s);
            }


        } else {
            // console.log("Miss " + s + "t: " + (t1 - t2));
            if (found.has(s)) {
                if (debug) console.log("%c" + " s: " + s + " was removed" + " t: " + (t1 - t2), 'color:red');
                trashed.add(s);
            } else {
                missed.add(s);
            }
            sizeS--;
        }
        /*         if ((t1 - t2 > threshold)) {
                    var found = debug_32contains(probeView, s);
                    console.log("found s: " + s + " at: " + found + " difference: " + (s - found));
                } */


        if(sizeS == associativity) break;

    }

    console.log('--------------------------------------- Resulting Eviction Set ---------------------------------------');

    currentEntry = startAddress;
    do {
        var f = found.has(currentEntry);
        var c = confirmed.has(currentEntry);
        var t = trashed.has(currentEntry);
        var m = missed.has(currentEntry);

        var css = "";
        if (f) {
            css = "color:lightgreen";
        } else {
            css = "color:orange";
        }
        if (c) {
            css = "color:green";
        }
        if (t || m) {
            css = "color:red";
        }

        console.log("%c" + currentEntry
            + "\n\tfound:    \t" + f
            + "\n\tconfirmed:\t" + c
            + "\n\ttrashed:  \t" + t
            + "\n\tmissed:   \t" + m
            , css);
        currentEntry = probeView.getUint32(currentEntry);
    } while (currentEntry != startAddress)

    return true;
}

