var circle = [false, false, false, false, false, false]; //dot states
var num = false; //stores digit prefix state
var bracket = false; //stores bracket state

// --- guessing game ---
var guessNum; //stores current number to guess
var scoreCorrect = 0; //stores scores
var scoreWrong = 0;
var scoreStreak = 0;

function brailleTranslate(){//called by submit button
    var bit = dotsToBin();
    var char;
    if(num)
        char = getNumber(bit);
    else
        char = getBraille(bit);
    document.getElementById('output').value += char;//adding char to output box
    resetPattern();//clearing dots
}

function resetPattern(){//resets dots and circle array
    for (var i = 0; i < 6; i++) {
        circle[i] = false;
        updateDot(i);
    }
}

function dotsToBin(){//converts dots to binary to decimal number
    var bin = 0;
    for (var i = 0; i < 6; i++)
        bin += Math.pow(2, i) * circle[i];//bin to decimal
    return bin;
}

function toggle(i){//toggles a dots state
    circle[i] = !circle[i];
    updateDot(i);
}

function updateDot(i){//updates picture in td table
    var pic = document.getElementsByClassName('circle')[i];
    if (circle[i])
        pic.src = 'dot.png';
    else
        pic.src = 'empty.png';
}

function getBraille(i){//converts decimal value to preset chars
    switch (i) {
        case  0: return ' ';
        case  1: return 'a';
        case  5: return 'b';
        case  3: return 'c';
        case 11: return 'd';
        case  9: return 'e';
        case  7: return 'f';
        case 15: return 'g';
        case 13: return 'h';
        case  6: return 'i';
        case 14: return 'j';
        case 17: return 'k';
        case 21: return 'l';
        case 19: return 'm';
        case 27: return 'n';
        case 25: return 'o';
        case 23: return 'p';
        case 31: return 'q';
        case 29: return 'r';
        case 22: return 's';
        case 30: return 't';
        case 49: return 'u';
        case 53: return 'v';
        case 46: return 'w';
        case 51: return 'x';
        case 59: return 'y';
        case 57: return 'z';
        case 26: return 'ä';
        case 38: return 'ö';
        case 45: return 'ü';
        case 54: return 'ß';
        case 62: return 'st';
        case 33: return 'au';
        case 37: return 'eu';
        case 35: return 'ei';
        case 18: return 'äu';
        case 50: return 'ie';
        case 43: return 'ch';
        case 41: return 'sch';
        case  4: return ',';
        case 20: return ';';
        case 12: return ':';
        case 16: return '.';
        case 36: return '?';
        case 28: return '!';
        case 52: return '„';
        case 56: return '“';
        case 48: return '-';
        case 50: return '§';
        case 32: return '\'';
        //special cases
        case 58: {//digit prefix
            num = true;//sets digit prefix
            document.getElementById('isNumber').innerHTML = '(number)';//sets digit notification
            break;
        }

        case 60: {//alternating opening and closing brackets
            if (!bracket) {
                bracket = true;
                return '(';
            }
            else {
                bracket = false;
                return ')';
            }
        }

        default: {//in case of unavailable value
            alert(`Zeichen nicht vorhanden [${i}]`);
            break;
        }
    }
    return '';//returns empty string
}

function getNumber(i){//converts decimal value to number if digit prefix
    document.getElementById('isNumber').innerHTML = '';//removes digit notification
    num = false;//resets digit prefix
    switch (i) {
        case  1: return '1';
        case  5: return '2';
        case  3: return '3';
        case 11: return '4';
        case  9: return '5';
        case  7: return '6';
        case 15: return '7';
        case 13: return '8';
        case  6: return '9';
        case 14: return '0';
        default: {//in case of unavailable value
            alert(`Ziffer nicht vorhanden [${i}]`);
            return '';//returns empty string
        }
    }
}

function hotkeys(event){//numpad hotkeys
    var pic = document.getElementsByClassName('circle');
    switch (event.key) {
        case '7': pic[0].click(); // 7 8 - 9
            break;
        case '8': pic[1].click(); // 4 5 - 6
            break;
        case '4': pic[2].click(); // 1 2 - 3
            break;
        case '5': pic[3].click();
            break;
        case '1': pic[4].click();
            break;
        case '2': pic[5].click();
            break;
        case 'Enter': document.getElementById('btnSubmit').click();
            break;
    }
}

function newChar(){//new char for guessing game
    var newNum, validNewNum;
    do {
        newNum = Math.floor(Math.random() * 62 + 1);//random value from 1-62
        switch (newNum) {//unused value prevention
            case 2:
            case 8:
            case 10:
            case 24:
            case 34:
            case 39:
            case 40:
            case 42:
            case 44:
            case 47:
            case 55:
            case 58: //digit prefix
            case 61:
            case 63: {
                validNewNum = false;
                break;
            }
            default: {
                validNewNum = true;
                break;
            }
        }
    } while(!validNewNum);
    guessNum = newNum;
    document.getElementById('charPreview').innerHTML = getBraille(guessNum);
}

function guessPattern(){//called by submit button
    if(dotsToBin()==guessNum){//guess correct?
        document.getElementById('result').innerHTML = `correct`;
        scoreCorrect++;
        scoreStreak++;
        resetPattern();
    }
    else{//wrong pattern msg + entered char + entered id
        document.getElementById('result').innerHTML = `wrong - you did ${getBraille(dotsToBin())} [${dotsToBin()}]`;
        scoreWrong++;
        scoreStreak = 0;
        setPattern(guessNum);//replacing wrong pattern with correct 
    }
     updateScores();
     newChar();
   
}

function updateScores(){//updates numbers in scores table
    var td = document.getElementsByClassName('scores');
    td[0].innerHTML = scoreCorrect;
    td[1].innerHTML = scoreWrong;
    td[2].innerHTML = scoreStreak;
}

function setPattern(num){//sets dots from a decimal value
    resetPattern();
    var base2 = (num).toString(2);
    while(base2.length<6)
        base2 = '0' + base2;//forcing 6 char string
    for(var i=0;i<6;i++){
        if(base2[5-i]=='1')//
            circle[i] = true;
        else
            circle[i] = false;
        updateDot(i);
    }
}