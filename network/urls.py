
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("posts/<str:which_posts>", views.get_posts, name='posts'),
    path("get-username", views.get_username, name='get username'),
    path("post", views.post, name='post'),
    path("view-posts/<str:which_posts>/", views.index, name="view posts")
]
