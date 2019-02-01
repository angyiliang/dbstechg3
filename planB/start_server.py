# data processing
import json
from isoweek import Week
import datetime
import csv

# server
import http.server
import socketserver

# process disease csv
def csv_to_json(fname, year_data, disease_data, disease_type):
    counter = 0
    with open(fname) as f:
        csvr = csv.reader(f)
        for content in csvr:
            counter += 1

            # ignore the first line
            if counter == 1:
                continue
            
            # ['2012-W01', 'Cholera', '0']
            date = Week(int(content[0][:4]),int(content[0][6:8])).monday()

            # handle inconsistent data naming from data.gov.sg
            if content[1] == "HFMD":
                disease_name = "Hand, Foot Mouth Disease"

            elif content[1] == "Nipah":
                disease_name = "Nipah virus infection"
            
            elif content[1] == "Zika":
                disease_name = "Zika Virus Infection"
            
            elif content[1] == "Campylobacter enteritis":
                disease_name = "Campylobacterenterosis"
            
            elif content[1] == "Acute Viral Hepatitis A":
                disease_name = "Viral Hepatitis A"
            
            elif content[1] == "Acute Viral Hepatitis E":
                disease_name = "Viral Hepatitis E"
            
            elif content[1] == "Chikungunya":
                disease_name = "Chikungunya Fever"
            else:
                disease_name = content[1]

            # disease category and type
            d_cat = disease_type[disease_name]['category']
            
            # print(disease_name, "::", d_cat)

            # save data by year and month
            if date.year not in year_data:
                year_data[date.year] = {"total":0}
            if date.month not in year_data[date.year]:
                year_data[date.year][date.month] = {"total":0}
            if d_cat not in year_data[date.year][date.month]:
                year_data[date.year][date.month][d_cat] = {"total":0}
            if disease_name not in year_data[date.year][date.month][d_cat]:
                year_data[date.year][date.month][d_cat][disease_name] = 0


            year_data["total"] += int(content[2])
            year_data[date.year]["total"] += int(content[2])
            year_data[date.year][date.month]["total"] += int(content[2])
            year_data[date.year][date.month][d_cat]["total"] += int(content[2])
            year_data[date.year][date.month][d_cat][disease_name] += int(content[2])

     
            # save data by disease type
            
            if d_cat not in disease_data:
                disease_data[d_cat] = {"total":0}
            if disease_name not in disease_data[d_cat]:
                disease_data[d_cat][disease_name] = {"total":0}
            if date.year not in disease_data[d_cat][disease_name]:
                disease_data[d_cat][disease_name][date.year] = {"total":0}
            if date.month not in disease_data[d_cat][disease_name][date.year]:
                disease_data[d_cat][disease_name][date.year][date.month] = 0


            disease_data["total"] += int(content[2])
            disease_data[d_cat]["total"] += int(content[2])
            disease_data[d_cat][disease_name]["total"]+= int(content[2])
            disease_data[d_cat][disease_name][date.year]["total"] += int(content[2])
            disease_data[d_cat][disease_name][date.year][date.month] += int (content[2])
                

# load rainfall
def rainfall_csv_to_json(fname, rainfall_data):
    counter = 0
    years = list(range(2012,2018))
    with open(fname) as f:
        csvr = csv.reader(f)
        for content in csvr:

            counter += 1
            # ignore the first line
            if counter == 1:
                continue

            # get date according to year and month    
            year = content[0][:4]
            month = content[0][5:]

            # ignore year not in years range
            if int(year) not in years: 
                continue

            # throw data into json
            if year not in rainfall_data:
                rainfall_data[year] = []
            if month not in rainfall_data[year]:
                rainfall_data[year].append(content[1])

def temperature_csv_to_json(fname, temperature_data):
    counter = 0
    years = list(range(2012,2018))
    with open(fname) as f:
        csvr = csv.reader(f)
        for content in csvr:

            counter += 1
            # ignore the first line
            if counter == 1:
                continue

            # get date according to year and month    
            year = content[0][:4]
            month = content[0][5:]

            # ignore year not in years range
            if int(year) not in years: 
                continue

            # throw data into json
            if year not in temperature_data:
                temperature_data[year] = []
            if month not in temperature_data[year]:
                temperature_data[year].append(content[1])



# load disease category
def load_disease_type(fname, type_data):
    counter = 0
    with open(fname) as f:
        csvr = csv.reader(f)
        for content in csvr:
            counter += 1

            # ignore the first line
            if counter == 1:
                continue
            
            # ['Diseases of the respiratory system','Influenza','Avian Influenza']

            # sort data by category
            if content[1] not in type_data:
                type_data[content[1]] = { "category":content[0]}



# convert data into a json file
# if Monday of week x falls in month y, data of x will belong to y
year_data = {"total":0}
disease_data = {"total":0}
disease_type = {}
rainfall_data = {}
temperature_data = {}
# process rainfall count
rain_file = "data/rainfall-monthly-total.csv"
rainfall_csv_to_json(rain_file, rainfall_data)

# process temperature count
temperature_file = "data/temp-monthly-total.csv"
temperature_csv_to_json(temperature_file,temperature_data)

# process disease category
type_file = "data/disease_type.csv"
load_disease_type(type_file, disease_type)


# processing disease csv file
cases_file = "data/raw_cases.csv"
csv_to_json(cases_file, year_data, disease_data, disease_type)

# write to json file
with open('data/sort_by_date.json', 'w') as outfile:
    json.dump(year_data, outfile)

# write to json file
with open('data/sort_by_disease.json', 'w') as outfile:
    json.dump(disease_data, outfile)

# write to json file
with open('data/disease_type.json', 'w') as outfile:
    json.dump(disease_type, outfile)


# write to json file
with open('data/rainfall.json', 'w') as outfile:
    json.dump(rainfall_data, outfile)

# write to json file
with open('data/temperature.json','w') as outfile:
    json.dump(temperature_data,outfile)

print("completed csv processsing")


# start server

PORT = 8000

Handler = http.server.SimpleHTTPRequestHandler
httpd = socketserver.TCPServer(("", PORT), Handler)
print("serving at port", PORT)
httpd.serve_forever()