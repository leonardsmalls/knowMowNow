# Import Meteostat library and dependencies
from datetime import datetime
#import matplotlib.pyplot as plt
from meteostat import Point, Daily
import sys

lat = float(sys.argv[1])
lon = float(sys.argv[2])
dateOfMow = sys.argv[3]
dateOfMowYear = int(dateOfMow[:4])
dateOfMowMonth = int(dateOfMow[4:6])
dateOfMowDay = int(dateOfMow[6:8])

# Set time period
#start = datetime(2018, 1, 1)
start = datetime(dateOfMowYear, dateOfMowMonth, dateOfMowDay)
#end = datetime(2018, 12, 31)
end = datetime(dateOfMowYear, dateOfMowMonth, dateOfMowDay + 7)

# Create Point for Vancouver, BC
vancouver = Point(49.2497, -123.1193, 70)
location = Point(lat, lon)

# Get daily data for 2018
#data = Daily(vancouver, start, end)
data = Daily(location, start, end)
data = data.fetch()

# Plot line chart including average, minimum and maximum temperature
#data.plot(y=['tavg', 'tmin', 'tmax'])
#plt.show()

print(data)