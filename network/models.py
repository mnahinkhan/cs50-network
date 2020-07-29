import random

from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.timezone import localtime
import pytz


def random_color():
    return User.FavColor(random.choice(User.FavColor.choices)[0])


color_mapper_dict = {
    'pink': 'lightpink',
    'yellow': 'lightyellow',
    'green': 'lightgreen',
    'blue': 'lightblue',
    'purple': 'pink'
}


class User(AbstractUser):
    class FavColor(models.TextChoices):
        PINK = 'pink', _('Pink')
        YELLOW = 'yellow', _('Yellow')
        GREEN = 'green', _('Green')
        BLUE = 'blue', _('Blue')
        PURPLE = 'purple', _('Purple')

    color = models.CharField(
        max_length=20,
        choices=FavColor.choices,
        default=random_color
    )

    followers = models.ManyToManyField("self", related_name="following", blank=True, symmetrical=False)

    def number_of_followers(self):
        return len(self.followers.all())

    def number_of_following(self):
        return len(self.following.all())


class Post(models.Model):
    writer = models.ForeignKey(User, on_delete=models.CASCADE, related_name="posts")
    content = models.TextField()
    datetime_modified = models.DateTimeField(auto_now=True)
    liking_users = models.ManyToManyField(User, related_name="liked_posts", blank=True)

    def likes(self):
        return len(self.liking_users.all())

    def __str__(self):
        return f'Post by {self.writer} saying "{self.content}".' \
               f' Has {self.likes()} like{"s" if self.likes() != 1 else ""}.'

    def serialize(self, tzname=None):
        if not tzname:
            tzname = "Asia/Qatar"
        timezone.activate(pytz.timezone(tzname))
        return {
            "id": self.id,
            "author": self.writer.username,
            "content": self.content,
            "time_modified": localtime(self.datetime_modified).strftime('%b %d, %I:%M %p'),
            "likes": self.likes(),
            "color": color_mapper_dict[self.writer.color]
        }
