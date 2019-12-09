var lowColor = "#54003D";
var highColor = "#004E29";
var medColor = "#00074E";

document.addEventListener('deviceready', onDeviceReady, false);   
function onDeviceReady(){
    var size =0;
    var type = LocalFileSystem.PERSISTENT;  
    window.requestFileSystem(type, size, fileSuccess, errorCall);
        function fileSuccess(fs){
            fs.root.getFile('t5.txt', {create: true, exclusive: false}, function(fileEntry){
            if (!fileEntry.isFile)
                writeFile(fileEntry, null);
            }, errorCall);
        }
    categoryPaste();
    tablePaste();
    checkDate();
}
function errorCall(error){
    alert("Error Code: "+ error.code + error);
}  
function reset(){
    var table = document.getElementById("table-container");
    table.innerHTML="";
    var size = 0;
    window.requestFileSystem(LocalFileSystem.PERSISTENT, size, successCall, errorCall);
    function successCall(fs){
        fs.root.getFile('t5.txt',{create:true, exclusive: false}, function(fileEntry){
            fileEntry.createWriter(function(fileWriter){
                fileWriter.onerror = function(e){
                    alert("write failed: "+ e.toString());
                };
                fileWriter.truncate(0);
            }, errorCall);    
        }, errorCall);
    };
}      
function appendTable() {
    var txt = document.getElementById('task').value;
    var date = document.getElementById('date').value;
    var priority = document.getElementById('priority').value;
    var category = document.getElementById('category').value;
    var table = document.getElementById('table-container');
    if (priority == "Low"){
        var style = lowColor;
        var name = "low";
    }
    else if (priority == "Med"){
        var style = medColor;
        var name = "med";
    }
    else{
        var style = highColor;
        var name = "high";
    }

    table.insertAdjacentHTML('beforeend',`
        <tr><td class="tg-rykj ${name}" bgcolor="${style}"><input type="radio" class="done"></td>
        <td class="tg-cly1 name ${name}" bgcolor="${style}">${txt}</td>
        <td class="dates ${name}" bgcolor="${style}">${date}</td>
        <td class="tg-cly1 ${name}" bgcolor="${style}">${priority}</td>
        <td class="tg-cly1 ${name}" bgcolor="${style}">${category}</td>
        <td>
            <img id="delete" src="img/delete.png" 
            onclick="this.parentNode.parentNode.parentNode.style.display = 'none'; 
            updateTable();">
        </td>
        </tr>`);
    checkDate();
    
    var size = 0;
    
    window.requestFileSystem(LocalFileSystem.PERSISTENT, size, successCall, errorCall);
    function successCall(fs){
        fs.root.getFile('t5.txt',{create:true, exclusive: false}, function(fileEntry){
            fileEntry.createWriter(function(fileWriter){
                fileWriter.onerror = function(e){
                    alert("write failed: "+ e.toString());
                };
                var output = document.getElementById('table-container').innerHTML;
                fileWriter.write(output);
            }, errorCall);    
        }, errorCall);
        document.getElementById('task').value="";
    document.getElementById('date').value="";    
    };
    dateSort();
}
function tablePaste() {
    
    var size = 0;    
    window.requestFileSystem(LocalFileSystem.PERSISTENT, size, successCall, errorCall);
    
    function successCall(fs){
        fs.root.getFile('t5.txt',{create: true, exclusive: false},function(fileEntry){
        fileEntry.file(function(file){
            var reader = new FileReader();
            reader.onloadend = function(e){  
                var table = document.getElementById('table-container');
                table.insertAdjacentHTML('beforeend', this.result);
            };
            reader.readAsText(file);
            }, errorCall);    
        }, errorCall);
    };
} 
function addCategory(x) {
    console.log(x);
    var select = document.getElementById("category");
    select.options[select.options.length] = new Option( "" + x, x, false, false);

    var size = 0;
    window.requestFileSystem(LocalFileSystem.PERSISTENT, size, successCall, errorCall);
    function successCall(fs){
        fs.root.getFile('c1.txt',{create:true, exclusive: false}, function(fileEntry){
            fileEntry.createWriter(function(fileWriter){
                fileWriter.onerror = function(e){
                    alert("write failed: "+ e.toString());
                };
                var output = document.getElementById('category').innerHTML;
                fileWriter.write(output);
            }, errorCall);    
        }, errorCall);  
    };
}
function categoryPaste() {
    var size = 0;    
    window.requestFileSystem(LocalFileSystem.PERSISTENT, size, successCall, errorCall);

    function successCall(fs){
        fs.root.getFile('c1.txt',{create: true, exclusive: false},function(fileEntry){
        fileEntry.file(function(file){
            var reader = new FileReader();
            reader.onloadend = function(e){  
                var category = document.getElementById('category');
                category.insertAdjacentHTML('beforeend', this.result);
            };
            reader.readAsText(file);
            }, errorCall);    
        }, errorCall);
    };
}
function updateTable(){
    var size = 0;
    
    window.requestFileSystem(LocalFileSystem.PERSISTENT, size, successCall, errorCall);
    function successCall(fs){
        fs.root.getFile('t5.txt',{create:true, exclusive: false}, function(fileEntry){
            fileEntry.createWriter(function(fileWriter){
                fileWriter.onerror = function(e){
                    alert("write failed: "+ e.toString());
                };
                var output = document.getElementById('table-container').innerHTML;
                fileWriter.write(output);
            }, errorCall);    
        }, errorCall);  
    };
}
function colorSelected () {
    var color = document.getElementById("color").value;
    var select = document.getElementById('colorChange').value;
    if (select == "Low"){
        lowColor = color;
        var style = document.getElementsByClassName('low');
    }
    else if (select == "Med"){
        medColor = color;
        var style = document.getElementsByClassName('med');
    }
    else{
        highColor = color;
        var style = document.getElementsByClassName('high');
    }
    for(var i = 0; i < style.length; i++){
        style[i].style.backgroundColor = color;
    }
}
function openNav() {
    document.getElementById("nav").style.width = "250px";
}
function closeNav() {
    document.getElementById("nav").style.width = "0";
}
function checkDate() {
    console.log('activated datecheck');
    var entries = document.getElementsByClassName('dates');
    var today = new Date();
    for (var i = 0; i < entries.length; i++){
        var startDate = new Date(entries[i].textContent + 'EST');
        if (startDate < today) {
            var entry = entries[i];  
            entry.style.backgroundColor = "red";
            entry.style.fontWeight = "bold";
        }
        else if (startDate === today) {
            var entry = entries[i];  
            entry.style.fontWeight = "bold";
        } 
    };
}
function dateSort() {
    console.log('sorting tables')
    var entries = document.getElementsByClassName('dates');
    var table = document.getElementById('table-container');
    var row = table.rows;
    var end;
    for (var i = 0; i < row.length; i++){
        for (j = 0, end = row.length - 1; j < end; j++ ){
            var firstDate = new Date(entries[j].textContent + 'EST');
            var secondDate = new Date(entries[j+1].textContent + 'EST');
            if (firstDate > secondDate){
                row[j].parentNode.insertBefore(row[j + 1], row[j]);
            };
        };
    };
    updateTable();
}


function eraseRow() {
    console.log('checking rows');
    var table = document.getElementById('table-container');
    var buttons = document.getElementsByClassName('done');
    for (var i = 0; i < buttons.length; i++){
        if (buttons[i].checked){
          buttons[i].parentNode.parentNode.parentNode.style.display = 'none';
        }
    }
    updateTable();
}   
var removal = setInterval(eraseRow, 2000);