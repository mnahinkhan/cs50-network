from django.contrib import admin

# Register your models here.
from network.models import User, Post


class PostAdmin(admin.ModelAdmin):
    readonly_fields = ('datetime_modified',)


admin.site.register(User)
admin.site.register(Post, PostAdmin)





