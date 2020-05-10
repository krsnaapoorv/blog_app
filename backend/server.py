from flask import Flask
from flask import request, make_response, jsonify
from blueprint_auth import auth
from flask_mysqldb import MySQL
import json
import jwt

app =Flask(__name__)
app.register_blueprint(auth, url_prefix = "/auth")

app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'Kushal#025'
app.config['MYSQL_DB'] = 'blog_app'
app.config['MYSQL_CURSORCLASS'] = 'DictCursor'
mysql = MySQL(app)


def read():
    cursor = mysql.connection.cursor()
    cursor.execute(
        """SELECT * FROM users """
    )
    results = cursor.fetchall()
    cursor.close()

    items = []
    # print(results)

    for i in results:
        print(i)
        items.append(i)

    return {"users":items}

def getId(username):
    cursor = mysql.connection.cursor()
    cursor.execute(
        """SELECT user_id FROM users WHERE username = %s""",(username,)
    )
    result = cursor.fetchone()['user_id']
    cursor.close()
    return result

def getUser(user_id):
    # user_id = int(user_id)
    cursor = mysql.connection.cursor()
    cursor.execute(
        """SELECT username FROM users WHERE user_id = %s""",(user_id,)
    )
    result = cursor.fetchone()['username']
    cursor.close()
    return result

def getCategory(category_id):
    # user_id = int(user_id)
    cursor = mysql.connection.cursor()
    cursor.execute(
        """SELECT category FROM category WHERE category_id = %s""",(category_id,)
    )
    result = cursor.fetchone()['category']
    cursor.close()
    return result

def getCatId(category):
    cursor = mysql.connection.cursor()
    cursor.execute(
        """SELECT category_id FROM category WHERE category = %s""",(category,)
    )
    result = cursor.fetchone()['category_id']
    cursor.close()
    return result

@app.route('/read', methods = ['POST'])
def read_route():
    auth_header = request.headers.get('Authorization')
    token_encoded = auth_header.split(' ')[1]
    decode_data = jwt.decode(token_encoded, 'secure', algorithms=['HS256'])
    val = str(decode_data['user_id'])
    cursor = mysql.connection.cursor()
    cursor.execute(
        """SELECT * FROM users  WHERE user_id = %s""",(val,)
    )
    results = cursor.fetchone()
    cursor.close()
    return jsonify(results)

@app.route('/blog', methods = ['GET'])
def getBlog():
    cursor = mysql.connection.cursor()
    cursor.execute(
        """SELECT * FROM blog """
    )
    results = cursor.fetchall()
    cursor.close()
    items = []
    for i in results:
        user_id = i['user_id']
        category_id = i['category_id']
        username = getUser(user_id)
        category = getCategory(category_id)
        items.append({"blog":i,"username":username,"category":category})
    return jsonify(items)

@app.route('/comments', methods = ['POST'])
def getComments():
    blog_id = request.json['blog_id']
    cursor = mysql.connection.cursor()
    cursor.execute(
        """SELECT * FROM comment WHERE blog_id = %s""",(blog_id,)
    )
    results = cursor.fetchall()
    cursor.close()
    items = []
    for i in results:
        user_id = i['user_id']
        username = getUser(user_id)
        items.append({"comment":i,"username":username})
    return jsonify(items)

@app.route('/addcomment', methods = ['POST'])
def addCommentToBlog():
    comment = request.json['comment']
    blog_id = request.json['blog_id']
    username = request.json['username']
    user_id = getId(username)
    try:
        cursor = mysql.connection.cursor()
        cursor.execute(
            """INSERT INTO comment(comment,blog_id,user_id) VALUES(%s,%s,%s)""",(comment,blog_id,user_id,)
        )
        mysql.connection.commit()
        return jsonify({"message":"comment made"})
    except Exception as e:
        print(e)
    finally:
        cursor.close()
    

@app.route('/blogBasedOnCat', methods = ['POST'])
def getBlogBasedOnCategory():
    category = request.json['category']
    category_id = int(getCatId(category))
    cursor = mysql.connection.cursor()
    cursor.execute(
        """SELECT * FROM blog WHERE category_id = %s""",(category_id,)
    )
    results = cursor.fetchall()
    cursor.close()
    items = []
    for i in results:
        items.append(i)
    return (items)

@app.route('/writeBlogs',methods = ['POST'])
def startBlogging():
    title = request.json['title']
    category_id = int(request.json['category_id'])
    username = request.json['username']
    blog_body = request.json['blog_body']
    user = getId(username)
    user_id = int(getId(username))
    try:
        cursor = mysql.connection.cursor()
        cursor.execute(
            """INSERT INTO blog(title,blog_body,category_id,user_id)
            VALUES(%s, %s, %s, %s) """, (title,blog_body,category_id,user_id,)
        )
        mysql.connection.commit()
        return jsonify({"message":"Blog Created"})
    except Exception as e:
        print(e)
    finally:
        cursor.close()

@app.route('/myblogs',methods = ['POST'])
def showmyblogs():
    auth_header = request.headers.get('Authorization')
    token_encoded = auth_header.split(' ')[1]
    decode_data = jwt.decode(token_encoded, 'secure', algorithms=['HS256'])
    val = str(decode_data['user_id'])
    cursor = mysql.connection.cursor()
    cursor.execute(
        """SELECT * FROM blog WHERE user_id = %s""",(val,)
    )
    results = cursor.fetchall()
    cursor.close()
    items = []
    for i in results:
        category_id = i['category_id']
        category = getCategory(category_id)
        items.append({"blog":i,"category":category})
    return jsonify(items)

@app.route('/deleteblog', methods = ['POST'])
def deleteMyBlog():
    auth_header = request.headers.get('Authorization')
    blog_id = request.json['blog_id']
    token_encoded = auth_header.split(' ')[1]
    decode_data = jwt.decode(token_encoded, 'secure', algorithms=['HS256'])
    val = str(decode_data['user_id'])
    # print(blog_id,val)
    try:
        cursor = mysql.connection.cursor()
        cursor.execute(
            """DELETE FROM comment WHERE blog_id = %s""",(blog_id,)
        )
        cursor.execute(
            """DELETE FROM blog WHERE blog_id = %s AND user_id=%s""",(blog_id,val,)
        )
        mysql.connection.commit()
        return jsonify({"message":"Blog Deleted Successfully"})
    except Exception as e:
        print(str(e))
        return jsonify({"error":"check"})
    finally:
        cursor.close()
    


@app.route('/getblogonid',methods = ['POST'])
def getblogbasedonid():
    blog_id = request.json['blog_id']
    cursor = mysql.connection.cursor()
    cursor.execute(
        """SELECT * FROM blog WHERE blog_id = %s""",(blog_id,)
    )
    results = cursor.fetchone()
    cursor.close()
    return jsonify(results)

@app.route('/updateBlog',methods=['PUT'])
def updatemyblog():
    title = request.json['title']
    category_id = request.json['category_id']
    blog_body = request.json['blog_body']
    blog_id = request.json['blog_id']
    auth_header = request.headers.get('Authorization')
    token_encoded = auth_header.split(' ')[1]
    decode_data = jwt.decode(token_encoded, 'secure', algorithms=['HS256'])
    val = decode_data['user_id']
    try:
        cursor = mysql.connection.cursor()
        cursor.execute(
            """UPDATE blog SET title= %s,blog_body=%s,category_id=%s WHERE blog_id = %s AND user_id = %s""",(title,blog_body,category_id,blog_id,val,)
        )
        mysql.connection.commit()
        return jsonify({"message":"Update Done"})
    except Exception as e:
        print(str(e))
        return jsonify({"error":"check"})
    finally:
        cursor.close()
