from django.contrib import admin
from .models import User, Question, Submission, Feedback, InterviewSession, LLM_CodingQuestion

admin.site.register(User)
admin.site.register(Question)
admin.site.register(Submission)
admin.site.register(Feedback)
admin.site.register(InterviewSession)
admin.site.register(LLM_CodingQuestion)

