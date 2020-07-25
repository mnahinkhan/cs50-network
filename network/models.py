from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    followers = models.ManyToManyField("self", related_name="following", blank=True, symmetrical=False)


class Post(models.Model):
    writer = models.ForeignKey(User, on_delete=models.CASCADE, related_name="posts")
    content = models.TextField()
    time_modified = models.TimeField(auto_now=True)
    liking_users = models.ManyToManyField(User, related_name="liked_posts", blank=True)

    def likes(self):
        return len(self.liking_users.all())

    def __str__(self):
        return f'Post by {self.writer} saying "{self.content}".' \
               f' Has {self.likes()} like{"s" if  self.likes() != 1 else ""}.'

    def serialize(self):
        return {
            "id": self.id,
            "author": self.writer.username,
            "content": self.content,
            "time_modified": self.time_modified.strftime('%I:%M%p'),
            "likes": self.likes()
        }
