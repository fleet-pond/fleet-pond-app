import inspect, os
import xml.etree.ElementTree as ET

routeName = "blackdiamond"
filePrefix =  os.path.dirname(os.path.abspath(inspect.getfile(inspect.currentframe()))) + "/" + routeName # name of input and output file
smallCut = 15 # number of seconds between each reading is small output file
fileTracked = filePrefix + ".tcx"
fullCSV=filePrefix+"Full.csv"
smallCSV=filePrefix+"Small.csv"
fullJS=filePrefix+"Full.js"
smallJS=filePrefix+"Small.js"
newLine = ""

def run():
    removeFile(fullCSV)
    removeFile(smallCSV)
    removeFile(fullJS)
    removeFile(smallJS)

    startJS(fullJS)
    startJS(smallJS)

    tree = ET.parse(fileTracked)
    root = tree.getroot()
    i = 0
    for child in root[0][0][1][5]:
        addToCSV(child, fullCSV)
        addToJS(convertToGoogleMapsJSON(child), fullJS)
        if ((i % smallCut) == 0):
            addToCSV(child, smallCSV)
            addToJS(convertToGoogleMapsJSON(child), smallJS)
        if (i == 0):
            global newLine
            newLine = ",\n"
        i += 1

    endJS(fullJS)
    endJS(smallJS)


def removeFile(fileName):
    try:
        os.remove(fileName)
    except OSError:
        pass

def addToCSV(point, fileVar):
    with open(fileVar, "a") as myFile:
        myFile.write(convertTrackpointToCSV(point))

def addToJS(string, fileVar):
    with open(fileVar, "a") as myFile:
        myFile.write(string)

def startJS(fileVar):
    addToJS(("var path" + routeName + "Coodinates = [\n"), fileVar)

def endJS(fileVar):
    addToJS("\n];", fileVar)


def convertTrackpointToCSV(point):
    return (point[0].text + ", " + point[1][0].text + ", " + point[1][1].text + "\n")

def convertToGoogleMapsJSON(point):
    print (newLine + "{lat: " + point[1][0].text + ", lng: " + point[1][1].text + "}")
    return newLine + "{lat: " + point[1][0].text + ", lng: " + point[1][1].text + "}"

run()