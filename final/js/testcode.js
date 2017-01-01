var test_basic = `x = 2
y = 4*(x+5)/2-6%4
print(y)`

var test_if = `x=4
if x==1:
  x=11
elif x==2:
  x=22
elif x==3:
  x=33
else:
  x=44
print(x)`;

var test_while = `x=1
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
  print(x)`;
  

var test_for = ``

var test_function1 = `x=1
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
fa(4)`

var test_function2 = `def fc(x):
  if x<=10:
    x=fc(x+1)
  return x
b=fc(9)
print(b)`

var test_class1 = `class Student():
  __init__(self,name,school):
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
print(bart.school)`

var test_class2 = `class Animal():
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
print(cat.hobby)`
	
test_list = ``

test_tuple = ``