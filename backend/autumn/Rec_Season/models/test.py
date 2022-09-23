from django.db import models
from models import season

class Paper(models.Model):
    no=models.IntegerField()
    season=models.ForeignKey(season.Season, on_delete=models.CASCADE)
    timing=models.CharField(max_length=50)

    def __str__(self):
        return self.no

class TestSection(models.Model):
    paper=models.ForeignKey(Paper,on_delete=models.CASCADE)
    section_name=models.CharField(max_length=100)
    percent_weightage=models.DecimalField(max_digits=10,decimal_places=5)

    def __str__(self):
        return self.section_name

class TestQuestion(models.Model):
    q_id=models.CharField(max_length=10)
    q_text=models.TextField()
    assigned_to=models.ForeignKey(season.IMGMember,on_delete=models.CASCADE)
    section=models.ForeignKey(TestSection, on_delete=models.CASCADE)
    total_marks=models.IntegerField()

    def __str__(self):
        return self.q_id