
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("posts/<str:which_posts>/<int:page_number>", views.get_posts, name='posts'),
    path("get-username", views.get_username, name='get username'),
    path("post", views.post, name='post'),
    path("view-posts/<str:which_posts>/", views.index, name="view posts"),
    path("view-posts/<str:which_posts>/<int:page_number>", views.index, name="view posts"),
    path("get-profile-info/<str:profile_name>", views.get_profile_info, name="get profile info"),
    path("like-post/<str:post_id>", views.like_post, name="like post"),
    path("follow-profile/<str:profile_username>", views.follow_profile, name="follow profile")
]
