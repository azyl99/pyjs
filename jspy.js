var tokenlist = [];
var currtoken = {
	type	: 0,
	value	: 0,
}
var currFunc = 0;
var preFunc = 0;
var keywords = ["while", "endwhile", "if", "else", "for", "endfor", "endif", "print","def", "return",]
var operators = ["=", "==", "!=", ">=", "<=", ">", "<", "+", "-", "*", "/", "%", "(", ")", ":", ",", ";", "."]
var identifierTable = new Array();
var funcTable = [];     //store the parse tree of functions
var stack = [];
var funcCallStack = []; //store the function call sequence
var funcVariables = []; //store the local variables of each function instance
var funcParams = [];    //store the parameters of each function
var funcNum = 0;

function run() {
	var inputstring = document.getElementById("input_area").value;
	tokenlist = lexer(inputstring);
	nextToken(tokenlist);
	consume("if")
	program = parseCondition();
	console.log(program)
}

function test() {
	var inputstring = document.getElementById("input_area").value;
	try {
		// console.log(inputstring);
		tokenlist = lexer(inputstring);
		// console.log(tokenlist);
		nextToken(tokenlist);
		program = parseStatementList();
		// console.log(program)
		// console.log(programToString(program))
		execStatementList(program)
	} catch (e) {
		document.getElementById("output_area").value = e;
	}
}

function arrayToString(array) {
	var str = "[";
	for (var v in array) {//var 要加上
		if (array[v] instanceof Array) {
			str += arrayToString(array[v]);
		} else {
			str += array[v]
		}
		if (v != array.length-1)
			 str += " ";
	}
	return str + "]";
}

function programToString(program) {
	var str = "";
	for (i in program) {
		str += arrayToString(program[i]) + '\n'
	}
	return str;
}


///lexer
function lexer(inputstring) {//暂时以空白符号分割
	return inputstring.split(/\s+/);
}


///parser
function nextToken() {
    // alert(currtoken.value)
	if (tokenlist.length > 0) {
		s = tokenlist.shift();
		if (keywords.indexOf(s) != -1) {
			currtoken.type = "keyword";
			currtoken.value = s;
		} else if (operators.indexOf(s) != -1) {
			currtoken.type = "operator";
			currtoken.value = s;
		} else if(!isNaN(s)) {
			currtoken.type = "number";
			currtoken.value = Number(s);
		} else if (isVaildSymbol(s)) {
            if(funcTable[s]){
                currtoken.type = "function";
            }
            else{
                identifierTable[s] = new Array();
                currtoken.type = "identifier";
            }
            currtoken.value = s;
		} else if (["[", "]"].indexOf(s) != -1){
			currtoken.type = "list";
			currtoken.value = s;
		} else {
			throw new Error("syntax error: '" + s + "'")
		}
	} else {
		currtoken.type = 0;
		currtoken.value = 0;
	}
}

function isVaildSymbol(s) {
	var reg= /^[_A-Za-z][_A-Za-z0-9]*$/;//单个下划线也可以是合法变量名
	return reg.test(s)
}

function consume(value) {
	if (currtoken.value == value) {
		nextToken(); 
	} else {
		console.trace();
		throw new Error("expected '" + value + "' not found");
		nextToken();
	}
}

function parseFunction(){   //used while calling a function
    var stmt = [];
    stmt.push("function");                  //an identifier - "function"          
    var function_name = currtoken.value;    //the function name                  
    stmt.push(function_name);
    nextToken();
    consume("(");
    for(var i = 0; i < funcParams[function_name].length; i++){  //transfer the value of params
        var param_transfer = ["=", funcParams[function_name][i], parseExpr()]
        stmt.push(param_transfer)
        if(i != funcParams[function_name].length - 1)
            consume(",")
    }
    consume(")");  
    return stmt;
}

function parseFactor() {//<factor> ::= ( <expr> ) | identifier | number | function
	var factor = [];
	if (currtoken.type == "operator" && currtoken.value == "(") {
		nextToken();
		factor = parseExpr();
		consume(")");
    } else if (currtoken.type == "function"){
        factor = parseFunction();
	} else if (["identifier", "number"].indexOf(currtoken.type) != -1) {
		factor = [currtoken.value];//[]?
		nextToken();
	}
	return factor;
}

function term_tail(left_term) {//<term_tail> ::= */% <factor> <term_tail> | empty
	if (["*", "/", "%"].indexOf(currtoken.value) != -1) {
		left_term = [left_term];
		left_term.unshift(currtoken.value);
		nextToken();
		left_term.push(parseFactor());
		// console.log(arrayToString(left_term))
		return term_tail(left_term);
	}
	return left_term;
}

function parseTerm() {//<term> ::= <factor> <term_tail>
	var factor = parseFactor();
	return term_tail(factor);
}

function expr_tail(left_expr) {//<expr_tail> ::= +- <term> <expr_tail> | empty
	if (["+", "-"].indexOf(currtoken.value) != -1) {
		left_expr = [left_expr]
		left_expr.unshift(currtoken.value);
		nextToken();
		left_expr.push(parseTerm());
		return expr_tail(left_expr);
	}
	return left_expr;
}

function parseExpr() {//<expr> ::= <term> <expr_tail>
	var term  = parseTerm();
	// console.log(arrayToString(term))
	return expr_tail(term);
}

function parseAssignmentStmt() {
	var stmt = [currtoken.value];
	nextToken();
	consume("=");
	stmt.unshift("=")
	if (currtoken.type == "list"){
		// console.log(currtoken.value);
		stmt.push(parseList());
	}
	else
		stmt.push(parseExpr()); 
	return stmt;
}

function parseList() {
	var list = [];
	if (currtoken.type == "list" && currtoken.value == "[") {
		list.push("[");
		nextToken();
		list.push(parseExpr());
		while(currtoken.type == "operator"){
			if (currtoken.value == ",") {
				consume(",");
				list.push(parseExpr());
			}
			else 
				break;
		}
		list.push("]");
		consume("]");
	}
	return list;
}

function parseStatementList() {
	var stmts = [];
	var loop = true;
	while (currtoken.type != 0 && loop == true) {
		var stmt = [];
		switch(currtoken.type) {			
		case "identifier":// 赋值语句
            stmt = parseAssignmentStmt();
            break;
		case "number":
			stmt = parseExpr();
			break;
		case "function":        //calling function
            stmt = parseFunction();
			break;
		case "keyword":
			switch (currtoken.value) {
			case "print":
				consume("print")
				consume("(")
				var expr = parseExpr()
				consume(")")
				stmt = ["print"];
				stmt.push(expr);
				break;
			case "if":
				consume("if");
				stmt = ["if"];
				stmt.push(parseCondition());
				consume(":");
				stmt.push(parseStatementList());
				if (currtoken.type == "keyword" && currtoken.value == "else") {
					consume("else");
					stmt.append(parseStatementList())
				}
				consume("endif");
				break;
			case "while":
				consume("while");
				stmt = ["while"];
				stmt.push(parseCondition());
				consume(":");
				stmt.push(parseStatementList());
				consume("endwhile")
				break;
			case "for":
				consume("for");
				stmt = ["for"];
				if (currtoken.value != ";")
					stmt.push(parseAssignmentStmt());//simple assignment statement. To be modified
				consume(";")
				if (currtoken.value != ";")
					stmt.push(parseCondition());
				consume(";");
				stmt.push(parseAssignmentStmt());
				consume(":");
				stmt.push(parseStatementList());
				consume("endfor");
				break;
            case "def":     //define a function 
                consume("def");
                var function_name = currtoken.value;
                currtoken.type = "function"
                nextToken();  
                consume("(");
                funcParams[function_name] = [];
                while(currtoken.value != ")"){                   
                    funcParams[function_name].push(currtoken.value) //store the parameters of the function in funcParams[function_name]
                    nextToken();
                    if(currtoken.value == ","){
                        consume(",")
                    }                  
                }
                consume(")");
                consume(":");
                funcTable[function_name] = [];
                funcTable[function_name] = parseStatementList();    //generate a parse tree of the function and store in funcTable[function_name]
                // alert(funcTable[function_name])
                break;
			case "endif": case "endwhile": case "endfor":
				loop = false;
                break;
            case "return":
                stmt.push("return")
                consume("return")
                stmt.push(parseExpr());
                loop = false;
				break;
			default:
				break;
			}
			break;
		default:
			break;
		}
		//if (loop == true){
            if(stmt.length > 0){
                stmts.push(stmt)
            }
       // }
	}
	return stmts;
}

function parseCondition() {// leftexpr op rightexpr
	var leftexpr = parseExpr();
	if (["=", "==", "!=", ">=", "<=", ">", "<"].indexOf(currtoken.value) != -1){
		ret = [currtoken.value];
		ret.push(leftexpr);
		nextToken();
		var rightexpr = parseExpr()
		ret.push(rightexpr);
	} else {
		throw new Error("compare statement expected, not '" + currtoken.value + "'");
	}
	return ret;
}


///Interpreter

function execFunc(stmt){
    preFunc = currFunc;
    var function_name = stmt[1] + ":" + funcNum++;          //create a new function instance
    funcVariables[function_name] = [];  
    funcCallStack.unshift(function_name)
    currFunc = function_name;
    if(funcParams[currFunc.split(":")[0]].length > 0){      //tranfser parameter value
        for(var i = 0; i < funcParams[currFunc.split(":")[0]].length; i++){                
            currFunc = preFunc;
            execExpression(stmt[i+2][2]);
            currFunc = funcCallStack[0]
            funcVariables[currFunc][funcParams[currFunc.split(":")[0]][i]] = stack.pop()
        }
    }
    execStatementList(funcTable[currFunc.split(":")[0]]);   //excute the function accoording to the parse tree store in funcTable[function_name]
    funcVariables[currFunc] = [];        
    funcCallStack.shift()
    currFunc = funcCallStack[0] ? funcCallStack[0] : 0;
}

function execExpression(expr) {
    if(expr[0] == "function"){
            execFunc(expr)
    } else if (expr[0] == "[" || expr[expr.length-1]=="]"){
		var list = [];
		for (var i=1; i<expr.length-1; i++){
			list.push(expr[i]);
		}
		stack.push(list);
	} else if (expr.length == 3) {
		execExpression(expr[1]);
		execExpression(expr[2]);
		rightOperand = stack.pop()
		leftOperand = stack.pop()
        
		switch (expr[0]) {
			case "+" : stack.push(leftOperand + rightOperand); break;
			case "-" : stack.push(leftOperand - rightOperand); break;
			case "*" : stack.push(leftOperand * rightOperand); break;
			case "/" : stack.push(leftOperand / rightOperand); break;
			case "%" : stack.push(leftOperand % rightOperand); break;
		}
	} else {       
		if (!isNaN(expr[0]))
			stack.push(expr[0])
		else{
            if(currFunc == 0)
                stack.push(identifierTable[expr[0]]["value"])                //use global variables
            else{
                if(funcVariables[currFunc][expr[0]])
                    stack.push(funcVariables[currFunc][expr[0]]);   //use local variables
                else
                    stack.push(identifierTable[expr[0]]["value"])             //use global variables in a function
            }
			
        }
	}
}

function execStatement(stmt) {
	// switch(stmt[0])
	if (stmt[0] == "=") {
		execExpression(stmt[2])        
        if(currFunc == 0){                              //get the result as global variable
            identifierTable[stmt[1][0]]["value"] = stack.pop();  //??[1][0]
        }
        else{
            if(funcVariables[currFunc][stmt[1][0]]){
                funcVariables[currFunc][stmt[1][0]] = stack.pop();  //get the result as local variable
            }
            else
                identifierTable[stmt[1][0]]["value"] = stack.pop();          //get the result as global variable in a function
        }
	} else if (stmt[0] == "print") {
		execExpression(stmt[1])
		outstr = stack.pop();
		document.getElementById("output_area").value += outstr + "\n";
		console.info("out:", outstr)
	} else if (stmt[0] == "if") {//if cond expr1 [expr2]
		execCondition(stmt[1]);
		if (stack.pop())
			execStatementList(stmt[2])
		else {
			if (stmt.length == 4)
				execStatementList(stmt[3])
		}
	} else if (stmt[0] == "while") {//while cond expr
		execCondition(stmt[1]);
		while (stack.pop()) {
			execStatementList(stmt[2]);
			execCondition(stmt[1]);
		}
	} else if (stmt[0] == "for") {//for assign1 cond assign2 stmt
		execStatement(stmt[1]);
		execCondition(stmt[2]);
		while (stack.pop()) {
			execStatementList(stmt[4]);
			execStatement(stmt[3]);
			stack.pop();
			execCondition(stmt[2]);
		}
	} else if(stmt[0] == "function"){
        execFunc(stmt)
    } else if (stmt[0] == "return"){
        execExpression(stmt[1])
    } else if (operators.indexOf(stmt[0]) != -1){
        // console.log("ok")
    } else {
		throw new Error("Invalid statement");
	}
}

function execStatementList(program) {
	for (var i=0; i<program.length; i++) {
		execStatement(program[i]);
	}
}

function execCondition(cond) {
	execExpression(cond[1]);
	execExpression(cond[2]);
	rightOperand = stack.pop();
	leftOperand = stack.pop();
	switch (cond[0]) {
	case "==": stack.push(leftOperand == rightOperand); break;
	case "!=": stack.push(leftOperand != rightOperand); break;
	case "<=": stack.push(leftOperand <= rightOperand); break;
	case ">=": stack.push(leftOperand >= rightOperand); break;
	case "<": stack.push(leftOperand < rightOperand); break;
	case ">": stack.push(leftOperand > rightOperand); break;
	default:break;
	}
}



















