from MySQL_Connection import *
from flask import Flask, request, render_template, redirect, session,jsonify
from flask_cors import CORS

conn=connect_to_mysql()
sql = conn.cursor()

app = Flask(__name__)
app.secret_key = "Is the moon big?"
CORS(app)

query="create database if not exists lbs;"
sql.execute(query)
conn.commit()
query="use lbs;"
sql.execute(query)
conn.commit()
query="create table if not exists user (username varchar(255) primary key, password varchar(255));"
sql.execute(query)
conn.commit()

@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method=="GET":
        return render_template("signup.html")
    data=request.get_json()
    username = data.get('username')
    password = data.get('password')
    query=f"insert into user (username, password) values ('{username}','{password}');"
    try:
        sql.execute(query)
        conn.commit()
        return redirect('signin.html'), 200
    except Exception as e:
        print("an error occurred :", e)
        conn.rollback()
        return "signup_failed", 401

@app.route('/signin', methods=['GET', 'POST']) 
def signin():
    if request.method=="GET":
        return render_template("signin.html")
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    query = f"select * from user where username = '{username}' and password = '{password}';"
    sql.execute(query)
    data=sql.fetchone()
    user_exists = data is not None
    if user_exists:
        return jsonify({"username":username}), 200
    else:
        return "Signin failed", 401
    
@app.route('/admin')
def admin():
    return render_template("admin.html")
    
@app.route('/')
def index():
    return render_template("index.html")
    
if __name__ == '__main__':
    app.run(debug=True)
