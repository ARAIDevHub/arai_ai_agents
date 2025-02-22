FROM python:3.11

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt
RUN pip install playwright
RUN playwright install

COPY . .

EXPOSE 8080

CMD ["python", "api.py"] 