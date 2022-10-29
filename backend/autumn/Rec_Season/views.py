from django.core.exceptions import ObjectDoesNotExist
from django.shortcuts import render
from rest_framework import status
from rest_framework import viewsets
from .models import *
from .serializers import *
from rest_framework.permissions import *
from rest_framework.decorators import action
from .permissions import *
from rest_framework.response import Response
from django.http import HttpResponse, HttpResponseForbidden, JsonResponse, HttpResponseRedirect,HttpResponseBadRequest
from . import oauth_info
import requests
from django.contrib.auth import login,logout,authenticate
import json
from .models import *
import pandas as pd
from django.db.models import Count
from datetime import date
# Create your views here.

#season.py model viewsets
class SeasonViewSet(viewsets.ModelViewSet):
    permission_classes=[IsAuthenticated]
    queryset=Season.objects.all()
    serializer_class=SeasonSerializer

class CandidateViewSet(viewsets.ModelViewSet):
    permission_classes=[Nobody]
    queryset=Candidate.objects.all()
    serializer_class=CandidateSerializer


class CandidateSeasonDataViewSet(viewsets.ModelViewSet):
    permission_classes=[Nobody] 
    queryset=CandidateSeasonData.objects.all()
    serializer_class=CandidateSeasonDataSerializer


    @action(detail=False,methods=['POST'],permission_classes=(IsAuthenticated,))
    def create_from_csv(self,request): #used in Form
        df=pd.read_csv(request.FILES['File'])
        for i in range(df.shape[0]):
            candidate,candidateExists=Candidate.objects.get_or_create(enrolment=df['enrolment'][i],defaults={"name":df['name'][i],"branch":df['branch'][i],"email":df['email'][i],"phone":df['phone'][i],"current_year":df['current_year'][i]})
            project,projectExists=Project.objects.get_or_create(project_name=df['project_name'][i],details=df['details'][i])
            season,seasonExists=Season.objects.get_or_create(season_year=df['season_year'][i],role=df['role'][i])
            csd=CandidateSeasonData(candidate=candidate,project_name=project,test=df['test'][i],status=df['status'][i],season=season)
            csd.save()
        return HttpResponse("DONE")


    def get_queryset(self): #used in candidates list
        choice=self.request.query_params.get('choice')
        id=self.request.query_params['id']
        if choice.__eq__('1'):
            queryset=CandidateSeasonData.objects.filter(test=choice,season_id=id) 
        else:
            null_project=Project.objects.get(project_name='nan')
            queryset=CandidateSeasonData.objects.filter(season_id=id).exclude(project_name_id=null_project.id)
        return queryset

    # @action(detail=False)
    # def get_mark(self,request):
    #     paper_id=self.request.query_params.get('paper_id')
    #     test_candidates=CandidateSeasonData.objects.filter(test=1).values()
    #     for candidate in test_candidates:
    #         info=Candidate.objects.get(id=candidate['candidate_id'])
    #         flag=0
    #         candidate.update({"enrolment":info.enrolment})
    #         candidate.update({"name":info.name})
    #         mark_list=[]
    #         section_total_list=[]
    #         sections=TestSection.objects.filter(paper_id=paper_id).values()
    #         for section in sections:
    #             sum=0
    #             ques_list=TestQuestion.objects.filter(section_id=section['id']).values()
    #             for ques in ques_list:
    #                 try:
    #                     res=TestResponse.objects.get(candidate_id=candidate['id'],question_id=ques['id'])
    #                     mark=Evaluation.objects.get(id=res.response_id)
    #                     mark_list.append((ques['q_id'],mark.marks,mark.remarks))
    #                     sum+=mark.marks
    #                 except TestResponse.DoesNotExist:
    #                     flag=1
    #             total={"section_id":section['id'],"total":sum}
    #             section_total_list.append(total)
                    
    #         candidate.update({"mark_list":mark_list})
    #         candidate.update({"section_total_list":section_total_list})
    #         if flag==0:
    #             candidate.update({"eval_status":"Evaluated"})
    #         else:
    #             candidate.update({"eval_status":"Not Evaluated"})
        
    #     res=Response(test_candidates)
    #     res['Content-Type']='application/json' 
    #     return res




    @action(detail=False,permission_classes=(IsAuthenticated,))
    def get_marks(self,request): #used in TestTable of Dashboard
        paper_id=self.request.query_params.get('paper_id')
        paper=Paper.objects.get(id=paper_id)
        candidates=CandidateSeasonData.objects.filter(test=1,status='IP',season_id=paper.season_id).values()
        test_candidates=[]
        int_rounds=InterviewRounds.objects.filter(season_id=paper.season_id)
        for candidate in candidates: #this loop gives only those test candidates which are not in any interview round
            flag=0
            for round in int_rounds:                
                int_candidates=round.latest_interview_candidate.all()
                for c in int_candidates:
                    if c.id==candidate['id']:
                        flag=1
            if flag==0:
                test_candidates.append(candidate)

        for candidate in test_candidates:
            info=Candidate.objects.get(id=candidate['candidate_id'])
            flag=0
            candidate.update({"enrolment":info.enrolment})
            candidate.update({"name":info.name})
            mark_list=[]
            section_total_list=[]
            sections=TestSection.objects.filter(paper_id=paper_id).values()
            for section in sections:
                sum=0
                ques_list=TestQuestion.objects.filter(section_id=section['id']).values()
                for ques in ques_list:
                    try:
                        res=TestResponse.objects.get(candidate_id=candidate['id'],question_id=ques['id'])
                        mark=Evaluation.objects.get(id=res.response_id)
                        mark_list.append((ques['q_id'],mark.marks,mark.remarks))
                        if(mark.marks!=None):
                            sum+=mark.marks
                    except TestResponse.DoesNotExist:
                        flag=1
                total={"section_id":section['id'],"total":sum}
                section_total_list.append(total)
        
            if(request.user.current_year>2):
                candidate.update({"mark_list":mark_list})
                candidate.update({"section_total_list":section_total_list})
            if flag==0:
                candidate.update({"eval_status":"Evaluated"})
            else:
                candidate.update({"eval_status":"Not Evaluated"})
        res=Response(test_candidates)
        return res



    @action(detail=False,permission_classes=(IsAuthenticated,))
    def get_selected(self,request):#used in SelectedTable of Dashboard
        season_id=self.request.query_params.get('season_id')
        selected_candidates=CandidateSeasonData.objects.filter(status='S',season=season_id).values()
        for c in selected_candidates:
            candidate=Candidate.objects.get(id=c['candidate_id'])
            c.update({"name":candidate.name})
            c.update({"enrolment":candidate.enrolment})
            c.update({"branch":candidate.branch})
            c.update({"email":candidate.email})
            c.update({"phone":candidate.phone})

        res=Response(selected_candidates)
        return res

    @action(detail=False,permission_classes=(IsAuthenticated,))
    def get_project_info(self,request): #used in ProjectTable of Dashboard
        season_id=self.request.query_params.get('season_id')
        null_project=Project.objects.get(project_name='nan')
        candidates=CandidateSeasonData.objects.filter(season_id=season_id).exclude(project_name_id=null_project.id).exclude(status="S").values()
        projects=[]
        int_rounds=InterviewRounds.objects.filter(season_id=season_id)
        for candidate in candidates: #pick only those candidates who are not in any interview rounds
            flag=0
            for round in int_rounds:                
                int_candidates=round.latest_interview_candidate.all()
                for c in int_candidates:
                    if c.id==candidate['id']:
                        flag=1
            if flag==0:
                projects.append(candidate)
        
        for project in projects:
            project_info=Project.objects.get(pk=project['project_name_id'])
            project.update({"project_name":project_info.project_name})
            project.update({"project_details":project_info.details})
            if request.user.current_year>2:
                project.update({"marks":project_info.marks})
                project.update({"remarks":project_info.remarks})
            candidate_info=Candidate.objects.get(pk=project['candidate_id'])
            project.update({"name":candidate_info.name})
            project.update({'enrolment':candidate_info.enrolment})
        res=Response(projects)
        return res




    @action(detail=False,methods=['POST'],permission_classes=(IsAuthenticated,))
    def move_to_test(self,request): #used in InterviewTable of Dashboard
        id=request.data['id']
        c=CandidateSeasonData.objects.get(id=id)
        int_rounds=InterviewRounds.objects.filter(season_id=c.season_id)
        for round in int_rounds:  #remove the candidate from any interview round                        
            int_candidates=round.latest_interview_candidate.all()
            for candidate in int_candidates:
                if candidate.id==id:
                    round.latest_interview_candidate.remove(c)
        c.status='IP'
        c.save()
        return HttpResponse("Done")



    @action(detail=False,methods=['POST'],permission_classes=(IsAuthenticated,))
    def move_to_selected(self,request): #used in TestTable,InterviewTable of Dashboard
        id=request.data['id']
        c=CandidateSeasonData.objects.get(id=id)
        int_rounds=InterviewRounds.objects.filter(season_id=c.season_id)
        for round in int_rounds: #remove the candidate from any interview round             
            int_candidates=round.latest_interview_candidate.all()
            for candidate in int_candidates:
                if candidate.id==id:
                    round.latest_interview_candidate.remove(c)
        c.status='S'
        c.save()
        return HttpResponse('Done')


    
    @action(detail=False,methods=['POST'],permission_classes=(IsAuthenticated,))
    def move_to_interview(self,request): #used in TestTable,InterviewTable of Dashboard
        candidate_id=request.data['candidate_id']
        round_id=request.data['round_id']
        
        c=CandidateSeasonData.objects.get(id=candidate_id)        
        int_rounds=InterviewRounds.objects.filter(season_id=c.season_id)
        for round in int_rounds:                
                int_candidates=round.latest_interview_candidate.all()
                for candidate in int_candidates:
                    if candidate.id==candidate_id:
                        round.latest_interview_candidate.remove(c)
        ir=InterviewRounds.objects.get(id=round_id)        
        ir.latest_interview_candidate.add(c)
        c.status='IP'
        c.save()

        try: #if the candidate, moved to an interview, has an Interview object, well and good, else create all the corresponding objects for the interview
            i=Interview.objects.get(candidate_id=c.id,interview_round_id=ir.id)
        except Interview.DoesNotExist:
            i=Interview(candidate=c,interview_round=ir)
            i.save()
            ip=InterviewPanel(interview=i)
            ip.save()
            ires=InterviewResponse(interview=i)
            ires.save()
        
        return HttpResponse('Done')



    
class IMGMemberViewSet(viewsets.ModelViewSet):
    permission_classes=[IsAuthenticated]
    queryset=IMGMember.objects.all()
    serializer_class=IMGMemberSerializer

    # def get_queryset(self):#used in redirector.js
    #     enrol=self.request.query_params.get('enrol')
    #     queryset=IMGMember.objects.filter(enrolment=enrol)
    #     return queryset

    @action(detail=False)
    def info(self,request):
        info=IMGMemberSerializer(request.user)
        res=Response(info.data,status=status.HTTP_202_ACCEPTED)
        return res 



class IMGMemberLoginViewSet(viewsets.ModelViewSet):
    queryset=IMGMember.objects.all()
    serializer_class=IMGMemberSerializer
    
    @action(detail=False, methods=['POST'])
    def login2(self, req):
        try:
            auth_code=req.data['code']
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

        res=requests.get("https://channeli.in/open_auth/get_user_data/",headers=header)

        user_data=res.json()
        isMaintainer=False

        for role in user_data['person']['roles']:
            if role['role'] == 'Maintainer':
                isMaintainer = True
            
        if not isMaintainer:
            return JsonResponse({'status': 'you are not a maintainer'})
        
        user,created=IMGMember.objects.get_or_create(enrolment=user_data['username'], defaults={"name":user_data['person']['fullName'], "branch":user_data['student']['branch name'],"current_year":user_data['student']['currentYear']})
        login(req,user)

        res=Response(user_data,status=status.HTTP_202_ACCEPTED)
        return res       


    @action(detail=False)
    def log_out(self,request):
        logout(request)
        res=Response({'status':'succesful'},status=status.HTTP_202_ACCEPTED)
        return res


    @action(detail=False)
    def info(self,request): #used in PrivateRouter
        if(request.user.is_authenticated):
            data=True
        else:
            data=False
        res=Response({'isLoggedIn':data},status = status.HTTP_200_OK)
        return res

    @action(detail=False,permission_classes=(IsAuthenticated,))
    def get_year(self,request): #used in dashboard,Test
        season_id=self.request.query_params.get('season_id')
        season=Season.objects.get(id=season_id)
        d=date.today()
        year=season.season_year-(d.year-request.user.current_year)
        res=Response({'year':year},status = status.HTTP_200_OK)
        return res



    
class ProjectViewSet(viewsets.ModelViewSet):
    permission_classes=[Nobody]
    queryset=Project.objects.all()
    serializer_class=ProjectSerializer

    
#test.py model viewsets
class PaperViewSet(viewsets.ModelViewSet):
    permission_classes=[Nobody]
    queryset=Paper.objects.all()
    serializer_class=PaperSerializer

    @action(detail=False,permission_classes=(IsAuthenticated,))
    def get_papers(self,request):#used in dashboard,Test
        season=self.request.query_params.get('season')
        papers=Paper.objects.filter(season=season).values()
        res=Response(papers)
        return res

    @action(detail=False, methods=['POST'],permission_classes=(IsAuthenticated,))
    def create_paper(self,request):#used in Test
        if request.user.current_year>2:
            season_id=request.data['season_id']
            timing=request.data['timing']
            no=request.data['no']
            season=Season.objects.get(pk=season_id)
            p=Paper(no=no,timing=timing,season=season)
            p.save()
        return HttpResponse("Done")

class TestSectionViewSet(viewsets.ModelViewSet):
    permission_classes=[Nobody]
    queryset=TestSection.objects.all()
    serializer_class=TestSectionSerializer

    def get_queryset(self):
        paper_id=self.request.query_params.get('paper_id')
        queryset=TestSection.objects.filter(paper_id=paper_id) #return those test questions whose 'section' fields have paper_id=paper_id
        return queryset
    
    @action(detail=False,permission_classes=(IsAuthenticated,))
    def get_sections(self,request): #used in TestTable of Dashboard
        paper_id=self.request.query_params.get('paper_id')
        sections=TestSection.objects.filter(paper_id=paper_id).values()
        for section in sections:
            ques_list=TestQuestion.objects.filter(section=section['id']).values()
            for ques in ques_list:
                assigned_to_name=IMGMember.objects.get(id=ques['assigned_to_id'])
                ques.update({'assigned_to_name':assigned_to_name.name})
            section.update({"ques_list":ques_list})
        res=Response(sections)
        return res

    @action(detail=False,methods=['POST'],permission_classes=(IsAuthenticated,))
    def update_weightage(self,request):#used in Test
        if request.user.current_year>2:
            id=request.data['id']
            weightage=request.data['weightage']
            section=TestSection.objects.get(id=id)
            section.percent_weightage=weightage
            section.save()
        return HttpResponse('Done')

    @action(detail=False,methods=['POST'],permission_classes=(IsAuthenticated,))
    def create_section(self,request): #used in Test
        if request.user.current_year>2:
            paper_id=request.data['paper_id']
            percentage_weightage=request.data['percent_weightage']
            section_name=request.data['section_name']
            paper=Paper.objects.get(id=paper_id)
            section=TestSection(section_name=section_name,percent_weightage=percentage_weightage,paper=paper)
            section.save()
        return HttpResponse("Done")

class TestQuestionViewSet(viewsets.ModelViewSet):
    permission_classes=[Nobody]
    queryset=TestQuestion.objects.all()
    serializer_class=TestQuestionSerializer


    def get_queryset(self):
        paper_id=self.request.query_params.get('paper_id')
        queryset=TestQuestion.objects.filter(section__paper_id=paper_id) #return those test questions whose 'section' fields have paper_id=paper_id
        return queryset

    @action(detail=False,methods=['POST'],permission_classes=(IsAuthenticated,))
    def update_question(self,request): #used in Test
        if request.user.current_year>2:
            id=request.data['id']
            q_text=request.data['q_text']
            assigned_to=request.data['assigned_to']
            total_marks=request.data['total_marks']
            ques=TestQuestion.objects.get(id=id)
            ques.q_text=q_text
            ques.assigned_to_id=assigned_to
            ques.total_marks=total_marks
            ques.save()
        return HttpResponse("Done")

    @action(detail=False,methods=['POST'],permission_classes=(IsAuthenticated,))
    def create_question(self,request): #used in Test
        if request.user.current_year>2:
            section_id=request.data['id']
            q_id=request.data['q_id']
            q_text=request.data['q_text']
            assigned_to=request.data['assigned_to']
            total_marks=request.data['total_marks']
            ques=TestQuestion(q_id=q_id,q_text=q_text,assigned_to_id=assigned_to,section_id=section_id,total_marks=total_marks)
            ques.save()
        return HttpResponse("Done")
    


#interview.py model viewsets
class InterviewRoundsViewSet(viewsets.ModelViewSet):
    permission_classes=[Nobody]
    queryset=InterviewRounds.objects.all()
    serializer_class=InterviewRoundsSerializer

    @action(detail=False,permission_classes=(IsAuthenticated,))
    def get_interviews(self,request): #used in Dashboard
        season_id=self.request.query_params.get('season')
        interviews=InterviewRounds.objects.filter(season_id=season_id).values()
        res=Response(interviews)
        return res


    @action(detail=False,permission_classes=(IsAuthenticated,))
    def get_info(self,request): #used in InterviewTable of Dashboard
        id=self.request.query_params.get('int_round_id')
        rows=[]
        int_round=InterviewRounds.objects.get(pk=id)
        candidates=int_round.latest_interview_candidate.all()        
        for candidate in candidates:
            info_dict={}
            candidate_info=Candidate.objects.get(id=candidate.candidate_id)
            info_dict.update({"name":candidate_info.name})
            info_dict.update({"phone":candidate_info.phone})
            interview=Interview.objects.get(interview_round_id=id,candidate_id=candidate.id)
            info_dict.update({"id":interview.id})#this is the interview model id
            info_dict.update({"candidate_id":interview.candidate_id})
            info_dict.update({"call_notes":interview.call_notes})
            info_dict.update({"slot_timing":interview.slot_timing})
            if interview.status=="C":
                info_dict.update({"status":"Called"})
            elif interview.status=="N":
                info_dict.update({"status":"Not Called"})
            elif interview.status=="O":
                info_dict.update({"status":"Ongoing"})
            elif interview.status=="W":
                info_dict.update({"status":"Waiting"})
            elif interview.status=="D":
                info_dict.update({"status":"Done"})
            else:
                info_dict.update({"status":None})


            if request.user.current_year>2:
                try:
                    int_response=InterviewResponse.objects.get(interview_id=interview.id)
                    response=Evaluation.objects.get(pk=int_response.response_id)
                    info_dict.update({"marks":response.marks})
                    info_dict.update({"remarks":response.remarks})
                except ObjectDoesNotExist:
                    info_dict.update({"marks":''})
                    info_dict.update({'remarks':''})
            rows.append(info_dict)
        
        res=Response(rows)
        return res


class InterviewViewSet(viewsets.ModelViewSet):
    permission_classes=[Nobody]
    queryset=Interview.objects.all()
    serializer_class=InterviewSerializer

    @action(detail=False,permission_classes=(IsAuthenticated,))
    def get_info(self,request):
        int_round_id=self.request.query_params.get('int_round_id')
        interviews=Interview.objects.filter(interview_round_id=int_round_id).values()
        
        for interview in interviews:
            c=CandidateSeasonData.objects.get(id=interview['candidate_id'])
            interview.update({"name":c.candidate.name})
            interview.update({"phone":c.candidate.phone})

            if(interview['status']=='C'):
                interview.update({"status":"Called"})
            else:
                interview.update({"status":"Not Called"})

            try:
                int_response=InterviewResponse.objects.get(interview_id=interview['id'])                
                response=Evaluation.objects.get(pk=int_response.response_id)
                interview.update({"marks":response.marks})
                interview.update({"remarks":response.remarks})
            except ObjectDoesNotExist:
                interview.update({"marks":''})
                interview.update({'remarks':''})
            
        res=Response(interviews)
        return res


class InterviewPanelViewSet(viewsets.ModelViewSet):
    permission_classes=[Nobody]
    queryset=InterviewPanel.objects.all()
    serializer_class=InterviewPanelSerializer

    @action(detail=False,permission_classes=(IsAuthenticated,))
    def get_info(self,request): #used in Interview
        season_id=self.request.query_params.get('season_id')
        rounds=InterviewRounds.objects.filter(season_id=season_id)
        info_list=[]
        for round in rounds:
            candidate_list=round.latest_interview_candidate.all()
            for candidate in candidate_list:
                info_dict={}
                info_dict.update({"type":round.interview_type})
                c=CandidateSeasonData.objects.get(id=candidate.id)
                candidate_info=Candidate.objects.get(id=c.candidate_id)
                info_dict.update({"candidate_name":candidate_info.name})
                info_dict.update({"enrolment":candidate_info.enrolment})
                interview=Interview.objects.get(interview_round_id=round.id,candidate_id=c.id)
                try:
                    info_dict.update({"slot_timing":interview.slot_timing})
                except:
                    info_dict.update({"slot_timing":""})
                if interview.status=="C":
                    info_dict.update({"status":"Called"})
                elif interview.status=="N":
                    info_dict.update({"status":"Not Called"})
                elif interview.status=="O":
                    info_dict.update({"status":"Ongoing"})
                elif interview.status=="W":
                    info_dict.update({"status":"Waiting"})
                elif interview.status=="D":
                    info_dict.update({"status":"Done"})
                else:
                    info_dict.update({"status":""})
                
                print(interview.id)
                panel=InterviewPanel.objects.get(interview_id=interview.id)
                interviewers=panel.interviewer.all()
                info_dict.update({"id":panel.id})
                try:
                    info_dict.update({"interviewer1":interviewers[0].id})
                    info_dict.update({"interviewer1name":interviewers[0].name})
                except:
                    info_dict.update({"interviewer1":""})
                    info_dict.update({"interviewer1name":""})
                try:
                    info_dict.update({"interviewer2":interviewers[1].id})
                    info_dict.update({"interviewer2name":interviewers[1].name})
                except:
                    info_dict.update({"interviewer2":""})
                    info_dict.update({"interviewer2name":""})
                try:
                    info_dict.update({"active":panel.active})
                except:
                    info_dict.update({"active":""})
                try:
                    info_dict.update({"location":panel.location})
                except:
                    info_dict.update({"location":""})
                try:
                    info_dict.update({"interviewers":panel.interviewer.all().values()})
                except:
                    info_dict.update({"interviewers":""})
                
                info_list.append(info_dict)
                



        # interviews=Interview.objects.filter(interview_round__season_id=season_id)
        # for interview in interviews:
        #     panel=InterviewPanel.objects.get(interview_id=interview.id)







        # panels=InterviewPanel.objects.all()        
        # info_list=[]
        # for panel in panels:
        #     info_dict={}
        #     info_dict.update({"id":panel.id})
        #     try:
        #         info_dict.update({"active":panel.active})
        #     except:
        #         info_dict.update({"active":""})
        #     try:
        #         info_dict.update({"location":panel.location})
        #     except:
        #         info_dict.update({"location":""})
        #     interview=Interview.objects.get(id=panel.interview_id)
        #     try:
        #         info_dict.update({"slot_timing":interview.slot_timing})
        #     except:
        #         info_dict.update({"slot_timing":""})
        #     int_round=InterviewRounds.objects.get(id=interview.interview_round_id)
        #     info_dict.update({"type":int_round.interview_type})
        #     candidate_season_data=CandidateSeasonData.objects.get(id=interview.candidate_id)
        #     candidate=Candidate.objects.get(id=candidate_season_data.candidate_id)
        #     info_dict.update({"candidate_name":candidate.name})
        #     info_dict.update({"enrolment":candidate.enrolment})
        #     try:
        #         info_dict.update({"interviewers":panel.interviewer.all().values()})
        #     except:
        #         info_dict.update({"interviewwers":""})
        #     info_list.append(info_dict)

        res=Response(info_list)
        return res

    
    @action(detail=False,methods=['POST'],permission_classes=(IsAuthenticated,))
    def update_interview(self,request): #used in Interview
        slot_timing=request.data['timing']
        location=request.data['location']
        active=request.data['panelStatus']
        id=request.data['id']
        status=request.data['intStatus']
        int1=request.data['int1']
        int2=request.data['int2']
        panel=InterviewPanel.objects.get(pk=id)
        panel.interviewer.clear()
        if active==None or active=="":
            panel.active=None
        else:
            panel.active=active[0]
        panel.location=location
        panel.save()
        try:
            member1=IMGMember.objects.get(id=int1)
            panel.interviewer.add(member1)
        except:
            panel.interviewer.add(None)
        try:
            member2=IMGMember.objects.get(id=int2)
            panel.interviewer.add(member2)
        except:
            panel.interviewer.add(None)
        
        
        
        interview=Interview.objects.get(pk=panel.interview_id)
        if status==None or status=="":
            interview.status=None
        else:
            interview.status=status[0]
        interview.slot_timing=slot_timing
        
        interview.save() 
        return HttpResponse("Done")




#response.py model viewsets
class TestResponseViewSet(viewsets.ModelViewSet):
    permission_classes=[Nobody]
    queryset=TestResponse.objects.all()
    serializer_class=TestResponseSerializer

    def get_queryset(self):
        ques_id=self.request.query_params.get('ques_id')
        c_id=self.request.query_params.get('c_id')
        queryset=TestResponse.objects.filter(candidate_id=c_id,question_id=ques_id)
        
        return queryset
    
    @action(detail=False,methods=['POST'],permission_classes=(IsAuthenticated,))
    def update_marks(self,request):#used  in TestTable of Dashboard
        marks=request.data['marks']
        remarks=request.data['remarks']
        ques_id=request.data['ques_id']
        candidate_season_id=request.data['candidate_season_id']
        if request.user.current_year>2:
            try:
                test_response=TestResponse.objects.get(candidate_id=candidate_season_id,question_id=ques_id)
                eval_resp=Evaluation.objects.get(id=test_response.response_id)
                eval_resp.marks=marks
                eval_resp.remarks=remarks
                eval_resp.save()
            except TestResponse.DoesNotExist:
                eval_resp=Evaluation(marks=marks,remarks=remarks)
                eval_resp.save()
                candidate=CandidateSeasonData.objects.get(pk=candidate_season_id)
                ques=TestQuestion.objects.get(pk=ques_id)
                test_response=TestResponse(response=eval_resp,candidate=candidate,question=ques)
                test_response.save()
        return HttpResponse("Done")


class EvaluationViewSet(viewsets.ModelViewSet):
    permission_classes=[Nobody]
    queryset=Evaluation.objects.all()
    serializer_class=EvaluationSerializer

class InterviewResponseViewSet(viewsets.ModelViewSet):
    permission_classes=[Nobody]
    queryset=InterviewResponse.objects.all()
    serializer_class=InterviewResponseSerializer

    @action(detail=False,methods=['POST'],permission_classes=(IsAuthenticated,))
    def update_marks(self,request):#used in InterviewTable of Dashboard
        timing=request.data['timing']
        if request.user.current_year>2:
            marks=request.data['marks']
            remarks=request.data['remarks']
        callNotes=request.data['callNotes']
        print(callNotes)
        status=request.data['status']
        interview_id=request.data['interview_id']
        int_response=InterviewResponse.objects.get(interview_id=interview_id)
        if request.user.current_year>2:
            try:            
                eval_resp=Evaluation.objects.get(id=int_response.response_id)
                eval_resp.marks=marks
                eval_resp.remarks=remarks
                eval_resp.save()
            except ObjectDoesNotExist:
                eval_resp=Evaluation(marks=marks,remarks=remarks)
                eval_resp.save()
        
        int=Interview.objects.get(id=interview_id)
        if status!=None:
            int.status=status[0]
        int.call_notes=callNotes
        int.slot_timing=timing
        int.save()
        return HttpResponse("Done")