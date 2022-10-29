from django.contrib import admin
from .models import *
from .models.season import Project

# Register your models here.

admin.site.register(Interview)
admin.site.register(InterviewRounds)
admin.site.register(InterviewPanel)
admin.site.register(InterviewResponse)
admin.site.register(TestResponse)
admin.site.register(Evaluation)
admin.site.register(Season)
admin.site.register(Paper)
admin.site.register(TestQuestion)
admin.site.register(TestSection)
admin.site.register(Candidate)
admin.site.register(CandidateSeasonData)
admin.site.register(Project)
admin.site.register(IMGMember)