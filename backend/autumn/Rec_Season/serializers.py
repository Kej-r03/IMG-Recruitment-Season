# from dataclasses import fields
from rest_framework import serializers
from .models import *
from .models.season import Project


#project.py model serializers
class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model=Project
        fields='__all__'


#season.py model serializers
class SeasonSerializer(serializers.ModelSerializer):
    class Meta:
        model=Season
        fields='__all__'
    
class CandidateSerializer(serializers.ModelSerializer):
    class Meta:
        model=Candidate
        fields='__all__'

class CandidateSeasonDataSerializer(serializers.ModelSerializer):
    candidate = CandidateSerializer(read_only=True)
    class Meta:
        model=CandidateSeasonData
        fields='__all__'

class IMGMemberSerializer(serializers.ModelSerializer):
    class Meta:
        model=IMGMember
        fields='__all__'

#test.py model serializers
class PaperSerializer(serializers.ModelSerializer):
    class Meta:
        model=Paper
        fields='__all__'

class TestSectionSerializer(serializers.ModelSerializer):
    class Meta:
        model=TestSection
        fields='__all__'

class TestQuestionSerializer(serializers.ModelSerializer):
    section=TestSectionSerializer(read_only=True)
    assigned_to=IMGMemberSerializer(read_only=True)
    class Meta:
        model=TestQuestion
        fields='__all__'




#interview.py model serializers
class InterviewRoundsSerializer(serializers.ModelSerializer):
    class Meta:
        model=InterviewRounds
        fields='__all__'

class InterviewSerializer(serializers.ModelSerializer):
    candidate=CandidateSeasonDataSerializer(read_only=True)
    interview_round=InterviewRoundsSerializer(read_only=True)
    class Meta:
        model=Interview
        fields='__all__'

class InterviewPanelSerializer(serializers.ModelSerializer):
    # interview=InterviewSerializer(read_only=True)
    # interviewer=IMGMemberSerializer(read_only=True)
    class Meta:
        model=InterviewPanel
        fields='__all__'



#response.py model serializers
class EvaluationSerializer(serializers.ModelSerializer):
    class Meta:
        model=Evaluation
        fields='__all__'

class TestResponseSerializer(serializers.ModelSerializer):
    response=EvaluationSerializer(read_only=True)
    class Meta:
        model=TestResponse
        fields='__all__'

class InterviewResponseSerializer(serializers.ModelSerializer):
    class Meta:
        model=InterviewResponse
        fields='__all__'