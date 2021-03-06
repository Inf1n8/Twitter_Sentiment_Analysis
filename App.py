import sys
import csv
import tweepy
from flask import jsonify,request
import matplotlib.pyplot as plt

from collections import Counter
from aylienapiclient import textapi
from flask import Flask, render_template
import requests

app = Flask(__name__)

@app.route("/")
def main():
    return render_template('index.html')

@app.route("/",methods=["POST"])
def main_post():
    print(request.is_json)
    data = request.get_json()
    print(data['search'])
    ## Twitter credentials
    consumer_key = "xxxxxxxxxxxxx"
    consumer_secret = "xxxxxxxxxxxxxxxxxxxxxxx"
    access_token = "xxxxxxxxxxxxxxxxx"
    access_token_secret = "xxxxxxxxxxxxxxxxxxxxxxxx"

    application_id = "xxxxxxxxxxx"
    application_key = "xxxxxxxxxxxxxx"

    ## set up an instance of Tweepy
    auth = tweepy.OAuthHandler(consumer_key, consumer_secret)
    auth.set_access_token(access_token, access_token_secret)
    api = tweepy.API(auth)

    ## set up an instance of the AYLIEN Text API
    client = textapi.Client(application_id, application_key)

    ## search Twitter for something that interests you
    query = data['search']
    number = 10

    results = api.search(
        lang="en",
        q=query + " -rt",
        count=number,
        result_type="recent"
    )
    for tweet in results:
        print(tweet.created_at, tweet.text)
    print("--- Gathered Tweets \n")

    ## open a csv file to store the Tweets and their sentiment
    file_name = 'Sentiment_Analysis_of_{}_Tweets_About_{}.csv'.format(number, query)

    with open(file_name, 'w', newline='') as csvfile:
        csv_writer = csv.DictWriter(
            f=csvfile,
            fieldnames=["Tweet", "Sentiment"]
        )
        csv_writer.writeheader()

        print("--- Opened a CSV file to store the results of your sentiment analysis... \n")

        ## tidy up the Tweets and send each to the AYLIEN Text API
        for c, result in enumerate(results, start=1):
            tweet = result.text
            tidy_tweet = tweet.strip().encode('ascii', 'ignore')

            if len(tweet) == 0:
                print('Empty Tweet')
                continue

            response = client.Sentiment({'text': tidy_tweet})
            csv_writer.writerow({
                'Tweet': response['text'],
                'Sentiment': response['polarity']
            })

            print("Analyzed Tweet {}".format(c))

    ## count the data in the Sentiment column of the CSV file
    with open(file_name, 'r') as data:
        counter = Counter()
        for row in csv.DictReader(data):
            counter[row['Sentiment']] += 1

        positive = counter['positive']
        negative = counter['negative']
        neutral = counter['neutral']

    ## declare the variables for the pie chart, using the Counter variables for "sizes" (not required for a web app)
    colors = ['green', 'red', 'grey']
    sizes = [positive, negative, neutral]
    labels = 'Positive', 'Negative', 'Neutral'
    
    return jsonify({'positive':positive,'negative':negative,'neutral':neutral})

if __name__ =='__main__':
    app.run(debug=True)
