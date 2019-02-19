/*
 * lektorium course: Java Script
 * homework #4.1: task 1 -- make own implementations of array methods forEach(), map(), sort(), filter()
 * made by Vitaliy Dovgan
 *
 * 1. Создать новые методы для всех массивов:
 * 1) myForEach - тот же самый forEach
 * 2) myMap - тот же самый map
 * 3) mySort - тот же самый sort
 * 4) myFilter - тот же самый filter
 * p.s. внутри нельзя использовать готовые методы массива, никакие
 */

var arrays = [
  [NaN,, undefined, 1, -1, null, 6, true, 0, Infinity, { key: 'val' }, false, () => {}, '', 0, ['arr', 100], -17], // 0
  [3, 0, -5, 1, 44, -12, 3, 0, 0, 1, 2, -3, -3, 2, 1, 4, -6], // 1
  [-1, -8, -2], // 2
  [1, 7, 3], // 3
  [1, undefined, 3, 5, -3], // 4
  [1, NaN, 3, 5, -3], // 5
  [NaN, undefined, 1, -7, null, 6], // 6
  [null, 1000, Infinity, 3000], // 7
  [], // 8
  [20,19,18,17,16,15,,], // 9
  [,undefined,,,8,undefined], // 10
  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17], // 11
  [1, 2, 3, 4, 5, 6, 7, 8, 80, -8, 9] // 12
]

/* About Array.prototype.forEach()::
   Always returns undefined.
   It is not invoked for index properties that have been deleted or are uninitialized (i.e. on sparse arrays).
   The range of elements processed by forEach() is set before the first invocation of callback.
   Elements that are appended after the call to forEach() begins, will not be visited by callback.
   If the values of existing elements of the array are changed, the value passed to callback will be the value at the time forEach() visits them;
   elements that are deleted before being visited are not visited.
*/
Array.prototype.myForEach = function(callback, thisArg) {
  var arr = this
  var arrLen = arr.length
  var context = arguments.length > 1 ? thisArg : undefined

  for (let index = 0; index < arrLen; index++) {
    if (index in arr) {
      callback.call(context, arr[index], index, arr)
    }
  }

  return undefined
}

/* About Array.prototype.map()::
   Callback is invoked only for indexes of the array which have assigned values, including undefined.
   Callback is not called for missing elements of the array (that is, indexes that have never been set,
   which have been deleted or which have never been assigned a value).
   Callback is invoked with three arguments: the value of the element, the index of the element, and the Array object being traversed.
   map does not mutate the array on which it is called (although callback, if invoked, may do so).
   The range of elements processed by map is set before the first invocation of callback.
   Elements which are appended to the array after the call to map begins will not be visited by callback.
   If existing elements of the array are changed, their value as passed to callback will be the value at the time map visits them.
   Elements that are deleted after the call to map begins and before being visited are not visited.
   Due to the algorithm defined in the specification if the array which map was called upon is sparse,
   resulting array will also be sparse keeping same indices blank.
*/
Array.prototype.myMap = function(callback, thisArg) {
  var arr = this
  var arrLen = arr.length
  var mappedArr = new Array(arrLen)
  var context = arguments.length > 1 ? thisArg : undefined

  for (let index = 0; index < arrLen; index++) {
    if (index in arr) {
      mappedArr[index] = callback.call(context, arr[index], index, arr)
    }
  }

  return mappedArr
}

/* About Array.prototype.filter()::
   Returns a new array with the elements that pass the test. If no elements pass the test, an empty array will be returned.
   filter() does not mutate the array on which it is called.
   filter() calls a provided callback function once for each element in an array,
   and constructs a new array of all the values for which callback returns a value that coerces to true.
   Callback is invoked only for indexes of the array which have assigned values;
   it is not invoked for indexes which have been deleted or which have never been assigned values.
   Array elements which do not pass the callback test are simply skipped, and are not included in the new array.
   The range of elements processed by filter() is set before the first invocation of callback.
   Elements which are appended to the array after the call to filter() begins will not be visited by callback.
   If existing elements of the array are changed, or deleted, their value as passed to callback will be the value at the time filter() visits them;
   elements that are deleted are not visited.
*/
Array.prototype.myFilter = function(callback, thisArg) {
  var arr = this
  var arrLen = arr.length
  var filteredArr = []
  var context = arguments.length > 1 ? thisArg : undefined

  for (let index = 0; index < arrLen; index++) {
    if ((index in arr) && callback.call(context, arr[index], index, arr)) {
      filteredArr[filteredArr.length] = arr[index]
    }
  }

  return filteredArr
}

/* About Array.prototype.sort()::
   Sorts the elements of an array _in_place_ and returns the array.
   If compareFunc is not supplied, all non-undefined array elements are sorted (using a quicksort algorithm)
   by converting them to strings and comparing strings in UTF-16 code units order.
   All undefined elements are sorted to the end of the array, with no call to compareFunc.
   All empty slots are sorted to the VERY END (beyond undefined) of the array (found out by testing the original sort() behaviour in Firefox and Google Chrome).
   If compareFunc is supplied, all non-undefined array elements are sorted according to the return value of the compare function.
   If a and b are two elements being compared, then:
     if compareFunc(a, b) is less than 0, sort a to an index lower than b, i.e. a comes first;
     if compareFunc(a, b) returns 0, leave a and b unchanged with respect to each other, but sorted with respect to all different elements.
       Note: the ECMAscript standard does not guarantee this behaviour, and thus not all browsers respect this.
     if compareFunc(a, b) is greater than 0, sort b to an index lower than a, i.e. b comes first.
   compareFunc(a, b) must always return the same value when given a specific pair of elements a and b as its two arguments;
   if inconsistent results are returned then the sort order is undefined.
*/
Array.prototype.mySort = function(compareFunc) {
  var arr = this
  var arrTemp = []
  var undefsCount = emptysCount = 0

  function doQuickSort (minIndex, maxIndex) { // a recursive quicksort algorithm
    var pivotVal
    var lowerIndex = minIndex
    var upperIndex = maxIndex
    var changed = false

    if ((maxIndex - minIndex) < 1) { // if the elements range has no (enough) elements to perform sorting
      return arr
    }

    pivotVal = arr[minIndex + ((maxIndex - minIndex) >>> 1)] // getting the pivot value

    do { // dividing the range
      while ((lowerIndex <= upperIndex) && compareFunc(arr[upperIndex], pivotVal) > 0) {
        upperIndex--
      } // <- looking for the element smaller than the pivot to the right of lowerIndex
      while ((lowerIndex <= upperIndex) && compareFunc(arr[lowerIndex], pivotVal) < 0) {
        lowerIndex++
      } // <- looking for the element greater than the pivot to the left of upperIndex

      if (lowerIndex <= upperIndex) { // swapping the elements
        [arr[lowerIndex], arr[upperIndex]] = [arr[upperIndex], arr[lowerIndex]]
        changed = true
        lowerIndex++
        upperIndex--
      }
    } while (lowerIndex <= upperIndex)
    if (changed) { // if any changes were made to the current elements range...
      doQuickSort(minIndex, upperIndex) // ...recur the process for the left part
      doQuickSort(lowerIndex, maxIndex) // ...recur the process for the right part
    }
  }

  if (typeof compareFunc !== 'function') { // if compareFunc wasn't passed -- using the default functionality
    compareFunc = function (val1, val2) {
      if (String(val1) < String(val2)) {
        return -1
      }
      if (String(val1) > String(val2)) {
        return 1
      }
      return 0 // both the args are equal as strings
    }
  }

  //that's where the process actually starts

  for (let i = 0; i < arr.length; i++) { // counting the amounts of undefs and emptys; extracting all other (defined) elements to the temp array
    if (!(i in arr)) {
      emptysCount++
    } else if (arr[i] === undefined) {
      undefsCount++
    } else {
      arrTemp[arrTemp.length] = arr[i]
    }
  }
  arr.length = 0
  for (let i = 0; i < arrTemp.length; i++) { // copying all defined elements to the source array
      arr[i] = arrTemp[i]
  } // for the moment arr contains only quicksortable defined elements (w/o undefs and emptys)
  delete arrTemp

  doQuickSort(0, arr.length - 1) // doing the quicksort

  for (let i = undefsCount; i > 0; i--) { // recreating all undefined elems at the end
    arr[arr.length] = undefined
  }
  arr.length += emptysCount // recreating all the emptys at the very end

  return arr
}

// callback functions for demos

var testMyForEach = function (arrVal, i) { // displaying each non-empty element as a string
  console.log('Elem ' + i + ': \'' + String(arrVal) + '\'')
}

var testMyMap = function (arrVal, i) { // marking all non-empty non-finite elements
  return Number.isFinite(arrVal) ? arrVal : '[' + i + '] isn\'t finite'
}

var testMyFilter = function (arrVal) { // keeping finite elements only
  return Number.isFinite(arrVal)
}

var testMySort = function (val1, val2) { // sorting all finite elements to the left
  if (!Number.isFinite(val1)) {
    return 1
  }
  if (!Number.isFinite(val2)) {
    return -1
  }
  return val1 - val2
}

// demoing all things

console.clear()

// myForEach demo
console.log('\nmyForEach :: Displaying each non-empty element as a string:')
arrays[0].myForEach(testMyForEach)

// myMap demo
console.log('\nmyMap :: Marking all non-empty non-finite elements: ', arrays[0].myMap(testMyMap))

// myFilter demo
console.log('\nmyFilter :: Finite elements only: ', arrays[0].myFilter(testMyFilter))

// mySort demo
console.log('\nmySort ::')
arrays[0].mySort() // sorting is performed in-place, and...
console.log('default mySorting: ', arrays[0])
console.log('mySorting all finite elements to the left: ', arrays[0].mySort(testMySort)) // ...the sorted array is returned by the method itself as well
