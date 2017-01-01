x = 1
y = 2 * 3


#if-elif-else语句
x = 4
if x == 1 :
  x = 11
elif x == 2 :
  x = 22
elif x == 3 :
  x = 33
else :
  x = 44
endif
print ( x )

x = 1
while x == 1 :
  if x == 2 :
    x = x + 1
  endif
  x = 10
endwhile
print ( x )

#for
x = 1
for i = 0 ; i < 5 ; i = i + 1 :
  x = x + 1
endfor
print ( x )

#while里面嵌套if
x = 1
while x < 10 :
  if x == 1 :
    x = x + 2
    print ( x )
    continue
  elif x == 3 :
    x = x + 5
    print ( x )
  else : 
    x = -10
    print ( x )
    break
  endif
  x = x + 1
  print ( x )
endwhile

#for里面嵌套if
for x = 1 ; x < 10 ; x = x :
  if x == 1 :
    x = x + 2
    print ( x )
    continue
  elif x == 3 :
    x = x + 5
    print ( x )
  else : 
    x = -1
    print ( x )
    break
  endif
  x = x + 1
  print ( x )
endfor

#双重嵌套的continue和break
x = 2
while x < 5 :
  for i = 0 ; i < 4 ; i = i + 1 :
    if i < x :
      continue
    endif
    y = i
    print ( y )
    break
  endfor
  x = x + 1
  print ( x )
  if x == 4 :
    break
  endif
endwhile



#函数+循环（计算乘方）

def pow ( x , n ) :
    s = 1
    while n > 0 :
        s = s * x
        n = n - 1
    endwhile
    return s
enddef   
print ( pow ( 2 , 3 ) )


##全局变量 & 局部变量 我换成list
x = [ 1 , 2 ]
y = [ 3 , 4 ]
def fa ( x ) :
    print ( x )
    print ( y )
enddef
fa ( 4 )

#传递表达式 & 返回表达式
x = 1
y = 2
def fb ( x , y ) :
    if x == 5 :
       print ( x + y )
    endif
    return x * y
enddef
a = fb ( 2 * x , 2 * y )
print ( a )

#函数出现在表达式，参数，返回值中
def fs ( x ) :
    return x + 1
enddef
def fp ( ) :
    return 10
enddef
def fq ( x ) :
    return x + fp ( )
enddef
print ( fq ( fs ( fp ( ) * 2 ) ) )
print ( fp ( ) * 2 )
print ( fq ( 1 ) )

#递归(求阶乘)
def fact ( x ) :
    if x <= 1 :
        return 1
    else :
        return x * fact ( x - 1 )
    endif
enddef
b = fact ( 4 )
print ( b )


#成员函数
def ga ( x , n ) :
    s = 1
    return s 
enddef
x = ( 1 + obj1 . obj2 . ga ( 1 , 2 ) . t ) * ( ga ( 1 , 2 ) + 2 )

#下标运算符合成员函数的混合调用
def gb ( x , n ) :
    s = 1
    return s 
enddef
a = gb ( b [ gb ( x , y ) ] , z )
print ( a )

# list 赋值和+ *
print ( [ ] )
x = [ ]
print ( x )
print ( [ [ 1 / 2 , 100 ] , ( 2 , 3 ) , { 4 : 5 } , 4 ] )
x = [ [ 1 / 2 , 100 ] , ( 2 , 3 ) , { 4 : 5 , 6 : 7 } , 4 ]
print ( x )
print ( ( x + [ 2 ] ) * 2 )
print ( x * 3 + [ 2 ] * 3 )
print ( x * 3 * 3 )

# list 取下表，越界报错
x = [ 1 , [ 2 , [ 3 , 4 , 5 ] ] , [ 6 , 7 ] ]
print ( x )
x [ 1 + 1 ] = 10 / 20 - 2
print ( x )

# tuple 对内部数据赋值报错
y = ( 1 , { 2 : 2 } , ( 3 , ) , [ 1 , 2 , 3 , 4 ] )
print ( y )
print ( y [ 3 ] )

# dict
x = { " ab " : [ 1 , { 2 : 3 } ] , 1 : ( 3 , 4 ) }
print ( x )
y = { }
print ( y )
print ( x [ " ab " ] )
x [ 1 ] = 0
print ( x )

#类
#成员变量&成员函数的调用&赋值       
class Student ( ) :
    def __init__ ( self , name , school ) :
        self . __name = name
        self . school = school
    enddef
    def f ( self , x ) :
        print ( self . __name )
        print ( x )
        return 3
    enddef
    def __f ( self ) :
        print ( 1 )
    enddef
endclass
bart = Student ( 59 , 12 )
print ( bart . f ( 2 ) )
x = bart . school
print ( x )
bart . school = 87
print ( bart . school )

bart . __f ( )  
bart . __name = 23 #访问私有变量报错

#嵌套调用类
#Student类的f()中创建了Dog类的对象并调用该对象的f()函数
class Dog ( ) :
    def __init__ ( self , name ) :
        self . name = name
    enddef
    def f ( self ) :
        print ( self . name )
    enddef
endclass
class Student ( ) :
    def __init__ ( self , name , school ) :
        self . __name = name
        self . school = school
    enddef
    def f ( self ) :
        dog = Dog ( 10 )
        dog . f ( )
    enddef
endclass
bart = Student ( 59 , 12 )
bart . f ( )

#继承&多态
#Dog类和Cat类均继承自Animal类
#Dog类继承了Animal类的构造函数，Cat类重载了Animal类的构造函数
#Dog类和Cat类继承了Animal类f()函数，各自重载了run()函数
class Animal ( ) :
    def __init__ ( self , name ) :
        self . name = name
    enddef
    def f ( ) :
        print ( " f() " )
    enddef
    def run ( self ) :
        print ( " animal " )
    enddef
endclass

class Dog ( Animal ) :
    def run ( self ) :
        print ( " dog " )
    enddef
endclass

class Cat ( Animal ) :
    def __init__ ( self , name , hobby ) :
        self . name = name
        self . hobby = hobby
    enddef
    def run ( self ) :
        print ( " cat " )
    enddef
endclass

animal = Animal ( 10 )
dog = Dog ( 4 )
cat = Cat ( 5 , 6 )
dog . f ( )
cat . f ( )
dog . run ( )
cat . run ( )
print ( dog . name )
print ( cat . hobby )

def run ( animal ) :
    animal . run ( )
enddef

run ( animal )
run ( dog )
run ( cat )




