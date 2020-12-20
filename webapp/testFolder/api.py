import pytesseract as tess  
tess.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe' 
from PIL import Image
from gtts import gTTS 
import os
import codecs

#-------------------------------------------------------------------

print ("Reading text from Image Initiated .............")

img = Image.open('testimage.jpg')
text = tess.image_to_string(img)

#-------------------------------------------------------------------

print (text)
print ("Writing text to a file ........................")

filename = "Random"
file1 = open(filename,"w+") 
file1.readline()
file1.write(text)
file1.close()

print ("file is written ...............................")

# #-------------------------------------------------------------------

fh = open(filename, "r")
myText = fh.read().replace("\n", " ")
language = 'en'
output = gTTS(text=myText, lang=language, slow=False)
outmpfile=filename+".mp3"
output.save(outmpfile)
fh.close()

print ("Audio file was saved")

