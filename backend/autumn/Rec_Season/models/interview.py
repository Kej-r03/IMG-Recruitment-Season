from django.db import models
from .season import CandidateSeasonData, Season,Candidate,IMGMember
from constant import *

class InterviewRounds(models.Model):
    round_no=models.IntegerField()
    interview_type=models.CharField(max_length=1, choices=TYPE)
    season=models.ForeignKey(Season, on_delete=models.CASCADE)
    latest_interview_candidate=models.ManyToManyField(CandidateSeasonData,null=True,blank=True)

    def __str__(self):
        return str(self.round_no)

class InterviewPanel(models.Model):
    # interview=models.OneToOneField(Interview,on_delete=models.CASCADE)
    season=models.ForeignKey(Season,on_delete=models.CASCADE,null=True,blank=True)
    location=models.CharField(max_length=100,null=True,blank=True)
    interviewer=models.ManyToManyField(IMGMember)
    active=models.CharField(max_length=1,choices=ACTIVE_CHOICES,null=True,blank=True)


class Interview(models.Model):
    candidate=models.ForeignKey(CandidateSeasonData,on_delete=models.CASCADE)
    interview_round=models.ForeignKey(InterviewRounds,on_delete=models.CASCADE)
    slot_timing=models.DateTimeField(null=True,blank=True)
    status=models.CharField(max_length=10, choices=INTERVIEW_STATUS_CHOICES,null=True,blank=True)
    call_notes=models.CharField(max_length=100,null=True,blank=True)
    interviewers=models.ManyToManyField(IMGMember) #interviewers at the moment the panel was allotted to the candidate
    panel=models.ForeignKey(InterviewPanel,on_delete=models.SET_NULL,null=True,blank=True)





    