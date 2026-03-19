import numpy as np

def extract_geometry(fname):
    print(fname)
    f = open(fname)
    lines = f.readlines()
    f.close()
    P = []
    for line in lines:
        data = line.split()
        if data[0] !=  "v":
            continue
        else:
            x,y,z = data[1:]
            x = float(x)
            y = float(y)
            z = float(z)
            P.append([x,y,z])
    P = np.array(P)

    return P

def calc_box3d(fname):
    verts = extract_geometry(fname)

    mins = np.min(verts, axis=0)
    maxs = np.max(verts, axis=0)

    return [mins[0],maxs[0],mins[1],maxs[1],mins[2],maxs[2],maxs[0] - mins[0],maxs[1] - mins[1],maxs[2] - mins[2]]