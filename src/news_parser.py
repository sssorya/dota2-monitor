import requests
from bs4 import BeautifulSoup

def parse_dota_news():
    """Парсит новости Dota 2 с официального сайта"""
    url = "https://www.dota2.com/news"
    response = requests.get(url)

    if response.status_code == 200:
        soup = BeautifulSoup(response.content, 'html.parser')
        news_items = soup.find_all('div', class_='news-item')

        for item in news_items:
            title = item.find('h2').text.strip()
            date = item.find('span', class_='date').text.strip()
            print(f"Заголовок: {title}")
            print(f"Дата: {date}")
            print("---")
    else:
        print("Ошибка загрузки страницы")

if __name__ == "__main__":
    parse_dota_news()