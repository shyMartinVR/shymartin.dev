// Javascript

// --- Global Vars START

    var counter = 0;	//Backsteine
    var anzahlAnlage = 4;
    var anlage = [];
    var bps;
    var allowSave = true;

// --- Global Vars END

setup();

function setup(){
    hideMsg();	//javaScript an?
    saveLaden();
    if(isNaN(counter))
        resetCookies(true);
    bpsInterval();
}

function saveLaden(){//---save laden
	counter = parseInt(getCookie("backstein_Anzahl"));
	var json_str = getCookie('anlagen');
	var arr = JSON.parse(json_str);
	for(var i=0;i<anzahlAnlage;i++){
		anlage.push(arr[i]);
		updateShop(i);
	}
}

function saveStats(){
	if(allowSave){
		document.cookie = createCookie("backstein_Anzahl",counter,100);
		var arr = [];
		for(var n=0;n<anzahlAnlage;n++)//speichern der anlagen
			arr.push(anlage[n]);
		var json_str = JSON.stringify(arr);
		createCookie('anlagen', json_str,100);
	}
}

function hideMsg(){//---entfernen der "Javascript nicht geladen msg"
	var parent = document.getElementById("backstein");
	var child = document.getElementById("jsLoaded");
	parent.removeChild(child);
}

function backsteinInc(){//---counter erhöhen
	counter+=1+anlage[0];
	updateBackstein();
}

function backsteinDec(){//---counter niedriger - anti cheat
	counter-=1+anlage[0];
	updateBackstein();
}

function updateBackstein(){//---update der Anzahl unterm Backstein
	document.getElementById('Anzahl').innerHTML=Math.round(counter);
	document.getElementById('bps').innerHTML="bps: "+ bps;
	saveStats();
}

function allesAuf(i){
	for(var n=0;n<anzahlAnlage;n++){
		anlage[n] = i;
		updateShop(n);
	}
}

function kaufen(i){//---shop
	if(counter>=preis(i)){		//hast du genug geld
		counter-=preis(i);		//wenn ja dann geld abziehen und
		anlage[i]++;			//anlage geben
		updateShop(i);
	}
}

function preis(i){//---Preis ausrechnen
	switch(i){
		case 0:{
			return expoPreis(10,i);
			break;
		}
		case 1:{
			return expoPreis(50,i);
			break;
		}
		case 2:{
			return expoPreis(100,i);
			break;
		}
		case 3:{
			return expoPreis(1000,i);
			break;
		}
	}
}

function expoPreis(grundkosten,i){
	return Math.round(grundkosten * Math.pow((10.0 / 100.0) + 1.0,anlage[i]));//gerundeter expo preis
}

function bpsInterval(){//---interval setzen
	var bps = setInterval(calcBps,50);
}

function calcBps(){//---Backsteine pro Sekunde hinzufügen
	bps = 0;
	bps+=anlage[1]*6;  //Hochofen
	bps+=anlage[2]*15; //cryto-miner
	bps+=anlage[3]*200; //Börse

	counter+=bps/20;
	updateBackstein();//und updaten
}

function updateShop(i){//---neue Shoppreise etc
		document.getElementsByClassName("Anzahl")[i].innerHTML= anlage[i];
		document.getElementsByClassName("Preis")[i].innerHTML= preis(i);
	updateBackstein();
}

function resetCookies(skipConfirm){//---Reset mit Confirm Alert
	var alarm;
	if(lang=="de"){
		alarm = "Bist du sicher?";
	}
	else
		alarm = "Are you sure?";
	if(skipConfirm||confirm(alarm)){
		counter = 0;
		for(var i=0;i<anzahlAnlage;i++)
			anlage[i] = 0;
		saveStats();
		location.reload();//F5
	}
}

function createCookie(name, value, days){
	var expires;
	if(days){
		var date = new Date();
		date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
		expires = "; expires=" + date.toGMTString();
	}
	else
		expires = "";
	document.cookie = name + "=" + value + expires + "; path=/";
}

function getCookie(cname){
	var name = cname + "=";
	var decodedCookie = decodeURIComponent(document.cookie);
	var ca = decodedCookie.split(';');
	for(var i = 0; i <ca.length; i++) {
	var c = ca[i];
	while (c.charAt(0) == ' ')
		c = c.substring(1);
	if(c.indexOf(name) == 0)
		return c.substring(name.length, c.length);
	}
	return 0;
}

function enterBan(event){//---Anti Enter Cheat nur für den Backstein
	if(event.key=="Enter")
		backsteinDec();
}

/* comming soon
function stringSave(){

}

function stringLoad(){
	
	var eingabe = prompt("Enter save string");
	if(eingabe != null){
		allowSave = false;
		
		location.reload();
	}
}
*/