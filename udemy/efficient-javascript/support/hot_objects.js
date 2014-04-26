// ------------------- Hot Objects ---------------------------------------------

var packed_array = {'a':0, 'b':1, 'c':2, 'd':3, 'e':4, 'f':5, 'g':6, 'h':7,
    'i':8, 'j':9, 'k':10};

var holey_array1 = {'a':0, 'b':1, 'c':2, 'd':3, 'e':4, 'f':5, 'g':6, 'h':7,
    'i':8, 'j':9, 'k':10};

delete holey_array1.a;

var holey_array2 = {'a':0, 'b':1, 'c':2, 'd':3, 'e':4, 'f':5, 'g':6, 'h':7,
    'i':8, 'j':9, 'k':10};

holey_array2.a = 3;

function packed_sum() {
    var sum = 0;

    for (var key in packed_array) {
        sum += packed_array[key];
    }
}//10M ops / sec

function holey_sum1() {
    var sum = 0;

    for (var key in holey_array1) {
        sum += holey_array1[key];
    }
}//600K ops / sec

function holey_sum2() {
    var sum = 0;

    for (var key in holey_array2) {
        sum += holey_array2[key];
    }
}//10M ops / sec

// Corollary 1:
// For "HOT" objects; don't use delete,
// instead of `delete obj.foo` use `obj.foo = null;`

// Corollary 2:
// Don't play with hot objects.
// If the object will be used frequently,
// don't modify it after it has been initialized.


/// write a couple of artilcesl in in brewsapce;
