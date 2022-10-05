from Rec_Season.views import SeasonViewSet
from rest_framework.routers import DefaultRouter
from .views import *
from . import views
from django.urls import path, include

router=DefaultRouter()

router.register('login',IMGMemberLoginViewSet)
router.register('season',SeasonViewSet)
router.register('candidate',CandidateViewSet)
router.register('candidate_season_data',CandidateSeasonDataViewSet)
router.register('img_member',IMGMemberViewSet)

router.register('paper',PaperViewSet)
router.register('testsection',TestQuestionViewSet)
router.register('testquestion',TestQuestionViewSet)

router.register('int_rounds',InterviewRoundsViewSet)
router.register('interview',InterviewViewSet)
router.register('interview_panel',InterviewPanelViewSet)

router.register('project',ProjectViewSet)

#router for evaluation isnt created as it is accessed through TestResponse and InterviewResponse models
router.register('testresponse',TestResponseViewSet)
router.register('interviewresponse',InterviewResponseViewSet)

urlpatterns=[ path('',include(router.urls)),
# path('login1/',views.login1,name='login1-oauth'),
# path('login2/',views.login2,name="login2_oauth"),
]