from google.appengine.ext import ndb
from google.appengine.datastore.datastore_query import Cursor
from flask import Flask, request, render_template, jsonify

app = Flask(__name__)


class Feed(ndb.Model):
    name = ndb.StringProperty()
    content = ndb.StringProperty()


@app.route('/')
def home():
    return render_template("home.html")


@app.route('/v1/feeds', methods=["GET"])
def loadFeed():
    to_send_data = []
    feed_contents = Feed.query().fetch()
    for data in feed_contents:
        to_send_data.extend([{'id': data.key.urlsafe(), 'name': data.name, 'feed': data.content}])
    return jsonify({'result':to_send_data, 'success':True}), 200


@app.route("/v1/feeds", methods=['POST'])
def addNewFeed():
    if request.method == 'POST':
        name = request.get_json().get('name')
        feeds = request.get_json().get('feed')
        feeds_send = Feed(name=name, content=feeds)
        feeds_send.put()
    return jsonify({'id': feeds_send.key.urlsafe(),'success':True}), 201


@app.route("/v1/feeds/<string:id>", methods=['DELETE'])
def deleteFeed(id):
    ndb.Key(urlsafe=id).delete()
    return jsonify({'success': True}), 204


@app.route("/v1/feeds/<string:id>", methods=['PUT'])
def updateFeed(id):
    up = ndb.Key(urlsafe=id[2:]).get()
    up.content = request.get_json().get('new_text')
    up.put()
    return jsonify({'success': True}), 200
