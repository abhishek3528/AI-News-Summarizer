from playwright.sync_api import sync_playwright, TimeoutError
from newspaper import Article
import logging
import random
import time
import os
from dotenv import load_dotenv
import requests
import json
from bs4 import BeautifulSoup

# Load environment variables
load_dotenv()

logger = logging.getLogger(__name__)

class NewsScraper:

    PROXY_URL = os.getenv('SMARTPROXY_URL')

    @staticmethod
    def get_first_article_url(topic):
        try:
            with sync_playwright() as p:
                # Format proxy URL correctly
                proxy_config = None
                if NewsScraper.PROXY_URL:
                    username = os.getenv('SMARTPROXY_USERNAME')
                    password = os.getenv('SMARTPROXY_PASSWORD')
                    proxy_config = {
                        "server": NewsScraper.PROXY_URL,
                        "username": username,
                        "password": password
                    }

                browser = p.chromium.launch(
                    headless=True,
                    slow_mo=1000,
                    proxy=proxy_config
                )
                context = browser.new_context(
                    viewport={'width': 1920, 'height': 1080},
                    user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
                )
                page = context.new_page()
                
                # Add random delays
                time.sleep(random.uniform(1, 3))
                
                # Navigate to Google News with timeout
                try:
                    page.goto(f'https://news.google.com/search?q={topic}&hl=en-US', timeout=60000)
                    time.sleep(random.uniform(2, 4))
                    
                    page.wait_for_selector('article', 
                                         state='visible',
                                         timeout=50000)
                    
                    # Get the first article link
                    article = page.locator('article').first
                    link = article.locator('a').first
                    href = link.get_attribute('href')
                    # print(f"*****************HREF: {href} ******************************")

                    if not href:
                        raise Exception("No article link found")
                    
                    # Transform the Google News URL to actual URL
                    full_url = f"https://news.google.com{href}"
                    # print(f"*****************FULL URL with Concatation: {full_url} ******************************")
                    page.goto(full_url,timeout=50000)
                    
                    # Wait for and extract the canonical URL
                    canonical_element = page.locator('link[rel="canonical"]')
                    actual_url = canonical_element.get_attribute('href')
                    
                    if not actual_url:
                        actual_url = page.url  # Fallback to current URL if canonical not found

                    
                    # print(f"Found article URL: {actual_url}")
                    return actual_url
                    
                except TimeoutError as te:
                    logger.error(f"Page load timed out: {str(te)}")
                    raise Exception("Failed to load page - timeout")
                except Exception as e:
                    logger.error(f"Error during page navigation: {str(e)}")
                    raise
                finally:
                    browser.close()
        except Exception as e:
            logger.error(f"Error in get_first_article_url: {str(e)}")
            raise

    @staticmethod
    def get_site_name(soup):
        """Extract site name from specific meta tags and JSON-LD"""
        try:
            # List of meta tag properties to check
            meta_properties = [
                'og:site_name',
                'al:ios:app_name',
                'al:android:app_name'
            ]
            # Check meta tags
            for prop in meta_properties:
                try:
                    meta_tag = soup.find('meta', property=prop)
                    # print(f"*****************META site name TAG: {meta_tag} ******************************")
                    if meta_tag and meta_tag.get('content'):
                        # Clean up any HTML entities (like &amp;)
                        content = meta_tag['content'].replace('&amp;', '&')
                        return content
                except:
                    continue
            
            # Check JSON-LD
            try:
                json_ld_scripts = soup.find_all('script', type='application/ld+json')
                # print(f"*****************JSON LD SCRIPTS: {json_ld_scripts} ******************************")
                for script in json_ld_scripts:
                    try:
                        data = json.loads(script.string)
                        # Check different common JSON-LD patterns
                        # print(f"*****************DATA: {data} ******************************")
                        if isinstance(data, dict):
                            # Check publisher name
                            if 'publisher' in data and isinstance(data['publisher'], dict):
                                if 'name' in data['publisher']:
                                    return data['publisher']['name']
                            # Check organization name
                            if '@type' in data and data['@type'] == 'Organization':
                                if 'name' in data:
                                    return data['name']
                            # Check website name
                            if '@type' in data and data['@type'] == 'WebSite':
                                if 'name' in data:
                                    return data['name']
                    except:
                        continue
            except:
                pass
            
            return None
            
        except Exception as e:
            logger.error(f"Error getting site name: {str(e)}")
            return None

    @staticmethod
    def get_author(soup):
        """Extract author from meta tags and JSON-LD"""
        try:
            # List of meta tag properties to check for author
            author_meta_properties = [
                ('name', 'author'),
                ('property', 'article:author'),
                ('property', 'og:article:author'),
                ('property', 'og:author')
            ]
            
            # Check meta tags
            for name, prop in author_meta_properties:
                try:
                    meta_tag = soup.find('meta', {name: prop})
                    # print(f"*****************META TAG: {meta_tag} ******************************")
                    if meta_tag and meta_tag.get('content'):
                        content = meta_tag['content'].replace('&amp;', '&')
                        # Don't return URLs as authors
                        if not content.startswith('http'):
                            return content
                except:
                    continue
            
            # Check JSON-LD for author
            try:
                json_ld_scripts = soup.find_all('script', type='application/ld+json')
                # print(f"*****************JSON LD SCRIPTS: {json_ld_scripts} ******************************")
                for script in json_ld_scripts:
                    try:
                        data = json.loads(script.string)
                        # print(f"*****************DATA: {data} ******************************")
                        
                        if isinstance(data, dict):
                            # Check for author field
                            if 'author' in data:
                                # Handle array of authors
                                if isinstance(data['author'], list):
                                    for author in data['author']:
                                        if isinstance(author, dict) and 'name' in author:
                                            return author['name']
                                        elif isinstance(author, str):
                                            return author
                                # Handle single author object
                                elif isinstance(data['author'], dict):
                                    if 'name' in data['author']:
                                        return data['author']['name']
                                # Handle string author
                                elif isinstance(data['author'], str):
                                    return data['author']
                    except:
                        continue
            except:
                pass
            
            return None
            
        except Exception as e:
            logger.error(f"Error getting author: {str(e)}")
            return None

    @staticmethod
    def scrape_article_content(url):
        # print(f"*****************SCRAPING URL: {url} ******************************")
        
        # Get site metadata using Playwright (outside retry loop)
        site_name = None
        author = None
        try:
            with sync_playwright() as p:
                browser = p.chromium.launch(headless=True)
                page = browser.new_page()
                try:
                    page.goto(url, timeout=60000, wait_until='domcontentloaded')
                    # Get page content and parse with BeautifulSoup
                    content = page.content()
                    soup = BeautifulSoup(content, 'html.parser')
                    site_name = NewsScraper.get_site_name(soup)
                    author = NewsScraper.get_author(soup)
                except Exception as e:
                    logger.error(f"Error getting metadata: {str(e)}")
                finally:
                    browser.close()
        except Exception as e:
            logger.error(f"Error in Playwright setup: {str(e)}")

        # Retry loop for article content
        max_retries = 3
        for attempt in range(max_retries):
            try:
                article = Article(url)
                # Configure proxy for newspaper3k
                proxy_url = os.getenv('SMARTPROXY_URL')
                proxies = {
                    'http': proxy_url,
                    'https': proxy_url
                }
                article.config.proxies = proxies
                article.download()
                article.parse()
                
                if not article.text:
                    raise Exception("No article text found")
                # print(f"*****************ARTICLE TITLE: {article.title} ******************************")
                return {
                    'title': article.title,
                    'text': article.text,
                    'site_name': site_name,  # Will be None if not found
                    'author': author  # Will be None if not found
                }
            except Exception as e:
                logger.error(f"Error scraping article (attempt {attempt + 1}): {str(e)}")
                if attempt == max_retries - 1:
                    raise Exception("Failed to scrape article content")
                time.sleep(random.uniform(1, 3)) 