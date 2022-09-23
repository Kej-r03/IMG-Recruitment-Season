from django.db import models
from models import season, test,interview

class Evaluation(models.Model):
    marks=models.IntegerField()
    remarks=models.CharField(max_length=200)

class TestResponse(models.Model):
    response=models.ForeignKey(Evaluation,on_delete=models.CASCADE)
    question=models.ForeignKey(test.TestQuestion, on_delete=models.CASCADE)
    candidate=models.ForeignKey(season.Candidate,on_delete=models.CASCADE)

class InterviewResponse(models.Model):
    response=models.ForeignKey(Evaluation,on_delete=models.CASCADE)
    section=models.CharField(max_length=200) #contains scores in various sections, in plain text format
    interview=models.OneToOneField(interview.Interview) #each particular interview is for one particular candidate and has one particular score
    # candidate=models.ForeignKey(Candidate,on_delete=models.CASCADE) #not written here, as candidate is specified in the Interview model

    