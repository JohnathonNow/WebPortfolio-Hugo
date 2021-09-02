import fileinput

P = 39

d = {x: 0 for x in range(0, P)}
for i in fileinput.input():
    i = int(i.strip())
    d[i % P] += 1
print(d)
