FROM python:3.6-slim
COPY . /Eduplay3_Studienarbeit
WORKDIR /Eduplay3_Studienarbeit
RUN pip install -r requirements.txt
WORKDIR /
ENV FLASK_APP=Eduplay3_Studienarbeit
ENV FLASK_ENV=development
CMD ["flask", "init-db"]
CMD ["flask", "run", "--host=0.0.0.0"]
