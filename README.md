# where-am-i
GPS Logger has an option to log to a custom URL. Might make a simple web app so the wife can find me.

TODO: We don't take to much attention to jobs with a too many points. It works  OK with tens of thousands but there will
be a point where the poor old browser will bog down.

Sometimes there are gaps in data, where there is no cellular reception and the data is not succesfully sent. The holes
can be "plugged" from the saved gpx files that can be saved from gps logger.

eg.
`node convertgpxtojson.js --job=Spring22 --file=../../../gpslogger/com.mendhak.gpslogger/files/20221124.gpx`
