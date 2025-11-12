from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    is_admin = models.BooleanField(default=False)  # For interviewer/admin

class Question(models.Model):
    QUESTION_TYPE = (
        ('behavioral', 'Behavioral'),
        ('technical', 'Technical'),
    )

    title = models.CharField(max_length=200)
    description = models.TextField()
    difficulty = models.CharField(max_length=50)
    type = models.CharField(choices=QUESTION_TYPE, max_length=20)

    def __str__(self):
        return self.title
    

class LLM_CodingQuestion(models.Model):

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    question_title = models.CharField(max_length=255)
    description = models.TextField()
    input_format = models.TextField(blank=True, null=True)
    output_format = models.TextField(blank=True, null=True)
    constraints = models.TextField(blank=True, null=True)
    difficulty = models.CharField(max_length=50, default='Medium')
    tags = models.JSONField(default=list)  # e.g. ["dp", "greedy"]
    test_cases = models.JSONField(default=list)  # [{ "input": ..., "output": ... }]

    def __str__(self):
        return self.question_title

class Submission(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    answer_text = models.TextField()
    code_submitted = models.TextField(blank=True, null=True)
    submitted_at = models.DateTimeField(auto_now_add=True)

class Feedback(models.Model):
    submission = models.OneToOneField(Submission, on_delete=models.CASCADE)
    comments = models.TextField()
    rating = models.IntegerField(default=0)  # 1–5 scale

class InterviewSession(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    scheduled_at = models.DateTimeField()
    duration_minutes = models.IntegerField(default=30)
    questions = models.ManyToManyField(Question)