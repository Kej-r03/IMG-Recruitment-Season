from django.db import models
from .season import CandidateSeasonData
from .test import TestQuestion
from .interview import Interview

class Evaluation(models.Model):
    marks=models.IntegerField(null=True,blank=True)
    remarks=models.CharField(max_length=200,null=True,blank=True)

class TestResponse(models.Model):
    response=models.ForeignKey(Evaluation,on_delete=models.CASCADE)
    question=models.ForeignKey(TestQuestion, on_delete=models.CASCADE)
    candidate=models.ForeignKey(CandidateSeasonData,on_delete=models.CASCADE)

class InterviewResponse(models.Model):
    response=models.ForeignKey(Evaluation,on_delete=models.CASCADE,null=True)
    # section=models.CharField(max_length=200) #contains scores in various sections, in plain text format
    interview=models.OneToOneField(Interview,models.CASCADE) #each particular interview is for one particular candidate and has one particular score
    # candidate=models.ForeignKey(Candidate,on_delete=models.CASCADE) #not written here, as candidate is specified in the Interview model
 