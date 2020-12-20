var storage = firebase.storage();
var storageRef = storage.ref();

var bucketList = []

storageRef.child('images/').listAll().then(function(result){
    var myArray = Object.values(result)
    for (let index = 0; index < myArray[0].prefixes.length; index++) {
        var path = myArray[0].prefixes[index]._location.path_;
        bucketList[index] = path
    }
    selectHtml = '<select class="uk-select bucket_select" id="directory_list">';
    for (let index = 0; index < bucketList.length; index++) {
        opt_ = "<option><b>" + bucketList[index] + "</></option>";
        selectHtml += opt_
    }
    selectHtml += "</select>";
    console.log(selectHtml)
    document.getElementById("bucket_list").innerHTML = selectHtml
})
console.log(bucketList)

