#######################################
# Imports
#######################################
from flask import Flask
from flask import render_template
from flask import request
from operator import itemgetter
import json

######################################
# App initialization
#####################################
app = Flask("flappy bird")

####################################
# Leaderboard
####################################
class Leaderboard:
    def __init__(self):
        # scores contains tuples of (name, score)
        # ordered by score (maximum to minimum)
        self.scores = []
        self.capacity = 10 # maximum leaderboard capacity

    def submit_score(self, name, score):
        self.scores.append((name, score))
        self.scores = sorted(self.scores, key=itemgetter(1), reverse=True)
        if len(self.scores) > self.capacity:
            # Remove lowest score if over capacity
            self.scores.pop(self.capacity)

leaderboard = Leaderboard()

###################################
# Routes
###################################

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/scores", methods=["POST"])
def scores():
    # Extract data from request
    name = request.json["name"]
    score = request.json["score"]
    print "received score " + str(score) + " for " + name
    leaderboard.submit_score(name, score)
    return json.dumps({"status": "OK", "scores": leaderboard.scores})

if __name__ == "__main__":
    app.run()
