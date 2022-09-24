from django.shortcuts import render
# from Rec_Season.permissions import IsAllowedToAccessScore
from rest_framework import viewsets
from .models import *
from .serializers import *
from rest_framework.permissions import *
from .permissions import *
# Create your views here.

#season.py model viewsets
class SeasonViewSet(viewsets.ModelViewSet):
    permission_classes=[AllowAny]
    queryset=Season.objects.all()
    serializer_class=SeasonSerializer

class CandidateViewSet(viewsets.ModelViewSet):
    permission_classes=[IsAuthenticated, IsAdminUser]
    queryset=Candidate.objects.all()
    serializer_class=CandidateSerializer

class CandidateSeasonDataViewSet(viewsets.ModelViewSet):
    permission_classes=[IsAuthenticated, IsAdminUser]
    queryset=CandidateSeasonData.objects.all()
    serializer_class=CandidateSeasonDataSerializer

class IMGMemberViewSet(viewsets.ModelViewSet):
    permission_classes=[IsAuthenticated, IsAdminUser]
    queryset=IMGMember.objects.all()
    serializer_class=IMGMemberSerializer

class IMGMemberSeasonDataViewSet(viewsets.ModelViewSet):
    permission_classes=[IsAuthenticated, IsAdminUser]
    queryset=IMGMemberSeasonData.objects.all()
    serializer_class=IMGMemberSeasonDataSerializer


#test.py model viewsets
class PaperViewSet(viewsets.ModelViewSet):
    permission_classes=[IsAuthenticated, IsAdminUser]
    queryset=Paper.objects.all()
    serializer_class=PaperSerializer

class TestSectionViewSet(viewsets.ModelViewSet):
    permission_classes=[IsAuthenticated, IsAdminUser]
    queryset=TestSection.objects.all()
    serializer_class=TestSectionSerializer

class TestQuestionViewSet(viewsets.ModelViewSet):
    permission_classes=[IsAuthenticated, IsAdminUser,IsAllowedToAssignQuestion] #doubt in how to only restrict "assigned_to" field and not every field of the TestQuestion model
    queryset=TestQuestion.objects.all()
    serializer_class=TestQuestionSerializer


#interview.py model viewsets
class InterviewRoundsViewSet(viewsets.ModelViewSet):
    permission_classes=[IsAuthenticated, IsAdminUser]
    queryset=InterviewRounds.objects.all()
    serializer_class=InterviewRoundsSerializer

class InterviewViewSet(viewsets.ModelViewSet):
    permission_classes=[IsAuthenticated, IsAdminUser]
    queryset=Interview.objects.all()
    serializer_class=InterviewSerializer

class InterviewPanelViewSet(viewsets.ModelViewSet):
    permission_classes=[IsAuthenticated, IsAdminUser]
    queryset=InterviewPanel.objects.all()
    serializer_class=InterviewPanelSerializer


#project.py model viewsets
class ProjectViewSet(viewsets.ModelViewSet):
    permission_classes=[IsAuthenticated, IsAdminUser]
    queryset=Project.objects.all()
    serializer_class=ProjectSerializer


#response.py model viewsets
class TestResponseViewSet(viewsets.ModelViewSet):
    permission_classes=[IsAuthenticated, IsAdminUser,IsAllowedToAccessScore]
    queryset=TestResponse.objects.all()
    serializer_class=TestResponseSerializer

class EvaluationViewSet(viewsets.ModelViewSet):
    permission_classes=[IsAuthenticated, IsAdminUser,IsAllowedToAccessScore]
    queryset=Evaluation.objects.all()
    serializer_class=EvaluationSerializer

class InterviewResponseViewSet(viewsets.ModelViewSet):
    permission_classes=[IsAuthenticated, IsAdminUser,IsAllowedToAccessScore]
    queryset=InterviewResponse.objects.all()
    serializer_class=InterviewResponseSerializer