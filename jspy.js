var tokenlist = [];
var currtoken = {
	type	: 0,
	value	: 0,
}
var keywords = ["while", "endwhile", "if", "else", "endif", "print", ]
var operators = ["=", "==", "!=", ">=", "<=", ">", "<", "+", "-", "*", "/", "%", "(", ")", ":"]
var identifierTable = new Array();
var stack = [];

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
			identifierTable[s] = 0;
			currtoken.type = "identifier";
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
	var reg= /^[_A-Za-z][A-Za-z0-9]*$/;//单个下划线也可以是合法变量名
	return reg.test(s)
}

function consume(value) {
	if (currtoken.value == value) {
		nextToken(); 
	} else {
		throw new Error("expected '" + value + "' not found");
		nextToken();
	}
}

function parseFactor() {//<factor> ::= ( <expr> ) | identifier
	var factor = [];
	if (currtoken.type == "operator" && currtoken.value == "(") {
		nextToken();
		factor = parseExpr();
		consume(")");
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
	stmt = [parseIdentifier()];
	consume("=");
	stmt.unshift("=")
	stmt.push(parseExpr());
	return stmt;
}

function parseIdentifier() {
	var ret = currtoken.value;
	nextToken();
	return ret;
}

function parseStatementList() {
	var stmts = [];
	var loop = true;
	while (currtoken.type != 0 && loop == true) {
		var stmt = [];
		switch(currtoken.type) {			
		case "identifier":// 赋值语句
			stmt = [currtoken.value];
			nextToken();
			consume("=");  
			stmt.unshift("=");
			stmt.push(parseExpr());
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
				stmt.push(parseStatementList());
				consume("endwhile")
				break;
			case "endif": case "endwhile":
				loop = false;
				break;
			default:
				break;
			}
			break;
		default:
			break;
		}
		if (loop == true)
			stmts.push(stmt)
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
		consume(":");
	} else {
		throw new Error("compare statement expected, not '" + currtoken.value + "'");
	}
	return ret;
}

///Interpreter
function execExpression(expr) {
	if (expr.length == 3) {
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
		else 
			stack.push(identifierTable[expr[0]])
	}
}

function execStatement(stmt) {
	// switch(stmt[0])
	if (stmt[0] == "=") {
		execExpression(stmt[2])
		identifierTable[stmt[1][0]] = stack.pop();//??[1][0]
	} else if (stmt[0] == "print") {
		execExpression(stmt[1])
		outstr = stack.pop();
		document.getElementById("output_area").value = outstr;
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
	} else {
		throw new Error("Invalid statement");
	}
}

function execStatementList(program) {
	for (i in program) {
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



















