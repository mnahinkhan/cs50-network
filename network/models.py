from django.utils import timezone

from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.timezone import localtime
import pytz


class User(AbstractUser):
    followers = models.ManyToManyField("self", related_name="following", blank=True, symmetrical=False)


class Post(models.Model):
    writer = models.ForeignKey(User, on_delete=models.CASCADE, related_name="posts")
    content = models.TextField()
    datetime_modified = models.DateTimeField(auto_now=True)
    liking_users = models.ManyToManyField(User, related_name="liked_posts", blank=True)

    def likes(self):
        return len(self.liking_users.all())

    def __str__(self):
        return f'Post by {self.writer} saying "{self.content}".' \
               f' Has {self.likes()} like{"s" if  self.likes() != 1 else ""}.'

    def serialize(self, tzname=None):
        if not tzname:
            tzname = "Asia/Qatar"
        timezone.activate(pytz.timezone(tzname))
        return {
            "id": self.id,
            "author": self.writer.username,
            "content": self.content,
            "time_modified": localtime(self.datetime_modified).strftime('%b %d, %I:%M %p'),
            "likes": self.likes()
        }
