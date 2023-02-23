FROM python:3.8
LABEL key="vinchit19@gmail.com"

RUN mkdir /app
WORKDIR /app
# COPY . /app

# Install pip requirements
ADD requirements.txt .
RUN python -m pip install --upgrade pip
RUN python -m pip install -r requirements.txt

ADD . /app

# During debugging, this entry point will be overridden
CMD ["python", "app.py"]

EXPOSE 5000