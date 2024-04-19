import mysql.connector
import dotenv 
import os

def connect_to_mysql():

    dotenv.load_dotenv()
    db_user = os.getenv("USERNAME")
    db_pass = os.getenv("PASSWORD")
    
    conn = mysql.connector.connect(user=db_user, passwd=db_pass,db="rpr")
    return conn

# query=f"select distinct paper from written where author = '{uname}';"
# sql.execute(query)
# data=sql.fetchall()

# query=f"insert into written (paper, author) values ('{name}', '{uname}');"
# sql.execute(query)
# conn.commit()