from rest_framework import serializers
from .models import User, Question, Submission, Feedback, InterviewSession, LLM_CodingQuestion
from django.contrib.auth import get_user_model

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'is_admin']


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password']
        )
        return user


class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = '__all__'

class CodingQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = LLM_CodingQuestion
        fields = '__all__'
        read_only_fields = ['user']  # user is set from request


class SubmissionSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    question = QuestionSerializer(read_only=True)

    class Meta:
        model = Submission
        fields = '__all__'


class FeedbackSerializer(serializers.ModelSerializer):
    submission = SubmissionSerializer(read_only=True)

    class Meta:
        model = Feedback
        fields = '__all__'


class InterviewSessionSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    questions = QuestionSerializer(many=True, read_only=True)

    class Meta:
        model = InterviewSession
        fields = '__all__'
