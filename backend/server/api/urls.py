# api/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    RegisterView, UserDetailView,
    QuestionViewSet, SubmissionViewSet,
    FeedbackViewSet, InterviewSessionViewSet,
    GenerateLLMQuestionView,
)
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

router = DefaultRouter()
router.register('questions', QuestionViewSet)
router.register('submissions', SubmissionViewSet)
router.register('feedbacks', FeedbackViewSet)
router.register('sessions', InterviewSessionViewSet)
# DO NOT register the APIView with router

urlpatterns = [
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/me/', UserDetailView.as_view(), name='user_detail'),

    # Add the generate endpoint as a path (this is the important change)
    path('generate-coding-question/', GenerateLLMQuestionView.as_view(), name='generate_llm_question'),

    path('', include(router.urls)),
]
