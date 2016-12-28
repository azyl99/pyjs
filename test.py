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
endwhile
print ( x )

#for
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
    x = -1
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



#函数一定要有返回值

def pow ( x , n ) :
    s = 1
    while n > 0 :
        s = s * x
        n = n - 1
    endwhile
    return s
    
print ( pow ( 2 , 3 ) )

##全局变量 & 局部变量
x = 1
y = 2
def fa ( x ) :
    print ( x )
    print ( y )
    return 1
fa ( 4 )

#传递表达式 & 返回表达式
x = 1
y = 2
def fb ( x , y ) :
    if x == 5 :
       print ( x + y )
    endif
    return x * y
a = fb ( 2 * x , 2 * y )
print ( a )

#函数出现在表达式，参数，返回值中
def fs ( x ) :
    return x + 1
def fp ( ) :
    return 10
def fq ( x ) :
    return x + fp ( )
print ( fq ( fs ( fp ( ) * 2 ) ) )
print ( fp ( ) * 2 )
print ( fq ( 1 ) )

#递归
def fc ( x ) :
    if x <= 10 :
        x = fc ( x + 1 )
    endif
    return x
b = fc ( 9 )
print ( b )


#成员函数
def ga ( x , n ) :
    s = 1
    return s 
x = ( 1 + obj1 . obj2 . ga ( 1 , 2 ) . t ) * ( ga ( 1 , 2 ) + 2 )

#下标运算符合成员函数的混合调用
def gb ( x , n ) :
    s = 1
    return s 
a = gb ( b [ gb ( x , y ) ] , z )
print ( a )

# list 现在只能赋值和+ *
print ( [ ] )
x = [ ]
print ( x )
print ( [ [ 1 / 2 , 100 ] , [ 2 , 3 ] , 3 , 4 ] )
x = [ 1 , 1 + 1 , [ [ 3 , 4 ] , 5 ] , 6 , 7 ]
print ( x )
print ( x + [ 2 ] )
print ( x * 3 + [ 2 ] * 3 )
print ( x * 3 * 3 )