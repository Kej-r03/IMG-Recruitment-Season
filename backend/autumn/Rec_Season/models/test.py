from django.db import models
from .season import Season,IMGMember

class Paper(models.Model):
    no=models.IntegerField()
    season=models.ForeignKey(Season, on_delete=models.CASCADE)
    timing=models.DateTimeField(null=True,blank=True)

    def __str__(self):
        return str(self.no)

class TestSection(models.Model):
    paper=models.ForeignKey(Paper,on_delete=models.CASCADE)
    section_name=models.CharField(max_length=100)
    percent_weightage=models.DecimalField(max_digits=10,decimal_places=5)

    def __str__(self):
        return str(self.pk)

class TestQuestion(models.Model):
    q_id=models.CharField(max_length=10)
    q_text=models.TextField()
    assigned_to=models.ForeignKey(IMGMember,on_delete=models.CASCADE)
    section=models.ForeignKey(TestSection, on_delete=models.CASCADE)
    total_marks=models.IntegerField()

    def __str__(self):
        return self.q_id