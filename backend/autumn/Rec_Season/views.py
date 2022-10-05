from crypt import methods
from os import access, environ
from django.shortcuts import render
from rest_framework import status
from rest_framework import viewsets
from .models import *
from .serializers import *
from rest_framework.permissions import *
from rest_framework.decorators import action
from .permissions import *
from rest_framework.response import Response
from django.http import HttpResponse, HttpResponseForbidden, HttpResponseRedirect,HttpResponseBadRequest
from . import oauth_info
import requests
from django.contrib.auth import logout
import json

# Create your views here.

#season.py model viewsets
class SeasonViewSet(viewsets.ModelViewSet):
    permission_classes=[AllowAny] #giving error
    queryset=Season.objects.all()
    serializer_class=SeasonSerializer

class CandidateViewSet(viewsets.ModelViewSet):
    permission_classes=[IsAuthenticated]
    queryset=Candidate.objects.all()
    serializer_class=CandidateSerializer

class CandidateSeasonDataViewSet(viewsets.ModelViewSet):
    permission_classes=[IsAuthenticated]
    queryset=CandidateSeasonData.objects.all()
    serializer_class=CandidateSeasonDataSerializer

    # def create_from_csv():


    @action(detail=False,methods=['post'])
    def mass_status_update(self, request):
        season=request.data.get('season')
        student_list=request.data.get('student_list')
        current_round_status=request.data.get('curr_round')
        next_round=request.data.get('next_round')

        for student_enrol in student_list:
            student=CandidateSeasonData.objects.get(enrolment=student_enrol,season=season)
            student.status=next_round
            student.save()

    def get_queryset(self):#to get list of candidates in a season applying via projects
        return super().get_queryset().exclude(project_name__isnull=True).exclude(project_name__exact='')

    #method to get list of candidates applying via test
    
class IMGMemberViewSet(viewsets.ModelViewSet):
    permission_classes=[IsAuthenticated]
    queryset=IMGMember.objects.all()
    serializer_class=IMGMemberSerializer

class IMGMemberLoginViewSet(viewsets.ModelViewSet):
    queryset=IMGMember.objects.all()
    serializer_class=IMGMemberSerializer

    @action(detail=False)
    def login1(self, request):
        url="https://channeli.in/oauth/authorise/?client_id="+oauth_info.CLIENT_ID+"&redirect_uri="+oauth_info.REDIRECT_URI
        return HttpResponseRedirect(url)
    
    @action(detail=False)
    def login2(self, request):
        try:
             auth_code=request.get_full_path().split("/")[3].split("&")[0][6:] #extracts code from the request url
        except:
            return HttpResponseBadRequest()

        params = {
            'client_id': oauth_info.CLIENT_ID,
            'client_secret': oauth_info.CLIENT_SECRET,
            'grant_type': 'authorization_code',
            'redirect_uri': oauth_info.REDIRECT_URI,
            'code': auth_code,
        }

        res = requests.post("https://channeli.in/open_auth/token/", data=params,)

        if(res.status_code==200):
            access_token=res.json()["access_token"]
            refresh_token=res.json()["refresh_token"]
        else:
            return HttpResponseBadRequest()

        header={ "Authorization": "Bearer " + access_token,}

        user_data=requests.get("https://channeli.in/open_auth/get_user_data/",headers=header)

        return HttpResponse(user_data)
        


    @action(detail=False, methods=['GET'])
    def log_out(self,request):
        if request.user.is_authenticated:
            logout(request)
            res=Response({'status':'succesful'},status=status.HTTP_202_ACCEPTED)
            return res
        else:
            return HttpResponseForbidden()

    
class ProjectViewSet(viewsets.ModelViewSet):
    permission_classes=[IsAuthenticated]
    queryset=Project.objects.all()
    serializer_class=ProjectSerializer

    
#test.py model viewsets
class PaperViewSet(viewsets.ModelViewSet):
    permission_classes=[IsAuthenticated]
    queryset=Paper.objects.all()
    serializer_class=PaperSerializer

class TestSectionViewSet(viewsets.ModelViewSet):
    permission_classes=[IsAuthenticated]
    queryset=TestSection.objects.all()
    serializer_class=TestSectionSerializer

class TestQuestionViewSet(viewsets.ModelViewSet):
    queryset=TestQuestion.objects.all()
    serializer_class=TestQuestionSerializer

    def get_permissions(self):
        if self.request.method=='GET':
            self.permission_classes=[IsAuthenticated]
        elif self.request.method=='POST' or self.request.method=='DELETE':
            self.permission_classes=[IsAuthenticated,isNot2ndYear]
        
        return super(TestQuestionViewSet,self).get_permissions()

    


#interview.py model viewsets
class InterviewRoundsViewSet(viewsets.ModelViewSet):
    permission_classes=[IsAuthenticated]
    queryset=InterviewRounds.objects.all()
    serializer_class=InterviewRoundsSerializer

class InterviewViewSet(viewsets.ModelViewSet):
    permission_classes=[IsAuthenticated]
    queryset=Interview.objects.all()
    serializer_class=InterviewSerializer

class InterviewPanelViewSet(viewsets.ModelViewSet):
    permission_classes=[IsAuthenticated]
    queryset=InterviewPanel.objects.all()
    serializer_class=InterviewPanelSerializer


#response.py model viewsets
class TestResponseViewSet(viewsets.ModelViewSet):
    permission_classes=[IsAuthenticated,isNot2ndYear]
    queryset=TestResponse.objects.all()
    serializer_class=TestResponseSerializer

class EvaluationViewSet(viewsets.ModelViewSet):
    permission_classes=[IsAuthenticated,isNot2ndYear]
    queryset=Evaluation.objects.all()
    serializer_class=EvaluationSerializer

class InterviewResponseViewSet(viewsets.ModelViewSet):
    permission_classes=[IsAuthenticated,isNot2ndYear]
    queryset=InterviewResponse.objects.all()
    serializer_class=InterviewResponseSerializer