#! python3

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
app = Flask(__name__)

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
leaderboard.submit_score("Beyonce", 5)
leaderboard.submit_score("Taylor", 4)
leaderboard.submit_score("Selena", 8)

###################################
# Routes
###################################

@app.route("/")
def home():
    return render_template("index.html", scores=leaderboard.scores)

if __name__ == "__main__":
    app.run()
