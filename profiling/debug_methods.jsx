function debug_32contains(view, variable){
    for(var i = 0; i < view.byteLength; i+=4){
        if(variable === view.getUint32(i) ) return i;
    }
    return 0;
}
