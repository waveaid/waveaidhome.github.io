import pyrebase

#-------------------------------------------------------------------

from flask import Flask, jsonify
from flask_restful import Resource, Api

#-------------------------------------------------------------------

import requests

#-------------------------------------------------------------------

import pytesseract as tess  
tess.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe' 

#-------------------------------------------------------------------

from PIL import Image

#-------------------------------------------------------------------

from gtts import gTTS 

#-------------------------------------------------------------------

import os
import codecs
import time

#-------------------------------------------------------------------

app = Flask(__name__)
api = Api(app)

#-------------------------------------------------------------------

class HelloWorld(Resource):

    def get(self):

        return {'hello': 'world'}

#-------------------------------------------------------------------

# Firebase Configurations

#-------------------------------------------------------------------

class Convert(Resource):

    def get(self, filename1):

        config = {
            "apiKey": "AIzaSyCBjIe3YZR_mZyXqZpufMSLBti-tuqTE_g",
            "authDomain": "ucd-waveaid-fakhruddin.firebaseapp.com",
            "databaseURL": "https://ucd-waveaid-fakhruddin.firebaseio.com",
            "projectId": "ucd-waveaid-fakhruddin",
            "storageBucket": "ucd-waveaid-fakhruddin.appspot.com",
            "messagingSenderId": "845102201301",
            "appId": "1:845102201301:web:d468ec5a749c0b7c5b655c",
            "measurementId": "G-FYSMZL6C27"
        }

        firebase = pyrebase.initialize_app(config)
        storage = firebase.storage()

        filename2="images/"+filename1+".jpg"

        audiofilename1=filename1+".mp3"

        filename1=filename1+".jpg"
        
        storage.child(filename2).download(filename1)
        
        time.sleep(3)

        #-------------------------------------------------------------------

        print ("Reading text from Image Initiated .............")

        img = Image.open(filename1)
        text = tess.image_to_string(img)
        time.sleep(3)

        #-------------------------------------------------------------------

        # print (text)
        print ("Writing text to a file ........................")

        filename = text[:10]
        file1 = open(filename,"w+") 
        file1.readline()
        file1.write(text)
        file1.close()
        time.sleep(2)

        print ("file is written ...............................")

        #-------------------------------------------------------------------

        fh = open(filename, "r")
        myText = fh.read().replace("\n", " ")
        language = 'en'
        output = gTTS(text=myText, lang=language, slow=False)
        # outmpfile=filename+".mp3"
        output.save(audiofilename1)
        fh.close()
        time.sleep(2)

        print ("Audio file was saved")

        #-------------------------------------------------------------------

        path_on_cloud = ("audiobooks/" + audiofilename1)
        path_local = audiofilename1
        storage.child(path_on_cloud).put(path_local)
        time.sleep(2)

        #-------------------------------------------------------------------

        url = storage.child(path_on_cloud).get_url(None)
        print (url)
        time.sleep(2)

        # os.remove(filename2)

        os.remove(filename)
        
        os.remove(audiofilename1)

        return jsonify ({'Link': url})

api.add_resource(HelloWorld, '/')
api.add_resource(Convert,'/convert/<string:filename1>')

if __name__ == '__main__':
    # app.run(debug=True,host='0.0.0.0')            #This is for Mobile Application
    app.run(debug=True)