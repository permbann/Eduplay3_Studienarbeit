#__authors__ = ["Luana Juhl", "Lukas Schult"]
#__contact__ = "it16156@lehre.dhbw-stuttgart.de"
#__credits__ = ["Luana Juhl", "Lukas Schult"]
#__date__ = "2021/02/06"
#__deprecated__ = False
#__email__ = "it16156@lehre.dhbw-stuttgart.de"
#__maintainer__ = "developer"
#__status__ = "Released"
#__version__ = "1.0"

FROM python:3.6-slim
COPY . /Eduplay3_Studienarbeit
WORKDIR /Eduplay3_Studienarbeit
RUN pip install -r requirements.txt
WORKDIR /
ENV FLASK_APP=Eduplay3_Studienarbeit
ENV FLASK_ENV=development
CMD ["flask", "init-db"]
CMD ["flask", "run", "--host=0.0.0.0"]
