# cache_attacks

this code was created as part of my Seminar.
the profiling algorithms are based on the algorithm described in
"The Spy in the Sandbox: Practical Cache Attacks in JavaScript and their Implications", 2015
by Yossef Oren, Vasileios P. Kemerlis, Simha Sethumadhavan, Angelos D. Keromytis 

graph:      plot the access time of a single variable
profile:    contains javscript files to create eviction sets
            - old creates several eviction sets but is implemented inefficiently
            - new is more efficient but only creates one eviction
