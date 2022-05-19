import sys
import os
import subprocess


#print(sys.argv)
#print("PID:")
#print (os.getpid())

dr = '../darknet/'
os.chdir(dr)

#sys.argv[1] = "L20-0001"
#sys.argv[2] = "I20-0001"
#sys.argv[3] = "ws14703558--0001--00001--000001_z030.png"
#sys.argv[4] = "b5d99ffa253473ddf0efc2ad43a74899"




darknet = "/home/jysoft2/darknet"
ai = "/home/jysoft2/aiMovieTool2"
data = "/build/darknet/x64/data/obj.data";
cfg = "/cfg/yolo-obj.cfg"
weights =   ai + "/data/checkpoints/" + sys.argv[1] + "/yolo-obj_final.weights"     # "/build/darknet/x64/backup2/yolo-obj_final_valid2.weights" #argv 사용
before =  ai + "/data/movie/" + sys.argv[2] + "/before/"  #"/build/darknet/x64/data/obj3/nonpd/ws14654722--0001--00001--000001_png/ws14654722--0001--00001--000001_z029.png" #argv 사용
after =  ai + "/data/movie/" + sys.argv[2] + "/after/"
img = before + sys.argv[3]

subprocess.call(['cp', ai + "/data/movie/" + sys.argv[4] , before + sys.argv[3] ]);


with open( after + 'yoloout.txt', 'w') as outfile:
    subprocess.call(['./darknet', 'detector', 'test', darknet+data, darknet+cfg, weights, img, '-dont_show' , '-ext_output'], stdout=outfile);


#if os.path.isfile("predictions.jpg"):
subprocess.call(['mv', "predictions.jpg", after + "predictions.jpg" ]);
