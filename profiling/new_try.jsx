/* TODO: check if s is put back into S correctly
 *
 *  
 */
const sizeLLC = 3 * 1024 * 1024;     //LLC size in B
const sizeEvictionBuffer = 4 * 1024 * 1024;
const associativity = 8;       //associativity
const sizeLine = 64;            //in B
const sizePage = 4 * 1024;        //in B
const threshold = 0.0005;
const k = 10000;



function create_eviction_set(variableToAccess) {
    var evictionBuffer = new ArrayBuffer(sizeEvictionBuffer);
    var probeView = new DataView(evictionBuffer);
    var testView = new DataView(evictionBuffer);
    var found = new Set();
    var f = 0, m = 0;
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
            console.log("%c" + i + " Hit " + s + " t: " + (t1 - t2), 'color:green');
            found.add(s);
            f++;
        } else {
            // console.log("Miss " + s + "t: " + (t1 - t2));
            if(found.has(s)){
                console.log("%c" + i  + " s: " + s + " was removed" + " t: " + (t1 - t2), 'color:red');
                m++;
            } 
            sizeS--;
        }
/*         if ((t1 - t2 > threshold)) {
            var found = debug_32contains(probeView, s);
            console.log("found s: " + s + " at: " + found + " difference: " + (s - found));
        } */

        if (sizeS == 1 /* associativity */) {
            break;
        }
        
    }

    console.log("%cfound: " + f + " missed: " + m, 'color:grey');
    currentEntry = startAddress;
    do {
        console.log("%c" + currentEntry, 'color:black');
        currentEntry = probeView.getUint32(currentEntry);
    } while (currentEntry != startAddress)
}

create_eviction_set(0);