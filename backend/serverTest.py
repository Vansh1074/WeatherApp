from flask import Flask

app = Flask(__name__)

@app.route("/weather")
def weather():
    return {"hello_msg" : ["Welcome the this Weather APP"]}

if __name__ == "__main__" :
    app.run(debug=True)
