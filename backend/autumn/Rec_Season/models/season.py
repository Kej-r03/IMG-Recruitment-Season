from django.db import models
from models import project
from constant import *
from django.contrib.auth.models import AbstractUser
# Create your models here.

class Season(models.Model):
    season_year=models.IntegerField()
    role=models.CharField(max_length=5,choices=ROLE_CHOICES) #role of candidate in that season

    def __str__(self):
        return self.season_year
    
class Candidate(models.Model):
    name=models.CharField(max_length=50)
    enrolment=models.IntegerField()
    email=models.EmailField(max_length=254)
    phone=models.IntegerField()
    current_year=models.IntegerField()

    def __str__(self):
        return self.name
    
class CandidateSeasonData(models.Model): #stores those data about candidate that vary in different seasons
    candidate=models.ForeignKey(Candidate,on_delete=models.CASCADE)
    project_name=models.OneToOneField(project.Project)
    test=models.BooleanField()#if appeared for the test, then only deal with test evaulation
    status=models.CharField(max_length=100)#status in the season
    season=models.ForeignKey(Season,on_delete=models.CASCADE)
    #role of the candidate in a season is given by its mapping with the corresponding season
    


class IMGMember(AbstractUser):
    name=models.CharField(max_length=50)
    branch=models.CharField(max_length=50)
    enrolment=models.IntegerField()
    current_year=models.IntegerField()  

    def __str__(self):
        return self.name

class IMGMemberSeasonData(models.Model):#stores those data about IMG_Member that vary in different seasons
    member=models.ForeignKey(IMGMember,on_delete=models.CASCADE)
    season=models.ForeignKey(Season,on_delete=models.CASCADE)
    year_in_season=models.IntegerField()
