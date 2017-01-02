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
  

var test_forin = `list=[1,2,3]
list2 = []
for x in list:
  if x == 3:
    break
  list2.append(x)
print(list2)`

var test_forex = `for x=1; x<10; x=x:
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
  print(x)`

var test_function1 = `x = 1
y = 2
z = 3
def fa(x):
    z = 5
    print("local:")
    print(x)
    print(y)
    print(z)
fa(4)
print("global:")
print(x)
print(y)
print(z)`

var test_function2 = `def fact(x):
    if x <= 1:
        return 1
    else:
        return x * fact(x-1)
b = fact(4)
print(b)`

var test_class1 = `class Student():
    def __init__(self, name, school):
        self.name = name
        self.__school = school
    def print(self, x):
        print(self.name)
        print(x)
        print(self.__school)
        
bart = Student("bart","ZJU")
bart.print("is a student in ")
bart.name = "bart2"
bart.print("is a student in ")`

var test_class2 = `class Animal():
    def __init__(self, name):
        self.name = name
    def f():
        print("animal:f()")
    def run(self):
        print("animal is running")

class Dog(Animal):
    def run(self):
        print("dog is running")

class Cat(Animal):
    def __init__(self,name,hobby):
        self.name = name
        self.hobby = hobby
    def run(self):
        print("cat is running")

animal = Animal(10)
dog = Dog("dog")
cat = Cat("cat", "ball")

print("variable:")
print(dog.name)
print(cat.hobby)

print("f():")
dog.f()
cat.f()

print("run():")
dog.run()
cat.run()

def run(animal):
    animal.run()
    
print("run():")
run(animal)
run(dog)
run(cat)`
	
test_list1 = `# 赋值
x = [[1/2,100],(2,3),{4:5},4]
print(x)
x[1+1] = 10/20-2
print(x)

# list + *
print([])
x = [1,2]
print(x)
print((x+[2])*2)
print(x*3+[2]*3)
print(x*3*3)`

test_list2 = `#list的其他操作
list = [1,2,3,1,2,3]
print(list)
# append
list.append({1:23})
print(list)
# reverse
list.reverse()
print(list)
# count
print(list.count(1))
# copy
c = list.copy()
print(c)
# toSet
s = list.toSet()
print(s)
# clear
list.clear()
print(list)`

test_tuple = `# tuple
y = (1,{2:2},(3,),[1,2,3,4])
print(y)

print(y[3])

# dictionary
y = {}
print(y)

x = {"name":"jspy","hello":"world"}
print(x)

print(x["name"])

x["abc"] = "abc"
print(x)`