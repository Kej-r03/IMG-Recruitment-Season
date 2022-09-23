from django.db import models
from models import season
from constant import *

class InterviewRounds(models.Model):
    round_no=models.IntegerField()
    interview_type=models.CharField(max_length=1, choices=TYPE)
    season=models.ForeignKey(season.Season, on_delete=models.CASCADE)

    def __str__(self):
        return self.round_no

class Interview(models.Model):
    candidate=models.ForeignKey(season.Candidate,on_delete=models.CASCADE)
    interview_round=models.ForeignKey(InterviewRounds,on_delete=models.CASCADE)
    # panel one to one mapped in Interview_Panel model
    slot_timing=models.CharField(max_length=100)
    status=models.CharField(max_length=1, choices=INTERVIEW_STATUS_CHOICES)
    call_notes=models.CharField(max_length=100)


class InterviewPanel(models.Model):
    interview=models.OneToOneField(Interview)
    location=models.CharField(max_length=100)
    interview_type=models.CharField(max_length=15)
    interviewer=models.ManyToManyField(season.IMGMember)
    active=models.CharField(max_length=1,choices=ACTIVE_CHOICES)


    