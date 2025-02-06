from flask import Blueprint, request, jsonify
from flask_cors import CORS
from app.services.news_scraper import NewsScraper
from app.services.summarizer import summarize_text
from app.services.sentiment_analyzer import SentimentAnalyzer
import logging


main = Blueprint('main', __name__)
logger = logging.getLogger(__name__)

@main.route('/process-news', methods=['POST'])
def process_news():
    try:
        # Validate input
        data = request.get_json()
        if not data or 'topic' not in data:
            return jsonify({'error': 'Topic is required'}), 400

        topic = data['topic']
        logger.info(f"Processing news for topic: {topic}")
        
        # Initialize services
        scraper = NewsScraper()
        sentiment_analyzer = SentimentAnalyzer()

        # Get article URL
        article_url = scraper.get_first_article_url(topic)
        # logger.info(f"Found article URL: {article_url}")
  

        # Scrape article content
        article_content = scraper.scrape_article_content(article_url)
        # logger.info(f"Article title: {article_content['title']}")
        # print(f"***ARTICLE CONTENT: {article_content['text']} ******************************")

        # Generate summary
        summary = summarize_text(article_content['text'])
        # print(f"***SUMMARY: {summary[:200]}... ******************************")

        # Analyze sentiment
        sentiment = sentiment_analyzer.analyze(article_content['text'])
        # print(f"***SENTIMENT: {sentiment} ******************************")

        return jsonify({
            'original_url': article_url,
            'title': article_content['title'],
            'summary': summary,
            'sentiment': sentiment,
            'site_name': article_content['site_name'],
            'author': article_content['author'],
            'topic':topic
        }), 200

    except Exception as e:
        logger.error(f"Error processing news: {str(e)}")
        return jsonify({'error': 'Failed to process news article', 'details': str(e)}), 500 