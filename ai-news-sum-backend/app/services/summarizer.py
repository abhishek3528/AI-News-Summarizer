from transformers import pipeline
from typing import List

summarizer = None

def init_summarizer():
    global summarizer
    summarizer = pipeline("summarization", model="facebook/bart-large-cnn")

def summarize_text(text: str, max_length: int = 130, min_length: int = 30) -> str:
    # Input validation
    if not text or not isinstance(text, str):
        raise ValueError("Input text must be a non-empty string")
    
    # Split text into chunks if it's too long
    max_chunk_length = 1024
    chunks = _split_into_chunks(text, max_chunk_length)
    
    if not summarizer:
        init_summarizer()
    
    summaries = []
    for chunk in chunks:
        # Calculate appropriate max_length based on input length
        input_length = len(chunk.split())
        if input_length < max_length:
            # For short texts, set max_length to half the input length
            # but not less than min_length
            chunk_max_length = max(min_length, input_length // 2)
            chunk_min_length = min(min_length, chunk_max_length - 10)
        else:
            chunk_max_length = max_length
            chunk_min_length = min_length
        
        # Only summarize if the text is long enough
        if input_length > min_length:
            summary = summarizer(
                chunk, 
                max_length=chunk_max_length, 
                min_length=chunk_min_length, 
                do_sample=False
            )
            summaries.append(summary[0]['summary_text'])
        else:
            # For very short chunks, just use the original text
            summaries.append(chunk)
    
    return ' '.join(summaries)

def _split_into_chunks(text: str, max_length: int) -> List[str]:
    # Try to split on sentence endings and newlines.
    sentences = text.split('. ')
    chunks = []
    current_chunk = []
    current_length = 0
    
    for sentence in sentences:
        sentence_length = len(sentence)
        if current_length + sentence_length <= max_length:
            current_chunk.append(sentence)
            current_length += sentence_length
        else:
            chunks.append('. '.join(current_chunk) + '.')
            current_chunk = [sentence]
            current_length = sentence_length
    
    if current_chunk:
        chunks.append('. '.join(current_chunk) + '.')
    
    return chunks if chunks else [text] 