from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    followers = models.ManyToManyField("self", related_name="following")


class Post(models.Model):
    writer = models.ForeignKey(User, on_delete=models.CASCADE, related_name="posts")
    content = models.TextField()
    time_modified = models.TimeField(auto_now=True)
    liking_users = models.ManyToManyField(User, related_name="liked_posts", blank=True)
