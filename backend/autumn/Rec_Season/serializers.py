from dataclasses import fields
from rest_framework import serializers
from .models import *
from .models.season import Project


#season.py model serializers
class SeasonSerializer(serializers.ModelSerializer):
    class Meta:
        model=Season
        fields='_all_'
    
class CandidateSerializer(serializers.ModelSerializer):
    class Meta:
        model=Candidate
        fields='_all_'

class CandidateSeasonDataSerializer(serializers.ModelSerializer):
    class Meta:
        model=CandidateSeasonData
        fields='_all_'

class IMGMemberSerializer(serializers.ModelSerializer):
    class Meta:
        model=IMGMember
        fields='_all_'

class IMGMemberSeasonDataSerializer(serializers.ModelSerializer):
    class Meta:
        model=IMGMemberSeasonData
        fields='_all_'



#test.py model serializers
class PaperSerializer(serializers.ModelSerializer):
    class Meta:
        model:Paper
        fields='_all_'

class TestSectionSerializer(serializers.ModelSerializer):
    class Meta:
        model=TestSection
        fields='_all_'

class TestQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model=TestQuestion
        fields='_all_'




#interview.py model serializers
class InterviewRoundsSerializer(serializers.ModelSerializer):
    class Meta:
        model=InterviewRounds
        fields='_all_'

class InterviewSerializer(serializers.ModelSerializer):
    class Meta:
        model=Interview
        fields='_all_'

class InterviewPanelSerializer(serializers.ModelSerializer):
    class Meta:
        model=InterviewPanel
        fields='_all_'


#project.py model serializers
class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model=Project
        fields='_all_'


#response.py model serializers
class EvaluationSerializer(serializers.ModelSerializer):
    class Meta:
        model=Evaluation
        fields='_all_'

class TestResponseSerializer(serializers.ModelSerializer):
    class Meta:
        model=TestResponse
        fields='_all_'

class InterviewResponseSerializer(serializers.ModelSerializer):
    class Meta:
        model=InterviewResponse
        fields='_all_'