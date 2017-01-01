x=1
y=2*3


#if-elif-else语句
x=4
if x==1:
  x=11
elif x==2:
  x=22
elif x==3:
  x=33
else:
  x=44
print(x)

x=1
while x==1:
  if x==2:
    x=x+1
  x=10
print(x)

#for
x=1
for i=0; i<5; i=i+1:
  x=x+1
print(x)

#while里面嵌套if
x=1
while x<10:
  if x==1:
    x=x+2
    print(x)
    continue
  elif x==3:
    x=x+5
    print(x)
  else: 
    x=-1
    print(x)
    break
  x=x+1
  print(x)

#for里面嵌套if
for x=1; x<10; x=x:
  if x==1:
    x=x+2
    print(x)
    continue
  elif x==3:
    x=x+5
    print(x)
  else: 
    x=-1
    print(x)
    break
  x=x+1
  print(x)

#双重嵌套的continue和break
x=2
while x<5:
  for i=0; i<4; i=i+1:
    if i<x:
      continue
    y=i
    print(y)
    break
  x=x+1
  print(x)
  if x==4:
    break



#函数一定要有返回值

def pow(x,n):
    s=1
    while n>0:
        s=s*x
        n=n-1
    return s
    
print(pow(2,3))

##全局变量 & 局部变量
x=1
y=2
def fa(x):
    print(x)
    print(y)
fa(4)

x=[1,2]
y=[3,4]
def fa (x):
    print(x)
    print(y)
fa(4)

#传递表达式 & 返回表达式
x=1
y=2
def fb(x,y):
    if x==5:
       print(x+y)
    return x*y
a=fb(2*x,2*y)
print(a)

#函数出现在表达式，参数，返回值中
def fs(x):
    return x+1
def fp():
    return 10
def fq(x):
    return x+fp()
print (fq(fs(fp()*2)))
print (fp()*2)
print (fq(1))

#递归
def fc(x):
    if x<=10:
        x=fc(x+1)
    return x
b=fc(9)
print(b)


#成员函数
def ga(x,n):
    s=1
    return s 
x =(1+obj1.obj2.ga(1,2).t)*(ga(1,2)+2)

#下标运算符合成员函数的混合调用
def gb(x,n):
    s=1
    return s 
a=gb(b[gb(x,y)],z)
print(a)


#递归(求阶乘)
def fact(x):
    if x<=1:
        return 1
    else:
        return x*fact(x-1)
b=fact(4)
print(b)

# list 现在只能赋值和+ *
print([])
x=[]
print(x)
print([[1/2,100],[2,3],3,4])
x=[1,1+1,[[3,4],5],6,7]
print(x)
print(x+[2])
print(x*3+[2]*3)
print(x*3*3)

# list . 操作 toSet, count(i), copy, append(i), reverse, clear
list=[1,2,3,1,2,3]
c=list.copy()
print(c)
set=list.toSet()
print(list)
print(set)
list.append({1:23})
print(list)
list.reverse()
print(list)
print(list.count(1))
print(list)
list.clear()
print(list)

# list 取下表，越界报错
x=[1,[2,[3,4,5]],[6,7]]
print(x)
x[1+1]=10/20-2
print(x)

# tuple 对内部数据赋值报错
y=(1,{2:2},(3,),[1,2,3,4])
print(y)
print(y[3])

# dict
x={" ab ":[1,{2:3}],1:(3,4)}
print(x)
y={}
print(y)
print(x[" ab "])
x[1]=0
print(x)

#string
abc=" abcdefg "
print(abc[2])

#类
#成员变量&成员函数的调用&赋值       
class Student():
    def __init__(self,name,school):
        self.__name=name
        self.school=school
    def f(self,x):
        print(self.__name)
        print(x)
        return "f() finished"
    def __f(self):
        print(1)
bart=Student("bart","ZJU")
print(bart.f("is a student"))
x=bart.school
print(x)
bart.school="ABC"
print(bart.school)

bart.__f()  
bart.__name="bart2" #访问私有变量报错

#嵌套调用类
#Student类的f()中创建了Dog类的对象并调用该对象的f()函数
class Dog():
    def __init__(self,name):
        self.name=name
    def f(self):
        print(self.name)

class Student():
    def __init__(self,name,school):
        self.__name=name
        self.school=school
    def f(self):
        dog=Dog("dog")
        dog.f()

Amy=Student("Amy","ZJU")
Amy.f()

#继承&多态
#Dog类和Cat类均继承自Animal类
#Dog类继承了Animal类的构造函数，Cat类重载了Animal类的构造函数
#Dog类和Cat类继承了Animal类f()函数，各自重载了run()函数
class Animal():
    def __init__(self,name):
        self.name=name
    def f():
        print("animal:f()")
    def run(self):
        print("animal is running")

class Dog(Animal):
    def run(self):
        print("dog is running")

class Cat(Animal):
    def __init__(self,name,hobby):
        self.name=name
        self.hobby=hobby
    def run(self):
        print("cat is running")

animal=Animal(10)
dog=Dog("dog")
cat=Cat("cat","ball")
dog.f()
cat.f()
dog.run()
cat.run()
print(dog.name)
print(cat.hobby)

def run(animal):
    animal.run()

run(animal)
run(dog)
run(cat)