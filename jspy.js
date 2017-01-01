var tokenList = [];
var currToken = {
	type: 0,
	value: 0,
}
var currFunc = 0;
var preFunc = 0;
var keywords = ["while", "endwhile", "if", "else", "elif", "for", "endfor", "endif", "print", "def", "enddef", "return", "break", "continue", "class", "endclass"]
var operators = ["=", "==", "!=", ">=", "<=", ">", "<", "+", "-", "*", "/", "%", "(", ")", ":", ",", ";", ".", "[", "]", "{", "}","'","\""]
var identifierTable = new Array();
var funcTable = []; //store the parse tree of functions
var stack = [];
var funcCallStack = []; //store the function call sequence
var funcVariables = []; //store the local variables of each function instance
var funcParams = []; //store the parameters of each function
var funcNum = 0;
var curr_class_define = 0;
var currClass = 0;

function run() {
	var inputstring = document.getElementById("input_area").value;
	tokenList = lexer(inputstring);
	nextToken();
	console.log(arrayToString(parseFunction()))
}

function test() {
	var inputstring = document.getElementById("input_area").value;
	document.getElementById("output_area").value = "";
	// try {
	// console.log(inputstring);
	tokenList = lexer(inputstring);
	// console.log(tokenList);
	nextToken();
	program = parseStatementList();
	// console.log(program)
	console.log(programToString(program))
	execStatementList(program)
	// } catch (e) {
	// document.getElementById("output_area").value = e;
	// }
}

function arrayToString(array) {
	var str = "[";
	for (var v = 0; v < array.length; v++) { //var Ҫ����
		if (array[v]instanceof Array) {
			str += arrayToString(array[v]);
		} else {
			str += array[v]
		}
		if (v != array.length - 1)
			str += " ";
	}
	return str + "]";
}

function programToString(program) {
	var str = "";
	for (var i = 0; i < program.length; i++) {
		str += arrayToString(program[i]) + '\n'
	}
	return str;
}

///lexer
function lexer(inputstring) {
	var i = 1;
	return inputstring.split(/\s+/);
}

///parser
function nextToken() {
	if (tokenList.length > 0) {
		s = tokenList.shift();
		if (keywords.indexOf(s) != -1) {
			currToken.type = "keyword";
			currToken.value = s;
		} else if (operators.indexOf(s) != -1) {
			currToken.type = "operator";
			currToken.value = s;
		} else if (!isNaN(s)) {
			currToken.type = "number";
			currToken.value = Number(s);
		} else if((lookNextToken(1) == "\""||lookNextToken(1) == "'")){
            currToken.type = "string";
			currToken.value = s;			
        } else if (isVaildSymbol(s)) {
			if (funcTable[s]) {
				currToken.type = "function";
			} else if(identifierTable[s] && identifierTable[s]["type"] == "class"){
                currToken.type = "class"                
            } else {
				identifierTable[s] = new Array();
				currToken.type = "identifier";
			}
			currToken.value = s;
		} else {
			throw new Error("syntax error: '" + s + "'")
		}
	} else {
		currToken.type = 0;
		currToken.value = 0;
	}
}

function lookNextToken(cnt) {
	if (tokenList.length > cnt - 1) {
		return tokenList[cnt - 1];
	}
	return "";
}

function isVaildSymbol(s) {
	var reg = /^[_A-Za-z][_A-Za-z0-9]*$/;
	return reg.test(s)
}

function consume(value) {
	if (currToken.value == value) {
		nextToken();
	} else {
		// console.trace();
		throw new Error("expected '" + value + "' not found");
		nextToken();
	}
}

function parseFunctionCall( x ) { //used while calling a function
	var stmt = [];
    if( x == 0 )
        stmt.push("function"); //an identifier - "function"
    else
        stmt.push("class")
	var function_name = currToken.value; //the function name
	stmt.push(function_name);
	nextToken();
	consume("(");
    while(currToken.value != ")"){
        stmt.push(parseExpr())
        if(currToken.value == ",")
            consume(",")
    }
	consume(")");
	return stmt;
}

function parseFunction(){
    consume("def");
    var function_name = currToken.value;
    currToken.type = "function"
    nextToken();
    consume("(");
    if(curr_class_define != 0){
        if(function_name == "__init__"){
            identifierTable[curr_class_define]["self"] = currToken.value        //store the self variable of a class
        }
        if(!identifierTable[curr_class_define]["function"])
            identifierTable[curr_class_define]["function"] = []
        if(identifierTable[curr_class_define]["function"].indexOf(function_name) == -1 ){
            identifierTable[curr_class_define]["function"].push(function_name)
        }
        identifierTable[curr_class_define]["value"][function_name] = [];
        identifierTable[curr_class_define]["value"][function_name]["params"] = [];
        while (currToken.value != ")") {
            identifierTable[curr_class_define]["value"][function_name]["params"].push(currToken.value) //store the parameters of the function in funcParams[function_name]
            nextToken();
            if (currToken.value == ",") {
                consume(",")
            }
        }
        consume(")");
        consume(":");
        identifierTable[curr_class_define]["value"][function_name]["type"] = "function";
        identifierTable[curr_class_define]["value"][function_name]["value"] = [];
        identifierTable[curr_class_define]["value"][function_name]["value"] = parseStatementList();
    }
    else{
        funcParams[function_name] = [];
        while (currToken.value != ")") {
            funcParams[function_name].push(currToken.value) //store the parameters of the function in funcParams[function_name]
            nextToken();
            if (currToken.value == ",") {
                consume(",")
            }
        }
        consume(")");
        consume(":");
        funcTable[function_name] = [];
        funcTable[function_name] = parseStatementList(); //generate a parse tree of the function and store in funcTable[function_name]
    }
    consume("enddef")
}

function parseClass(){
    consume("class");
    var class_name = currToken.value;
    curr_class_define = class_name;
    identifierTable[class_name]["value"] = [];
    currToken.type = "class"
    nextToken();
    consume("(")
    if (currToken.value != ")") {
        var parent_name = currToken.value
        identifierTable[class_name]["parent"] = parent_name;
        identifierTable[class_name]["value"] = []
        identifierTable[class_name]["function"] = []
        for(var i = 0; i < identifierTable[parent_name]["function"].length; i++){
            var function_name = identifierTable[parent_name]["function"][i]
            identifierTable[class_name]["value"][function_name] = identifierTable[parent_name]["value"][function_name]
            identifierTable[class_name]["function"].push(function_name)
        }
        nextToken()
    }
    consume(")");
    consume(":");
    identifierTable[class_name]["type"] = "class"
    parseStatementList();
    curr_class_define = 0;    
    consume("endclass")
}

function parseList() { // <list> ::= "list" [<expr_list>]
	var list = [];
	if (currToken.type == "operator" && currToken.value == "[") {
		list.push("list");
		nextToken();
		list.push(parseExpr());
		while (currToken.type == "operator" && currToken.value != "]") {
			if (currToken.value == ",") {
				consume(",");
				if (currToken.type == "operator" && currToken.value == "]")
					break;
				list.push(parseExpr());
			} else {
				throw new Error("list syntax error: '" + currToken.value + "'");
			}
		}
		consume("]");
	}
	return list;
}

function parseTuple(FirstTupleItem) { //[= [x] [tuple [1] [2] [3] [4]]]
	var tuple = [];
	tuple.push("tuple");
	tuple.push(FirstTupleItem);
	while (currToken.type == "operator" && currToken.value != ")") {
		if (currToken.value == ",") {
			consume(",");
			if (currToken.type == "operator" && currToken.value == ")")
				break;
			tuple.push(parseExpr());
		} else {
			throw new Error("tuple syntax error: '" + currToken.value + "'");
		}
	}
	return tuple;
}

function parseDict() { // [= [x] [dict [1] [2] [3] [4]]]
	var dict = [];
	if (currToken.type == "operator" && currToken.value == "{") {
		dict.push("dict");
		nextToken();
		if (currToken.value != "}"){
			dict.push(parseExpr());
			consume(":");
			dict.push(parseExpr());
		}
		while (currToken.type == "operator" && currToken.value != "}") {
			if (currToken.value == ",") {
				consume(",");
				if (currToken.type == "operator" && currToken.value == "}")
					break;
				dict.push(parseExpr());
				consume(":");
				dict.push(parseExpr());
			} else {
				throw new Error("dict syntax error: '" + currToken.value + "'");
			}
		}
		consume("}");
	}
	return dict;
}

function parseFactor() { //<factor> ::= ( <expr> ) | identifier | string | list | tuple | dict | number | function | class.member | class.method() | arr[expr]
	var factor = [];
	if (currToken.type == "operator" && currToken.value == "(") {
		nextToken();
		factor = parseExpr();
		if (currToken.type == "operator" && currToken.value == ",")
			factor = parseTuple(factor);
		consume(")");
		// } else if (currToken.type == "function"){
		// factor = parseFunction();
	} else if (currToken.type == "identifier" || currToken.type == "function" || currToken.type == "class") { //"object"|"function"
		if (lookNextToken(1) == "(") {
            if(identifierTable[currToken.value] && identifierTable[currToken.value]["type"] == "class"){
                factor = parseFunctionCall(1);
            } else{
                factor = parseFunctionCall(0);
            }			
		} else {
			factor = [currToken.value];
			nextToken();
		}
		while (currToken.value == "." || currToken.value == "[") {
			if (currToken.value == ".") {
				factor = [factor];
				factor.unshift(".");
				consume(".");
				if (lookNextToken(1) == "(") { //f.g()
					factor.push(parseFunctionCall(0))
				} else { //f.x
					factor.push(currToken.value);
					nextToken();
				}
			} else if (currToken.value == "[") {
				factor = [factor];
				factor.unshift("index");
				consume("[");
				factor.push(parseExpr());
				consume("]");
			} else {
				throw new error("error in parseFactor")
			}
		}
		// } else if (currToken.type == "identifier") {
		// factor = [currToken.value];//[]?
		// nextToken();
	} else if (currToken.type == "number") {
		factor = [currToken.value]; //[]?
		nextToken();
	} else if (currToken.type == "operator" && currToken.value == "[") {
		factor = parseList();
	} else if (currToken.type == "operator" && currToken.value == "{") {
		factor = parseDict();
	} else if (currToken.type == "operator" && currToken.value == "\"" ) {
		consume("\"");
		factor.push("string");
		var str = [currToken.value];
		factor.push(str);
		nextToken();
		consume("\"");
	} else if (currToken.type == "operator" && currToken.value == "'" ) {
		consume("'");
		factor.push("string");
		factor.push(currToken.value);
		nextToken();
		consume("'");
	}
	return factor;
}

function term_tail(left_term) { //<term_tail> ::= */% <factor> <term_tail> | empty
	if (["*", "/", "%"].indexOf(currToken.value) != -1) {
		left_term = [left_term];
		left_term.unshift(currToken.value);
		nextToken();
		left_term.push(parseFactor());
		// console.log(arrayToString(left_term))
		return term_tail(left_term);
	}
	return left_term;
}

function parseTerm() { //<term> ::= <factor> <term_tail>
	var factor = parseFactor();
	return term_tail(factor);
}

function expr_tail(left_expr) { //<expr_tail> ::= +- <term> <expr_tail> | empty
	if (["+", "-"].indexOf(currToken.value) != -1) {
		left_expr = [left_expr]
		left_expr.unshift(currToken.value);
		nextToken();
		left_expr.push(parseTerm());
		return expr_tail(left_expr);
	}
	return left_expr;
}

function parseExpr() { //<expr> ::= <term> <expr_tail>
	var term = parseTerm();
	// console.log(arrayToString(term))
	return expr_tail(term);
}

function parseAssignmentStmt() {
	var stmt = parseFactor();
	if (currToken.value == "=") {
		stmt = [stmt]
		consume("=");
		stmt.unshift("=")
		stmt.push(parseExpr());
	}
	return stmt;
}

function parseStatementList() {
	var stmts = [];
	var loop = true;
	while (currToken.type != 0 && loop == true) {
		var stmt = [];
		switch (currToken.type) {
		case "identifier":
		case "function":
			// if (lookNextToken() == "=") // ��ֵ���?
			stmt = parseAssignmentStmt();
			// else if (lookNextToken() == "." || lookNextToken() == "(" || lookNextToken() == "[")
			// stmt = parseFactor();
			// else
			// throw new Error("error in parseStatementList()")
			break;
		case "number":
			stmt = parseExpr();
			break;
			// case "function":        //calling function
			// stmt = parseFunction();
			// break;
		case "keyword":
			switch (currToken.value) {
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
				while (currToken.type == "keyword" && currToken.value == "elif") {
					consume("elif");
					stmt.push(parseCondition());
					consume(":");
					stmt.push(parseStatementList())
				}
				if (currToken.type == "keyword" && currToken.value == "else") {
					consume("else");
					stmt.push("else")
					consume(":");
					stmt.push(parseStatementList())
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
				if (currToken.value != ";")
					stmt.push(parseAssignmentStmt()); //simple assignment statement. To be modified
				consume(";")
				if (currToken.value != ";")
					stmt.push(parseCondition());
				consume(";");
				stmt.push(parseAssignmentStmt());
				consume(":");
				stmt.push(parseStatementList());
				consume("endfor");
				break;
			case "continue":
				consume("continue");
				stmt = ["continue"];
				break;
			case "break":
				consume("break");
				stmt = ["break"];
				break;
			case "def": //define a function
				parseFunction();
				break;
             case "class":
                parseClass();
                break;
			case "endif":
			case "endwhile":
			case "endfor":
			case "else":
			case "elif":
            case "enddef":
            case "endclass":
			case ".":
				loop = false;
				break;
			case "return":
				stmt.push("return")
				consume("return")
				stmt.push(parseExpr());
				break;
			default:
				break;
			}
			break;
		default:
			break;
		}
		//if (loop == true){
		if (stmt.length > 0) {
			stmts.push(stmt)
		}
		// }
	}
	return stmts;
}

function parseCondition() { // leftexpr op rightexpr
	var leftexpr = parseExpr();
	if (["==", "!=", ">=", "<=", ">", "<"].indexOf(currToken.value) != -1) {
		ret = [currToken.value];
		ret.push(leftexpr);
		nextToken();
		var rightexpr = parseExpr()
			ret.push(rightexpr);
	} else {
		throw new Error("compare statement expected, not '" + currToken.value + "'");
	}
	return ret;
}

///Interpreter

function execFunc(stmt) {
    if(currClass != 0){
        preFunc = currFunc;
        var function_name = stmt[1] + ":" + funcNum++; //create a new function instance
        funcVariables[function_name] = [];
        funcCallStack.unshift(function_name)
        currFunc = function_name;
        if( stmt[stmt.length-1]["value"])
            var function_addr = stmt[stmt.length-1]["value"][stmt[1]];
        else
            var function_addr = stmt[stmt.length-1][stmt[1]];
        funcVariables[currFunc][function_addr["params"][0]] = stmt[stmt.length-1];
        if (function_addr["params"].length > 0) { //tranfser parameter value
            for (var i = 1; i < function_addr["params"].length; i++) {
                currFunc = preFunc;
                execExpression(stmt[i + 1]);
                currFunc = funcCallStack[0]
                funcVariables[currFunc][function_addr["params"][i]] = stack.pop()
            }
        }
        execStatementList(function_addr["value"]); //excute the function accoording to the parse tree store in funcTable[function_name]
        funcVariables[currFunc] = [];
        funcCallStack.shift()
        currFunc = funcCallStack[0] ? funcCallStack[0] : 0;
    }
    else{
        preFunc = currFunc;
        var function_name = stmt[1] + ":" + funcNum++; //create a new function instance
        funcVariables[function_name] = [];
        funcCallStack.unshift(function_name)
        currFunc = function_name;
        if (funcParams[currFunc.split(":")[0]].length > 0) { //tranfser parameter value
            for (var i = 0; i < funcParams[currFunc.split(":")[0]].length; i++) {
                currFunc = preFunc;
                execExpression(stmt[i + 2]);
                currFunc = funcCallStack[0]
                funcVariables[currFunc][funcParams[currFunc.split(":")[0]][i]] = stack.pop()
            }
        }
        execStatementList(funcTable[currFunc.split(":")[0]]); //excute the function accoording to the parse tree store in funcTable[function_name]
        funcVariables[currFunc] = [];
        funcCallStack.shift()
        currFunc = funcCallStack[0] ? funcCallStack[0] : 0;
    }
}

function execClass(stmt) {
    var class_name = stmt[1]
    preFunc = currFunc;
    var function_name = class_name + ":" + "__init__" + funcNum++; //create a new function instance
    funcVariables[function_name] = [];
    funcCallStack.unshift(function_name)
    currFunc = function_name;
    if (identifierTable[class_name]["value"]["__init__"]) { //tranfser parameter value
        if (identifierTable[class_name]["value"]["__init__"]["params"].length > 1){
            for (var i = 1; i < identifierTable[class_name]["value"]["__init__"]["params"].length; i++) {
                currFunc = preFunc;
                execExpression(stmt[i + 1]);
                currFunc = funcCallStack[0]
                funcVariables[function_name][identifierTable[class_name]["value"]["__init__"]["params"][i]] = stack.pop()
            }
        }
    }
    var object = [];
    object["class"] = class_name
    if (identifierTable[class_name]["value"]["__init__"]){       
        var stmt = identifierTable[class_name]["value"]["__init__"]["value"];
        for(var i = 0; i < stmt.length; i++){
            var param_name = stmt[i][1][2]
            object[param_name] = []
            object[param_name]["value"] = funcVariables[function_name][stmt[i][2]]
            object[param_name]["type"] = "variable"
        }
    }
    
    for(var i = 0; i < identifierTable[class_name]["function"].length; i++){
        var function_name = identifierTable[class_name]["function"][i]
        object[function_name] = identifierTable[class_name]["value"][function_name]
    }
    stack.push(object)
    funcVariables[currFunc] = [];
    funcCallStack.shift()
    currFunc = funcCallStack[0] ? funcCallStack[0] : 0;
}

function addType(id, type) {
	if (type == "list")
		id["type"] = "list";
	else if (type == "tuple")
		id["type"] = "tuple";
	else if (type == "dict")
		id["type"] = "dict";
	else
		id["type"] = "number";
}

function execList(stmt) { // list [1] [2] [3] [4]
	var list = [];
	for (var i = 1; i < stmt.length; i++) {
		execExpression(stmt[i]);
		list.push(stack.pop());
	}
	addType(list, "list");
	stack.push(list);
}

function execTuple(stmt) { // tuple [1] [2] [3] [4]
	var tuple = [];
	for (var i = 1; i < stmt.length; i++) {
		execExpression(stmt[i]);
		tuple.push(stack.pop());
	}
	addType(tuple, "tuple");
	stack.push(tuple);
}

function execDict(stmt){ // dict [1] [2] [3] [4]
	var dict = {};
	for (var i = 1; i < stmt.length; i=i+2) {
		execExpression(stmt[i]);
		execExpression(stmt[i+1]);
		// dict.push(stack.pop());
		var value = stack.pop();
		var key = stack.pop();
		dict[key] = value;
	}
	addType(dict, "dict");
	stack.push(dict);
}

function calculate(expr, leftOperand, rightOperand) {
	if (leftOperand instanceof Array) {
		switch (expr[0]) {
		case "+":
			if (rightOperand instanceof Array){
				var newList = leftOperand.addList(rightOperand);
				newList["type"] = "list";
				stack.push(newList);
			}
			else
				throw new Error("Invalid operation " + expr[0]);
			break;
		case "*":
			if (Number.isInteger(rightOperand)) {
				var mulList = [];
				for (var i = 0; i < rightOperand; i++) {
					mulList = mulList.addList(leftOperand);
				}
				mulList["type"] = "list";
				stack.push(mulList);
			} else
				throw new Error("Invalid operation " + expr[0]);
			break;
		default:
			throw new Error("Invalid operation " + expr[0]);
			break;
		}
	} else if (rightOperand instanceof Array) {
		switch (expr[0]) {
		case "+":
			if (leftOperand instanceof Array){
				var newList = rightOperand.addList(leftOperand);
				newList["type"] = "list";
				stack.push(newList);
			}
			else
				throw new Error("Invalid operation " + expr[0]);
			break;
		case "*":
			if (Number.isInteger(leftOperand)) {
				var mulList = [];
				for (var i = 0; i < leftOperand; i++) {
					mulList = mulList.addList(rightOperand);
				}
				mulList["type"] = "list";
				stack.push(mulList);
			} else
				throw new Error("Invalid operation " + expr[0]);
			break;
		default:
			throw new Error("Invalid operation " + expr[0]);
			break;
		}
	} else {
		switch (expr[0]) {
		case "+":
			stack.push(leftOperand + rightOperand);
			break;
		case "-":
			stack.push(leftOperand - rightOperand);
			break;
		case "*":
			stack.push(leftOperand * rightOperand);
			break;
		case "/":
			stack.push(leftOperand / rightOperand);
			break;
		case "%":
			stack.push(leftOperand % rightOperand);
			break;
		}
	}
}

function execExpression(expr) {
	if (expr[0] == "dict") {
		execDict(expr);
	} else if (expr instanceof Array && expr.length == 1) {
		execExpression(expr[0]);
	} else if (expr[0] == "."){
        var result = execDotExpr(expr)
        if(result["value"])
            stack.push(result["value"])
        else 
            stack.push(result)
    } else if (expr[0] == "function") {
		execFunc(expr)
	} else if (expr[0] == "class"){
        execClass(expr)
    } else if (expr[0] == "list") {
		execList(expr);
	} else if (expr[0] == "tuple") {
		execTuple(expr);
	} else if (expr[0] == "string") {
		str = [];
		str.push(expr[1][0]);
		str["type"] = "string";
		stack.push(str);
	} else if (expr instanceof Array && expr.length == 3) {
		execExpression(expr[1]);
		execExpression(expr[2]);
		rightOperand = stack.pop();
		leftOperand = stack.pop();
		calculate(expr, leftOperand, rightOperand);
	} else {
		if (!isNaN(expr))
			stack.push(expr);
		else {
			if (currFunc == 0)
				stack.push(identifierTable[expr]["value"]) //use global variables
				else {
					if (funcVariables[currFunc][expr])
						stack.push(funcVariables[currFunc][expr]); //use local variables
					else
						stack.push(identifierTable[expr]["value"]) //use global variables in a function
				}

		}
	}
}

function execDotExpr(expr){
    var i = 0;
    var result;
    while(expr[i] == ".")
        i++;
    if(currFunc == 0){
        result = identifierTable[expr[i]]
    }
    else{
        result = funcVariables[currFunc][expr[i]]
    }
    for(i = i + 1;i<expr.length; i++){
		if (result["value"]["type"] == "list" && expr[i][1] == "toSet"){
			result["value"] = result["value"].unique();
		} else if(expr[i][0] == "function"){
            if(expr[i][1][0] == "_" && expr[i][1][1] == "_" && currClass != result["value"]["class"]){
                throw new Error("illegal access to private variable");
            }
            var func = expr[i]
            expr[i].push(result) //function, transfer the object addr, function name and params
            if(result["value"])
                currClass = result["value"]["class"]
            else
                currClass = result["class"]
            execFunc(expr[i])
            currClass = 0
            result = stack.pop()
        }
        else{
            if(expr[i][0] == "_" && expr[i][1] == "_" && currClass != result["value"]["class"]){
                throw new Error("illegal access to private variable");
            }else{
                if(result["value"])
                    result = result["value"][expr[i]]
                else
                    result = result[expr[i]]
            }
        }

    }
    return result
}

function execAssignment(stmt) {
    execExpression(stmt[2]);
    if (stmt[1][0] == "."){
        var left_operand = execDotExpr(stmt[1])
        left_operand["value"] = stack.pop()    
    } else if (currFunc == 0) { //get the result as global variable
        if (stmt[1][0] == "index") { // index x 0
            if ( identifierTable[stmt[1][1]]["value"]["type"] == "tuple")
                throw new Error("'tuple' object does not support item assignment");
			if ( identifierTable[stmt[1][1]]["value"]["type"] == "string")
                throw new Error("'string' object does not support item assignment");
            execExpression(stmt[1][2]);
            var index = stack.pop();
            if (index > identifierTable[stmt[1][1]]["value"].length - 1)
                throw new Error("IndexError: index " + index + " out of range");
            identifierTable[stmt[1][1]]["value"][index] = stack.pop();
        } else {
            identifierTable[stmt[1][0]]["value"] = stack.pop(); //??[1][0]
        }
    } else {
        if (stmt[1][0] == "index") { // index x 0
            if (funcVariables[currFunc][stmt[1][1]]) {
				if ( funcVariables[currFunc][stmt[1][1]]["type"] == "tuple")
					throw new Error("'tuple' object does not support item assignment");
				if ( funcVariables[currFunc][stmt[1][1]]["type"] == "string")
					throw new Error("'string' object does not support item assignment");
                execExpression(stmt[1][2]);
                var index = stack.pop();
                if (index > funcVariables[currFunc][stmt[1][1]].length - 1)
                    throw new Error("IndexError: list index " + index + " out of range");
                funcVariables[currFunc][stmt[1][1]][index] = stack.pop(); //get the result as local variable
            } else {
				if ( identifierTable[stmt[1][1]]["value"]["type"] == "tuple")
					throw new Error("'tuple' object does not support item assignment");
				if ( identifierTable[stmt[1][1]]["value"]["type"] == "string")
                throw new Error("'string' object does not support item assignment");
                execExpression(stmt[1][2]);
                var index = stack.pop();
                if (index > identifierTable[stmt[1][1]]["value"].length - 1)
                    throw new Error("IndexError: list index " + index + " out of range");
                identifierTable[stmt[1][1]]["value"] = stack.pop(); //get the result as global variable in a function
            }
        } else {
            funcVariables[currFunc][stmt[1][0]] = stack.pop(); //get the result as local variable
        }
    }
}

function execPrintItem(out) {
	var outStrItem = "";
	if (out.length > 1) {
		for (var i = 0; i < out.length - 1; i++) {
			if (out[i] instanceof Object) {
				if (out[i] instanceof Array)
					outStrItem += execPrint(out[i])+ ", ";
				else
					outStrItem += execPrint(out[i])+ ", ";
			} else {
				outStrItem += out[i] + ", ";
			}
		}
		if (out[out.length - 1] instanceof Array) {
			outStrItem += execPrint(out[i]);
		} else if (out[i] instanceof Object){
			outStrItem += execPrint(out[i]);
		} else {
				outStrItem += out[i];
		}
	} else if (out[0] instanceof Object){
		outStrItem += execPrint(out[0]);
	} else {
		outStrItem += out;
	}
	return outStrItem;
}

function execPrintEnclosureLeft(type) { // list tuple dict 左符号
	if (type == "list") {
		return "[";
	} else if (type == "tuple") {
		return "(";
	} else if (type == "dict") {
		return "{";
	} else {
		return "";
	}
}

function execPrintEnclosureRight(type) { // list tuple dict 右符号
	if (type == "list") {
		return "]";
	} else if (type == "tuple") {
		return ")";
	} else if (type == "dict") {
		return "}";
	} else {
		return "";
	}
}

function execPrint(out) {
	var outStr = "";
	if (typeof out === 'string')
		outStr += out;
	else if (out.constructor == Object){  // [] instanceof array和object 都是true, 用constructor区分
		outStr += execPrintEnclosureLeft(out["type"]);
		// outStr += execPrintDict(out);
		for (var i in out){
			if (i != "type")
				outStr += i + ":" + execPrint(out[i]) + ", "
		}
		if (outStr.length>2)
			outStr = outStr.substring(0,outStr.length-2);
		outStr += execPrintEnclosureRight(out["type"]);
	} else { 
		if (out instanceof Array)
			outStr += execPrintEnclosureLeft(out["type"]);
		outStr += execPrintItem(out);
		if (out instanceof Array)
			outStr += execPrintEnclosureRight(out["type"]);
	}
	return outStr;
}

function execStatement(stmt) {
	var loopStatus = "normal";
	// switch(stmt[0])
	if (stmt[0] == "=") {
		execAssignment(stmt);
	} else if (stmt[0] == "print") {
		if (stmt[1][0] == "index") {
			execExpression(stmt[1][2]);
			var index = stack.pop();
			if (identifierTable[stmt[1][1]]["value"]["type"] == "string"){
				if (index > identifierTable[stmt[1][1]]["value"][0].length - 1)
					throw new Error("IndexError: index " + index + " out of range");
				outstr = identifierTable[stmt[1][1]]["value"][0].substring(index, index+1);
			} else {
				if (index > identifierTable[stmt[1][1]]["value"].length - 1)
					throw new Error("IndexError: index " + index + " out of range");
				if (!(index in identifierTable[stmt[1][1]]["value"]))
					throw new Error("KeyError:  " + index );
				outstr = execPrint(identifierTable[stmt[1][1]]["value"][index]);
			}
			document.getElementById("output_area").value += outstr + "\n";
		} else {
			execExpression(stmt[1]);
			out = stack.pop();
			outstr = execPrint(out);
			document.getElementById("output_area").value += outstr + "\n";
			// console.info("out:", outstr);
		}
	} else if (stmt[0] == "if") { //if cond expr1 [elif expr] [else expr2]
		var i = 1;
		execCondition(stmt[i]);
		while (!stack.pop()) {
			i = i + 2;
			if (i >= stmt.length) // has no 'else'
				return loopStatus;
			if (stmt[i] == "else")
				break;
			execCondition(stmt[i]);
		}
		loopStatus = execStatementList(stmt[i + 1]);
	} else if (stmt[0] == "while") { //while cond expr
		execCondition(stmt[1]);
		while (stack.pop()) {
			loopStatus = execStatementList(stmt[2]);
			if (loopStatus == "break")
				return loopStatus;
			execCondition(stmt[1]);
		}
	} else if (stmt[0] == "for") { //for assign1 cond assign2 stmt
		execStatement(stmt[1]);
		execCondition(stmt[2]);
		while (stack.pop()) {
			loopStatus = execStatementList(stmt[4]);
			if (loopStatus == "break")
				return loopStatus;
			execStatement(stmt[3]);
			stack.pop();
			execCondition(stmt[2]);
		}
	} else if(stmt[0] == "."){
        execDotExpr(stmt)
    } else if (stmt[0] == "function") {
		execFunc(stmt)
	} else if (stmt[0] == "class"){
        execClass(stmt)
    } else if (stmt[0] == "return") {
		execExpression(stmt[1])
	} else if (stmt[0] == "continue") {
		loopStatus = "continue";
	} else if (stmt[0] == "break") {
		loopStatus = "break";
	} else if (operators.indexOf(stmt[0]) != -1) {
		// console.log("ok")
	} else {
		throw new Error("Invalid statement");
	}
	return loopStatus;
}

function execStatementList(program) {
	var loopStatus = "normal";
	for (var i = 0; i < program.length; i++) {
		loopStatus = execStatement(program[i]);
		if (loopStatus == "break" && (program[i][0] == "while" || program[i][0] == "for")) {
			loopStatus = "normal"; //reset the loopStatus
			continue; // break to execute next statement after "while" or "for"
		} else if (loopStatus == "continue" && program[i][0] == "if") {
			return "normal"; //execute the statement in first line of "whlie" or "for" normally
		} else if (loopStatus == "continue" || loopStatus == "break") {
			return loopStatus;
		}
	}
	return "normal";
}

function execCondition(cond) {
	execExpression(cond[1]);
	execExpression(cond[2]);
	rightOperand = stack.pop();
	leftOperand = stack.pop();
	switch (cond[0]) {
	case "==":
		stack.push(leftOperand == rightOperand);
		break;
	case "!=":
		stack.push(leftOperand != rightOperand);
		break;
	case "<=":
		stack.push(leftOperand <= rightOperand);
		break;
	case ">=":
		stack.push(leftOperand >= rightOperand);
		break;
	case "<":
		stack.push(leftOperand < rightOperand);
		break;
	case ">":
		stack.push(leftOperand > rightOperand);
		break;
	default:
		break;
	}
}
