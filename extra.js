   [15][12][13][14][15]
   [03][00][01][02][03]
   [07][04][05][06][07]

   width * (height-1)

       /*
      surrounding cells:
      [x-(width-2)],[x-width-1],[x-width]
           [x-1],      [x],      [x+1] 
      [x+width],[x+width+1],[x-width+2]

      [18][19][20]
      [49][50][51]
      [80][81][82]
    */