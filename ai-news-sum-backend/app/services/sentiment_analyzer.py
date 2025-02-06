
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
import numpy as np

class SentimentAnalyzer:
    def __init__(self):
        self.analyzer = SentimentIntensityAnalyzer()

    def analyze(self, text):
        
        sentences = text.split('.')
        sentiment_scores = []
        sentence_weights = []

        for sentence in sentences:
            sentence = sentence.strip()
            if sentence:
                score = self.analyzer.polarity_scores(sentence)['compound']
                sentiment_scores.append(score)
                sentence_weights.append(len(sentence))  # Weight by sentence length

        if not sentiment_scores:
            return 'Neutral'

        # Weighted average sentiment score
        vader_score = np.average(sentiment_scores, weights=sentence_weights)

         # Classify sentiment based on compound score
        if vader_score >= 0.05:
            return "Positive"
        elif vader_score <= -0.05:
            return "Negative"
        else:
            return "Neutral"