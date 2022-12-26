FROM python:3.8
ENV PYTHONBUFFERED 1
WORKDIR ./autumn
COPY . .
RUN python -m pip install --upgrade pip
# RUN apt update && apt install -y libmariadb-dev mariadb-dev mariadb-client mariadb-libs python3-dev build-base
RUN pip install -r requirements.txt
EXPOSE 8000
CMD ["python3","./manage.py","runserver","0.0.0.0:8000"]