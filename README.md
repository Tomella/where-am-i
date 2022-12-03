# where-am-i
GPS Logger has an option to log to a custom URL. Might make a simple web app so the wife can find me.

TODO: We don't take to much attention to jobs with too many points. It works  OK with tens of thousands but there will
be a point where the poor old browser will bog down.

Sometimes there are gaps in data, where there is no cellular reception and the data is not succesfully sent. The holes
can be "plugged" from the saved gpx files that can be saved from gps logger.

eg.
`node convertgpxtojson.js --job=Spring22 --file=../../../gpslogger/com.mendhak.gpslogger/files/20221124.gpx`


Web app

Three pages:

1 Where am I now? 
url  /

Shows the last recorded point on a leaflet map. Very simple.

2 By job name
url /plot.html?job=Summer21

Shows jobs by job name. The optional job url parameter allows a job to the show without selecting from the list.

3 By day
url /byday.html?date=2022-12-03

Shot points on a particular day. The optional date parameter allow a date's point to be shown without selecting from graph.