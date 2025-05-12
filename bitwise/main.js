function updateShift(){
    var num = parseInt(document.getElementById('num').value);
    var bits = document.getElementById('bits').value;
    var out = '';
    while(num>0&&bits!=0){
        if(num>=0){
            out+= '<tr><td>' + num + '</td><td>' + num.toString(2) + '</td><td>';
        if(bits>0){
            num = num >> bits;
            out+= '>>' + bits;
        }
        else{
            num = num << -bits;
            out+= '<<' + -bits;
        }
            
        out+= ' </td><td>' + num.toString(2) + '</td><td>' + num + '</td></tr>';
        }
    }
    document.getElementById('out').innerHTML = out;
}