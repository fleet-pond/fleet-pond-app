import inspect, os
import xml.etree.ElementTree as ET

filePrefix =  os.path.dirname(os.path.abspath(inspect.getfile(inspect.currentframe()))) + "/blackdiamond" # name of input and output file
smallCut = 15 # number of seconds between each reading is small output file
fileTracked = filePrefix + ".tcx"
fullCSV=filePrefix+"Full.csv"
smallCSV=filePrefix+"Small.csv"

def run():
    removeFile(fullCSV)
    removeFile(smallCSV)

    tree = ET.parse(fileTracked)
    root = tree.getroot()
    i = 0
    for child in root[0][0][1][5]:
        addToFullCSV(child)
        if ((i % smallCut) == 0):
            addToSmallCSV(child)
        i += 1

def removeFile(fileName):
    try:
        os.remove(fileName)
    except OSError:
        pass

def addToFullCSV(point):
    with open(filePrefix + "Full.csv", "a") as myFile:
        myFile.write(convertTrackpointToCSV(point))

def addToSmallCSV(point):
    with open(filePrefix + "Small.csv", "a") as myFile:
        myFile.write(convertTrackpointToCSV(point))

def convertTrackpointToCSV(point):
    return (point[0].text + ", " + point[1][0].text + ", " + point[1][1].text + "\n")

run()