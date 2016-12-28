
/**
 * Created by 3140102511 on 2016/12/23.
 */

/**
 * Created by 3140102511 on 2016/12/23.
 */
var linesIndex;
var lines;
var splitChar=/\s+/;
var linesNum;
var operator=["<=",">=","==","!=","&&","||","+=","-=","*=","/="];
var TokenType=["spli","oper","single","num","str"];
var indentKey=["if","while","for","def","class"];

function lexer(inputString) {//对程序进行词法分析，生成tokenList
    var handleString = addSplit(inputString);  //为某一个token加上间隔符；
    var testString = "";
    var testLinesNum;
    var strSign = 0;
    var i;
    var lineContent;
    var num;
    var currentToken=[];
    lines = handleString.split('\n');
    linesNum=lines.length;
    linesIndex = 0;
    indent([0,0],[-1,-1]);
    testLinesNum=lines.length;
    tokenList = [];
    for(linesIndex = 0; linesIndex<testLinesNum; linesIndex++){
        lineContent = lines[linesIndex];
        currentToken[0]="";
        currentToken[1]=linesIndex;
        for(i = 0; i<lineContent.length; i++){
            if(splitChar.test(lineContent[i]) && strSign == 0){
                if(currentToken[0] != ""){
                    tokenList.push([currentToken[0],currentToken[1]]);
                    currentToken[0]="";
                }
            }
            else if(lineContent[i] == '\'' || lineContent[i] == '\"' && strSign ==0){
                if(currentToken[0] != ""){
                    tokenList.push([currentToken[0],currentToken[1]]);
                }
                currentToken[0] = lineContent[i];
                tokenList.push([currentToken[0],currentToken[1]]);
                currentToken[0]="";
                strSign = 1;
            }
            else if(lineContent[i] == '\'' || lineContent[i] == '\"' && strSign ==1){
                tokenList.push([currentToken[0],currentToken[1]]);
                currentToken[0] = lineContent[i];
                strSign = 0;
            }
            else {
                currentToken[0] += lineContent[i];
            }
        }
        if(currentToken[0]!=""){
            tokenList.push([currentToken[0],currentToken[1]]);
        }
    }
}

function indent(start,last) {  //处理缩进，if,for,while 加end ,start数组第一个元素为等价空格数，第二个为字符数
    var currentKey = "", nextStart, nextIndentStart;
    var firstToken;
    nextStart = start;
    try {
        while (nextStart[0] >= start[0]) {
            if (nextStart[0] == start[0]) {
                firstToken = getStartOfline(lines[linesIndex].substring(nextStart[1]));
                if (indentKey.indexOf(firstToken) != -1) {
                    currentKey = firstToken;
                    linesIndex++;
                    nextIndentStart = calBlankNum(lines[linesIndex]);
                    if (nextIndentStart[0] <= nextStart[0]) {
                        throw new Error("indent error");
                    }
                    else {
                        indent(nextIndentStart, nextStart);
                    }
                    lines.splice(linesIndex, 0, "end" + firstToken);
                }
                else {
                    linesIndex++;
                }
                if (linesIndex >= linesNum) {
                    break;
                }
                nextStart = calBlankNum(lines[linesIndex]);
            }
            else {
                throw new Error("indent error");
            }
        }
        if (linesIndex < linesNum && nextStart[0] > last[0]) {
            throw new Error("indent error");
        }

    } catch (e) {
        alert(e.message);
    }
}

function calBlankNum(str){
    var len=str.length;
    var num = 0;
    for(var i = 0; i<len; i++){
        if(str[i] == " "){
            num++;
        }
        else if(str[i] == '\t'){
            num += 4;
        }
        else
            break;
    }
    return [num,i];
}

function getStartOfline(str){  //获得每行第一个token的长度
    var len = str.length;
    for(var i = 0; i < len; i++){
        if(splitChar.test(str[i])){
            break;
        }
    }
    return str.substring(0,i);
}

function checkType(c){
    var specialChar1=['!','>','<','+','-','*','/','%','=','|','&'];
    var specialChar2=[',','(',')',':',';','\'','\"'];

    if(splitChar.test(c)){
        return 0;
    }
    else if(specialChar1.indexOf(c) != -1){
        return 1;
    }
    else if(specialChar2.indexOf(c) != -1){
        return 2;
    }
    else if(c >= '0' && c <= '9'){
        return 3;
    }
    else if(c == '.'){
        return 4;
    }
    else return 5;
}

function addSplit(inputString){
    var handleString = "";
    var len = inputString.length;
    var currentChar;
    var currentToken={
        type: TokenType[0],
        content: ""
    };
    var strSign = 0;
    for (var i = 0; i < len; i++ ) {  //
        currentChar = checkType(inputString[i]);
        if(inputString[i]!= '\'' && inputString[i] !='\"' && strSign == 1 ){
            currentToken.type=TokenType[4];
            handleString += inputString[i];
        }
        else if(currentChar==0){
            handleString+=inputString[i];
            currentToken.type=TokenType[0];
        }
        else if(currentChar == 1){
            if(currentToken.type != TokenType[1]){
                if(currentToken.type == TokenType[0]){
                    handleString += inputString[i];
                }
                else
                    handleString += " "+inputString[i];
                currentToken.type=TokenType[1];
                currentToken.content=inputString[i];
            }
            else{
                currentToken.content += inputString[i];
                if(operator.indexOf(currentToken.content)!= -1){
                    handleString += inputString[i];
                }
                else{
                    handleString += " " +inputString[i];
                    currentToken.content=inputString[i];
                }
            }
        }
        else if(currentChar == 2){
            if(inputString[i]=='\''|| inputString[i] == '\"'){
                if(strSign == 0){
                    handleString += " "+inputString[i];
                }
                else{
                    handleString += inputString[i];
                }
                strSign = 1-strSign;
            }
            else if(currentToken.type!=TokenType[0]){
                handleString += " "+inputString[i];
            }
            else
                handleString += inputString[i];
            currentToken.type=TokenType[2];
        }
        else if(currentChar==3){
            if(i ==1 && inputString[i-1] == '-' || i>1 && inputString[i-1] == '-' && (checkType(inputString[i-2])<=2)){
                handleString += inputString[i];
                currentToken.type == TokenType[3];
                currentToken.content += inputString[i];
            }
            else if(currentToken.type == TokenType[0]){
                handleString += inputString[i];
                currentToken.type=TokenType[3];
            }
            else if(currentToken.type==TokenType[3] || currentToken.type == TokenType[4]){
                handleString += inputString[i];
            }
            else{
                handleString += " "+inputString[i];
                currentToken.type=TokenType[3];
            }
        }
        else if(currentChar==4){
            if(currentToken.type==TokenType[3]){
                handleString += inputString[i];
            }
            else if(currentToken.type == TokenType[0]){
                handleString += inputString[i];
                currentToken.type = TokenType[2];
            }
            else{
                handleString += " "+inputString[i];
                currentToken.type = TokenType[2];
            }
        }
        else{
            if(currentToken.type == TokenType[0] || currentToken.type == TokenType[4]){
                handleString += inputString[i];
                currentToken.type = TokenType[4];
            }
            else{
                handleString += " "+inputString[i];
                currentToken.type=TokenType[4];
            }
        }
    }
    return handleString;
}