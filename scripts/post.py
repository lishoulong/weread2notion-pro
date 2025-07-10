import os
import os
from dotenv import load_dotenv
from weread_api import WeReadApi
from openai import OpenAI

# Load environment variables from .env file
load_dotenv()

# Ensure the temp directory exists
os.makedirs("temp", exist_ok=True)

# Initialize WeReadApi
weread_api = WeReadApi()

# Initialize OpenAI client
openai_client = OpenAI(
    api_key=os.getenv("ARK_API_KEY"),
    base_url='https://ark-cn-beijing.bytedance.net/api/v3',
)

# Function to enhance content using DeepSeek API
def enhance_content_with_deepseek(title, content):
    try:
        stream = openai_client.chat.completions.create(
            model='ep-20250425172533-tmllk', # This model ID is from the user's Node.js example
            messages=[
                {"role": "system", "content": f"用中文编写，Please write a summary for book {title}, 把如下书评和原文润色为一篇文章."},
                {"role": "user", "content": content}
            ],
            stream=True
        )

        full_content = []
        for chunk in stream:
            if chunk.choices and chunk.choices[0].delta.content:
                full_content.append(chunk.choices[0].delta.content)
        return "".join(full_content)
    except Exception as e:
        print(f"Error enhancing content with DeepSeek: {e}")
        # Depending on desired behavior, you might re-raise the exception,
        # return an empty string, or return the original content.
        raise

# Fetch books and their reviews
books = weread_api.get_notebooklist()

# Sort books by finished date and select the most recent one
# most_recent_book = None
most_recent_date = None

for book in books:
    book_id = book.get("bookId")
    read_info = weread_api.get_read_info(book_id)
    finished_reading = read_info.get("finishReading")
    if finished_reading == 1:
        title = book.get("book").get("title")
        reviews = weread_api.get_review_list(book_id)
        
        # Prepare a single content string for enhancement
        content_to_enhance = f"Book Title: {title}\n\n"
        content_to_enhance += "Here are my insights and reflections:\n\n"
        
        for review in reviews:
            original_text = review.get("abstract", "")
            print(f"review.get('content', '') '{review.get('content', '')}'")
            content_to_enhance += f"Review: {review.get('content', '')}\nOriginal: {original_text}\n\n"
        print(f"content_to_enhance '{content_to_enhance}' book_id：{book_id}")
        # Enhance content
        enhanced_content = enhance_content_with_deepseek(title, content_to_enhance)
        # Write enhanced content to a file
        file_path = f"temp/{title}_enhanced.txt"
        with open(file_path, "w", encoding="utf-8") as file:
            file.write(f"Title: {title}\n")
            file.write(f"Enhanced Content:\n{enhanced_content}\n\n")
        print(f"Enhanced content for '{title}' written to {file_path}")