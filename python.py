import pandas as pd
import cv2
import numpy as np
import matplotlib.pyplot as plt

def process(img):
  ret,thresh1 = cv2.threshold(img,170,255,cv2.THRESH_BINARY)

  #### ---------->>>>>>>> Finding index of header line ---------->>>>>>>>>>
  mx = 0;
  index = -1
  for h in range(int(thresh1.shape[0]*2/3)):
    temp = 0;
    for w in range(thresh1.shape[1]):
      if thresh1[h][w] == 0:
        temp += 1;
    if temp>mx:
      mx = temp;
      index = h

  #print("header index: ", index)
  #### --------->>>>>>> Removing header line from the word ---------->>>>>>>
  rg = int(thresh1.shape[0]/17)
  img_n = thresh1.copy();
  for h in np.arange(index - rg, index + rg, 1):
    for w in range(thresh1.shape[1]):
      if img_n[h][w] == 0:
        img_n[h][w] = 255
  


  #### -------->>>>>>> Finding the starting width index of the middle image (main charaters line) --------->>>>>>
  mx = 0;
  img_bottom = img_n[index+rg:].copy()
  height = img_bottom.shape[0]
  check = -1
  idx_max = 0
  for w in range(img_bottom.shape[1]):
    ct = 0
    for h in range(height):
      if img_bottom[h][w] == 0:
        check = 1;
    if check == 1:
      break;
    idx_max = w;

  #print("Starting of word index: ", idx_max)
  #### -------->>>>>> Finding width indexs (seperation indexs in the middle image) -------->>>>>>>>
  img_bottom1 = img_bottom[:, idx_max:].copy()
  idx = []
  for w in range(img_bottom1.shape[1]):
    ct = 0
    for h in range(img_bottom1.shape[0]):
      if img_bottom1[h][w] == 0:
        continue;
      ct += 1;
    if ct == img_bottom1.shape[0]:
      idx.append(w)
  #print(idx)
  
  #### -------->>>> Removing multiple spacing width indexs calculated in above para of code ------>>>>>>
  idx_updated = []
  for i in range(len(idx)):
    if i == 0:
      continue
    if idx[i] == idx[i-1]+1:
      continue;
    idx_updated.append(idx[i-1])
    idx_updated.append(idx[i])
  #print(idx_updated)
  
  #### ----->>>>> Storing middle image characters and modifiers in a list with their location on the original image ------->>>>>
  img_char = []
  img_char_loc = []
  for i in range(int(len(idx_updated)/2)):
    ct = 0
    for h in range(img_bottom1.shape[0]):
      for w in np.arange(idx_updated[2*i], idx_updated[2*i + 1]+1, 1):
        if img_bottom1[h][w] == 0:
          ct += 1;
    if ct/(img_bottom1.shape[0]*(idx_updated[2*i + 1] - idx_updated[2*i])) >0.05:
      img_char.append(img_bottom1[:, idx_updated[2*i]:idx_updated[2*i + 1]])
      img_char_loc.append([idx_updated[2*i], idx_updated[2*i + 1]])
  #print(img_char_loc)

  #### ----->>>>>> removing unneccessary space in the bottom of these middle characters and modifiers ------>>>>>>>
  for i in range(len(img_char)):
    bottom_idx = 0;
    for h in np.arange(img_char[i].shape[0]-1, 0, -1):
      ct = -1
      for w in range(img_char[i].shape[1]):
        if img_char[i][h][w] == 0:
          ct = 1;
          break;
      if ct == 1:
        bottom_idx = h+1;
        break;
    img_char[i] = img_char[i][:bottom_idx+1]

  
  #### ------>>>>> Storing bottom modifier images in the list along with its location (or just index that are associated with middle char and modi) ----->>>>>
  heig = []
  for i in range(len(img_char)):
    heig.append([img_char[i].shape[0], i])

  heig = sorted(heig)
  #print(len(heig))
  med = 0;
  if len(heig)%2 == 0:
    med = (heig[int(len(heig)/2)][0] + heig[int(len(heig)/2 - 1)][0])/2
  else:
    med = heig[int(len(heig)/2)][0]
  bottom_mod_idx = []
  for it in heig:
    if it[0]/med>1.4:
      bottom_mod_idx.append(it[1])
  img_mod_bottom = []
  for it1 in bottom_mod_idx:
    img_mod_bottom.append(img_char[it1][int(img_char[it1].shape[0]*3/4):])
    img_char[it[1]] = img_char[it[1]][:int(img_char[it[1]].shape[0]*3/4)]

  
  #### ----->>>>> Identifying middle modifiers from the middle images ----->>>>>
  width = []
  for i in range(len(img_char)):
    width.append([img_char[i].shape[1], i]);
  width = sorted(width)
  med = 0;
  if len(width)%2 == 0:
    med = (width[int(len(width)/2)][0] + width[int(len(width)/2 - 1)][0])/2
  else:
    med = width[int(len(width)/2)][0]
  middle_mod_idx = []
  middle_mod_idx1 = [];
  for it in width:
    if it[0]/med<0.3:
      middle_mod_idx.append(it[1])
    elif it[0]/med >1.7:
      middle_mod_idx1.append(it[1])


  #### ----->>>>> Seperating and finding upper modifier's location of the word (width indexs) ------>>>>>>>
  img_top = img_n[:index-rg+1].copy()
  img_top = img_top[:, idx_max:]
  idx1 = []
  for w in range(img_top.shape[1]):
    ct = 0
    for h in range(img_top.shape[0]):
      if img_top[h][w] == 0:
        ct = 1;
        break;
    if ct == 0:
      idx1.append(w)
  idx_updated1 = []
  start_idx = 0;
  ii = 1;
  while(ii<len(idx1) and idx1[ii] == idx1[ii-1]+1):
    ii += 1;
    
  for i in np.arange(ii, len(idx1)):
    if i == 0:
      continue
    if idx1[i] == idx1[i-1]+1:
      continue;
    idx_updated1.append(idx1[i-1])
    idx_updated1.append(idx1[i])


  #### ----->>>>> Storing upper modifiers in the list along with their location ------>>>>>>
  img_char_top = []
  img_char_loc_top = []
  for i in range(int(len(idx_updated1)/2)):
    ct = 0
    for h in range(img_top.shape[0]):
      for w in np.arange(idx_updated1[2*i], idx_updated1[2*i + 1]+1, 1):
        if img_top[h][w] == 0:
          ct += 1;
    if ct/(img_top.shape[0]*(idx_updated1[2*i + 1] - idx_updated1[2*i])) >0.05:
      img_char_top.append(img_top[:, idx_updated1[2*i]:idx_updated1[2*i + 1]])
      img_char_loc_top.append([idx_updated1[2*i], idx_updated1[2*i + 1]])


  return img_char_top, img_char, img_mod_bottom


img = cv2.imread('img.jpg', 0)
top_mod, chars, bottom_mod = process(img)

for i in range(len(top_mod)):
  plt.subplot(1, len(top_mod), i+1);
  plt.axis('off')
  plt.imshow(top_mod[i])
plt.savefig('top.jpg')

for i in range(len(chars)):
  plt.subplot(1, len(chars), i+1);
  plt.axis('off')
  plt.imshow(chars[i])
plt.savefig('middle.jpg')

for i in range(len(bottom_mod)):
  plt.subplot(1, len(bottom_mod), i+1);
  plt.axis('off')
  plt.imshow(bottom_mod[i])
plt.savefig('bottom.jpg')